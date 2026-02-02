---
name: troubleshooting
description: Common queue errors and solutions
file-type: markdown
---

# Queue Troubleshooting

## Common Errors

| Error | Solution |
|-------|----------|
| Job not running | Check driver, start worker |
| Timeout | Increase `$timeout`, install pcntl |
| Memory exhausted | Use model IDs, not objects |
| Duplicate jobs | Use ShouldBeUnique |
| Lost jobs | Enable Redis persistence |

---

## Jobs Not Processing

```bash
# Check driver
php artisan tinker
>>> config('queue.default')

# Check worker
php artisan queue:work --once

# Check queue size
>>> Queue::size('default')
```

---

## Timeout Issues

```php
public int $timeout = 300;
```

**Note**: Requires `pcntl` extension.

---

## Memory Issues

```php
// BAD: Large object
public function __construct(public Collection $users) {}

// GOOD: Use IDs
public function __construct(public array $userIds) {}

public function handle(): void
{
    User::whereIn('id', $this->userIds)->chunk(100, fn($u) => ...);
}
```

---

## Transaction Issues

```php
// Problem: Data not committed
DB::transaction(function () {
    $order = Order::create([...]);
    ProcessOrder::dispatch($order); // May fail!
});

// Solution
ProcessOrder::dispatch($order)->afterCommit();
```

---

## Debug Commands

```bash
redis-cli LLEN queues:default   # Pending jobs
php artisan queue:failed        # Failed jobs
php artisan queue:retry 5       # Retry job
php artisan queue:clear redis   # Clear queue
```

---

## Horizon Issues

```bash
php artisan tinker
>>> Redis::ping()

php artisan horizon:publish
php artisan horizon:terminate && php artisan horizon
```

---

## Decision Tree

```
Issue?
├── Not running → Check driver + worker
├── Timeout → Increase + pcntl
├── Memory → Use IDs
├── Transaction → afterCommit()
└── Redis lost → Check connection
```

---

## Best Practices

### DO
- Log job progress
- Use `queue:monitor`
- Test jobs locally

### DON'T
- Store large objects
- Use sync in production
