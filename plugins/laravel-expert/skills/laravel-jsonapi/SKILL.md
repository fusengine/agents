---
name: laravel-jsonapi
description: Use when building JSON:API spec-compliant endpoints in Laravel 13 with the first-party `JsonApiResource` base class.
versions:
  laravel: "13.0"
  php: "8.3"
user-invocable: true
references: references/resources.md, references/sparse-fieldsets.md, references/relationships.md, references/templates/PostResource.php.md, references/templates/UserResource.php.md
related-skills: laravel-api, laravel-eloquent
---

<objective>
Covers Laravel 13's JsonApiResource base class for JSON:API v1.1-compliant
responses: $attributes / toAttributes(), $relationships / toRelationships(),
toType() / toId() overrides, sparse
fieldsets (?fields[type]=a,b), relationship inclusion (?include=) with the
included array, resource identifiers, self/related links, and the
application/vnd.api+json content type. For general (non-JSON:API-spec) REST
API building, see laravel-api instead.
</objective>

# Laravel 13 JSON:API Resources

## Agent Workflow (MANDATORY)

Before ANY implementation, spawn 3 agents in parallel, one `Agent` call each with a `name`:

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
| **Links / meta** | `toLinks()` / `toMeta()` overrides |

---

## Critical Rules

1. **Extend `JsonApiResource`** - Never roll your own JSON:API serializer; the base class handles spec edge cases
2. **Type is derived from the class name** (`PostResource` → `posts`) - override `toType()` only when it must differ
3. **Use `$attributes` / `toAttributes()` not `toArray()`** - JSON:API splits attributes from identifiers; mixing them breaks compliance
4. **Whitelist relationships** - Declare `$relationships` (or `toRelationships()`) with only the relations clients may include
5. **Respect Content-Type** - Clients sending JSON:API requests MUST use `Accept: application/vnd.api+json`

---

## Architecture

```
app/Http/Resources/
├── PostResource.php           # extends JsonApiResource → type "posts"
├── UserResource.php           # extends JsonApiResource → type "users"
└── CommentResource.php        # extends JsonApiResource → type "comments"

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
// php artisan make:resource PostResource --json-api
use Illuminate\Http\Resources\JsonApi\JsonApiResource;

class PostResource extends JsonApiResource
{
    public $attributes = ['title', 'body'];

    public $relationships = ['author', 'comments'];
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
- Override `toType()` only when the derived type must differ from the class name (e.g. `AuthorResource` wrapping `User`)
- Use `toLinks()` to expose `self` / `related` links

### DON'T
- Don't return a JSON:API response without the `JsonApiResource` base class - manual JSON breaks subtle spec rules (e.g., null vs empty data)
- Don't include relationships not whitelisted in `$relationships` / `toRelationships()` - silent ignoring keeps APIs predictable
- Don't mix `toArray()` and `toAttributes()` - the JSON:API base class expects the latter
- Don't forget to set the response Content-Type when bypassing resources (e.g., custom errors) - clients may reject the response
