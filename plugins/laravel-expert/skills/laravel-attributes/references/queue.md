---
name: queue-attributes
description: Queue Job class-level attributes shipped in Laravel 13
---

# Queue / Job Attributes (Laravel 13)

Namespace: `Illuminate\Queue\Attributes\*`

## Routing

```php
use Illuminate\Queue\Attributes\{Connection, Queue};

#[Connection('redis')]
#[Queue('podcasts')]
class ProcessPodcast implements ShouldQueue {}
```

| Attribute | Replaces |
|-----------|----------|
| `#[Connection('redis')]` | `public $connection` |
| `#[Queue('podcasts')]` | `public $queue` |

## Reliability

```php
use Illuminate\Queue\Attributes\{Tries, Timeout, Backoff, MaxExceptions, FailOnTimeout};

#[Tries(5)]
#[Timeout(120)]
#[Backoff([10, 30, 60])]
#[MaxExceptions(3)]
#[FailOnTimeout]
class GenerateReport implements ShouldQueue {}
```

| Attribute | Replaces | Notes |
|-----------|----------|-------|
| `#[Tries(5)]` | `public $tries = 5` | Total attempt count |
| `#[Timeout(120)]` | `public $timeout = 120` | Seconds before SIGTERM |
| `#[Backoff([10,30,60])]` | `public $backoff` | Array = progressive backoff |
| `#[MaxExceptions(3)]` | `public $maxExceptions` | Stop after N uncaught exceptions |
| `#[FailOnTimeout]` | `public $failOnTimeout = true` | Marker attribute |

## Uniqueness

```php
use Illuminate\Queue\Attributes\UniqueFor;

#[UniqueFor(3600)]
class GenerateInvoice implements ShouldQueue, ShouldBeUnique
{
    public function uniqueId(): string
    {
        return $this->invoice->id;
    }
}
```

`#[UniqueFor(3600)]` replaces `public $uniqueFor = 3600` - lock duration in seconds.

## Centralized routing alternative

Instead of per-class `#[Connection]`/`#[Queue]`, use `Queue::route()` in a service provider:

```php
use Illuminate\Support\Facades\Queue;

public function boot(): void
{
    Queue::route(ProcessPodcast::class, connection: 'redis', queue: 'podcasts');
    Queue::route([
        ProcessVideo::class => ['redis', 'videos'], // [connection, queue]
        SendEmail::class => 'mail',                 // queue only
    ]);
}
```

Use attributes when routing is intrinsic to the job; use `Queue::route()` when routing depends on environment.

## Delay & debounce (13.4+ / 13.6+)

```php
use Illuminate\Queue\Attributes\{Delay, DebounceFor};

#[Delay(60)]                         // replaces public $delay
class SendReminder implements ShouldQueue {}

#[DebounceFor(30, maxWait: 120)]     // only the latest dispatch within 30s runs
class UpdateSearchIndex implements ShouldQueue
{
    public function debounceId(): string { return (string) $this->productId; }
}
```

`#[DebounceFor]` and `ShouldBeUnique` are mutually exclusive. Since 13.2, `#[Queue]` / `#[Connection]` accept enums and `#[Backoff]` is variadic (`#[Backoff(10, 30, 60)]`); since 13.16 queue attributes may be declared on traits.
