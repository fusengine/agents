---
name: laravel-permission
description: Spatie Laravel Permission - roles, permissions, middleware, Blade directives. Use when implementing RBAC, role-based access control, or user authorization.
versions:
  laravel: "12.46"
  spatie-permission: "6.24"
  php: "8.5"
user-invocable: false
references: references/spatie-permission.md, references/middleware.md, references/blade-directives.md
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

Spatie Laravel Permission provides role-based access control (RBAC) for Laravel applications.

| Component | Purpose |
|-----------|---------|
| **Role** | Group of permissions (admin, writer) |
| **Permission** | Single ability (edit articles) |
| **Middleware** | Route protection |
| **Blade Directives** | UI authorization |

---

## Critical Rules

1. **Seed roles/permissions** in `DatabaseSeeder`
2. **Cache reset** after changes: `php artisan permission:cache-reset`
3. **Use kebab-case** for naming: `edit-articles`
4. **Never hardcode** role checks in controllers - use middleware

---

## Reference Guide

### Concepts

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **Setup** | [spatie-permission.md](references/spatie-permission.md) | Installation, model setup |
| **Middleware** | [middleware.md](references/middleware.md) | Route protection |
| **Blade** | [blade-directives.md](references/blade-directives.md) | UI authorization |

### Templates

| Template | When to use |
|----------|-------------|
| [RoleSeeder.php.md](references/templates/RoleSeeder.php.md) | Database seeding |
| [routes-example.md](references/templates/routes-example.md) | Protected routes |

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
```
