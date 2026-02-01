---
name: middleware
description: Laravel middleware for API request filtering
when-to-use: Protecting routes, transforming requests/responses
keywords: laravel, php, middleware, auth, throttle
priority: high
related: routing.md, rate-limiting.md
---

# API Middleware

## Overview

Middleware filters HTTP requests before they reach controllers. For APIs, middleware handles authentication, rate limiting, CORS, and request transformation. They run in order, forming a pipeline.

## Why Middleware

| Use Case | Middleware |
|----------|------------|
| **Authentication** | Verify tokens, reject unauthenticated |
| **Rate Limiting** | Throttle requests per user/IP |
| **CORS** | Handle cross-origin requests |
| **Logging** | Log requests for debugging |
| **Transformation** | Modify request/response data |

## Built-in API Middleware

| Middleware | Purpose |
|------------|---------|
| `auth:sanctum` | Authenticate via Sanctum tokens |
| `throttle:60,1` | Rate limit to 60/minute |
| `EnsureFrontendRequestsAreStateful` | SPA cookie auth |

## Middleware Location

**Global middleware** runs on every request. Defined in `bootstrap/app.php`.

**Route middleware** runs only on specific routes. Applied via `->middleware()` on routes/groups.

**Controller middleware** applied in controller constructor with `$this->middleware()`.

## Creating Middleware

```shell
php artisan make:middleware EnsureTokenIsValid
```

Creates class in `app/Http/Middleware/`. Implement `handle()` method that either passes request to next middleware or returns a response.

## Before vs After

**Before middleware** runs logic before the request reaches controller. Check auth, validate headers, log incoming request.

**After middleware** runs logic after response is created. Add headers, log response, transform output.

## Middleware Parameters

Pass parameters to middleware via route definition: `middleware('role:admin')`. Access in middleware via third parameter of `handle()`.

## Terminating Middleware

Implement `terminate()` method for work after response is sent. Useful for logging, cleanup tasks that shouldn't delay response.

## API Middleware Group

The `api` middleware group (stateless, no sessions) is applied automatically to routes in `routes/api.php`. Configure in `bootstrap/app.php`.

## Common Patterns

| Pattern | Implementation |
|---------|---------------|
| Auth check | `auth:sanctum` middleware |
| Admin only | Custom middleware checking user role |
| API version | Add `X-API-Version` header to responses |
| Request ID | Add unique ID for tracing |
| JSON force | Ensure response is always JSON |

## Best Practices

1. **Keep middleware small** - Single responsibility
2. **Use groups** - Apply middleware to route groups, not individual routes
3. **Order matters** - Auth before role checks
4. **Don't duplicate** - Use existing middleware when possible
5. **Test separately** - Unit test middleware in isolation

## Related References

- [routing.md](routing.md) - Applying middleware to routes
- [rate-limiting.md](rate-limiting.md) - Throttle middleware
