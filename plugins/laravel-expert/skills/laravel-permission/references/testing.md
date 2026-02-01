---
name: testing
description: Testing roles and permissions in Laravel applications
when-to-use: Writing tests for authorization, permission checks, role assignments
keywords: testing, pest, phpunit, test, mock, factory
priority: high
related: spatie-permission.md, policies.md
---

# Testing Permissions

## Overview

Testing authorization requires proper setup to ensure permissions and roles work correctly in isolation. Key considerations include cache management and trait configuration.

## Test Setup Requirements

### Clear Cache Before Tests

| Requirement | Reason |
|-------------|--------|
| Reset permission cache | Avoid stale data between tests |
| Clear in setUp() | Fresh state each test |
| Use RefreshDatabase | Clean tables each test |

### Trait Configuration

| Trait | Purpose |
|-------|---------|
| `RefreshDatabase` | Reset database between tests |
| `WithoutMiddleware` | Skip middleware if testing isolated logic |

## Testing Patterns

### Testing Role Assignment

| Test Case | Assertion |
|-----------|-----------|
| User has role after assign | `assertTrue($user->hasRole('admin'))` |
| User roles count | `assertCount(1, $user->roles)` |
| Role sync replaces | Previous roles removed |

### Testing Permission Checks

| Test Case | Assertion |
|-----------|-----------|
| User has permission | `assertTrue($user->can('edit'))` |
| User lacks permission | `assertFalse($user->can('delete'))` |
| Via role inheritance | Permission from role works |

### Testing Middleware

| Test Case | Expected |
|-----------|----------|
| Authorized user | 200 OK |
| Unauthorized user | 403 Forbidden |
| Unauthenticated | 401/Redirect |

### Testing Policies

| Test Case | Setup |
|-----------|-------|
| Owner can update | Create user, assign permission, create owned resource |
| Non-owner cannot | Different owner on resource |
| Admin override | Admin permission bypasses ownership |

## Factory States

Define factory states for common permission scenarios:

| State | Configuration |
|-------|---------------|
| `admin()` | Assigns admin role |
| `editor()` | Assigns editor role + permissions |
| `guest()` | No roles or permissions |

## Pest vs PHPUnit

| Framework | Approach |
|-----------|----------|
| Pest | `beforeEach`, `it()`, `expect()` |
| PHPUnit | `setUp()`, `test_*()`, `$this->assert*()` |

Both work equally well with Spatie Permission.

## Common Pitfalls

| Issue | Solution |
|-------|----------|
| Stale cache | Clear in setUp() |
| Wrong guard | Specify guard in role/permission |
| Missing trait | Add HasRoles to User model |
| Parallel tests | Use separate cache keys |

## Best Practices

1. **Always reset cache** - In setUp() or beforeEach()
2. **Use factories** - Define permission states
3. **Test both paths** - Authorized AND unauthorized
4. **Isolate tests** - Don't depend on previous test state
5. **Test real scenarios** - Middleware, policies, not just methods

## Related Templates

| Template | Purpose |
|----------|---------|
| [PermissionTest.php.md](templates/PermissionTest.php.md) | Complete test examples |
| [UserFactory.php.md](templates/UserFactory.php.md) | Factory with permission states |

## Related References

- [spatie-permission.md](spatie-permission.md) - Core concepts
- [policies.md](policies.md) - Policy testing
- [cache.md](cache.md) - Cache in tests
