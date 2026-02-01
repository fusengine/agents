---
name: providers
description: Laravel Service Providers for bootstrapping
when-to-use: Registering services, bootstrapping application
keywords: laravel, php, providers, service provider, bootstrap
priority: high
related: container.md, facades.md
---

# Service Providers

## Overview

Service Providers are the central place for configuring and bootstrapping your Laravel application. All core Laravel services and your application services are bootstrapped via providers.

## Provider Structure

```php
class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind services to container
    }

    public function boot(): void
    {
        // Bootstrap after all providers registered
    }
}
```

## Register vs Boot

| Method | When | Purpose |
|--------|------|---------|
| `register()` | First | Bind services to container |
| `boot()` | After all register() | Use services, configure app |

**Important**: Never use services in `register()` - other providers may not be registered yet.

## Creating Providers

```shell
php artisan make:provider PaymentServiceProvider
```

Register in `bootstrap/providers.php`:

```php
return [
    App\Providers\AppServiceProvider::class,
    App\Providers\PaymentServiceProvider::class,
];
```

## Binding Services

```php
public function register(): void
{
    // Simple binding
    $this->app->bind(PaymentGateway::class, StripeGateway::class);

    // Singleton
    $this->app->singleton(Analytics::class, function ($app) {
        return new Analytics(config('services.analytics.key'));
    });

    // Interface to implementation
    $this->app->bind(
        PaymentGatewayInterface::class,
        StripeGateway::class
    );
}
```

## Bootstrapping

```php
public function boot(): void
{
    // Define routes
    Route::middleware('api')->group(base_path('routes/api.php'));

    // Register Blade components
    Blade::component('alert', AlertComponent::class);

    // Configure services
    Validator::extend('phone', fn ($attr, $value) => preg_match('/^\+/', $value));

    // Publish config
    $this->publishes([
        __DIR__.'/../config/payment.php' => config_path('payment.php'),
    ]);
}
```

## Deferred Providers

Load providers only when needed:

```php
class HeavyServiceProvider extends ServiceProvider implements DeferrableProvider
{
    public function provides(): array
    {
        return [HeavyService::class];
    }
}
```

## Common Use Cases

| Use Case | Method |
|----------|--------|
| Bind services | `register()` |
| Register commands | `boot()` |
| Configure routes | `boot()` |
| Register Blade directives | `boot()` |
| Publish assets | `boot()` |
| Listen to events | `boot()` |

## Best Practices

1. **One responsibility** - Split large providers
2. **Defer heavy services** - Use `DeferrableProvider`
3. **No logic in register** - Only bindings
4. **Use boot for config** - Routes, Blade, etc.

## Related References

- [container.md](container.md) - Service Container bindings
- [facades.md](facades.md) - Facade registration
