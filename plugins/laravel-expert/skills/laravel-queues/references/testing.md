---
name: testing
description: Testing queue jobs, batches, and chains
file-type: markdown
---

# Testing Jobs

## Faking Jobs

```php
Queue::fake();
$order->process();
Queue::assertPushed(ProcessOrder::class);
```

---

## Assertions

| Assertion | Purpose |
|-----------|---------|
| `assertPushed()` | Was dispatched |
| `assertPushedOn()` | On specific queue |
| `assertNotPushed()` | Not dispatched |
| `assertNothingPushed()` | None dispatched |

---

## Assert with Callback

```php
Queue::assertPushed(ProcessOrder::class, fn($job) =>
    $job->order->id === $this->order->id
);

Queue::assertPushedOn('orders', ProcessOrder::class);
```

---

## Partial Faking

```php
Queue::fake([ProcessOrder::class]);
// Only ProcessOrder faked, others run normally
```

---

## Test Job Logic

```php
public function test_job_processes(): void
{
    $order = Order::factory()->create();

    (new ProcessOrder($order))->handle(app(OrderService::class));

    $this->assertEquals('processed', $order->fresh()->status);
}
```

---

## Test Chains

```php
Queue::fake();

Bus::chain([new ValidateOrder($order), new ProcessPayment($order)])->dispatch();

Queue::assertPushedWithChain(ValidateOrder::class, [ProcessPayment::class]);
```

---

## Test Batches

```php
Bus::fake();

$this->service->processImages($images);

Bus::assertBatched(fn($batch) =>
    $batch->jobs->count() === 5
);
```

---

## Test Failures

```php
public function test_failed_logs_error(): void
{
    Log::shouldReceive('error')->once();

    $job = new ProcessOrder($order);
    $job->failed(new \Exception('Error'));
}
```

---

## Decision Tree

```
Testing approach?
├── Verify dispatch → Queue::fake()
├── Test logic → Call handle()
├── Test chains → assertPushedWithChain
├── Test batches → Bus::assertBatched
└── Test failures → Call failed()
```

---

## Best Practices

### DO
- Test dispatch and logic separately
- Test failure handling
- Use factories

### DON'T
- Test framework internals
- Skip failed() tests
