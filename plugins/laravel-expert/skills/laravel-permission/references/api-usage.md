---
name: api-usage
description: Using Spatie Permission with API authentication (Sanctum, Passport)
when-to-use: Protecting API routes, JSON responses, multiple guards
keywords: api, sanctum, passport, guard, json, token
priority: high
related: spatie-permission.md, middleware.md
---

# API Usage

## Overview

Spatie Permission works seamlessly with Laravel's API authentication systems (Sanctum, Passport). The key is properly configuring guards and handling JSON error responses.

## Guard Configuration

### API Guard Setup

| Guard | Use Case | Package |
|-------|----------|---------|
| `api` | Token authentication | Sanctum/Passport |
| `sanctum` | SPA + Mobile tokens | Sanctum |
| `web` | Session-based | Default |

### Config Setup

Configure default guard for API in `config/auth.php`:

| Setting | Value |
|---------|-------|
| `defaults.guard` | `web` (or `api` for API-first) |
| `guards.api.driver` | `sanctum` or `passport` |

## Creating API Roles/Permissions

### Guard-Specific Creation

Roles and permissions are guard-specific:

| Creation | Guard Used |
|----------|------------|
| Without guard param | Uses default guard |
| With guard param | Uses specified guard |

### Naming Convention

| Approach | Example |
|----------|---------|
| Same names, different guards | `admin` (web), `admin` (api) |
| Prefixed names | `api-admin`, `web-admin` |

## Middleware for API Routes

### Available Middleware

| Middleware | Syntax |
|------------|--------|
| Role check | `role:admin,api` |
| Permission check | `permission:edit,api` |
| Role or Permission | `role_or_permission:admin\|edit,api` |

The second parameter specifies the guard.

### Route Group Pattern

| Pattern | Use Case |
|---------|----------|
| `auth:sanctum` + `role:admin,api` | Sanctum with role |
| `auth:api` + `permission:edit,api` | Passport with permission |

## JSON Error Responses

### Default Behavior

By default, unauthorized throws `UnauthorizedException` which returns HTML.

### Custom Exception Handling

Handle in `bootstrap/app.php` (Laravel 11+) or `Handler.php`:

| Request Type | Response |
|--------------|----------|
| `expectsJson()` | JSON 403 |
| Otherwise | Redirect or HTML |

### Response Format

| Field | Value |
|-------|-------|
| `message` | Error description |
| `error` | Error type |
| Status code | 403 |

## Sanctum Integration

### Token Abilities vs Permissions

| Concept | Scope |
|---------|-------|
| Token abilities | What the token can do |
| Spatie permissions | What the user can do |
| Combined | Both must allow action |

### Check Both

For sensitive operations, verify both token ability AND user permission.

## API Response Patterns

### Include Permissions in Response

When returning user data, include their permissions:

| Field | Content |
|-------|---------|
| `roles` | User's role names |
| `permissions` | User's permission names |
| `can` | Object with ability checks |

### Permission-Based Conditionals

Include action URLs/buttons based on permissions in API responses.

## Testing API Permissions

### Test Setup

| Step | Action |
|------|--------|
| Create user | Factory |
| Assign API role | `assignRole('api-admin')` |
| Create token | Sanctum/Passport |
| Make request | With bearer token |

### Assertions

| Check | Assertion |
|-------|-----------|
| Authorized | `assertOk()` |
| Unauthorized | `assertForbidden()` |
| Response structure | `assertJsonStructure()` |

## Best Practices

1. **Specify guard explicitly** - Don't rely on defaults for API
2. **JSON responses** - Always return JSON for API errors
3. **Include permissions** - Return user permissions with auth response
4. **Token + Permission** - Consider both for sensitive actions
5. **Consistent naming** - Either same names or clear prefixes

## Common Patterns

### Login Response with Permissions

Return token + user permissions on successful login.

### Permission Check Endpoint

Dedicated endpoint to check if user can perform action.

### Resource with Allowed Actions

Include `can_edit`, `can_delete` booleans in resource responses.

## Related Templates

| Template | Purpose |
|----------|---------|
| [ApiPermissionSetup.php.md](templates/ApiPermissionSetup.php.md) | API guard configuration |
| [ApiExceptionHandler.php.md](templates/ApiExceptionHandler.php.md) | JSON error responses |
| [ApiAuthController.php.md](templates/ApiAuthController.php.md) | Login with permissions |
| [ApiUserResource.php.md](templates/ApiUserResource.php.md) | User resource with permissions |

## Related References

- [spatie-permission.md](spatie-permission.md) - Core concepts
- [middleware.md](middleware.md) - Middleware syntax
