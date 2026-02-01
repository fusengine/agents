---
name: laravel-api
description: Build RESTful APIs with Laravel using API Resources, Sanctum authentication, rate limiting, and versioning. Use when creating API endpoints, transforming responses, or handling API authentication.
versions:
  laravel: "12.46"
  php: "8.5"
user-invocable: false
references: references/routing.md, references/controllers.md, references/middleware.md, references/requests.md, references/responses.md, references/redirects.md, references/rate-limiting.md, references/pagination.md, references/http-client.md, references/validation.md, references/strings.md
related-skills: laravel-auth
---

# Laravel API Development

## Agent Workflow (MANDATORY)

Before ANY implementation, launch in parallel:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing API patterns
2. **fuse-ai-pilot:research-expert** - Verify Laravel API docs via Context7
3. **mcp__context7__query-docs** - Check API Resources and Sanctum

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

Build RESTful APIs with Laravel using API Resources for response transformation and Sanctum for authentication.

---

## Critical Rules

1. **Always use API Resources** - Never return Eloquent models directly
2. **Versioned routes** - Prefix with `/v1/`, `/v2/`
3. **Validate all input** - Use Form Requests
4. **Rate limiting** - Configure per-route limits

---

## Reference Guide

### Concepts

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **Routing** | [routing.md](references/routing.md) | API route definition |
| **Controllers** | [controllers.md](references/controllers.md) | Controller patterns |
| **Middleware** | [middleware.md](references/middleware.md) | Request filtering |
| **Requests** | [requests.md](references/requests.md) | HTTP request handling |
| **Responses** | [responses.md](references/responses.md) | Response formatting |
| **Rate Limiting** | [rate-limiting.md](references/rate-limiting.md) | Throttling |
| **Pagination** | [pagination.md](references/pagination.md) | Result pagination |
| **Validation** | [validation.md](references/validation.md) | Input validation |
| **HTTP Client** | [http-client.md](references/http-client.md) | External API calls |

### Templates

| Template | When to use |
|----------|-------------|
| [ApiController.php.md](references/templates/ApiController.php.md) | CRUD controller + resource |
| [api-routes.md](references/templates/api-routes.md) | Versioned routes setup |

---

## Quick Reference

```php
// Resource
return PostResource::collection($posts);

// Status codes
return response()->json($data, 201);

// Rate limiting
Route::middleware('throttle:60,1')->group(...);
```
