---
name: service-provider
description: Module ServiceProvider setup and best practices
when-to-use: Creating module providers, registering services
keywords: serviceprovider, provider, register, boot, binding
priority: high
related: traits.md, module-discovery.md
---

# Module ServiceProvider

## Overview

Every FuseCore module has a ServiceProvider that handles registration and bootstrapping. It uses the `HasModule` trait for resource loading.

## ServiceProvider Structure

### Location

```
FuseCore/{Module}/App/Providers/{Module}ServiceProvider.php
```

### Naming Convention

| Module | Provider Name |
|--------|---------------|
| `User` | `UserServiceProvider` |
| `BlogPost` | `BlogPostServiceProvider` |
| `Dashboard` | `DashboardServiceProvider` |

## Lifecycle Methods

### register()

| Purpose | Examples |
|---------|----------|
| Bind services | `$this->app->singleton(...)` |
| Register sub-providers | `$this->app->register(...)` |
| Merge config | `$this->mergeConfigFrom(...)` |

### boot()

| Purpose | Examples |
|---------|----------|
| Load resources | `$this->loadModuleMigrations()` |
| Publish assets | `$this->publishes(...)` |
| Register listeners | `Event::listen(...)` |
| Gate definitions | `Gate::define(...)` |

## Registration Types

### Singletons

Use for stateful services:

| Scenario | Use Singleton |
|----------|---------------|
| Configuration holder | Yes |
| Cache manager | Yes |
| API client | Yes |
| Request handler | No |

### Bindings

Use for stateless services:

| Scenario | Use Bind |
|----------|----------|
| Form request | Yes |
| Data transformer | Yes |
| Validator | Yes |

### Contextual Bindings

Different implementations per consumer:

| Use Case | Example |
|----------|---------|
| Different payment gateways | Stripe for web, PayPal for API |
| Different loggers | File for dev, CloudWatch for prod |

## Sub-Provider Registration

For complex modules, split into sub-providers:

| Provider | Purpose |
|----------|---------|
| `{Module}ServiceProvider` | Main orchestrator |
| `RouteServiceProvider` | Route registration |
| `EventServiceProvider` | Event listeners |
| `AuthServiceProvider` | Gates and policies |

## Best Practices

### 1. Keep Providers Small

| Guideline | Limit |
|-----------|-------|
| Lines of code | < 100 |
| Methods | < 10 |
| Responsibilities | 1-2 |

### 2. Order of Operations

| Order | Action |
|-------|--------|
| 1 | Merge config |
| 2 | Bind interfaces |
| 3 | Register sub-providers |
| 4 | Load resources (boot) |

### 3. Lazy Loading

| Approach | When |
|----------|------|
| Eager | Always needed services |
| Deferred | Rarely used services |

## Common Patterns

### Config Registration

Load module config and merge with app config.

### Service Binding

Bind interface to implementation for dependency injection.

### Event Registration

Register event listeners for module events.

### Command Registration

Register artisan commands for module CLI.

## Auto-Registration

FuseCore auto-registers providers via:

1. Discovery finds `module.json`
2. Locates provider in standard location
3. Calls `register()` then `boot()`

Provider must be in:
```
FuseCore/{Module}/App/Providers/{Module}ServiceProvider.php
```

## Debugging

| Issue | Check |
|-------|-------|
| Provider not loading | Path correct? |
| Services not bound | `register()` called? |
| Resources missing | `boot()` loading them? |
| Dependency issues | Circular reference? |

## Related Templates

| Template | Purpose |
|----------|---------|
| [ServiceProvider.php.md](templates/ServiceProvider.php.md) | Complete examples |

## Related References

- [traits.md](traits.md) - HasModule trait
- [module-discovery.md](module-discovery.md) - Auto-registration
