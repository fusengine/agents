---
name: laravel-eloquent
description: Complete Eloquent ORM for Laravel 13 - PHP Attributes (#[Table], #[Fillable], #[Casts]), models, relationships, queries, observers, factories. Use when working with database models.
versions:
  laravel: "13.0"
  php: "8.3"
user-invocable: true
references: references/legacy-properties.md, references/models.md, references/relationships-basic.md, references/relationships-many-to-many.md, references/relationships-advanced.md, references/relationships-polymorphic.md, references/eager-loading.md, references/scopes.md, references/casts.md, references/accessors-mutators.md, references/events-observers.md, references/soft-deletes.md, references/collections.md, references/serialization.md, references/factories.md, references/performance.md, references/resources.md, references/transactions.md, references/pagination.md, references/aggregates.md, references/batch-operations.md, references/query-debugging.md, references/templates/ModelBasic.php.md, references/templates/ModelRelationships.php.md, references/templates/ModelCasts.php.md, references/templates/Observer.php.md, references/templates/Factory.php.md, references/templates/Resource.php.md, references/templates/EagerLoadingExamples.php.md
related-skills: laravel-attributes, laravel-migrations, laravel-api, laravel-testing
---

# Laravel Eloquent ORM (L13 — Attributes-first)

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Inspect existing models, mixed property/attribute usage
2. **fuse-ai-pilot:research-expert** - Verify Laravel 13 Eloquent + Attributes docs via Context7
3. **mcp__context7__query-docs** - Query attribute patterns (#[Fillable], #[Casts], #[Scope])

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

Laravel 13 promotes **PHP 8.3 Attributes** as the primary metadata mechanism on Eloquent models. Legacy properties (`$fillable`, `$hidden`, ...) remain supported for backward compatibility but should not be mixed with their attribute counterparts.

| Feature | Attribute (L13 MAIN) | Legacy property |
|---------|---------------------|-----------------|
| Table name | `#[Table('users')]` | `protected $table` |
| Mass assignment | `#[Fillable([...])]` | `protected $fillable` |
| Hidden / Visible | `#[Hidden([...])]` / `#[Visible([...])]` | `protected $hidden` / `$visible` |
| Guarded | `#[Guarded([...])]` / `#[Unguarded]` | `protected $guarded` |
| Casts | `#[Casts([...])]` | `casts()` method |
| Appends | `#[Appends([...])]` | `protected $appends` |
| Touches | `#[Touches([...])]` | `protected $touches` |
| Connection | `#[Connection('mysql')]` | `protected $connection` |

---

## Critical Rules

1. **Attributes are the source of truth** - Use `#[Fillable]`, `#[Casts]`, `#[Hidden]` on new code
2. **Never mix attribute + property** for the same concern (`#[Fillable]` AND `$fillable`)
3. **Eager load relationships** - Prevent N+1 queries with `with()`
4. **No `new Model()` in `boot()`** - Throws `LogicException` in L13 (booted lifecycle protected)
5. **Use factories** in tests - Never hardcode test data

---

## Architecture

```
app/Models/
├── User.php              # #[Table], #[Fillable], #[Hidden], #[Casts]
├── Post.php              # #[Connection], #[Appends], relationships
└── Concerns/
    └── HasUuid.php       # Reusable trait
```

→ See [templates/ModelBasic.php.md](references/templates/ModelBasic.php.md)

---

## Reference Guide

### Concepts

- **Migration L12→L13:** [legacy-properties.md](references/legacy-properties.md)
- **Modeling:** [models.md](references/models.md) · [casts.md](references/casts.md) · [accessors-mutators.md](references/accessors-mutators.md) · [serialization.md](references/serialization.md) · [soft-deletes.md](references/soft-deletes.md)
- **Relationships:** [relationships-basic.md](references/relationships-basic.md) · [relationships-many-to-many.md](references/relationships-many-to-many.md) · [relationships-advanced.md](references/relationships-advanced.md) · [relationships-polymorphic.md](references/relationships-polymorphic.md)
- **Querying:** [eager-loading.md](references/eager-loading.md) · [scopes.md](references/scopes.md) · [aggregates.md](references/aggregates.md) · [pagination.md](references/pagination.md) · [batch-operations.md](references/batch-operations.md) · [query-debugging.md](references/query-debugging.md)
- **Lifecycle / Output:** [events-observers.md](references/events-observers.md) · [collections.md](references/collections.md) · [resources.md](references/resources.md) · [factories.md](references/factories.md) · [transactions.md](references/transactions.md) · [performance.md](references/performance.md)

### Templates

| Template | When to Use |
|----------|-------------|
| [ModelBasic.php.md](references/templates/ModelBasic.php.md) | Attribute-based model |
| [ModelRelationships.php.md](references/templates/ModelRelationships.php.md) | All relationship types |
| [ModelCasts.php.md](references/templates/ModelCasts.php.md) | #[Casts] and accessors |
| [Observer.php.md](references/templates/Observer.php.md) | Complete observer |
| [Factory.php.md](references/templates/Factory.php.md) | Factory with states |
| [Resource.php.md](references/templates/Resource.php.md) | API resource |
| [EagerLoadingExamples.php.md](references/templates/EagerLoadingExamples.php.md) | N+1 prevention |

---

## Quick Reference

### Attribute-based Model (L13 MAIN)

```php
use Illuminate\Database\Eloquent\Attributes\{Table, Fillable, Hidden, Casts};
use Illuminate\Database\Eloquent\Model;

#[Table('users')]
#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
#[Casts(['email_verified_at' => 'datetime', 'is_admin' => 'boolean'])]
final class User extends Model
{
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
```

### Scope (attribute syntax)

```php
#[Scope]
protected function published(Builder $query): void
{
    $query->whereNotNull('published_at');
}
// Usage: Post::published()->get();
```

### Eager Loading

```php
$posts = Post::with('author')->get();  // 2 queries, not N+1
```

→ Legacy `$fillable` / `$hidden` style — see [legacy-properties.md](references/legacy-properties.md)

---

## Best Practices

### DO
- Declare metadata with **PHP Attributes** (`#[Table]`, `#[Fillable]`, `#[Casts]`, ...)
- Use `final` on model classes when not extended
- Eager load with `with()`
- Use factories in tests
- Cast dates, arrays, enums via `#[Casts]`

### DON'T
- **Mix `#[Fillable]` and `$fillable`** on the same model (conflict — single source of truth)
- **Instantiate models in `boot()` / `booted()`** — L13 throws `LogicException`
- Lazy-load relationships in loops (N+1)
- Use `#[Unguarded]` in production
- Query inside accessors / mutators
- Put business logic in models (use Services/Actions)
