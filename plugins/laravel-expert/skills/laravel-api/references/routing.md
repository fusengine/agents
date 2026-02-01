---
name: routing
description: Laravel API routing patterns and concepts
when-to-use: Defining API routes, versioning, grouping
keywords: laravel, php, routing, api, versioning
priority: high
related: controllers.md, middleware.md
---

# API Routing

## Overview

Laravel routing maps HTTP requests to controllers. For APIs, routes are defined in `routes/api.php` with automatic `/api` prefix.

## Route Files

| File | Purpose | Middleware |
|------|---------|------------|
| `routes/api.php` | Stateless API routes | `api` group |
| `routes/web.php` | Web routes with sessions | `web` group |

## HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| `Route::get()` | Read resource | List, Show |
| `Route::post()` | Create resource | Store |
| `Route::put()` | Full update | Update all fields |
| `Route::patch()` | Partial update | Update some fields |
| `Route::delete()` | Delete resource | Destroy |

## Route Parameters

| Type | Syntax | Example |
|------|--------|---------|
| Required | `{id}` | `/posts/{id}` |
| Optional | `{id?}` | `/posts/{id?}` |
| Constrained | `->where('id', '[0-9]+')` | Numeric only |

## Route Groups

| Feature | Method | Purpose |
|---------|--------|---------|
| Prefix | `->prefix('v1')` | URL prefix |
| Middleware | `->middleware('auth:sanctum')` | Protection |
| Controller | `->controller(PostController::class)` | Shared controller |
| Name | `->name('posts.')` | Route name prefix |

## Model Binding

| Type | Description |
|------|-------------|
| Implicit | `Route::get('/posts/{post}', ...)` - Auto resolves Post model |
| Custom key | `{post:slug}` - Use slug instead of id |
| Scoped | `{user}/{post}` - Post must belong to User |

## API Versioning

| Pattern | Example |
|---------|---------|
| URL prefix | `/api/v1/posts`, `/api/v2/posts` |
| Controller namespace | `Api\V1\PostController` |
| Route group | `Route::prefix('v1')->group(...)` |

## Resource Routes

| Method | Verb | URI | Action |
|--------|------|-----|--------|
| index | GET | /posts | List all |
| store | POST | /posts | Create |
| show | GET | /posts/{id} | Show one |
| update | PUT/PATCH | /posts/{id} | Update |
| destroy | DELETE | /posts/{id} | Delete |

## Rate Limiting

| Method | Purpose |
|--------|---------|
| `RateLimiter::for()` | Define limiter in AppServiceProvider |
| `->middleware('throttle:api')` | Apply to routes |
| `throttle:60,1` | 60 requests per minute |

## Route Caching

| Command | Purpose |
|---------|---------|
| `php artisan route:cache` | Cache routes for production |
| `php artisan route:clear` | Clear route cache |
| `php artisan route:list` | List all routes |

## Best Practices

1. **Version your API** - Use `/v1/`, `/v2/` prefixes
2. **Use resource routes** - `Route::apiResource()` for CRUD
3. **Group by feature** - Organize routes logically
4. **Apply middleware to groups** - Not individual routes
5. **Cache in production** - `route:cache` for performance

## Common Patterns

| Pattern | Use Case |
|---------|----------|
| Public + Protected | Some routes open, others require auth |
| Nested resources | `/posts/{post}/comments` |
| Singleton | `/user/profile` (no ID needed) |

## Related Templates

| Template | Purpose |
|----------|---------|
| [api-routes.md](templates/api-routes.md) | Complete versioned API routes |
| [routing-examples.md](templates/routing-examples.md) | Detailed routing examples |

## Related References

- [controllers.md](controllers.md) - Controller patterns
- [middleware.md](middleware.md) - Route protection
- [rate-limiting.md](rate-limiting.md) - Throttling
