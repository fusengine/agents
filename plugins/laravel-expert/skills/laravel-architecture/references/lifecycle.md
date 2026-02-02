---
name: lifecycle
description: Laravel request lifecycle - entry points, bootstrapping, middleware, and response
when-to-use: Consult when debugging request flow, understanding bootstrapping, or working with service providers
keywords: lifecycle, request, bootstrap, kernel, middleware, service provider, container
priority: high
related: service-providers.md, middleware.md
---

# Request Lifecycle

## Overview

Understanding the request lifecycle helps debug issues and know where to place code.

## Lifecycle Phases

| Phase | Component | Purpose |
|-------|-----------|---------|
| **1. Entry** | `public/index.php` | Loads autoloader, creates app |
| **2. Bootstrap** | `bootstrap/app.php` | Creates service container |
| **3. Kernel** | HTTP/Console Kernel | Configures bootstrappers, middleware |
| **4. Providers** | Service Providers | Register and boot services |
| **5. Routing** | Router | Match request to route/controller |
| **6. Middleware** | Middleware Stack | Filter request/response |
| **7. Controller** | Controller/Action | Handle business logic |
| **8. Response** | Response Object | Send to browser |

---

## Key Concepts

### Entry Point

All web requests go through `public/index.php`:

| Action | Purpose |
|--------|---------|
| Load autoloader | Composer's `vendor/autoload.php` |
| Create application | From `bootstrap/app.php` |
| Handle request | Via HTTP Kernel |

### HTTP Kernel

The kernel (`Illuminate\Foundation\Http\Kernel`) does:

| Step | Purpose |
|------|---------|
| Run bootstrappers | Error handling, logging, environment |
| Load middleware | Session, CSRF, auth |
| Dispatch to router | Match route, run controller |

### Service Providers

Providers bootstrap the entire framework:

| Method | When Called | Purpose |
|--------|-------------|---------|
| `register()` | First | Bind services to container |
| `boot()` | After all register | Use other services |

**Important**: `boot()` runs after ALL providers are registered.

---

## Request Flow Diagram

```
Request → index.php → app.php → Kernel
                                   ↓
                            Bootstrappers
                                   ↓
                         Service Providers
                            (register → boot)
                                   ↓
                              Middleware
                            (before → after)
                                   ↓
                         Router → Controller
                                   ↓
                              Response
```

---

## When to Use What

| Need | Where to Put Code |
|------|-------------------|
| Bind service | ServiceProvider `register()` |
| Use other service | ServiceProvider `boot()` |
| Filter all requests | Global middleware |
| Filter some requests | Route middleware |
| Handle specific route | Controller |

---

## Debugging Tips

| Issue | Check |
|-------|-------|
| Service not found | Provider registered in `bootstrap/providers.php`? |
| Middleware not running | Applied to route/group? |
| Route not found | `php artisan route:list` |
| Provider error | Check `boot()` dependencies exist |

---

## Best Practices

### DO
- Keep providers focused (single responsibility)
- Use `boot()` for logic needing other services
- Register middleware in `bootstrap/app.php`

### DON'T
- Don't put business logic in providers
- Don't access services in `register()` (not ready yet)
- Don't forget middleware order matters
