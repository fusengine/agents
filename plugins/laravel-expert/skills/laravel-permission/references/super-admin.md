---
name: super-admin
description: Implement Super Admin role that bypasses all permission checks
when-to-use: Creating admin users with full access to all features
keywords: super-admin, bypass, gate, before, all-permissions
priority: high
related: spatie-permission.md
---

# Super Admin Role

## Overview

A Super Admin bypasses all permission checks using Laravel's `Gate::before()` hook.

## Implementation

Add to `AppServiceProvider` (Laravel 11+) or `AuthServiceProvider` (Laravel 10):

```php
<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Super Admin bypasses all permission checks
        Gate::before(function ($user, $ability) {
            return $user->hasRole('Super-Admin') ? true : null;
        });
    }
}
```

## Create Super Admin Role

```php
use Spatie\Permission\Models\Role;

// In seeder or tinker
$superAdmin = Role::create(['name' => 'Super-Admin']);

// Assign to user
$user->assignRole('Super-Admin');
```

## How It Works

| Gate::before Return | Effect |
|---------------------|--------|
| `true` | Authorized (bypass) |
| `false` | Denied |
| `null` | Continue to normal checks |

The `null` return is crucial - it allows non-super-admins to go through normal permission checks.

## Multiple Super Admin Roles

```php
Gate::before(function ($user, $ability) {
    if ($user->hasAnyRole(['Super-Admin', 'Owner', 'Root'])) {
        return true;
    }
    return null;
});
```

## With Specific Exceptions

```php
Gate::before(function ($user, $ability) {
    // Super admin can do everything EXCEPT delete users
    if ($user->hasRole('Super-Admin')) {
        if ($ability === 'delete users') {
            return null; // Let normal checks proceed
        }
        return true;
    }
    return null;
});
```

## Checking Super Admin Status

```php
// In controller or service
if ($user->hasRole('Super-Admin')) {
    // Show admin-only features
}

// In Blade
@role('Super-Admin')
    <a href="/admin/dangerous-action">Danger Zone</a>
@endrole
```

## Security Considerations

1. **Limit Super-Admin assignment** - Only via seeder or trusted admin action
2. **Audit Super-Admin actions** - Log all operations
3. **Use sparingly** - Prefer specific permissions when possible
4. **Protect the role** - Don't allow self-assignment

```php
// Prevent non-super-admins from assigning Super-Admin role
public function assignRole(User $user, string $role): void
{
    if ($role === 'Super-Admin' && !auth()->user()->hasRole('Super-Admin')) {
        abort(403, 'Cannot assign Super-Admin role');
    }

    $user->assignRole($role);
}
```

## Testing Super Admin

```php
it('super admin bypasses all permissions', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('Super-Admin');

    // Should pass any permission check
    expect($superAdmin->can('any-permission'))->toBeTrue();
    expect($superAdmin->can('non-existent-permission'))->toBeTrue();
});
```
