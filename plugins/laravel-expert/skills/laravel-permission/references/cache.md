---
name: cache
description: Permission cache management for performance optimization
when-to-use: Optimizing permission lookups, debugging cache issues
keywords: cache, performance, reset, clear, redis
priority: medium
related: spatie-permission.md
---

# Permission Cache

## Overview

Spatie caches permissions for performance. Understanding cache behavior is crucial for debugging.

## Configuration

```php
// config/permission.php
'cache' => [
    'expiration_time' => \DateInterval::createFromDateString('24 hours'),
    'key' => 'spatie.permission.cache',
    'store' => 'default', // or 'redis', 'memcached', etc.
],
```

## Using Redis for Cache

```php
// config/permission.php
'cache' => [
    'store' => 'redis',
    'expiration_time' => \DateInterval::createFromDateString('1 hour'),
],
```

## Clearing Cache Manually

### Via Artisan

```bash
php artisan permission:cache-reset
```

### Via Code

```php
use Spatie\Permission\PermissionRegistrar;

app(PermissionRegistrar::class)->forgetCachedPermissions();
```

## Automatic Cache Invalidation

Cache is automatically cleared when:

| Action | Auto-Clear |
|--------|------------|
| Role created/updated/deleted | ✅ |
| Permission created/updated/deleted | ✅ |
| Permission assigned/removed from role | ✅ |
| Permission assigned/removed from user | ✅ |
| Role assigned/removed from user | ✅ |

## Manual Database Operations

Direct DB queries bypass auto-invalidation:

```php
// This WON'T clear cache automatically!
\DB::table('role_has_permissions')->insert([
    'role_id' => $role->id,
    'permission_id' => $permission->id,
]);

// You MUST clear cache manually
app(PermissionRegistrar::class)->forgetCachedPermissions();
```

## Debugging Cache Issues

### Check if Cache is Working

```php
// Get cache key
$cacheKey = config('permission.cache.key');

// Check cache contents
$cached = cache()->get($cacheKey);
dd($cached);
```

### Force Fresh Permissions

```php
// Clear cache before checking
app(PermissionRegistrar::class)->forgetCachedPermissions();

// Now check permissions (will rebuild cache)
$user->hasPermissionTo('edit articles');
```

## Seeder Best Practice

```php
public function run(): void
{
    // Reset cache at START of seeder
    app(PermissionRegistrar::class)->forgetCachedPermissions();

    // Create permissions and roles
    Permission::create(['name' => 'edit articles']);
    $role = Role::create(['name' => 'editor']);
    $role->givePermissionTo('edit articles');

    // Cache will be fresh after seeder completes
}
```

## Testing with Cache

```php
// In tests, reset cache before each test
protected function setUp(): void
{
    parent::setUp();

    app(PermissionRegistrar::class)->forgetCachedPermissions();
}
```

## Performance Tips

1. **Use Redis** for shared cache across servers
2. **Set appropriate TTL** based on how often permissions change
3. **Batch operations** to minimize cache clears
4. **Warm cache** after deployments

```php
// Warm cache after deploy
Artisan::call('permission:cache-reset');

// Force rebuild
Permission::all(); // Rebuilds cache
```
