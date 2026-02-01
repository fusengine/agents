---
name: laravel-eloquent
description: Master Eloquent ORM with relationships, scopes, casts, observers, and query optimization. Use when creating models, defining relationships, writing queries, or optimizing database access.
versions:
  laravel: "12.46"
  php: "8.5"
user-invocable: false
references: references/eloquent.md, references/eloquent-relationships.md, references/eloquent-collections.md, references/eloquent-mutators.md, references/eloquent-serialization.md, references/eloquent-factories.md, references/eloquent-resources.md, references/collections.md, references/scout.md
related-skills: laravel-migrations
---

# Laravel Eloquent ORM

## Agent Workflow (MANDATORY)

Before ANY implementation, launch in parallel:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing model patterns
2. **fuse-ai-pilot:research-expert** - Verify Eloquent docs via Context7
3. **mcp__context7__query-docs** - Check relationship and query patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

Eloquent is Laravel's ActiveRecord ORM for database interactions.

---

## Critical Rules

1. **Use eager loading** - Prevent N+1 queries with `with()`
2. **Use scopes** for reusable query constraints
3. **Use casts** for attribute transformation
4. **Models are data only** - No business logic

---

## Reference Guide

### Concepts

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **Eloquent** | [eloquent.md](references/eloquent.md) | ORM basics |
| **Relationships** | [eloquent-relationships.md](references/eloquent-relationships.md) | Model relations |
| **Collections** | [eloquent-collections.md](references/eloquent-collections.md) | Eloquent collections |
| **Mutators** | [eloquent-mutators.md](references/eloquent-mutators.md) | Accessors & casts |
| **Factories** | [eloquent-factories.md](references/eloquent-factories.md) | Test data |
| **Resources** | [eloquent-resources.md](references/eloquent-resources.md) | API Resources |
| **Scout** | [scout.md](references/scout.md) | Full-text search |

---

## Quick Reference

```php
// Eager loading
$posts = Post::with(['user', 'comments.user'])->get();

// Scope
public function scopePublished(Builder $query): Builder
{
    return $query->where('status', PostStatus::Published);
}

// Cast
protected function casts(): array
{
    return ['status' => PostStatus::class];
}
```
