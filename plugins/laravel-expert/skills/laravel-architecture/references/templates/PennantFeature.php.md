---
name: PennantFeature.php
description: Laravel Pennant feature flags from official Laravel 12 docs
keywords: pennant, feature flags, feature toggles, ab testing
source: https://laravel.com/docs/12.x/pennant
---

# Laravel Pennant Templates

## Installation

```shell
composer require laravel/pennant
php artisan vendor:publish --provider="Laravel\Pennant\PennantServiceProvider"
php artisan migrate
```

## Defining Features (Class-Based)

```php
<?php

namespace App\Features;

use App\Models\User;
use Illuminate\Support\Lottery;

class NewApi
{
    /**
     * Resolve the feature's initial value.
     */
    public function resolve(User $user): mixed
    {
        return match (true) {
            $user->isInternalTeamMember() => true,
            $user->isHighTrafficCustomer() => false,
            default => Lottery::odds(1 / 100),
        };
    }
}
```

## Rich Value Features

```php
<?php

namespace App\Features;

use Illuminate\Support\Arr;

class PurchaseButton
{
    /**
     * Resolve the feature's initial value.
     */
    public function resolve(): string
    {
        return Arr::random([
            'blue-hierarchyaw',
            'green-hierarchyaw',
            'red-hierarchyaw',
        ]);
    }
}
```

## Checking Features

```php
use Laravel\Pennant\Feature;
use App\Features\NewApi;

// Boolean check
if (Feature::active('new-api')) {
    // ...
}

// Class-based check
if (Feature::active(NewApi::class)) {
    // ...
}

// Rich value retrieval
$color = Feature::value(PurchaseButton::class);

// With custom scope
Feature::for($user)->active('new-api');

// Multiple features
Feature::someAreActive(['feature-a', 'feature-b']);
Feature::allAreActive(['feature-a', 'feature-b']);
Feature::someAreInactive(['feature-a', 'feature-b']);
Feature::allAreInactive(['feature-a', 'feature-b']);
```

## Blade Directives

```blade
@feature('new-api')
    <!-- Feature is active -->
@else
    <!-- Feature is inactive -->
@endfeature

@feature(App\Features\NewApi::class)
    <!-- Class-based feature -->
@endfeature
```

## Middleware

```php
use Laravel\Pennant\Middleware\EnsureFeaturesAreActive;

Route::get('/api/v2/endpoint', function () {
    // ...
})->middleware(EnsureFeaturesAreActive::using('new-api'));

// Multiple features
->middleware(EnsureFeaturesAreActive::using('billing-v2', 'new-api'));

// Custom response on inactive
->middleware(EnsureFeaturesAreActive::using('new-api')->whenInactive(
    fn () => redirect('/dashboard')
));
```

## Activating/Deactivating Features

```php
use Laravel\Pennant\Feature;

// Activate for everyone
Feature::activate('new-api');

// Activate with value
Feature::activate('purchase-button', 'seafoam-green');

// Activate for specific scope
Feature::for($user)->activate('new-api');

// Deactivate
Feature::deactivate('new-api');
Feature::for($user)->deactivate('new-api');

// Forget (re-resolve on next check)
Feature::forget('new-api');
```

## Bulk Operations

```php
// Activate for all users
Feature::activateForEveryone('new-api');
Feature::activateForEveryone('purchase-button', 'seafoam-green');

// Deactivate for everyone
Feature::deactivateForEveryone('new-api');

// Purge stored values
Feature::purge('new-api');
Feature::purge(['new-api', 'purchase-button']);
```

## Eager Loading

```php
// Load multiple features for scope
Feature::for($user)->load(['new-api', 'purchase-button']);

// Load for multiple scopes
Feature::for([$user1, $user2])->load(['new-api']);
```

## Testing

```php
use Laravel\Pennant\Feature;

public function test_new_api_feature()
{
    Feature::define('new-api', true);

    // Test with feature active...
}

public function test_without_new_api()
{
    Feature::define('new-api', false);

    // Test with feature inactive...
}
```

## Artisan Commands

```shell
# List all features
php artisan pennant:feature

# Purge resolved features
php artisan pennant:purge new-api
php artisan pennant:purge --except=new-api
```
