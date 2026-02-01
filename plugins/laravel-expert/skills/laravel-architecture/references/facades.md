---
name: facades
description: Laravel Facades for static-like access to services
when-to-use: Understanding facades, creating custom facades
keywords: laravel, php, facades, static, proxy
priority: medium
related: container.md, providers.md, contracts.md
---

# Facades

## Overview

Facades provide a static-like interface to classes available in the service container. They act as proxies to underlying service instances, offering convenient syntax while maintaining testability.

## How Facades Work

```php
// Facade call
Cache::get('key');

// Actually resolves to
app('cache')->get('key');
```

Facades extend `Illuminate\Support\Facades\Facade` and define a `getFacadeAccessor()` method.

## Common Facades

| Facade | Service | Purpose |
|--------|---------|---------|
| `Auth` | Authentication | User auth |
| `Cache` | Cache manager | Caching |
| `Config` | Config repository | Configuration |
| `DB` | Database manager | Database queries |
| `Event` | Event dispatcher | Events |
| `File` | Filesystem | File operations |
| `Hash` | Hasher | Password hashing |
| `Log` | Logger | Logging |
| `Mail` | Mailer | Sending emails |
| `Queue` | Queue manager | Job queuing |
| `Route` | Router | Routing |
| `Session` | Session manager | Sessions |
| `Storage` | Filesystem | Cloud storage |
| `Validator` | Validator factory | Validation |

## Facades vs Dependency Injection

| Aspect | Facades | DI |
|--------|---------|-----|
| Syntax | `Cache::get()` | `$this->cache->get()` |
| Testing | Fake with `Cache::fake()` | Mock in constructor |
| Discoverability | IDE needs helper | Clear dependencies |
| Coupling | Implicit | Explicit |

## Real-Time Facades

Use any class as a facade:

```php
use Facades\App\Services\PaymentService;

PaymentService::charge($amount);
```

Prefix namespace with `Facades\` to access any class statically.

## Creating Custom Facades

```php
// 1. Create facade class
class Payment extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return PaymentService::class;
    }
}

// 2. Register alias in config/app.php
'aliases' => [
    'Payment' => App\Facades\Payment::class,
],
```

## Testing with Facades

```php
// Fake the facade
Cache::fake();

// Assert interactions
Cache::shouldReceive('get')
    ->once()
    ->with('key')
    ->andReturn('value');
```

## Facade vs Contract

| Use | When |
|-----|------|
| **Facade** | Quick prototyping, simple apps |
| **Contract (Interface)** | Large apps, explicit dependencies |

## Best Practices

1. **Prefer DI** - In controllers and services
2. **Use in config** - Facades ok in config, routes
3. **Real-time facades** - For temporary facade access
4. **Don't overuse** - Hides dependencies

## Related References

- [container.md](container.md) - Services behind facades
- [contracts.md](contracts.md) - Interface alternative
- [providers.md](providers.md) - Registering facades
