---
name: relationships-advanced
description: HasOneThrough, HasManyThrough, dynamic relationships
when-to-use: Indirect relationships, runtime relationships
keywords: hasOneThrough, hasManyThrough, through, dynamic
---

# Advanced Relationships

## Decision Tree

```
Need to access through intermediate model?
├── One result → hasOneThrough
├── Many results → hasManyThrough
└── Dynamic at runtime → resolveRelationUsing
```

## Has One Through

| Scenario | Chain |
|----------|-------|
| Mechanic → Car → Owner | `Mechanic::hasOneThrough(Owner, Car)` |
| Supplier → User → History | `Supplier::hasOneThrough(History, User)` |

## Has Many Through

| Scenario | Chain |
|----------|-------|
| Country → User → Post | `Country::hasManyThrough(Post, User)` |
| Project → Environment → Deployment | `Project::hasManyThrough(Deployment, Environment)` |

## Method Signatures

```
hasOneThrough(
    $related,           // Final model
    $through,           // Intermediate model
    $firstKey,          // FK on intermediate
    $secondKey,         // FK on final
    $localKey,          // Local PK
    $secondLocalKey     // Intermediate PK
)

hasManyThrough(
    $related,
    $through,
    $firstKey,
    $secondKey,
    $localKey,
    $secondLocalKey
)
```

## Laravel 12 Fluent Syntax

| Traditional | Fluent (Laravel 12) |
|-------------|---------------------|
| `hasManyThrough(Deployment::class, Environment::class)` | `$this->through('environments')->has('deployments')` |
| Custom keys | `$this->throughEnvironments()->hasDeployments()` |

## Dynamic Relationships

| Method | Purpose |
|--------|---------|
| `resolveRelationUsing($name, $callback)` | Add relationship at runtime |
| Called in `AppServiceProvider::boot()` | Global registration |

## One of Many

| Method | Purpose |
|--------|---------|
| `hasOne(...)->latestOfMany()` | Latest by primary key |
| `hasOne(...)->oldestOfMany()` | Oldest by primary key |
| `hasOne(...)->latestOfMany('published_at')` | Latest by column |
| `hasOne(...)->ofMany('price', 'min')` | Aggregate (min/max) |

## Chained Of Many

| Scenario | Method |
|----------|--------|
| Latest with highest price | `ofMany(['published_at' => 'max', 'id' => 'max'])` |
| Custom constraint | `ofMany('published_at', 'max', fn($q) => $q->where('published', true))` |

## Belongs To Of Many

| Method | Purpose |
|--------|---------|
| `belongsTo(...)->withDefault()` | Default model if null |
| Available with all relationship types | Prevents null errors |

## Touching Parent Timestamps

| Property | Purpose |
|----------|---------|
| `$touches = ['post']` | Update parent's updated_at |
| Multiple parents | `$touches = ['post', 'author']` |

## Query Optimizations

| Pattern | Use |
|---------|-----|
| `with('relation')` | Eager load |
| `withCount('relation')` | Count without loading |
| `loadMissing('relation')` | Load if not loaded |

→ **Complete examples**: See [ModelRelationships.php.md](templates/ModelRelationships.php.md)
