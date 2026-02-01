---
name: contracts
description: Laravel Contracts (interfaces) for loose coupling
when-to-use: Using Laravel interfaces, understanding contracts
keywords: laravel, php, contracts, interfaces, loose coupling
priority: medium
related: container.md, facades.md
---

# Contracts

## Overview

Contracts are Laravel's set of interfaces defining core framework services. They provide explicit, documented APIs for framework features, enabling loose coupling and easier testing.

## Why Use Contracts

| Benefit | Description |
|---------|-------------|
| **Loose coupling** | Depend on interface, not implementation |
| **Documentation** | Clear API definition |
| **Swappable** | Easy to change implementations |
| **Testable** | Mock interfaces in tests |

## Contracts vs Facades

| Aspect | Contracts | Facades |
|--------|-----------|---------|
| Type | Interface | Static proxy |
| DI | Explicit injection | Implicit resolution |
| IDE support | Native | Needs helper |
| Testing | Mock interface | Fake facade |

## Common Contracts

| Contract | Facade | Purpose |
|----------|--------|---------|
| `Illuminate\Contracts\Auth\Guard` | `Auth` | Authentication |
| `Illuminate\Contracts\Cache\Repository` | `Cache` | Caching |
| `Illuminate\Contracts\Config\Repository` | `Config` | Configuration |
| `Illuminate\Contracts\Events\Dispatcher` | `Event` | Events |
| `Illuminate\Contracts\Filesystem\Filesystem` | `Storage` | File storage |
| `Illuminate\Contracts\Mail\Mailer` | `Mail` | Email |
| `Illuminate\Contracts\Queue\Queue` | `Queue` | Job queuing |
| `Illuminate\Contracts\Validation\Factory` | `Validator` | Validation |

## Using Contracts

Type-hint the contract in your constructor:

```php
use Illuminate\Contracts\Cache\Repository as Cache;

class UserRepository
{
    public function __construct(
        private readonly Cache $cache,
    ) {}

    public function find(int $id): ?User
    {
        return $this->cache->remember(
            "user.{$id}",
            3600,
            fn () => User::find($id)
        );
    }
}
```

## Contract Location

All contracts are in `Illuminate\Contracts` namespace:

```
Illuminate\Contracts\
├── Auth\
├── Broadcasting\
├── Bus\
├── Cache\
├── Config\
├── Console\
├── Container\
├── Cookie\
├── Database\
├── Encryption\
├── Events\
├── Filesystem\
├── Foundation\
├── Hashing\
├── Http\
├── Mail\
├── Notifications\
├── Pagination\
├── Pipeline\
├── Queue\
├── Redis\
├── Routing\
├── Session\
├── Support\
├── Translation\
├── Validation\
└── View\
```

## Creating Your Own Contracts

```php
// Define interface
namespace App\Contracts;

interface PaymentGateway
{
    public function charge(int $amount, string $token): PaymentResult;
    public function refund(string $chargeId): RefundResult;
}

// Bind in provider
$this->app->bind(PaymentGateway::class, StripeGateway::class);

// Use via DI
public function __construct(private readonly PaymentGateway $gateway) {}
```

## Best Practices

1. **Use for core services** - Cache, Queue, etc.
2. **Create for domain** - Your own service interfaces
3. **Bind in providers** - Register implementations
4. **Test with mocks** - Mock interface, not implementation

## Related References

- [container.md](container.md) - Binding contracts
- [facades.md](facades.md) - Alternative access pattern
