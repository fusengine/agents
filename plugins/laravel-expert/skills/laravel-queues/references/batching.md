---
name: batching
description: Job batching for grouped processing
file-type: markdown
---

# Job Batching

## Overview

| Feature | Purpose |
|---------|---------|
| **Batch** | Group jobs together |
| **Progress** | Track completion % |
| **Callbacks** | then/catch/finally |
| **Cancel** | Stop remaining jobs |

---

## Setup

```bash
php artisan make:queue-batches-table && php artisan migrate
```

---

## Batchable Job

```php
use Illuminate\Bus\Batchable;

final class ProcessImage implements ShouldQueue
{
    use Batchable, Queueable;

    public function handle(): void
    {
        if ($this->batch()?->cancelled()) return;
        // Process...
    }
}
```

---

## Dispatching Batches

```php
$batch = Bus::batch([
    new ProcessImage('img1.jpg'),
    new ProcessImage('img2.jpg'),
])
->then(fn(Batch $b) => /* success */)
->catch(fn(Batch $b, \Throwable $e) => /* failure */)
->finally(fn(Batch $b) => /* always */)
->name('Process Images')
->onQueue('images')
->dispatch();
```

---

## Batch Properties

| Property | Purpose |
|----------|---------|
| `id` | Batch UUID |
| `totalJobs` | Total count |
| `pendingJobs` | Remaining |
| `failedJobs` | Failed count |
| `progress()` | % complete |
| `finished()` | All done? |
| `cancelled()` | Cancelled? |

---

## Common Operations

```php
// Find batch
$batch = Bus::findBatch($batchId);

// Check progress
$batch->progress(); // 0-100

// Cancel batch
Bus::findBatch($batchId)->cancel();

// Add jobs dynamically
$batch->add([new ProcessImage('new.jpg')]);
```

---

## Batch Options

```php
Bus::batch($jobs)
    ->name('Import')
    ->allowFailures()      // Continue on errors
    ->onQueue('imports')
    ->dispatch();
```

---

## Decision Tree

```
Batch config?
├── Must all succeed → Default
├── Continue on error → allowFailures()
├── Need progress → progress() polling
├── Need cancel → cancel() + check
└── Add jobs later → $batch->add()
```

---

## Best Practices

### DO
- Check `cancelled()` in long jobs
- Name batches for identification
- Clean up old batches

### DON'T
- Create huge batches
- Forget cancellation handling
