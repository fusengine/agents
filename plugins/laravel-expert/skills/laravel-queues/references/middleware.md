---
name: middleware
description: Job middleware for rate limiting and throttling
file-type: markdown
---

# Job Middleware

## Built-in

| Middleware | Purpose |
|------------|---------|
| `RateLimited` | Limit job rate |
| `WithoutOverlapping` | Prevent concurrent |
| `ThrottlesExceptions` | Backoff on errors |
| `Skip` | Conditionally skip |

---

## Applying Middleware

```php
public function middleware(): array
{
    return [
        new RateLimited('orders'),
        new WithoutOverlapping($this->order->id),
    ];
}
```

---

## Rate Limiting

```php
// AppServiceProvider
RateLimiter::for('orders', fn($job) => Limit::perMinute(10));

// In job
public function middleware(): array
{
    return [new RateLimited('orders')];
}
```

---

## Without Overlapping

```php
(new WithoutOverlapping($this->order->id))
    ->releaseAfter(60)   // Release if locked
    ->expireAfter(180);  // Lock expiry
```

---

## Throttle Exceptions

```php
(new ThrottlesExceptions(10, 5)) // 10 exceptions, 5 min backoff
    ->backoff(5);
```

---

## Skip Middleware

```php
Skip::when($this->order->isCancelled());
Skip::unless($this->user->isActive());
```

---

## Custom Middleware

```php
final class EnsureActiveSubscription
{
    public function handle(object $job, Closure $next): void
    {
        if ($job->user->subscribed()) {
            $next($job);
        }
    }
}
```

---

## Decision Tree

```
Middleware needed?
├── API rate limits → RateLimited
├── One at a time → WithoutOverlapping
├── Backoff errors → ThrottlesExceptions
├── Conditional → Skip::when()
└── Custom → Create class
```

---

## Best Practices

### DO
- Define limiters in AppServiceProvider
- Set lock expiration times

### DON'T
- Chain too many middleware
- Forget `expireAfter()`
