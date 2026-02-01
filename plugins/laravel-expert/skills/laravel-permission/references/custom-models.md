---
name: custom-models
description: Extending Spatie Role and Permission models with custom functionality
when-to-use: Adding UUID support, custom attributes, or extending model behavior
keywords: custom, model, uuid, extend, override
priority: low
related: spatie-permission.md
---

# Custom Models

## Overview

Extend Spatie's Role and Permission models for custom behavior like UUIDs, additional attributes, or custom relationships.

## When to Extend

| Requirement | Need Custom Model |
|-------------|-------------------|
| UUID primary keys | Yes |
| Additional columns | Yes |
| Custom relationships | Yes |
| Custom scopes | Yes |
| Standard usage | No |

## Extension Approach

### Key Principle

**Extend, don't replace**. Custom models inherit from Spatie models, preserving all functionality.

| Do | Don't |
|----|-------|
| Extend `SpatieRole` | Implement from scratch |
| Add to `$fillable` | Override parent behavior |
| Register in config | Modify package files |

## UUID Support

### Requirements

1. Custom Role model with `HasUuids` trait
2. Custom Permission model with `HasUuids` trait
3. Updated migrations for UUID columns
4. Updated pivot table migrations
5. Register models in config

### Configuration Changes

| Setting | Value |
|---------|-------|
| `models.permission` | `App\Models\Permission::class` |
| `models.role` | `App\Models\Role::class` |

### Migration Changes

| Table | Primary Key Change |
|-------|-------------------|
| `roles` | `uuid` instead of `id` |
| `permissions` | `uuid` instead of `id` |
| `role_has_permissions` | UUID foreign keys |
| `model_has_roles` | UUID foreign keys |
| `model_has_permissions` | UUID foreign keys |

## Custom Attributes

### Common Additions

| Attribute | Purpose | Type |
|-----------|---------|------|
| `description` | Human-readable explanation | String |
| `is_default` | Auto-assign to new users | Boolean |
| `priority` | Ordering/precedence | Integer |
| `category` | Grouping permissions | String |

### Implementation Requirements

1. Add columns via migration
2. Add to `$fillable` array
3. Add to `casts()` method if needed
4. Create scopes for querying

## Custom Relationships

### Common Relationships

| Relationship | Purpose |
|--------------|---------|
| Role → Department | Roles belong to departments |
| Permission → Category | Organize permissions |
| Role → Parent Role | Hierarchical roles |

### Implementation

Extend model and add relationship methods. Use standard Eloquent relationships.

## Permission Categories

### Use Case

Group permissions by feature area in admin UI:

| Category | Permissions |
|----------|-------------|
| Articles | `articles.create`, `articles.edit` |
| Users | `users.view`, `users.manage` |
| Settings | `settings.view`, `settings.edit` |

### Implementation

Add `category` column to permissions table, add to fillable, create scope.

## Custom Scopes

### Common Scopes

| Scope | Purpose |
|-------|---------|
| `byPriority()` | Order by priority |
| `forDepartment()` | Filter by department |
| `category()` | Filter by category |
| `isDefault()` | Get default roles |

## Testing Considerations

| Concern | Solution |
|---------|----------|
| Cache invalidation | Clear cache in setUp |
| Custom attributes | Factory definitions |
| UUID testing | Use UUID factory state |

## Best Practices

1. **Extend, don't replace** - Always extend Spatie models
2. **Update config** - Register custom models in config
3. **Test thoroughly** - Custom models may affect caching
4. **Document changes** - Team should know about customizations
5. **Keep sync** - Watch Spatie updates for breaking changes

## Related Templates

| Template | Purpose |
|----------|---------|
| [CustomRole.php.md](templates/CustomRole.php.md) | Extended Role model |
| [CustomPermission.php.md](templates/CustomPermission.php.md) | Extended Permission model |
| [UUIDMigration.php.md](templates/UUIDMigration.php.md) | UUID table migration |

## Related References

- [spatie-permission.md](spatie-permission.md) - Core concepts
- [cache.md](cache.md) - Cache with custom models
