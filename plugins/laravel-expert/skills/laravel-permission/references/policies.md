---
name: policies
description: Integrating Spatie Permission with Laravel Policies
when-to-use: Combining RBAC with resource-based authorization, model ownership
keywords: policy, gate, authorize, resource, ownership
priority: high
related: spatie-permission.md, middleware.md
---

# Policy Integration

## Overview

Laravel Policies and Spatie Permission work together. Use Spatie for **role-based** checks and Policies for **resource-based** authorization (ownership, status).

## When to Use Each

| Check Type | Use | Example |
|------------|-----|---------|
| Role membership | Spatie | Can access admin area? |
| General permission | Spatie | Can create posts? |
| Resource ownership | Policy | Can edit THIS post? |
| Resource state | Policy | Can publish THIS draft? |
| Combined | Both | Can edit posts AND owns this one? |

## Integration Pattern

### Policy Structure

| Method | Checks |
|--------|--------|
| `view()` | Permission + ownership/published status |
| `create()` | Permission only (no resource yet) |
| `update()` | Permission + ownership |
| `delete()` | Permission + ownership/admin override |

### Permission Naming Convention

| Permission | Purpose |
|------------|---------|
| `view posts` | Can view any post |
| `view own posts` | Can view only own posts |
| `edit all posts` | Can edit any post |
| `edit own posts` | Can edit only own posts |
| `delete any post` | Admin delete |
| `delete own posts` | Author delete |

## Authorization Flow

1. **Gate::before** - Super Admin bypass (if configured)
2. **Policy method** - Checks permission + resource rules
3. **Return boolean** - Authorized or not

## Common Patterns

### View Authorization

| Scenario | Result |
|----------|--------|
| Published post | Anyone can view |
| Unpublished + admin permission | Can view |
| Unpublished + is author | Can view |
| Unpublished + no permission | Cannot view |

### Update Authorization

| Scenario | Result |
|----------|--------|
| Has `edit all posts` | Can update |
| Has `edit own posts` + is author | Can update |
| Has `edit own posts` + not author | Cannot update |

### Delete Authorization

| Scenario | Result |
|----------|--------|
| Has `delete any post` | Can delete |
| Has `delete own posts` + is author | Can delete |
| No delete permission | Cannot delete |

## Super Admin in Policies

Gate::before runs before policies, so Super Admin bypasses all policy checks automatically.

## Best Practices

1. **Permission for action type** - `create posts`, `edit posts`
2. **Policy for resource logic** - Ownership, status, relationships
3. **Don't duplicate** - Check permission once, not in middleware AND policy
4. **Name clearly** - `edit all` vs `edit own` distinction

## Controller Usage

| Method | Usage |
|--------|-------|
| `authorize()` | Throws exception if unauthorized |
| `can()` | Returns boolean |
| `@can` in Blade | Conditional display |

## Testing Policies

| Test Case | Setup |
|-----------|-------|
| Owner can edit | Create user, assign permission, create owned post |
| Non-owner cannot edit | Create user with `edit own`, different author |
| Admin can edit any | Create user with `edit all`, any post |

## Related Templates

| Template | Purpose |
|----------|---------|
| [PostPolicy.php.md](templates/PostPolicy.php.md) | Complete policy example |
| [PolicyRegistration.php.md](templates/PolicyRegistration.php.md) | Registering policies |

## Related References

- [spatie-permission.md](spatie-permission.md) - Core concepts
- [middleware.md](middleware.md) - Route-level checks
- [blade-directives.md](blade-directives.md) - View-level checks
