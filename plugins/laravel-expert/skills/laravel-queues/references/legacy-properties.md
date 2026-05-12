---
name: laravel-queues-legacy-properties
description: Legacy queueable property style (public $tries, $timeout, $backoff, ...) - retained for backward compatibility in Laravel 13. Prefer Attributes for new code.
---

# Queueable Legacy Properties (L12 → L13 migration)

Laravel 13 ships **PHP Attributes** for all queueable metadata. The legacy public-property style remains supported, but should be treated as LEGACY.

> ⚠ **Never mix** an attribute and its equivalent property on the same class. A single source of truth avoids silent conflicts.

Applies to **Jobs, Listeners, Notifications, Mailables, Broadcast Events**.

---

## Mapping Table

| Concern | Legacy (L12-style) | L13 Attribute (preferred) |
|---------|-------------------|---------------------------|
| Connection | `public $connection = 'redis';` | `#[Connection('redis')]` |
| Queue | `public $queue = 'podcasts';` | `#[Queue('podcasts')]` |
| Tries | `public int $tries = 5;` | `#[Tries(5)]` |
| Max exceptions | `public int $maxExceptions = 3;` | `#[MaxExceptions(3)]` |
| Timeout | `public int $timeout = 120;` | `#[Timeout(120)]` |
| Backoff (uniform) | `public int $backoff = 60;` | `#[Backoff(60)]` |
| Backoff (progressive) | `public array $backoff = [10, 30, 60];` | `#[Backoff([10, 30, 60])]` |
| Retry until | `public function retryUntil(): \DateTime` | `#[RetryUntil('+1 hour')]` |
| Fail on timeout | `public bool $failOnTimeout = true;` | `#[FailOnTimeout]` |
| Unique for | `public int $uniqueFor = 3600;` | `#[UniqueFor(3600)]` |
| After commit | `public bool $afterCommit = true;` | `#[AfterCommit]` |
| Delete when missing | `public $deleteWhenMissingModels = true;` | `#[DeleteWhenMissingModels]` |

---

## Full legacy example

```php
namespace App\Jobs;

use App\Models\Podcast;
use App\Services\PodcastService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

final class ProcessPodcast implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $connection      = 'redis';
    public $queue           = 'podcasts';
    public int $tries       = 5;
    public int $timeout     = 120;
    public array $backoff   = [10, 30, 60];
    public int $maxExceptions = 3;
    public bool $failOnTimeout = true;
    public int $uniqueFor   = 3600;
    public bool $afterCommit = true;

    public function __construct(public readonly Podcast $podcast) {}

    public function handle(PodcastService $service): void
    {
        $service->process($this->podcast);
    }

    public function failed(Throwable $e): void
    {
        \Log::error('Podcast failed', ['id' => $this->podcast->id, 'e' => $e]);
    }
}
```

---

## Migration recipe (per queueable)

1. Add `use Illuminate\Queue\Attributes\{Connection, Queue, Tries, Timeout, Backoff, MaxExceptions, FailOnTimeout, UniqueFor, AfterCommit};`
2. Replace each public property with its attribute counterpart on the class declaration.
3. **Delete** the legacy property — keeping both is forbidden.
4. If the job dispatches inside a transaction, switch to `#[AfterCommit]`.
5. Move per-job connection/queue defaults to centralised `Queue::route()` if applicable.
6. Run `fuse-ai-pilot:sniper`.

---

## Queue::route() vs per-class attribute

For environment-driven routing, prefer centralised configuration in `AppServiceProvider::boot()`:

```php
use Illuminate\Support\Facades\Queue;

Queue::route('podcasts', connection: 'redis',    queue: 'media');
Queue::route('mail',     connection: 'database', queue: 'transactional');
```

Then drop `#[Connection]` / `#[Queue]` from jobs that should follow the route. Per-job attributes still win when present.

---

## When the legacy style is still acceptable

- Generated code from third-party packages you cannot patch.
- Phased migration plans tracked in tickets.
- Scratch / prototype code never shipped.

For everything else, prefer Attributes — see [SKILL.md](../SKILL.md).
