---
name: pennant
description: Laravel Pennant for feature flags
when-to-use: Feature toggles, A/B testing, gradual rollouts
keywords: laravel, php, pennant, feature-flags, toggles
priority: low
related: configuration.md
---

# Laravel Pennant

## Overview

Pennant is Laravel's feature flag package for incremental rollouts, A/B testing, and trunk-based development. It supports multiple storage drivers (database, array) and rich scoping.

## Installation

```shell
composer require laravel/pennant
php artisan vendor:publish --provider="Laravel\Pennant\PennantServiceProvider"
php artisan migrate
```

## Defining Features

```php
// app/Providers/AppServiceProvider.php
use Laravel\Pennant\Feature;

public function boot(): void
{
    Feature::define('new-dashboard', fn (User $user) =>
        $user->is_beta_tester
    );
}
```

### Class-Based Features

```php
class NewApi
{
    public function resolve(User $user): bool
    {
        return $user->created_at->isAfter('2024-01-01');
    }
}
```

## Checking Features

```php
// Boolean check
if (Feature::active('new-dashboard')) { }

// For specific scope
Feature::for($team)->active('new-dashboard');

// Conditional execution
Feature::when('new-dashboard',
    fn () => /* active */,
    fn () => /* inactive */
);
```

## Blade Directives

```blade
@feature('new-dashboard')
    <x-new-dashboard />
@else
    <x-old-dashboard />
@endfeature
```

## Middleware

```php
Route::get('/dashboard', DashboardController::class)
    ->middleware('feature:new-dashboard');
```

## Rich Values

Return values beyond boolean:

```php
Feature::define('theme', fn () =>
    match (true) {
        $user->is_admin => 'admin',
        default => 'default',
    }
);

$theme = Feature::value('theme');
```

## Storage & Performance

```php
// Eager load
Feature::load(['new-dashboard', 'new-api']);

// Purge stored values
Feature::purge('new-dashboard');

// Store drivers: database (default), array
```

## Events

- `FeatureRetrieved` - Feature checked
- `FeatureResolved` - Feature resolved (first time)
- `AllFeaturesPurged` - All features purged

## Best Practices

1. **Class-based for complex** - Better organization
2. **Eager load** - Reduce queries
3. **Purge on deploy** - Clear stale values
4. **Scope appropriately** - User, team, or global

## Related References

- [configuration.md](configuration.md) - Environment config
