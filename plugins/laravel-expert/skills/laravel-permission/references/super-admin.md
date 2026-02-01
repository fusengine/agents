---
name: super-admin
description: Implement Super Admin role that bypasses all permission checks
when-to-use: Creating admin users with full access to all features
keywords: super-admin, bypass, gate, before, all-permissions
priority: high
related: spatie-permission.md
---

# Super Admin Role

## Overview

A Super Admin bypasses all permission checks. This is implemented using Laravel's `Gate::before()` hook, which runs before any authorization check.

## How It Works

### Gate::before Mechanism

| Return Value | Effect |
|--------------|--------|
| `true` | **Authorized** - bypass all checks |
| `false` | **Denied** - stop immediately |
| `null` | **Continue** - proceed to normal checks |

The key is returning `null` for non-super-admins, allowing normal permission logic to run.

## Implementation Location

| Laravel Version | File |
|-----------------|------|
| Laravel 11+ | `AppServiceProvider::boot()` |
| Laravel 10 | `AuthServiceProvider::boot()` |

## Role Naming

| Convention | Example |
|------------|---------|
| Standard | `Super-Admin` |
| Alternative | `super-admin`, `SuperAdmin` |

Use consistent naming across seeders, code, and Blade directives.

## Behavior Characteristics

| Scenario | Super Admin Behavior |
|----------|---------------------|
| `can('any-permission')` | Always true |
| `can('non-existent')` | Always true |
| Middleware checks | Always passes |
| Policy checks | Always passes |
| Blade `@can` | Always shows content |

## Security Considerations

### Assignment Protection

| Concern | Mitigation |
|---------|------------|
| Self-assignment | Only Super-Admin can assign Super-Admin |
| UI visibility | Don't show assignment option to non-super-admins |
| Seeder only | Consider only creating via seeder |

### Audit Trail

| Recommendation | Purpose |
|----------------|---------|
| Log all actions | Track what Super-Admin does |
| Separate audit log | Don't let Super-Admin clear logs |
| Alert on sensitive actions | Real-time monitoring |

## Variations

### Multiple Super Admin Roles

Support multiple roles that bypass checks: `Super-Admin`, `Owner`, `Root`.

### Partial Super Admin

Super Admin bypasses everything **except** certain dangerous actions. Return `null` for those specific abilities to let normal checks run.

### Environment-Based

Disable Super Admin in production or require additional verification.

## Testing Considerations

| Test Case | Expected |
|-----------|----------|
| Super Admin has any permission | True |
| Super Admin accesses all routes | 200 OK |
| Regular user cannot self-assign | Forbidden |
| Non-existent permission check | True for Super Admin |

## Best Practices

1. **Limit assignment** - Only via seeder or trusted admin action
2. **Audit everything** - Log all Super Admin operations
3. **Use sparingly** - Prefer specific permissions when possible
4. **Don't allow self-assignment** - Prevent privilege escalation
5. **Document holders** - Know who has Super Admin access

## Related Templates

| Template | Purpose |
|----------|---------|
| [SuperAdminSetup.php.md](templates/SuperAdminSetup.php.md) | Complete Gate::before setup |
| [SuperAdminSeeder.php.md](templates/SuperAdminSeeder.php.md) | Seeding Super Admin role and user |

## Related References

- [spatie-permission.md](spatie-permission.md) - Core concepts
- [middleware.md](middleware.md) - Route protection (bypassed by Super Admin)
