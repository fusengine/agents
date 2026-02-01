---
name: pennant
description: Laravel Pennant feature flags for gradual rollouts
when-to-use: Implementing feature flags, A/B testing, gradual rollouts
keywords: laravel, php, pennant, feature flags, a/b testing
priority: medium
related: configuration.md, providers.md
---

# Laravel Pennant

## Overview

Laravel Pennant is a lightweight feature flag package for incremental feature rollouts, A/B testing, and trunk-based development. It enables toggling features per user, team, or any scope.

## Why Feature Flags

| Use Case | Description |
|----------|-------------|
| **Gradual Rollout** | Enable for 10%, then 50%, then 100% of users |
| **A/B Testing** | Show different UIs to different user groups |
| **Kill Switch** | Instantly disable problematic features |
| **Beta Access** | Enable for specific users/teams |

## Installation

```shell
composer require laravel/pennant
php artisan vendor:publish --provider="Laravel\Pennant\PennantServiceProvider"
php artisan migrate
```

## Defining Features

### Closure-Based

```php
// In AppServiceProvider boot()
Feature::define('new-dashboard', fn (User $user) => $user->isAdmin());
```

### Class-Based

```shell
php artisan pennant:feature NewDashboard
```

```php
class NewDashboard
{
    public function resolve(User $user): bool
    {
        return $user->created_at->isAfter('2024-01-01');
    }
}
```

## Checking Features

| Method | Purpose |
|--------|---------|
| `Feature::active('feature')` | Check if active |
| `Feature::inactive('feature')` | Check if inactive |
| `Feature::when('feature', fn() => ...)` | Conditional execution |
| `Feature::value('feature')` | Get rich value |

### In Controllers

```php
if (Feature::active('new-dashboard')) {
    return view('dashboard.new');
}
return view('dashboard.old');
```

### Blade Directive

```blade
@feature('new-dashboard')
    <x-new-dashboard />
@else
    <x-old-dashboard />
@endfeature
```

### Middleware

```php
Route::get('/dashboard', DashboardController::class)
    ->middleware('feature:new-dashboard');
```

## Scope

Features are resolved per scope (usually the authenticated user).

### Explicit Scope

```php
Feature::for($team)->active('billing-v2');
```

### Default Scope

Configure default scope in config or service provider.

## Rich Feature Values

Return more than boolean:

```php
Feature::define('purchase-button', fn (User $user) => match (true) {
    $user->isVip() => 'blue-purchase-button',
    default => 'green-purchase-button',
});

$color = Feature::value('purchase-button');
```

## Managing Features

| Method | Purpose |
|--------|---------|
| `Feature::activate('feature')` | Enable for current scope |
| `Feature::deactivate('feature')` | Disable for current scope |
| `Feature::activateForEveryone('feature')` | Enable globally |
| `Feature::deactivateForEveryone('feature')` | Disable globally |
| `Feature::purge('feature')` | Remove stored values |

## Eager Loading

Prevent N+1 when checking features for multiple users:

```php
Feature::for($users)->load(['new-dashboard', 'billing-v2']);
```

## Testing

```php
Feature::define('new-dashboard', true); // Always active in test
Feature::define('new-dashboard', false); // Always inactive
```

Or use `Feature::fake()`:

```php
Feature::fake(['new-dashboard' => true]);
```

## Storage Drivers

| Driver | Use Case |
|--------|----------|
| `database` | Persistent, default |
| `array` | Testing, in-memory |

## Events

| Event | Triggered When |
|-------|----------------|
| `FeatureResolved` | Feature value resolved |
| `FeatureUpdated` | Feature value changed |
| `AllFeaturesPurged` | All features purged |

## Best Practices

1. **Use class-based** - For complex logic, easier to test
2. **Clean up** - Remove old feature flags after full rollout
3. **Default to off** - New features should be inactive by default
4. **Scope appropriately** - User, team, or organization level
5. **Monitor** - Track feature flag states in production

## Related References

- [configuration.md](configuration.md) - Environment-based config
- [Laravel Pennant Docs](https://laravel.com/docs/12.x/pennant) - Full documentation
