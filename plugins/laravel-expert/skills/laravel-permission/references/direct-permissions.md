---
name: direct-permissions
description: Direct permissions vs role-based permissions and retrieval methods
when-to-use: Understanding permission inheritance, debugging authorization
keywords: direct, role, inheritance, getDirectPermissions, getAllPermissions
priority: medium
related: spatie-permission.md
---

# Direct vs Role Permissions

## Overview

Permissions can be assigned directly to users or inherited through roles.

## Types of Permissions

| Type | Description |
|------|-------------|
| **Direct** | Assigned directly to user |
| **Via Role** | Inherited from assigned roles |
| **All** | Combination of both |

## Retrieving Permissions

```php
// Get only direct permissions
$directPermissions = $user->getDirectPermissions();
// or
$directPermissions = $user->permissions;

// Get permissions inherited from roles
$rolePermissions = $user->getPermissionsViaRoles();

// Get ALL permissions (direct + via roles)
$allPermissions = $user->getAllPermissions();

// Get permission names as collection of strings
$permissionNames = $user->getPermissionNames();

// Get role names
$roleNames = $user->getRoleNames();
```

## Checking Direct Permissions

```php
// Check if permission is assigned DIRECTLY (not via role)
$user->hasDirectPermission('edit articles');

// Check all direct permissions
$user->hasAllDirectPermissions(['edit articles', 'delete articles']);

// Check any direct permission
$user->hasAnyDirectPermission(['create articles', 'delete articles']);
```

## Example Scenario

```php
// Setup
$editorRole = Role::create(['name' => 'editor']);
$editorRole->givePermissionTo(['edit articles', 'view articles']);

$user = User::find(1);
$user->assignRole('editor');
$user->givePermissionTo('delete articles'); // Direct permission

// Results
$user->getDirectPermissions()->pluck('name');
// ['delete articles']

$user->getPermissionsViaRoles()->pluck('name');
// ['edit articles', 'view articles']

$user->getAllPermissions()->pluck('name');
// ['delete articles', 'edit articles', 'view articles']
```

## Checking Permission Source

```php
// Check if permission comes from role
$hasViaRole = $user->getPermissionsViaRoles()
    ->contains('name', 'edit articles');

// Check if permission is direct
$hasDirect = $user->hasDirectPermission('edit articles');

// Determine source
function getPermissionSource(User $user, string $permission): string
{
    if ($user->hasDirectPermission($permission)) {
        return 'direct';
    }
    if ($user->getPermissionsViaRoles()->contains('name', $permission)) {
        return 'role';
    }
    return 'none';
}
```

## Revoking Permissions

```php
// Remove direct permission
$user->revokePermissionTo('delete articles');

// Remove permission from role (affects all users with role)
$role->revokePermissionTo('edit articles');

// Sync direct permissions (replace all)
$user->syncPermissions(['view articles', 'create articles']);
```

## Use Cases

### Override Role Permission

```php
// User has 'viewer' role with 'view articles' only
// Give direct permission to also edit
$user->givePermissionTo('edit articles');
```

### Temporary Permissions

```php
// Give temporary access directly
$user->givePermissionTo('admin-panel');

// Later, revoke without affecting role
$user->revokePermissionTo('admin-panel');
```

### Audit Permissions

```php
// Show permission breakdown in admin panel
$breakdown = [
    'direct' => $user->getDirectPermissions()->pluck('name'),
    'via_roles' => $user->getPermissionsViaRoles()->pluck('name'),
    'roles' => $user->getRoleNames(),
];
```
