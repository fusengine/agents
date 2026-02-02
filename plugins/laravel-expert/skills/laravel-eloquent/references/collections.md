---
name: collections
description: Eloquent-specific collection methods
when-to-use: Working with model collections, relationship results
keywords: collection, pluck, find, contains, modelKeys, toQuery
---

# Eloquent Collections

## Decision Tree

```
Working with collection?
├── Need specific model → find(), contains()
├── Transform → map(), pluck()
├── Filter → filter(), where()
├── Back to query → toQuery()
└── Unique by column → unique()
```

## Eloquent vs Base Collection

| Feature | Eloquent Collection |
|---------|---------------------|
| Extends | `Illuminate\Support\Collection` |
| Contains | Model instances |
| Extra methods | Model-specific operations |

## Eloquent-Specific Methods

| Method | Purpose |
|--------|---------|
| `find($id)` | Find model by primary key |
| `contains($key, $value)` | Check if model exists |
| `modelKeys()` | Get all primary keys |
| `fresh()` | Refresh from database |
| `load('relation')` | Lazy eager load |
| `loadMissing('relation')` | Load if not loaded |
| `toQuery()` | Convert to query builder |
| `diff($models)` | Models not in other |
| `intersect($models)` | Models in both |
| `unique()` | Unique by primary key |
| `except($keys)` | Except by primary keys |
| `only($keys)` | Only by primary keys |

## Finding Models

| Method | Returns |
|--------|---------|
| `$users->find(1)` | User or null |
| `$users->find([1, 2])` | Collection |
| `$users->contains(1)` | bool |
| `$users->contains($user)` | bool |

## Loading Relations

| Method | When |
|--------|------|
| `$users->load('posts')` | Load for all |
| `$users->loadMissing('posts')` | Only if not loaded |
| `$users->load(['posts' => fn])` | With constraints |

## Model Keys

| Method | Returns |
|--------|---------|
| `$users->modelKeys()` | `[1, 2, 3]` |
| Used for | IN queries, sync |

## Converting to Query

| Method | Returns |
|--------|---------|
| `$users->toQuery()` | Query builder |
| Allows | Further query operations |

## Collection Mutations

| Method | Purpose |
|--------|---------|
| `$users->fresh()` | Refresh all from DB |
| `$users->fresh('posts')` | Refresh with relation |

## Differencing

| Method | Returns |
|--------|---------|
| `$a->diff($b)` | In A, not in B |
| `$a->intersect($b)` | In both A and B |
| Based on | Primary key |

## Custom Collections

| Method | Location |
|--------|----------|
| `newCollection(array $models)` | On model |
| Returns | Custom collection class |

## Common Patterns

| Pattern | Method |
|---------|--------|
| Get IDs | `pluck('id')` or `modelKeys()` |
| Group by attribute | `groupBy('status')` |
| Key by ID | `keyBy('id')` |
| Unique by column | `unique('email')` |
| Map to array | `map->toArray()` |

## Higher Order Messages

| Syntax | Equivalent |
|--------|------------|
| `$users->map->name` | `$users->map(fn($u) => $u->name)` |
| `$users->filter->active` | Filter where active is truthy |
| `$users->each->save()` | Call save() on each |

## Best Practices

| DO | DON'T |
|----|-------|
| Use `find()` for single | Loop to find |
| Use `loadMissing()` | Double-load relations |
| Use `toQuery()` for SQL ops | Convert to array then query |
| Use `modelKeys()` | `pluck('id')->toArray()` |

→ **Complete examples**: See templates
