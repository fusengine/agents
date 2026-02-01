---
name: traits
description: FuseCore traits for module composition
when-to-use: Creating ServiceProviders, loading module resources
keywords: trait, hasmodule, hasmoduledatabase, hasmoduleresources
priority: high
related: service-provider.md, contracts.md
---

# Module Traits

## Overview

FuseCore uses trait composition to provide reusable functionality for modules. The primary trait is `HasModule`.

## Available Traits

| Trait | Purpose | Location |
|-------|---------|----------|
| `HasModule` | All module resources | `Core/App/Traits/` |
| `HasModuleDatabase` | Migrations, seeders | `Core/App/Traits/` |
| `HasModuleResources` | Views, translations | `Core/App/Traits/` |

## HasModule Trait

### Composition

`HasModule` combines:
- `HasModuleDatabase`
- `HasModuleResources`

### Key Methods

| Method | Purpose | Auto-called |
|--------|---------|-------------|
| `getModulePath()` | Get module root path | Automatic |
| `getModuleName()` | Get module name | Automatic |
| `loadModuleMigrations()` | Load migrations | Manual |
| `loadModuleViews()` | Load Blade views | Manual |
| `loadModuleTranslations()` | Load lang files | Manual |
| `loadAllModuleResources()` | Load everything | Manual |

### Path Resolution

The trait automatically determines the module path:

| From | Resolves To |
|------|-------------|
| `FuseCore/User/App/Providers/UserServiceProvider.php` | `FuseCore/User/` |

Uses reflection to go up 3 directory levels from provider.

## HasModuleDatabase Trait

### Methods

| Method | Loads From |
|--------|------------|
| `loadModuleMigrations()` | `/Database/Migrations/` |
| `loadModuleSeeders()` | `/Database/Seeders/` |
| `loadModuleFactories()` | `/Database/Factories/` |

### Migration Loading

Automatically registers migrations with Laravel. No manual registration needed after calling `loadModuleMigrations()`.

## HasModuleResources Trait

### Methods

| Method | Loads From | Registered As |
|--------|------------|---------------|
| `loadModuleViews()` | `/Resources/views/` | `{module}::` |
| `loadModuleTranslations()` | `/Resources/lang/` | `{module}::` |
| `loadModuleConfig()` | `/Config/` | Merged with app |

### View Usage

Views are namespaced:
```php
view('user::profile.show')
// Loads: FuseCore/User/Resources/views/profile/show.blade.php
```

### Translation Usage

Translations are namespaced:
```php
__('user::messages.welcome')
// Loads: FuseCore/User/Resources/lang/{locale}/messages.php
```

## Using Traits

### Basic Usage

```php
class MyModuleServiceProvider extends ServiceProvider
{
    use HasModule;

    public function boot(): void
    {
        $this->loadModuleMigrations();
    }
}
```

### Full Resource Loading

```php
class MyModuleServiceProvider extends ServiceProvider
{
    use HasModule;

    public function boot(): void
    {
        $this->loadAllModuleResources();
        // Loads: migrations, views, translations
    }
}
```

### Selective Loading

```php
class MyModuleServiceProvider extends ServiceProvider
{
    use HasModule;

    public function boot(): void
    {
        $this->loadModuleMigrations();
        $this->loadModuleViews();
        // Skip translations if not needed
    }
}
```

## Overriding Defaults

### Custom Path

Override `getModulePath()` if non-standard structure:

```php
protected function getModulePath(): string
{
    return base_path('FuseCore/CustomLocation');
}
```

### Custom Name

Override `getModuleName()` if needed:

```php
protected function getModuleName(): string
{
    return 'CustomName';
}
```

## Best Practices

1. **Use `HasModule`** - Don't use sub-traits directly
2. **Call in `boot()`** - Not in `register()`
3. **Load only needed** - Don't load views if API-only
4. **Check paths** - Ensure directories exist

## Common Issues

| Issue | Solution |
|-------|----------|
| Path not found | Check directory structure |
| Migrations not running | Call `loadModuleMigrations()` |
| Views not found | Check namespace usage |
| Wrong module path | Override `getModulePath()` |

## Related Templates

| Template | Purpose |
|----------|---------|
| [ServiceProvider.php.md](templates/ServiceProvider.php.md) | Provider with traits |

## Related References

- [service-provider.md](service-provider.md) - Provider setup
- [contracts.md](contracts.md) - Interface contracts
