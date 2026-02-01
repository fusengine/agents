---
name: routes
description: API routing in FuseCore modules
when-to-use: Creating API endpoints, understanding route aggregation
keywords: routes, api, endpoint, middleware, routing
priority: high
related: service-provider.md, module-discovery.md
---

# Module Routes

## Overview

Each FuseCore module has its own `api.php` routes file. Routes are automatically aggregated by the `RouteAggregator` service.

## Route File Location

```
FuseCore/{Module}/Routes/api.php
```

## Automatic Loading

### How It Works

| Step | Action |
|------|--------|
| 1 | Module discovered |
| 2 | `RouteAggregator` finds `Routes/api.php` |
| 3 | Routes registered with API middleware |
| 4 | All module routes combined |

### Default Configuration

| Setting | Value |
|---------|-------|
| Prefix | `api` |
| Middleware | `['api']` |
| Rate limiting | Standard API throttle |

## Route Patterns

### Resource Routes

Use `apiResource` for CRUD:

| Method | URI | Action |
|--------|-----|--------|
| GET | `/posts` | index |
| POST | `/posts` | store |
| GET | `/posts/{id}` | show |
| PUT | `/posts/{id}` | update |
| DELETE | `/posts/{id}` | destroy |

### Grouped Routes

Group related routes with shared middleware.

### Nested Resources

For parent-child relationships:

| URI | Description |
|-----|-------------|
| `/posts/{post}/comments` | Comments for post |
| `/users/{user}/posts` | Posts by user |

## Middleware

### Authentication

| Middleware | Purpose |
|------------|---------|
| `auth:sanctum` | Sanctum token auth |
| `auth:api` | API guard |
| `guest` | Unauthenticated only |

### Authorization

| Middleware | Purpose |
|------------|---------|
| `role:admin` | Role check |
| `permission:edit` | Permission check |

### Rate Limiting

| Middleware | Purpose |
|------------|---------|
| `throttle:api` | Default API limit |
| `throttle:60,1` | 60 requests/minute |

## Route Naming

### Convention

| Pattern | Example |
|---------|---------|
| `{module}.{resource}.{action}` | `blog.posts.index` |

### Benefits

- Clear namespacing
- Easy testing
- URL generation

## Controller Binding

### Invokable Controllers

For single-action routes:

| Route | Controller |
|-------|------------|
| `GET /stats` | `StatsController::class` |

### Resource Controllers

For CRUD:

| Route | Controller |
|-------|------------|
| `apiResource('posts')` | `PostController::class` |

## Response Format

### Standard JSON

All API routes return JSON:

| Field | Description |
|-------|-------------|
| `data` | Response payload |
| `message` | Status message |
| `meta` | Pagination, etc. |

### Error Responses

| Status | Meaning |
|--------|---------|
| 400 | Validation error |
| 401 | Unauthenticated |
| 403 | Unauthorized |
| 404 | Not found |
| 500 | Server error |

## Best Practices

1. **Keep routes declarative** - No logic in routes
2. **Use resource routes** - Consistent naming
3. **Group by feature** - Related routes together
4. **Apply middleware** - Security at route level
5. **Name all routes** - For URL generation

## Route Caching

Works with Laravel route cache:

```bash
php artisan route:cache
php artisan route:clear
```

## Debugging

| Command | Purpose |
|---------|---------|
| `php artisan route:list` | Show all routes |
| `php artisan route:list --path=api` | API routes only |
| `php artisan fusecore:routes` | Module routes |

## Related Templates

| Template | Purpose |
|----------|---------|
| [ApiRoutes.php.md](templates/ApiRoutes.php.md) | Route examples |

## Related References

- [service-provider.md](service-provider.md) - Provider setup
- [module-discovery.md](module-discovery.md) - Route aggregation
