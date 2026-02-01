---
name: laravel-permission
description: Spatie Laravel Permission - roles, permissions, middleware, Blade directives, teams, wildcards, super-admin. Use when implementing RBAC, role-based access control, or user authorization.
versions:
  laravel: "12.46"
  spatie-permission: "6.24"
  php: "8.5"
user-invocable: false
references: references/spatie-permission.md, references/middleware.md, references/blade-directives.md, references/teams.md, references/wildcard-permissions.md, references/super-admin.md, references/cache.md, references/direct-permissions.md, references/artisan-commands.md, references/custom-models.md
related-skills: laravel-auth
---

# Laravel Permission (Spatie)

## Agent Workflow (MANDATORY)

Before ANY implementation, launch in parallel:

1. **fuse-ai-pilot:explore-codebase** - Check existing auth patterns
2. **fuse-ai-pilot:research-expert** - Verify Spatie Permission docs via Context7
3. **mcp__context7__query-docs** - Check Laravel authorization patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

Spatie Laravel Permission provides complete role-based access control (RBAC) for Laravel applications.

| Component | Purpose |
|-----------|---------|
| **Role** | Group of permissions (admin, writer) |
| **Permission** | Single ability (edit articles) |
| **Middleware** | Route protection |
| **Blade Directives** | UI authorization |
| **Teams** | Multi-tenant scoping |
| **Wildcards** | Hierarchical permissions |
| **Super Admin** | Bypass all checks |

---

## Critical Rules

1. **Seed roles/permissions** in `DatabaseSeeder`
2. **Cache reset** after changes: `php artisan permission:cache-reset`
3. **Use kebab-case** for naming: `edit-articles`
4. **Never hardcode** role checks in controllers - use middleware
5. **Set team context** early in request for multi-tenant apps

---

## Reference Guide

### Concepts

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **Setup** | [spatie-permission.md](references/spatie-permission.md) | Installation, model setup |
| **Middleware** | [middleware.md](references/middleware.md) | Route protection |
| **Blade** | [blade-directives.md](references/blade-directives.md) | UI authorization |
| **Teams** | [teams.md](references/teams.md) | Multi-tenant permissions |
| **Wildcards** | [wildcard-permissions.md](references/wildcard-permissions.md) | Hierarchical patterns |
| **Super Admin** | [super-admin.md](references/super-admin.md) | Bypass all permissions |
| **Cache** | [cache.md](references/cache.md) | Performance, debugging |
| **Direct vs Role** | [direct-permissions.md](references/direct-permissions.md) | Permission inheritance |
| **CLI** | [artisan-commands.md](references/artisan-commands.md) | Artisan commands |
| **Custom Models** | [custom-models.md](references/custom-models.md) | UUID, extending models |

### Templates

| Template | When to use |
|----------|-------------|
| [RoleSeeder.php.md](references/templates/RoleSeeder.php.md) | Database seeding |
| [routes-example.md](references/templates/routes-example.md) | Protected routes |
| [TeamMiddleware.php.md](references/templates/TeamMiddleware.php.md) | Multi-tenant setup |
| [SuperAdminSetup.php.md](references/templates/SuperAdminSetup.php.md) | Super Admin bypass |

---

## Quick Reference

```php
// Assign role
$user->assignRole('admin');

// Check permission
$user->can('edit articles');

// Middleware
Route::middleware(['role:admin'])->group(fn () => ...);

// Blade
@role('admin') ... @endrole

// Teams
setPermissionsTeamId($team->id);

// Wildcards
$role->givePermissionTo('articles.*');

// Super Admin (in AppServiceProvider)
Gate::before(fn ($user, $ability) =>
    $user->hasRole('Super-Admin') ? true : null
);
```

---

## Feature Matrix

| Feature | Status | Reference |
|---------|--------|-----------|
| Basic RBAC | ✅ | spatie-permission.md |
| Middleware | ✅ | middleware.md |
| Blade Directives | ✅ | blade-directives.md |
| Multi-Guard | ✅ | middleware.md |
| Teams (Multi-Tenant) | ✅ | teams.md |
| Wildcard Permissions | ✅ | wildcard-permissions.md |
| Super Admin | ✅ | super-admin.md |
| Cache Management | ✅ | cache.md |
| Direct vs Role Perms | ✅ | direct-permissions.md |
| Artisan Commands | ✅ | artisan-commands.md |
| UUID Support | ✅ | custom-models.md |
| Custom Models | ✅ | custom-models.md |
