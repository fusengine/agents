---
name: dispatching
description: Dispatching jobs to queues
file-type: markdown
---

# Dispatching Jobs

## Methods

| Method | Purpose |
|--------|---------|
| `dispatch()` | Add to queue |
| `dispatchSync()` | Run immediately |
| `dispatchAfterResponse()` | After HTTP response |
| `dispatchIf($cond)` | Conditional |

---

## Basic Dispatching

```php
// Standard
ProcessOrder::dispatch($order);

// Delayed
ProcessOrder::dispatch($order)->delay(now()->addMinutes(5));

// Specific queue
ProcessOrder::dispatch($order)->onQueue('orders');

// Specific connection + queue
ProcessOrder::dispatch($order)->onConnection('redis')->onQueue('high');
```

---

## Conditional Dispatch

```php
ProcessOrder::dispatchIf($order->isPaid(), $order);
ProcessOrder::dispatchUnless($order->isCancelled(), $order);
```

---

## Synchronous Dispatch

```php
ProcessOrder::dispatchSync($order);
```

---

## After Response Dispatch

```php
ProcessOrder::dispatchAfterResponse($order);

dispatch(fn() => $user->notify(new WelcomeNotification()))
    ->afterResponse();
```

---

## Database Transactions

```php
// Safe dispatch within transaction
DB::transaction(function () use ($order) {
    $order->save();
    ProcessOrder::dispatch($order)->afterCommit();
});

// Global config (config/queue.php)
'redis' => ['after_commit' => true],
```

---

## Dispatch Closures

```php
dispatch(fn() => Mail::to('admin@example.com')->send(new Report()))
    ->catch(fn(\Throwable $e) => Log::error($e->getMessage()));
```

---

## Queue Priorities

```bash
php artisan queue:work --queue=high,default,low
```

---

## Decision Tree

```
When to dispatch?
├── Background → dispatch()
├── Must complete now → dispatchSync()
├── Non-critical → dispatchAfterResponse()
├── In transaction → afterCommit()
└── One-off → dispatch(closure)
```

---

## Best Practices

### DO
- Use `afterCommit()` in transactions
- Set queue priorities

### DON'T
- Dispatch in loops (use batches)
- Use sync driver in production
