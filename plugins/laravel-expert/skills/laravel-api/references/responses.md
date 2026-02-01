---
name: responses
description: Laravel API responses with Resources and Collections
when-to-use: Transforming data for API output, pagination
keywords: laravel, php, responses, api resource, json
priority: high
related: controllers.md, pagination.md
---

# API Responses

## Overview

API responses should be consistent, well-structured JSON. Laravel's API Resources provide a transformation layer between Eloquent models and the JSON output. Never return models directly - always transform through Resources.

## Why API Resources

| Benefit | Description |
|---------|-------------|
| **Transformation** | Control exactly what data is exposed |
| **Consistency** | Same model always returns same structure |
| **Relationships** | Include related data conditionally |
| **Pagination** | Automatic pagination metadata |
| **Security** | Hide sensitive fields by default |

## Resource Types

**JsonResource** transforms a single model. Use for show endpoints returning one item.

**ResourceCollection** transforms a collection of models. Use for index endpoints. Includes pagination metadata automatically.

## Creating Resources

```shell
php artisan make:resource PostResource
php artisan make:resource PostCollection
```

Resources are created in `app/Http/Resources/`. The `toArray()` method defines the output structure.

## Basic Usage

Return a single resource:
```php
return PostResource::make($post);
return new PostResource($post);
```

Return a collection:
```php
return PostResource::collection($posts);
return new PostCollection($posts);
```

## Conditional Data

Include data only when certain conditions are met:

**when()** includes a value if condition is true
**whenLoaded()** includes relationship only if eager loaded
**whenPivotLoaded()** includes pivot data from many-to-many

This prevents N+1 queries and keeps responses lean.

## Wrapping

By default, Resources wrap output in a `data` key. This is good practice for APIs - it leaves room for metadata, pagination, and future additions.

Disable wrapping with `JsonResource::withoutWrapping()` in a service provider if needed.

## Pagination

When passing a paginator to a collection, Laravel automatically includes pagination metadata:

```json
{
    "data": [...],
    "links": {
        "first": "...",
        "last": "...",
        "prev": null,
        "next": "..."
    },
    "meta": {
        "current_page": 1,
        "total": 50,
        "per_page": 15
    }
}
```

## HTTP Status Codes

| Code | Meaning | When to use |
|------|---------|-------------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Malformed request |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Authenticated but not allowed |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable | Validation failed |
| 500 | Server Error | Unexpected error |

## Setting Status Codes

For resources, chain `response()->setStatusCode()`:

```php
return PostResource::make($post)
    ->response()
    ->setStatusCode(201);
```

For plain JSON:
```php
return response()->json($data, 201);
return response()->json(null, 204);
```

## Response Headers

Add headers to responses:

```php
return PostResource::make($post)
    ->response()
    ->header('X-Custom-Header', 'value');
```

## Best Practices

1. **Always use Resources** - Never return models directly
2. **Use whenLoaded()** - Prevent N+1 on relationships
3. **Consistent structure** - Same resource, same output shape
4. **Meaningful status codes** - 201 for create, 204 for delete
5. **Keep data key** - Don't disable wrapping

## Related Templates

| Template | Purpose |
|----------|---------|
| [ApiResource.php.md](templates/ApiResource.php.md) | Complete Resource examples |
| [ApiController.php.md](templates/ApiController.php.md) | Using Resources in controllers |

## Related References

- [controllers.md](controllers.md) - Returning responses from controllers
- [pagination.md](pagination.md) - Paginating results
