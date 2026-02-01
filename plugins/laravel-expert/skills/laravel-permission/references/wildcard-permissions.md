---
name: wildcard-permissions
description: Wildcard permission patterns for hierarchical permissions
when-to-use: Implementing hierarchical or grouped permissions with wildcards
keywords: wildcard, pattern, hierarchy, asterisk, glob
priority: medium
related: spatie-permission.md
---

# Wildcard Permissions

## Overview

Wildcards allow creating hierarchical permission structures using patterns like `articles.*` or `*.view`.

## Enable Wildcards

```php
// config/permission.php
'enable_wildcard_permission' => true,
```

## Permission Patterns

| Pattern | Matches |
|---------|---------|
| `articles.*` | `articles.create`, `articles.edit`, `articles.delete` |
| `*.view` | `articles.view`, `users.view`, `posts.view` |
| `*` | Everything |
| `articles.comments.*` | `articles.comments.create`, `articles.comments.delete` |

## Creating Wildcard Permissions

```php
use Spatie\Permission\Models\Permission;

// Create specific permissions
Permission::create(['name' => 'articles.create']);
Permission::create(['name' => 'articles.edit']);
Permission::create(['name' => 'articles.delete']);
Permission::create(['name' => 'articles.view']);

// Create wildcard permission
Permission::create(['name' => 'articles.*']);
```

## Assigning Wildcard Permissions

```php
// Give all article permissions via wildcard
$role->givePermissionTo('articles.*');

// User can now do all article operations
$user->assignRole($role);

// All these checks return true
$user->can('articles.create');  // true
$user->can('articles.edit');    // true
$user->can('articles.delete');  // true
```

## Checking Wildcards

```php
// If user has 'articles.*'
$user->hasPermissionTo('articles.create');  // true
$user->hasPermissionTo('articles.edit');    // true
$user->hasPermissionTo('articles.view');    // true

// Specific check still works
$user->hasPermissionTo('articles.*');       // true
```

## Multi-Level Wildcards

```php
// Create nested permissions
Permission::create(['name' => 'blog.posts.create']);
Permission::create(['name' => 'blog.posts.edit']);
Permission::create(['name' => 'blog.comments.create']);
Permission::create(['name' => 'blog.comments.moderate']);

// Wildcard for all blog.posts actions
$role->givePermissionTo('blog.posts.*');

// Wildcard for ALL blog actions
$role->givePermissionTo('blog.*');
```

## Use Cases

### Module-Based Permissions

```php
// CRM module permissions
Permission::create(['name' => 'crm.contacts.*']);
Permission::create(['name' => 'crm.deals.*']);
Permission::create(['name' => 'crm.reports.view']);

// Sales role gets all CRM access
$salesRole->givePermissionTo('crm.*');

// Support role gets contacts only
$supportRole->givePermissionTo('crm.contacts.*');
```

### CRUD Shortcuts

```php
// Standard CRUD pattern
foreach (['articles', 'users', 'posts'] as $resource) {
    Permission::create(['name' => "$resource.create"]);
    Permission::create(['name' => "$resource.read"]);
    Permission::create(['name' => "$resource.update"]);
    Permission::create(['name' => "$resource.delete"]);
}

// Admin gets everything
$admin->givePermissionTo('*');

// Editor gets all article operations
$editor->givePermissionTo('articles.*');
```

## Best Practices

1. **Be consistent** with naming: `resource.action` format
2. **Create specific permissions** even when using wildcards
3. **Document hierarchy** for team understanding
4. **Avoid too deep nesting** - max 3 levels recommended
