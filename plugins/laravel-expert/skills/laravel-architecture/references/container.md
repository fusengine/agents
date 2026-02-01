---
name: container
description: Laravel Service Container and dependency injection
when-to-use: Understanding DI, binding services, resolving dependencies
keywords: laravel, php, container, di, dependency injection, ioc
priority: high
related: providers.md, facades.md, contracts.md
---

# Service Container

## Overview

The Service Container is Laravel's powerful tool for managing class dependencies and performing dependency injection. It's the foundation of the framework, automatically resolving dependencies declared in constructors.

## Why Use the Container

| Benefit | Description |
|---------|-------------|
| **Automatic DI** | Constructor dependencies resolved automatically |
| **Loose Coupling** | Bind interfaces to implementations |
| **Testability** | Swap implementations for testing |
| **Singletons** | Share instances across application |

## Automatic Resolution

Laravel automatically resolves type-hinted dependencies:

```php
class PostController extends Controller
{
    public function __construct(
        private readonly PostService $postService, // Auto-resolved
    ) {}
}
```

## Binding

Register bindings in Service Providers:

### Simple Binding

```php
$this->app->bind(PostService::class, function ($app) {
    return new PostService($app->make(PostRepository::class));
});
```

### Interface to Implementation

```php
$this->app->bind(
    PostRepositoryInterface::class,
    EloquentPostRepository::class
);
```

### Singleton

```php
$this->app->singleton(PaymentGateway::class, function ($app) {
    return new StripeGateway(config('services.stripe.key'));
});
```

### Instance

```php
$this->app->instance(PaymentGateway::class, $gateway);
```

## Contextual Binding

Different implementations for different classes:

```php
$this->app->when(PhotoController::class)
    ->needs(Filesystem::class)
    ->give(function () {
        return Storage::disk('photos');
    });
```

## Resolving

```php
// From container
$service = app(PostService::class);
$service = resolve(PostService::class);

// With parameters
$service = app()->make(PostService::class, ['param' => $value]);
```

## Method Injection

Laravel also injects into controller methods:

```php
public function store(Request $request, PostService $service)
{
    // $service is auto-injected
}
```

## Tagging

Group related bindings:

```php
$this->app->tag([EmailReport::class, PdfReport::class], 'reports');

// Resolve all tagged
$reports = app()->tagged('reports');
```

## Extending Bindings

Modify resolved instances:

```php
$this->app->extend(PostService::class, function ($service, $app) {
    return new CachedPostService($service);
});
```

## Best Practices

1. **Bind interfaces** - Not concrete classes
2. **Use singletons** - For expensive-to-create services
3. **Contextual binding** - When same interface needs different implementations
4. **Constructor injection** - Prefer over method injection

## Related References

- [providers.md](providers.md) - Where to register bindings
- [facades.md](facades.md) - Static access to container services
- [contracts.md](contracts.md) - Laravel's interface contracts
