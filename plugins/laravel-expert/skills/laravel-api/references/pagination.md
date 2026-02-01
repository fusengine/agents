---
name: pagination
description: Laravel pagination for API responses
when-to-use: Paginating large datasets in API responses
keywords: laravel, php, pagination, cursor, api
priority: medium
related: responses.md, controllers.md
---

# API Pagination

## Overview

Pagination splits large datasets into manageable pages. Laravel provides offset-based and cursor-based pagination, both with automatic JSON metadata when used with API Resources.

## Pagination Types

| Type | Best For | Trade-offs |
|------|----------|------------|
| **Offset (paginate)** | UI with page numbers | Slower on large tables, can skip/duplicate on changes |
| **Cursor** | Infinite scroll, real-time | Can't jump to page, only forward/back |
| **Simple** | Next/prev only | No total count, faster |

## Basic Usage

```php
// Offset pagination (with total count)
$posts = Post::paginate(15);

// Simple pagination (no total count, faster)
$posts = Post::simplePaginate(15);

// Cursor pagination (best for large datasets)
$posts = Post::cursorPaginate(15);
```

## Pagination Methods

| Method | Returns |
|--------|---------|
| `paginate($perPage)` | LengthAwarePaginator |
| `simplePaginate($perPage)` | Paginator |
| `cursorPaginate($perPage)` | CursorPaginator |

## JSON Response Structure

When returning paginated results through Resources, Laravel includes metadata:

```json
{
    "data": [...],
    "links": {
        "first": "http://api.test/posts?page=1",
        "last": "http://api.test/posts?page=5",
        "prev": null,
        "next": "http://api.test/posts?page=2"
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 5,
        "per_page": 15,
        "to": 15,
        "total": 75
    }
}
```

## Customizing Per Page

Allow clients to request different page sizes:

```php
$perPage = min($request->input('per_page', 15), 100);
$posts = Post::paginate($perPage);
```

Always set a maximum to prevent abuse.

## Cursor Pagination

Cursor pagination uses encoded cursor instead of page numbers. More efficient for large tables and handles concurrent insertions better.

```json
{
    "data": [...],
    "meta": {
        "next_cursor": "eyJpZCI6MTUsIl9wb2ludHNUb05leHRJdGVtcyI6dHJ1ZX0",
        "prev_cursor": null
    }
}
```

## Appending Query Params

Preserve query parameters in pagination links:

```php
$posts = Post::where('published', true)
    ->paginate(15)
    ->appends(['sort' => 'title']);
```

## With Relationships

Always paginate after adding relationships to avoid N+1:

```php
$posts = Post::with(['author', 'category'])
    ->paginate(15);
```

## Best Practices

1. **Default per_page** - Sensible default (15-25)
2. **Maximum limit** - Cap per_page to prevent abuse
3. **Use cursor** - For large datasets or real-time feeds
4. **Include sort params** - In pagination links
5. **Eager load** - Relationships before paginating

## Related Templates

| Template | Purpose |
|----------|---------|
| [ApiResource.php.md](templates/ApiResource.php.md) | Using Resources with pagination |

## Related References

- [responses.md](responses.md) - API Resource responses
- [controllers.md](controllers.md) - Controller index methods
