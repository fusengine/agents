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

Permissions can be assigned directly to users or inherited through roles. Understanding this distinction is crucial for debugging and permission management.

## Permission Types

| Type | Assignment | Use Case |
|------|------------|----------|
| **Direct** | `$user->givePermissionTo()` | Override role for specific user |
| **Via Role** | `$role->givePermissionTo()` | Standard access pattern |
| **All** | Combination | What user can actually do |

## How Permission Inheritance Works

```
User
├── Direct Permissions: [delete articles]
└── Roles
    └── Editor Role
        └── Permissions: [edit articles, view articles]

→ User's All Permissions: [delete articles, edit articles, view articles]
```

## Retrieval Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getDirectPermissions()` | Collection | Only directly assigned |
| `permissions` (property) | Collection | Alias for direct |
| `getPermissionsViaRoles()` | Collection | Only from roles |
| `getAllPermissions()` | Collection | Both combined |
| `getPermissionNames()` | Collection | Names only (strings) |
| `getRoleNames()` | Collection | Role names (strings) |

## Checking Methods

| Method | Checks | Returns |
|--------|--------|---------|
| `hasDirectPermission('edit')` | Direct only | Boolean |
| `hasAllDirectPermissions([...])` | All must be direct | Boolean |
| `hasAnyDirectPermission([...])` | Any must be direct | Boolean |
| `hasPermissionTo('edit')` | Direct + via role | Boolean |
| `can('edit')` | Direct + via role + policies | Boolean |

## Use Cases

### Override Role for User

Give specific user an extra permission without creating a new role.

| Situation | Solution |
|-----------|----------|
| User needs `delete` but role only has `edit` | Add `delete` as direct permission |

### Temporary Access

| Action | Method |
|--------|--------|
| Grant temporary access | `givePermissionTo()` directly |
| Revoke after period | `revokePermissionTo()` on user |
| Role users unaffected | Direct permissions don't touch role |

### Permission Audit

Show where each permission comes from in admin panel.

| Permission | Source |
|------------|--------|
| edit articles | Editor role |
| delete articles | Direct assignment |
| view articles | Editor role |

## Revoking Permissions

| Action | Effect |
|--------|--------|
| Revoke direct permission | Only removes from user |
| Revoke from role | Removes from ALL users with role |
| Sync permissions | Replaces all direct permissions |

## Debugging Authorization

When `can('edit')` fails unexpectedly:

1. Check `getAllPermissions()` - Does permission exist?
2. Check `hasDirectPermission('edit')` - Is it direct?
3. Check `getPermissionsViaRoles()` - Is it via role?
4. Check role assignment - Does user have the role?
5. Check guard - Is permission in correct guard?

## Best Practices

1. **Prefer roles** - Easier to manage at scale
2. **Use direct sparingly** - For exceptions only
3. **Document direct assignments** - They're harder to track
4. **Audit periodically** - Review direct permissions
5. **Consider time limits** - Remove temporary direct permissions

## Common Patterns

| Pattern | Implementation |
|---------|----------------|
| Exception user | Direct permission for override |
| Trial access | Direct permission with expiry check |
| Grandfathered users | Direct permission from migration |

## Related Templates

| Template | Purpose |
|----------|---------|
| [PermissionAudit.php.md](templates/PermissionAudit.php.md) | Audit user permissions |

## Related References

- [spatie-permission.md](spatie-permission.md) - Core concepts
- [cache.md](cache.md) - Cache affects all permission types
