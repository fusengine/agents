---
name: MeteredBillingController
description: Complete metered billing implementation with usage tracking
when-to-use: Implementing usage-based billing
keywords: metered, usage, api, tracking, reporting
---

# Metered Billing Implementation

## Controller

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Jobs\ReportUsageBatch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MeteredBillingController extends Controller
{
    public function createSubscription(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payment_method' => ['required', 'string'],
        ]);

        $user = $request->user();

        // Hybrid: Base + metered
        $subscription = $user->newSubscription('default')
            ->price(config('billing.prices.base'))
            ->meteredPrice(config('billing.prices.api_calls'))
            ->meteredPrice(config('billing.prices.storage'))
            ->create($validated['payment_method']);

        return response()->json([
            'subscription' => $subscription->only(['id', 'name', 'stripe_status']),
        ], 201);
    }

    public function usage(Request $request): JsonResponse
    {
        $user = $request->user();
        $subscription = $user->subscription('default');

        if (!$subscription) {
            return response()->json(['error' => 'No subscription'], 404);
        }

        return response()->json([
            'api_calls' => [
                'used' => $this->getUsage($subscription, 'api_calls'),
                'limit' => $user->getPlanLimit('api_calls'),
                'resets_at' => $subscription->asStripeSubscription()->current_period_end,
            ],
            'storage_gb' => [
                'used' => $this->getUsage($subscription, 'storage'),
                'limit' => $user->getPlanLimit('storage_gb'),
            ],
        ]);
    }

    private function getUsage($subscription, string $type): int
    {
        $priceId = config("billing.prices.{$type}");
        $item = $subscription->items->where('stripe_price', $priceId)->first();

        if (!$item) {
            return 0;
        }

        $summary = \Stripe\SubscriptionItem::retrieve($item->stripe_id)
            ->usageRecordSummaries(['limit' => 1])
            ->data[0] ?? null;

        return $summary?->total_usage ?? 0;
    }
}
```

## Usage Tracking Middleware

```php
<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Jobs\ReportApiUsage;
use Closure;
use Illuminate\Http\Request;

class TrackApiUsage
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if ($user = $request->user()) {
            ReportApiUsage::dispatch($user->id)->onQueue('usage');
        }

        return $response;
    }
}
```

## Usage Report Job

```php
<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Cache;

class ReportApiUsage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public function __construct(
        private int $userId,
        private int $quantity = 1
    ) {}

    public function handle(): void
    {
        $user = User::find($this->userId);

        if (!$user?->subscribed('default')) {
            return;
        }

        // Batch: accumulate in cache, report hourly
        $key = "usage:{$this->userId}:" . now()->format('YmdH');
        $count = Cache::increment($key, $this->quantity);
        Cache::expire($key, 7200);

        // Report every 100 calls or hourly via scheduler
        if ($count % 100 === 0) {
            $this->reportToStripe($user, $count);
            Cache::forget($key);
        }
    }

    private function reportToStripe(User $user, int $quantity): void
    {
        $user->subscription('default')
            ->reportUsageFor(config('billing.prices.api_calls'), $quantity);
    }
}
```

## Batch Reporter (Scheduled)

```php
<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Cache;

class ReportUsageBatch implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        User::whereHas('subscriptions', fn ($q) => $q->active())
            ->chunk(100, function ($users) {
                foreach ($users as $user) {
                    $this->reportUserUsage($user);
                }
            });
    }

    private function reportUserUsage(User $user): void
    {
        // API calls from cache
        $pattern = "usage:{$user->id}:*";
        $keys = Cache::getRedis()->keys($pattern);

        $total = 0;
        foreach ($keys as $key) {
            $total += (int) Cache::get($key);
            Cache::forget($key);
        }

        if ($total > 0) {
            $user->subscription('default')
                ->reportUsageFor(config('billing.prices.api_calls'), $total);
        }

        // Storage (calculate directly)
        $storageGb = (int) ceil($user->files()->sum('size') / 1024 / 1024 / 1024);

        if ($storageGb > 0) {
            $user->subscription('default')
                ->reportUsageFor(config('billing.prices.storage'), $storageGb);
        }
    }
}
```

## Limit Enforcement Middleware

```php
<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnforceUsageLimit
{
    public function handle(Request $request, Closure $next, string $limitType = 'api_calls')
    {
        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        $limit = $user->getPlanLimit($limitType);
        $current = $user->getCurrentUsage($limitType);

        if ($limit !== -1 && $current >= $limit) {
            return response()->json([
                'error' => 'Usage limit exceeded',
                'limit' => $limit,
                'current' => $current,
                'upgrade_url' => route('billing.plans'),
            ], 429);
        }

        return $next($request);
    }
}
```

## Config

```php
<?php
// config/billing.php

return [
    'prices' => [
        'base' => env('STRIPE_PRICE_BASE'),
        'api_calls' => env('STRIPE_PRICE_API_CALLS'),
        'storage' => env('STRIPE_PRICE_STORAGE'),
    ],

    'limits' => [
        'basic' => [
            'api_calls' => 1000,
            'storage_gb' => 5,
        ],
        'premium' => [
            'api_calls' => 50000,
            'storage_gb' => 100,
        ],
        'enterprise' => [
            'api_calls' => -1, // unlimited
            'storage_gb' => -1,
        ],
    ],
];
```

## Scheduler

```php
// routes/console.php
Schedule::job(new ReportUsageBatch)->hourly();
```
