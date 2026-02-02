---
name: chaining
description: Job chaining for sequential execution
file-type: markdown
---

# Job Chaining

## Overview

Chains execute jobs sequentially. If one fails, remaining jobs don't run.

---

## Basic Chain

```php
use Illuminate\Support\Facades\Bus;

Bus::chain([
    new ProcessPodcast($podcast),
    new OptimizeAudio($podcast),
    new ReleasePodcast($podcast),
])->dispatch();
```

---

## Chain with Callbacks

```php
Bus::chain([
    new ProcessOrder($order),
    new SendConfirmation($order),
    new NotifyWarehouse($order),
])
->catch(function (\Throwable $e) {
    Log::error('Order chain failed', ['error' => $e->getMessage()]);
})
->finally(function () {
    // Always runs
})
->dispatch();
```

---

## Chain Configuration

```php
Bus::chain($jobs)
    ->onConnection('redis')
    ->onQueue('orders')
    ->dispatch();
```

---

## Chains in Batches

```php
Bus::batch([
    // Chain 1
    Bus::chain([
        new ProcessOrder($order1),
        new SendConfirmation($order1),
    ]),
    // Chain 2
    Bus::chain([
        new ProcessOrder($order2),
        new SendConfirmation($order2),
    ]),
])->dispatch();
```

---

## Dynamic Chaining

```php
// Build chain dynamically
$jobs = collect($orders)->map(fn($order) => new ProcessOrder($order));

Bus::chain($jobs->all())->dispatch();
```

---

## Accessing Chain in Job

```php
final class ProcessOrder implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        // Process...

        // Add job to chain dynamically
        $this->appendToChain(new SendReceipt($this->order));
    }
}
```

---

## Chain vs Batch

| Feature | Chain | Batch |
|---------|-------|-------|
| Execution | Sequential | Parallel |
| Failure | Stops chain | Configurable |
| Progress | No built-in | Yes |
| Cancel | No | Yes |
| Use case | A → B → C | A + B + C |

---

## Decision Tree

```
Job orchestration?
├── Must run in order → Chain
├── Can run in parallel → Batch
├── Both patterns → Chains inside Batch
├── Add jobs dynamically → appendToChain()
└── Error handling → catch() callback
```

---

## Best Practices

### DO
- Use chains for dependent sequential tasks
- Add catch() for error handling
- Use chains inside batches for complex workflows

### DON'T
- Use chains for independent jobs (use batches)
- Create very long chains (harder to debug)
- Forget error handling with catch()
