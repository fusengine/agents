---
name: spatie-permission
description: Spatie Laravel Permission package concepts and setup
when-to-use: Implementing RBAC, roles, permissions in Laravel
keywords: spatie, permission, role, rbac, authorization
priority: high
related: middleware.md, blade-directives.md
---

# Spatie Laravel Permission

## Overview

Spatie's Laravel Permission package provides a simple way to manage roles and permissions in Laravel applications.

## Installation

```bash
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan optimize:clear
php artisan migrate
```

## User Model Setup

```php
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasRoles;
}
```

## Core Concepts

| Concept | Description |
|---------|-------------|
| **Role** | Group of permissions (admin, writer) |
| **Permission** | Single ability (edit articles) |
| **Direct Permission** | Permission assigned directly to user |
| **Role Permission** | Permission inherited via role |

## Creating Roles & Permissions

```php
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

// Create role
$admin = Role::create(['name' => 'admin']);

// Create permission
Permission::create(['name' => 'edit articles']);

// Assign permissions to role
$admin->givePermissionTo(['edit articles', 'publish articles']);
```

## Assigning to Users

| Method | Description |
|--------|-------------|
| `assignRole('admin')` | Add role |
| `syncRoles(['writer'])` | Replace all roles |
| `removeRole('writer')` | Remove role |
| `givePermissionTo('edit')` | Direct permission |
| `revokePermissionTo('edit')` | Remove permission |

## Checking Permissions

```php
$user->hasRole('admin');
$user->hasAnyRole(['writer', 'admin']);
$user->hasPermissionTo('edit articles');
$user->can('edit articles');
```

## Best Practices

1. **Seed roles/permissions** in `DatabaseSeeder`
2. **Cache reset** after changes: `php artisan permission:cache-reset`
3. **Naming** use kebab-case: `edit-articles`
4. **Teams** for multi-tenant: `'teams' => true`
