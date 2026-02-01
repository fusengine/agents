---
name: events
description: Spatie Permission events for role and permission changes
when-to-use: Listening to role/permission assignments, audit logging, notifications
keywords: events, listener, roleattached, permissiondetached, audit
priority: medium
related: spatie-permission.md
---

# Permission Events

## Overview

Since v6.15.0, Spatie Permission dispatches events when roles and permissions are attached or detached. Use these for audit logging, notifications, or triggering side effects.

## Available Events

| Event | Triggered When |
|-------|----------------|
| `RoleAttached` | Role assigned to model |
| `RoleDetached` | Role removed from model |
| `PermissionAttached` | Permission assigned to model/role |
| `PermissionDetached` | Permission removed from model/role |

## Event Classes

All events are in the `Spatie\Permission\Events` namespace:

| Class | Properties |
|-------|------------|
| `RoleAttached` | `$role`, `$model` |
| `RoleDetached` | `$role`, `$model` |
| `PermissionAttached` | `$permission`, `$model` |
| `PermissionDetached` | `$permission`, `$model` |

## Use Cases

### Audit Logging

Log all permission changes for compliance and debugging.

| Action | Logged Data |
|--------|-------------|
| Role assigned | User ID, Role name, Timestamp, Actor |
| Permission granted | User/Role ID, Permission name, Timestamp |
| Role removed | User ID, Role name, Reason |

### Notifications

| Trigger | Notification |
|---------|--------------|
| Admin role assigned | Email to security team |
| Permission revoked | Slack notification |
| Super-Admin assigned | SMS alert |

### Cache Invalidation

Invalidate user-specific caches when permissions change.

### Webhook Triggers

Notify external systems of permission changes.

## Listener Registration

Register listeners in `EventServiceProvider` or use attribute-based discovery in Laravel 11+.

## Event Properties

Events receive the actual Eloquent models:

| Property | Type |
|----------|------|
| `$role` | `Role` model instance |
| `$permission` | `Permission` model instance |
| `$model` | The model receiving the role/permission |

## Batch Operations

When using `syncRoles()` or `syncPermissions()`:

| Method | Events Fired |
|--------|--------------|
| `syncRoles(['a', 'b'])` | Multiple `RoleAttached`/`RoleDetached` |
| `syncPermissions([...])` | Multiple `PermissionAttached`/`PermissionDetached` |

## Best Practices

1. **Keep listeners fast** - Queue heavy operations
2. **Use queued listeners** - For email/notifications
3. **Log actor** - Include `auth()->id()` in audit logs
4. **Handle bulk operations** - Events fire for each item in sync

## Related Templates

| Template | Purpose |
|----------|---------|
| [PermissionEventListener.php.md](templates/PermissionEventListener.php.md) | Event listener examples |
| [AuditLogger.php.md](templates/AuditLogger.php.md) | Audit logging service |

## Related References

- [spatie-permission.md](spatie-permission.md) - Core concepts
- [cache.md](cache.md) - Cache invalidation on events
