---
name: jobs
description: Creating and configuring job classes
file-type: markdown
---

# Job Classes

## Creating Jobs

```bash
php artisan make:job ProcessOrder
php artisan make:job SendEmail --sync  # Synchronous
```

---

## Job Structure

| Property | Type | Purpose |
|----------|------|---------|
| `$tries` | int | Max attempts before failing |
| `$backoff` | int/array | Seconds between retries |
| `$timeout` | int | Max execution seconds |
| `$maxExceptions` | int | Max exceptions before failing |
| `$failOnTimeout` | bool | Fail instead of retry on timeout |

---

## Basic Job

```php
<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

final class ProcessOrder implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;
    public int $backoff = 60;
    public int $timeout = 120;

    public function __construct(
        public readonly Order $order,
    ) {}

    public function handle(OrderService $service): void
    {
        $service->process($this->order);
    }
}
```

---

## Retry Configuration

```php
// Fixed backoff
public int $backoff = 60;

// Exponential backoff (10s, 30s, 60s)
public array $backoff = [10, 30, 60];

// Dynamic backoff
public function backoff(): array
{
    return [1, 5, 10];
}

// Retry until specific time
public function retryUntil(): DateTime
{
    return now()->addHours(24);
}
```

---

## Unique Jobs

| Modifier | Purpose |
|----------|---------|
| `ShouldBeUnique` | Prevent duplicates in queue |
| `ShouldBeUniqueUntilProcessing` | Unique until job starts |
| `uniqueId()` | Custom uniqueness key |
| `uniqueFor()` | Lock duration in seconds |

```php
final class ProcessOrder implements ShouldQueue, ShouldBeUnique
{
    public int $uniqueFor = 3600; // 1 hour lock

    public function uniqueId(): string
    {
        return $this->order->id;
    }
}
```

---

## Encrypted Jobs

```php
use Illuminate\Contracts\Queue\ShouldBeEncrypted;

final class ProcessPayment implements ShouldQueue, ShouldBeEncrypted
{
    public function __construct(
        public readonly string $cardNumber,
    ) {}
}
```

---

## Decision Tree

```
Job type needed?
├── Standard async → ShouldQueue
├── Prevent duplicates → ShouldBeUnique
├── Sensitive data → ShouldBeEncrypted
├── Run once only → ShouldBeUniqueUntilProcessing
└── Conditional → ShouldQueueAfterCommit
```

---

## Best Practices

### DO
- Use `final` for job classes
- Use `readonly` for constructor properties
- Set explicit `$tries` and `$timeout`
- Use dependency injection in `handle()`

### DON'T
- Store Eloquent models directly (use IDs)
- Make jobs too complex (single responsibility)
- Forget to set timeout for long operations
