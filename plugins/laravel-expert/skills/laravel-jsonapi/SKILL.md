---
name: laravel-jsonapi
description: Use when building JSON:API compliant endpoints in Laravel 13 using the first-party `JsonApiResource` base class. Covers sparse fieldsets, inclusion, links, and response headers.
versions:
  laravel: "13.0"
  php: "8.3"
user-invocable: true
references: references/resources.md, references/sparse-fieldsets.md, references/relationships.md, references/templates/PostResource.php.md, references/templates/UserResource.php.md
related-skills: laravel-api, laravel-eloquent
---

# Laravel 13 JSON:API Resources

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Inventory existing `JsonResource` classes to migrate
2. **fuse-ai-pilot:research-expert** - Check JSON:API v1.1 spec for required headers and structure
3. **mcp__context7__query-docs** - Pull `laravel.com/docs/13.x/eloquent-resources` examples

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Feature | Description |
|---------|-------------|
| **`JsonApiResource`** | Base class extending `JsonResource` with spec compliance |
| **Content-Type** | Auto-sets `application/vnd.api+json` |
| **Sparse fieldsets** | `?fields[posts]=title,created_at` |
| **Inclusion** | `?include=author,comments` with `included` array |
| **Resource identifiers** | `{"id":"1","type":"posts"}` in relationships |
| **Links** | `self`, `related` links auto-generated |

---

## Critical Rules

1. **Extend `JsonApiResource`** - Never roll your own JSON:API serializer; the base class handles spec edge cases
2. **Declare `$type`** - Each resource MUST set a string `$type` (e.g., `posts`, `users`)
3. **Use `toAttributes()` not `toArray()`** - JSON:API splits attributes from identifiers; mixing them breaks compliance
4. **Whitelist relationships** - Implement `relationships()` returning only the relations clients may include
5. **Respect Content-Type** - Clients sending JSON:API requests MUST use `Accept: application/vnd.api+json`

---

## Architecture

```
app/Http/Resources/
├── PostResource.php           # extends JsonApiResource, $type = 'posts'
├── UserResource.php           # extends JsonApiResource, $type = 'users'
└── CommentResource.php        # extends JsonApiResource, $type = 'comments'

app/Http/Controllers/
└── Api/PostController.php     # returns PostResource::collection($posts)
```

→ See [PostResource.php.md](references/templates/PostResource.php.md) for full example

---

## Reference Guide

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Base resource class** | [resources.md](references/resources.md) | Structuring `JsonApiResource` subclasses |
| **Sparse fieldsets** | [sparse-fieldsets.md](references/sparse-fieldsets.md) | Implementing `fields[type]=a,b` |
| **Relationships** | [relationships.md](references/relationships.md) | Inclusion + identifiers + links |

### Templates

| Template | When to Use |
|----------|-------------|
| [PostResource.php.md](references/templates/PostResource.php.md) | Resource with belongsTo + hasMany |
| [UserResource.php.md](references/templates/UserResource.php.md) | Simple resource with sparse fields |

---

## Quick Reference

### Minimal resource

```php
use Illuminate\Http\Resources\Json\JsonApiResource;

class PostResource extends JsonApiResource
{
    public string $type = 'posts';

    public function toAttributes($request): array
    {
        return ['title' => $this->title, 'body' => $this->body];
    }
}
```

### Controller

```php
return PostResource::collection(Post::with('author')->get());
```

→ See [PostResource.php.md](references/templates/PostResource.php.md) for complete example

---

## Best Practices

### DO
- Eager-load relationships used in `include` to avoid N+1 (`?include=author` → `with('author')`)
- Document supported `include` and `fields` parameters in your OpenAPI spec
- Set explicit `$type` matching the URL segment (e.g., `/api/posts` → `'posts'`)
- Use `toLinks()` to expose `self`, `related`, pagination links

### DON'T
- Don't return a JSON:API response without the `JsonApiResource` base class - manual JSON breaks subtle spec rules (e.g., null vs empty data)
- Don't include relationships not whitelisted in `relationships()` - silent ignoring keeps APIs predictable
- Don't mix `toArray()` and `toAttributes()` - the JSON:API base class expects the latter
- Don't forget to set the response Content-Type when bypassing resources (e.g., custom errors) - clients may reject the response
