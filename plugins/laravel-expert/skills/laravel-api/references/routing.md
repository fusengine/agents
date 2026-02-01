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

Laravel routing maps incoming HTTP requests to controller actions. For APIs, routes are defined in `routes/api.php` which automatically applies the `/api` prefix and `api` middleware group (stateless, no sessions).

## Why Separate API Routes

API routes differ from web routes in important ways:

| Aspect | API Routes | Web Routes |
|--------|------------|------------|
| **State** | Stateless (no sessions) | Sessions enabled |
| **Auth** | Token-based (Sanctum) | Cookie-based |
| **Response** | JSON always | Views or JSON |
| **CSRF** | Not required | Required for forms |

## Route Files Structure

`routes/api.php` is created when you run `php artisan install:api`. This also installs Sanctum for token authentication. The `/api` prefix is applied automatically, so a route defined as `/posts` becomes `/api/posts`.

## HTTP Methods and REST

RESTful APIs use HTTP methods semantically:

| Method | Meaning | Controller action |
|--------|---------|-------------------|
| GET | Retrieve | index, show |
| POST | Create | store |
| PUT | Full update | update (all fields) |
| PATCH | Partial update | update (some fields) |
| DELETE | Remove | destroy |

## Route Parameters

**Required parameters** use `{param}` syntax. Laravel passes these to controller methods automatically.

**Optional parameters** use `{param?}` and require a default value in the controller.

**Constraints** limit what values a parameter accepts. Use `whereNumber('id')` for numeric IDs, `whereAlpha('slug')` for letters only.

## Model Binding

Laravel automatically resolves Eloquent models from route parameters. When you type-hint `Post $post` in a controller method and have `{post}` in the route, Laravel fetches the Post by ID automatically. Returns 404 if not found.

Use `{post:slug}` to resolve by a different column than ID.

## Route Groups

Groups apply shared attributes to multiple routes:

**Prefix** adds URL segments: `prefix('v1')` makes routes start with `/v1/`

**Middleware** applies authentication or rate limiting to all routes in group

**Controller** shares controller class when all routes use same controller

**Name prefix** adds prefix to route names for easier generation

## API Versioning

Version your API to maintain backward compatibility. Common pattern:

1. Use URL prefix: `/v1/posts`, `/v2/posts`
2. Organize controllers: `Api\V1\PostController`, `Api\V2\PostController`
3. Group routes by version in `routes/api.php`

This lets you evolve the API without breaking existing clients.

## Rate Limiting

Protect your API from abuse with rate limiting. Define limiters in `AppServiceProvider` using `RateLimiter::for()`. Apply via `throttle:limiter-name` middleware.

Common approach: 60 requests per minute per user, or by IP for unauthenticated requests.

## Route Caching

In production, cache routes with `php artisan route:cache` for faster route resolution. Clear with `route:clear` when routes change. Never cache in development.

## Best Practices

1. **Version from day one** - Add `/v1/` prefix even for first version
2. **Use resource routes** - `Route::apiResource()` for consistent CRUD
3. **Group by feature** - Organize related routes together
4. **Protect by default** - Put authenticated routes inside `auth:sanctum` group
5. **Rate limit everything** - Especially public endpoints

## Related Templates

| Template | Purpose |
|----------|---------|
| [api-routes.md](templates/api-routes.md) | Complete versioned API routes example |
| [routing-examples.md](templates/routing-examples.md) | Detailed routing patterns |

## Related References

- [controllers.md](controllers.md) - Controller that routes point to
- [middleware.md](middleware.md) - Protecting routes with middleware
- [rate-limiting.md](rate-limiting.md) - Throttling configuration
