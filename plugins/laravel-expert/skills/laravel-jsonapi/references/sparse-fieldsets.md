---
name: jsonapi-sparse-fieldsets
description: Implement and consume sparse fieldsets
---

# Sparse Fieldsets

## Client query

```http
GET /api/posts?fields[posts]=title,created_at&fields[users]=name
```

The client requests only `title` and `created_at` for posts, and only `name` for users.

## Server-side

`JsonApiResource` parses the `fields[type]` query string and filters `toAttributes()` output automatically. No code is needed in the resource - the framework intersects the requested fields with the returned array.

## Default response (no fields parameter)

```json
{
  "data": {
    "id": "1",
    "type": "posts",
    "attributes": {
      "title": "Hello World",
      "body": "Lorem ipsum",
      "created_at": "2026-05-12T10:00:00Z"
    }
  }
}
```

## With `?fields[posts]=title`

```json
{
  "data": {
    "id": "1",
    "type": "posts",
    "attributes": {
      "title": "Hello World"
    }
  }
}
```

## Combined with `?include`

```http
GET /api/posts/1?include=author&fields[posts]=title&fields[users]=name
```

```json
{
  "data": {
    "id": "1",
    "type": "posts",
    "attributes": {"title": "Hello World"},
    "relationships": {
      "author": {"data": {"id": "1", "type": "users"}}
    }
  },
  "included": [
    {
      "id": "1",
      "type": "users",
      "attributes": {"name": "Taylor"}
    }
  ]
}
```

## Notes

- Fields ARE applied to `included` resources too (per JSON:API spec)
- `id` and `type` are always returned regardless of the fields parameter
- Invalid field names are silently ignored - validate at the controller if strictness is needed
