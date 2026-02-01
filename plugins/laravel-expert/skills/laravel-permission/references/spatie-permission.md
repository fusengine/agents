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

Spatie's Laravel Permission package provides a simple way to manage roles and permissions in Laravel applications. It integrates seamlessly with Laravel's Gate and authorization system.

## Why Use This Package

| Benefit | Description |
|---------|-------------|
| **Simplicity** | Clean API for role/permission management |
| **Integration** | Works with Laravel's native Gate and policies |
| **Caching** | Built-in permission caching for performance |
| **Multi-guard** | Support for multiple authentication guards |
| **Teams** | Optional multi-tenant team support |

## Core Concepts

| Concept | Description | Use Case |
|---------|-------------|----------|
| **Role** | Group of permissions | `admin`, `writer`, `subscriber` |
| **Permission** | Single ability | `edit articles`, `publish posts` |
| **Direct Permission** | Assigned directly to user | Override role for specific user |
| **Role Permission** | Inherited via assigned roles | Standard access pattern |

## Installation Requirements

1. Require the package via Composer
2. Publish the config and migrations
3. Run migrations to create permission tables
4. Add the `HasRoles` trait to your User model

See [UserModel.php.md](templates/UserModel.php.md) for complete setup example.

## Model Setup

The User model must use the `HasRoles` trait from Spatie. This adds all permission-related methods to the model.

## Key Methods

### Assigning Roles

| Method | Description |
|--------|-------------|
| `assignRole('admin')` | Add a single role |
| `assignRole(['writer', 'admin'])` | Add multiple roles |
| `syncRoles(['writer'])` | Replace all roles |
| `removeRole('writer')` | Remove a role |

### Assigning Permissions

| Method | Description |
|--------|-------------|
| `givePermissionTo('edit')` | Add direct permission |
| `givePermissionTo(['edit', 'view'])` | Add multiple |
| `syncPermissions(['edit'])` | Replace all |
| `revokePermissionTo('edit')` | Remove permission |

### Checking Permissions

| Method | Description |
|--------|-------------|
| `hasRole('admin')` | Check single role |
| `hasAnyRole(['writer', 'admin'])` | Check any role |
| `hasAllRoles(['writer', 'admin'])` | Check all roles |
| `hasPermissionTo('edit articles')` | Check permission |
| `can('edit articles')` | Laravel Gate check |

## Guard System

Spatie supports multiple guards for different authentication types:

| Guard | Use Case |
|-------|----------|
| `web` | Browser sessions (default) |
| `api` | API token authentication |
| `admin` | Separate admin authentication |

Roles and permissions are guard-specific. A role in `web` guard is different from a role in `api` guard.

## Best Practices

1. **Seed roles/permissions** - Define in `DatabaseSeeder` for consistency
2. **Use kebab-case** - `edit-articles` not `editArticles`
3. **Reset cache** - After direct DB changes: `php artisan permission:cache-reset`
4. **Check via middleware** - Don't hardcode role checks in controllers
5. **Use permissions, not roles** - Check `can('edit')` not `hasRole('admin')`

## Related Templates

| Template | Purpose |
|----------|---------|
| [UserModel.php.md](templates/UserModel.php.md) | User model with HasRoles trait |
| [RoleSeeder.php.md](templates/RoleSeeder.php.md) | Database seeding example |
| [PermissionSeeder.php.md](templates/PermissionSeeder.php.md) | Permission creation seeder |

## Related References

- [middleware.md](middleware.md) - Route protection
- [blade-directives.md](blade-directives.md) - View authorization
- [direct-permissions.md](direct-permissions.md) - Permission inheritance
- [cache.md](cache.md) - Performance optimization
