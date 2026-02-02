---
name: scopes
description: Local, global, and dynamic query scopes
when-to-use: Reusable query constraints, filtering patterns
keywords: scope, globalScope, local, dynamic, #[Scope]
---

# Query Scopes

## Decision Tree

```
What type of scope?
├── Always applied → Global Scope
├── Called explicitly → Local Scope
├── Accepts parameters → Dynamic Scope
└── Laravel 12 → Use #[Scope] attribute
```

## Scope Types

| Type | Applied | Example |
|------|---------|---------|
| **Global** | Automatically | `SoftDeletes` |
| **Local** | When called | `User::active()` |
| **Dynamic** | With parameters | `User::ofType('admin')` |

## Local Scopes (Laravel 12)

| Syntax | Method |
|--------|--------|
| Attribute | `#[Scope] protected function popular(Builder $query)` |
| Prefix | `scopePopular(Builder $query)` (legacy) |
| Usage | `User::popular()->get()` |

## Dynamic Scopes

| Definition | Usage |
|------------|-------|
| `#[Scope] protected function ofType(Builder $query, string $type)` | `User::ofType('admin')` |
| `scopeOfStatus(Builder $query, string $status)` | `Order::ofStatus('pending')` |

## Global Scopes

| Method | Location |
|--------|----------|
| Closure | `booted()` method |
| Class | Implement `Scope` interface |

## Defining Global Scopes

| Approach | Use When |
|----------|----------|
| Closure in `booted()` | Simple, single-model |
| Scope class | Reusable across models |
| Trait with `booted()` | Reusable pattern |

## Removing Global Scopes

| Method | Purpose |
|--------|---------|
| `withoutGlobalScope(AgeScope::class)` | Remove specific |
| `withoutGlobalScope('age')` | Remove by name |
| `withoutGlobalScopes()` | Remove all |
| `withoutGlobalScopes([...])` | Remove multiple |

## Scope Chaining

| Pattern | Result |
|---------|--------|
| `User::active()->popular()` | Combines both |
| `User::active()->orWhere->popular()` | OR condition |

## Common Scope Patterns

| Scope | Purpose |
|-------|---------|
| `active()` | `where('active', true)` |
| `published()` | `whereNotNull('published_at')` |
| `recent()` | `orderBy('created_at', 'desc')` |
| `ofType($type)` | `where('type', $type)` |
| `createdBetween($start, $end)` | Date range |

## Scope Best Practices

| DO | DON'T |
|----|-------|
| Keep scopes focused (SRP) | Mix unrelated logic |
| Use for query constraints | Use for business logic |
| Chain simple scopes | Create mega-scopes |
| Document parameters | Rely on implicit behavior |

## Testing Scopes

| Approach | Method |
|----------|--------|
| Test query SQL | `toSql()` |
| Test results | Assert collection |
| Test chaining | Multiple scopes |

→ **Complete examples**: See [ModelBasic.php.md](templates/ModelBasic.php.md)
