---
name: query-scopes
description: Eloquent query scopes for filtering users by roles and permissions
when-to-use: Querying users by role, filtering by permission, building admin panels
keywords: scope, query, filter, role, permission, eloquent
priority: medium
related: spatie-permission.md, direct-permissions.md
---

# Query Scopes

## Overview

The `HasRoles` trait provides Eloquent query scopes to filter models by their roles and permissions. Essential for admin panels, reports, and user management.

## Available Scopes

| Scope | Purpose | Returns |
|-------|---------|---------|
| `role($role)` | Filter by role | Users with role |
| `withoutRole($role)` | Exclude by role | Users without role |
| `permission($permission)` | Filter by permission | Users with permission |
| `withoutPermission($permission)` | Exclude by permission | Users without permission |

## Scope Parameters

### Role Scope

| Parameter Type | Example |
|----------------|---------|
| String | `'admin'` |
| Role model | `$adminRole` |
| Array | `['admin', 'editor']` |
| Collection | `Role::where(...)->get()` |

### Permission Scope

| Parameter Type | Example |
|----------------|---------|
| String | `'edit articles'` |
| Permission model | `$editPermission` |
| Array | `['edit', 'delete']` |

## Behavior

### Role Scope

| Query | Returns |
|-------|---------|
| `User::role('admin')` | Users with admin role |
| `User::role(['admin', 'editor'])` | Users with admin OR editor |
| `User::withoutRole('guest')` | Users without guest role |

### Permission Scope

| Query | Returns |
|-------|---------|
| `User::permission('edit')` | Users who can edit (direct OR via role) |
| `User::withoutPermission('delete')` | Users who cannot delete |

## Important Notes

### Permission Scope Includes Both Sources

The `permission()` scope returns users who have the permission:
- Directly assigned to them
- Via any of their roles

### Guard Consideration

Scopes respect the guard:

| Scenario | Behavior |
|----------|----------|
| Default guard | Uses config default |
| Specific guard | Pass guard as second parameter |

## Common Patterns

### Admin User List

Filter users for admin panel display.

### Role-Based Pagination

Paginate users by role for management interfaces.

### Permission Audit

Find all users with specific sensitive permissions.

### Bulk Operations

Select users by role for mass actions.

## Chaining with Other Scopes

Scopes can be chained with other Eloquent methods:

| Chain | Purpose |
|-------|---------|
| `role()->where()` | Additional filtering |
| `role()->orderBy()` | Sorting |
| `role()->with()` | Eager loading |
| `role()->paginate()` | Pagination |

## Performance Considerations

| Concern | Solution |
|---------|----------|
| Large user tables | Add index on pivot tables |
| Complex queries | Use eager loading |
| Repeated queries | Cache results |

## Best Practices

1. **Use scopes over manual joins** - Cleaner and maintained
2. **Chain with pagination** - Don't load all users
3. **Index pivot tables** - For large datasets
4. **Cache admin queries** - Role lists change rarely

## Related Templates

| Template | Purpose |
|----------|---------|
| [UserQueryExamples.php.md](templates/UserQueryExamples.php.md) | Query scope examples |
| [AdminUserController.php.md](templates/AdminUserController.php.md) | Admin panel queries |

## Related References

- [spatie-permission.md](spatie-permission.md) - Core concepts
- [direct-permissions.md](direct-permissions.md) - Permission types
