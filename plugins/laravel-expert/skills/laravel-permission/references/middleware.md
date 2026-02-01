---
name: middleware
description: Spatie Permission middleware for route protection
when-to-use: Protecting routes with role/permission checks
keywords: middleware, route, protection, role, permission
priority: high
related: spatie-permission.md
---

# Permission Middleware

## Overview

Spatie provides three middleware for protecting routes. They integrate with Laravel's middleware system and return 403 Forbidden on failure.

## Available Middleware

| Middleware | Purpose | Logic |
|------------|---------|-------|
| `role` | Check user role | User MUST have the role |
| `permission` | Check permission | User MUST have the permission |
| `role_or_permission` | Either role OR permission | Flexible access control |

## Middleware Syntax

### Single Check

| Pattern | Meaning |
|---------|---------|
| `role:admin` | Must have admin role |
| `permission:edit articles` | Must have edit articles permission |
| `role_or_permission:admin\|edit` | Must have admin role OR edit permission |

### Multiple Checks (OR Logic)

| Pattern | Meaning |
|---------|---------|
| `role:admin\|writer` | Must have admin OR writer role |
| `permission:edit\|publish` | Must have edit OR publish permission |

### With Specific Guard

| Pattern | Meaning |
|---------|---------|
| `role:admin,api` | Admin role in api guard |
| `permission:edit,web` | Edit permission in web guard |

## Application Methods

### Route Groups

Apply middleware to groups of routes for organized protection. All routes in the group inherit the middleware.

### Single Routes

Apply middleware directly to individual routes when granular control is needed.

### Controller Constructors

Apply middleware in controller constructor for controller-wide protection. Useful for resource controllers where all methods need the same check.

## Failure Behavior

When middleware fails:

| Scenario | Response |
|----------|----------|
| Unauthenticated | Redirect to login |
| Unauthorized | 403 Forbidden |
| AJAX/API request | JSON 403 response |

## Exception Handling

Customize the 403 response by handling `UnauthorizedException` in your exception handler. This allows custom error pages or API responses.

## Best Practices

1. **Prefer permissions over roles** - More flexible: `permission:edit` vs `role:admin`
2. **Group related routes** - Apply middleware to route groups, not individual routes
3. **Use route names** - Makes debugging easier
4. **Combine with policies** - Middleware for route-level, policies for resource-level

## Common Patterns

| Pattern | Use Case |
|---------|----------|
| Admin section | `role:admin` on `/admin/*` routes |
| API endpoints | `permission:api-access` with api guard |
| Feature access | `permission:feature-name` for specific features |
| Dashboard | `role_or_permission:admin\|view dashboard` |

## Related Templates

| Template | Purpose |
|----------|---------|
| [routes-example.md](templates/routes-example.md) | Complete route protection examples |
| [ControllerMiddleware.php.md](templates/ControllerMiddleware.php.md) | Controller-based middleware |

## Related References

- [spatie-permission.md](spatie-permission.md) - Core concepts
- [blade-directives.md](blade-directives.md) - UI authorization
