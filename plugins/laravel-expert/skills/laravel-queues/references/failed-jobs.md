---
name: failed-jobs
description: Handling failed jobs and retries
file-type: markdown
---

# Failed Jobs

## Setup

```bash
php artisan make:queue-failed-table && php artisan migrate
```

---

## Commands

| Command | Purpose |
|---------|---------|
| `queue:failed` | List failed |
| `queue:retry {id}` | Retry one |
| `queue:retry all` | Retry all |
| `queue:forget {id}` | Delete one |
| `queue:flush` | Delete all |
| `queue:prune-failed` | Prune old |

---

## Handling in Job

```php
final class ProcessOrder implements ShouldQueue
{
    public int $tries = 3;
    public int $maxExceptions = 2;

    public function failed(\Throwable $e): void
    {
        Log::error('Job failed', [
            'order' => $this->order->id,
            'error' => $e->getMessage(),
        ]);
    }
}
```

---

## Retry Config

```php
// Max attempts
public int $tries = 3;

// Or retry until time
public function retryUntil(): DateTime
{
    return now()->addHours(24);
}
```

---

## Global Handler

```php
// AppServiceProvider
Queue::failing(function (JobFailed $event) {
    Log::channel('slack')->error('Job failed', [
        'job' => $event->job->getName(),
    ]);
});
```

---

## Missing Models

```php
// Auto-delete when model missing
public bool $deleteWhenMissingModels = true;
```

---

## Pruning

```bash
php artisan queue:prune-failed --hours=48
```

```php
$schedule->command('queue:prune-failed --hours=48')->daily();
```

---

## Decision Tree

```
Failed job?
├── Auto retry → Set $tries
├── Time-based → retryUntil()
├── Custom handling → failed()
├── Monitor all → Queue::failing()
└── Model deleted → deleteWhenMissingModels
```

---

## Best Practices

### DO
- Implement `failed()` method
- Set up global monitoring
- Schedule pruning

### DON'T
- Ignore failures
- Set unlimited retries
