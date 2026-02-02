---
name: JobMiddleware
description: Custom job middleware for rate limiting and throttling
file-type: template
---

# Job Middleware Template

## Rate Limiter Setup

```php
<?php
// app/Providers/AppServiceProvider.php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // API rate limiter
        RateLimiter::for('api-calls', function (object $job) {
            return Limit::perMinute(60);
        });

        // Per-user rate limiter
        RateLimiter::for('user-emails', function (object $job) {
            return Limit::perHour(10)->by($job->user->id);
        });

        // Sliding window
        RateLimiter::for('payments', function (object $job) {
            return Limit::perMinute(5)->by($job->order->user_id);
        });
    }
}
```

## Custom Middleware: Ensure Active Subscription

```php
<?php

declare(strict_types=1);

namespace App\Jobs\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;

/**
 * Only process job if user has active subscription.
 */
final class EnsureActiveSubscription
{
    public function handle(object $job, Closure $next): void
    {
        if (!$job->user->subscribed()) {
            Log::warning('Job skipped: no active subscription', [
                'user_id' => $job->user->id,
                'job' => get_class($job),
            ]);
            return;
        }

        $next($job);
    }
}
```

## Custom Middleware: Log Execution Time

```php
<?php

declare(strict_types=1);

namespace App\Jobs\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;

/**
 * Log job execution time.
 */
final class LogExecutionTime
{
    public function handle(object $job, Closure $next): void
    {
        $startTime = microtime(true);

        $next($job);

        $duration = round((microtime(true) - $startTime) * 1000, 2);

        Log::info('Job completed', [
            'job' => get_class($job),
            'duration_ms' => $duration,
        ]);
    }
}
```

## Custom Middleware: Database Transaction

```php
<?php

declare(strict_types=1);

namespace App\Jobs\Middleware;

use Closure;
use Illuminate\Support\Facades\DB;

/**
 * Wrap job in database transaction.
 */
final class WithTransaction
{
    public function handle(object $job, Closure $next): void
    {
        DB::transaction(function () use ($job, $next) {
            $next($job);
        });
    }
}
```

## Custom Middleware: Circuit Breaker

```php
<?php

declare(strict_types=1);

namespace App\Jobs\Middleware;

use Closure;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * Circuit breaker for external service calls.
 */
final class CircuitBreaker
{
    public function __construct(
        private readonly string $service,
        private readonly int $threshold = 5,
        private readonly int $cooldownSeconds = 60,
    ) {}

    public function handle(object $job, Closure $next): void
    {
        $key = "circuit_breaker:{$this->service}";
        $failures = (int) Cache::get($key, 0);

        if ($failures >= $this->threshold) {
            Log::warning('Circuit breaker open', [
                'service' => $this->service,
                'failures' => $failures,
            ]);

            // Release back to queue after cooldown
            $job->release($this->cooldownSeconds);
            return;
        }

        try {
            $next($job);

            // Reset on success
            Cache::forget($key);
        } catch (\Throwable $e) {
            // Increment failure count
            Cache::put($key, $failures + 1, $this->cooldownSeconds);
            throw $e;
        }
    }
}
```

## Job Using Multiple Middleware

```php
<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Jobs\Middleware\{
    EnsureActiveSubscription,
    LogExecutionTime,
    CircuitBreaker
};
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Middleware\RateLimited;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Queue\SerializesModels;

final class SyncUserData implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 3;

    public function __construct(
        public readonly User $user,
    ) {}

    /**
     * Job middleware stack.
     *
     * @return array<int, object>
     */
    public function middleware(): array
    {
        return [
            // Log execution time
            new LogExecutionTime(),

            // Only for subscribed users
            new EnsureActiveSubscription(),

            // Rate limit API calls
            new RateLimited('api-calls'),

            // Prevent concurrent sync for same user
            (new WithoutOverlapping($this->user->id))
                ->expireAfter(180),

            // Circuit breaker for external API
            new CircuitBreaker('external-api', threshold: 3),
        ];
    }

    public function handle(): void
    {
        // Sync user data with external service...
    }
}
```

## Built-in Middleware Reference

```php
use Illuminate\Queue\Middleware\RateLimited;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Queue\Middleware\ThrottlesExceptions;
use Illuminate\Queue\Middleware\Skip;

public function middleware(): array
{
    return [
        // Rate limiting
        new RateLimited('limiter-name'),

        // Prevent overlapping (same key = one at a time)
        (new WithoutOverlapping($this->order->id))
            ->releaseAfter(60)      // Release after 60s if locked
            ->expireAfter(180),     // Lock expires after 180s

        // Throttle on exceptions
        (new ThrottlesExceptions(maxAttempts: 10, decayMinutes: 5))
            ->backoff(5),

        // Skip conditionally
        Skip::when($this->order->isCancelled()),
        Skip::unless($this->user->isActive()),
    ];
}
```
