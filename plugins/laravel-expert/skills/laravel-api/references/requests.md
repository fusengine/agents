---
name: requests
description: Laravel HTTP request handling for APIs
when-to-use: Accessing request data, files, headers in controllers
keywords: laravel, php, request, input, headers, files
priority: medium
related: validation.md, controllers.md
---

# HTTP Requests

## Overview

The Request object provides access to all incoming HTTP data - input fields, query strings, files, headers, and more. In API controllers, type-hint `Illuminate\Http\Request` or a Form Request to access this data.

## Accessing Input

Laravel provides unified access to input regardless of HTTP method or content type (form data, JSON, query string).

| Method | Purpose |
|--------|---------|
| `$request->input('name')` | Get single input value |
| `$request->input('name', 'default')` | With default value |
| `$request->all()` | All input as array |
| `$request->only(['name', 'email'])` | Only specified fields |
| `$request->except(['password'])` | All except specified |
| `$request->query('page')` | Query string only |

## JSON Input

For JSON APIs, Laravel automatically decodes JSON body when `Content-Type: application/json` header is present.

Access nested JSON data with dot notation: `$request->input('user.name')`.

Check if request expects JSON response: `$request->expectsJson()` or `$request->wantsJson()`.

## Input Presence

| Method | Returns true when |
|--------|-------------------|
| `$request->has('name')` | Key exists (even if empty) |
| `$request->filled('name')` | Key exists and not empty |
| `$request->missing('name')` | Key doesn't exist |
| `$request->hasAny(['name', 'email'])` | Any key exists |

## Boolean Input

`$request->boolean('active')` converts truthy values (1, "1", "true", "on", "yes") to boolean. Useful for checkboxes and toggle fields.

## Merging Input

`$request->merge(['key' => 'value'])` adds data to the request. Useful in Form Request `prepareForValidation()` to normalize data before validation.

## Files

| Method | Purpose |
|--------|---------|
| `$request->file('avatar')` | Get uploaded file |
| `$request->hasFile('avatar')` | Check if file uploaded |
| `$file->isValid()` | Check if upload succeeded |
| `$file->store('avatars')` | Store in storage disk |
| `$file->getClientOriginalName()` | Original filename |
| `$file->extension()` | File extension |

## Headers

| Method | Purpose |
|--------|---------|
| `$request->header('X-Custom')` | Get single header |
| `$request->bearerToken()` | Get Bearer token from Authorization |
| `$request->headers->all()` | All headers |

## Request Information

| Method | Returns |
|--------|---------|
| `$request->method()` | HTTP method (GET, POST...) |
| `$request->isMethod('post')` | Check method |
| `$request->url()` | URL without query string |
| `$request->fullUrl()` | URL with query string |
| `$request->ip()` | Client IP address |
| `$request->userAgent()` | User agent string |

## Route Parameters

Access route parameters directly on request:

```php
// Route: /posts/{post}/comments/{comment}
$postId = $request->route('post');
$commentId = $request->route('comment');
```

## Request User

`$request->user()` returns the authenticated user. For Sanctum APIs, this requires `auth:sanctum` middleware.

## Content Types

| Method | Purpose |
|--------|---------|
| `$request->getContentType()` | Content-Type value |
| `$request->isJson()` | Request has JSON content type |
| `$request->acceptsJson()` | Client accepts JSON |

## Best Practices

1. **Use Form Requests** - Move validation logic out of controllers
2. **Use validated()** - Get only validated data after validation
3. **Type-hint properly** - Form Request or base Request class
4. **Sanitize early** - Use `prepareForValidation()` for normalization
5. **Check expectations** - Use `expectsJson()` for response format

## Related Templates

| Template | Purpose |
|----------|---------|
| [FormRequest.php.md](templates/FormRequest.php.md) | Request validation |
| [ApiController.php.md](templates/ApiController.php.md) | Request handling in controllers |

## Related References

- [validation.md](validation.md) - Validating request input
- [controllers.md](controllers.md) - Using requests in controllers
