---
name: controllers
description: Laravel API controller patterns and concepts
when-to-use: Creating API controllers, resource controllers
keywords: laravel, php, controllers, api, resource
priority: high
related: routing.md, responses.md
---

# API Controllers

## Overview

Controllers group related request handling logic into a single class. For APIs, controllers handle incoming HTTP requests, validate input, delegate business logic to services, and return JSON responses via API Resources.

## Why Use Controllers

| Benefit | Description |
|---------|-------------|
| **Organization** | Group related endpoints (all post operations in PostController) |
| **Reusability** | Share middleware, services across related methods |
| **Testing** | Easy to mock dependencies and test in isolation |
| **Convention** | RESTful patterns with resource controllers |

## Controller Types

### Resource Controllers
The most common type for APIs. Provide standard CRUD methods (index, store, show, update, destroy) that map to RESTful routes. Use `--api` flag to skip create/edit methods not needed for APIs.

### Single Action Controllers
Use when an action is complex enough to warrant its own class. Define an `__invoke()` method. Good for actions like `ProvisionServerController`, `ExportReportController`.

### Invokable Controllers
Similar to single action, but more explicit about intent. Keeps each controller focused on one responsibility.

## Resource Methods Explained

| Method | Purpose | When triggered |
|--------|---------|----------------|
| `index` | List resources with pagination | GET /posts |
| `store` | Create a new resource | POST /posts |
| `show` | Display a single resource | GET /posts/{id} |
| `update` | Modify an existing resource | PUT/PATCH /posts/{id} |
| `destroy` | Delete a resource | DELETE /posts/{id} |

## Dependency Injection

Laravel automatically injects dependencies declared in constructor or method signatures.

**Constructor injection** is ideal for services used across multiple methods (PostService, UserRepository). The container resolves these once when the controller is instantiated.

**Method injection** works for request-specific dependencies like Form Requests or route model binding. Laravel resolves Post model automatically from `{post}` route parameter.

## Keeping Controllers Thin

Controllers should orchestrate, not contain business logic. Follow this pattern:

1. **Validate** - Use Form Requests (not inline validation)
2. **Delegate** - Call services for business logic
3. **Transform** - Return API Resources (not raw models)

This makes code testable and maintainable. Services can be reused across controllers, queued jobs, and console commands.

## Best Practices

1. **One resource per controller** - PostController handles only Post operations
2. **Use Form Requests** - Move validation out of controller methods
3. **Return Resources** - Never return Eloquent models directly
4. **Inject services** - Don't instantiate services inside methods
5. **Type everything** - Request types, return types, model binding

## Response Codes

| Action | Code | Why |
|--------|------|-----|
| index | 200 | Successful retrieval |
| store | 201 | Resource created |
| show | 200 | Successful retrieval |
| update | 200 | Resource modified |
| destroy | 204 | No content to return |

## Related Templates

| Template | Purpose |
|----------|---------|
| [ApiController.php.md](templates/ApiController.php.md) | Complete CRUD controller with service injection |
| [api-routes.md](templates/api-routes.md) | Route definitions for controllers |

## Related References

- [routing.md](routing.md) - How routes map to controller methods
- [responses.md](responses.md) - API Resources for JSON output
- [validation.md](validation.md) - Form Requests for input validation
