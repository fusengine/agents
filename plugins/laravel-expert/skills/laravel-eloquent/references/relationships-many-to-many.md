---
name: relationships-many-to-many
description: Many-to-Many relationships with pivot tables
when-to-use: Users-Roles, Posts-Tags, any M:N relationship
keywords: belongsToMany, pivot, attach, detach, sync, toggle
---

# Many-to-Many Relationships

## Decision Tree

```
Many-to-Many relationship?
├── Simple pivot (just IDs) → belongsToMany
├── Pivot with extra data → withPivot()
├── Pivot with timestamps → withTimestamps()
├── Custom pivot model → using(RoleUser::class)
└── Pivot as model → Pivot or MorphPivot class
```

## Pivot Table Convention

| Tables | Pivot Table | Convention |
|--------|-------------|------------|
| users, roles | role_user | Alphabetical, singular |
| posts, tags | post_tag | Alphabetical, singular |

## Method Signature

```
belongsToMany(
    $related,           // Related model
    $table,             // Pivot table name
    $foreignPivotKey,   // This model's FK
    $relatedPivotKey,   // Related model's FK
    $parentKey,         // This model's PK
    $relatedKey         // Related model's PK
)
```

## Pivot Configuration

| Method | Purpose |
|--------|---------|
| `withPivot('active', 'created_by')` | Include pivot columns |
| `withTimestamps()` | Include created_at/updated_at |
| `as('subscription')` | Rename pivot accessor |
| `using(Membership::class)` | Custom pivot model |

## Accessing Pivot Data

| Access | Returns |
|--------|---------|
| `$user->roles` | Collection of Role |
| `$role->pivot->active` | Pivot attribute |
| `$role->subscription->expires_at` | With `as()` alias |

## Modifying Relationships

| Method | Purpose |
|--------|---------|
| `attach($id)` | Add single |
| `attach([1, 2, 3])` | Add multiple |
| `attach([1 => ['active' => true]])` | Add with pivot data |
| `detach($id)` | Remove single |
| `detach([1, 2])` | Remove multiple |
| `detach()` | Remove all |

## Syncing

| Method | Behavior |
|--------|----------|
| `sync([1, 2, 3])` | Replace all with these IDs |
| `sync([1 => ['active' => true]])` | Replace with pivot data |
| `syncWithoutDetaching([1, 2])` | Add only, don't remove |
| `syncWithPivotValues([1, 2], ['active' => true])` | Sync with same pivot data |

## Toggle

| Method | Behavior |
|--------|----------|
| `toggle([1, 2, 3])` | Attach if missing, detach if exists |
| `toggle([1 => ['active' => true]])` | Toggle with pivot data |

## Updating Pivot

| Method | Purpose |
|--------|---------|
| `updateExistingPivot($id, ['active' => false])` | Update specific pivot |

## Filtering by Pivot

| Method | Purpose |
|--------|---------|
| `wherePivot('active', true)` | Filter by pivot column |
| `wherePivotIn('priority', [1, 2])` | Filter by IN |
| `wherePivotNotIn('priority', [3])` | Filter by NOT IN |
| `wherePivotBetween('created_at', [...])` | Filter by BETWEEN |
| `wherePivotNull('approved_at')` | Filter by NULL |
| `wherePivotNotNull('approved_at')` | Filter by NOT NULL |
| `orderByPivot('created_at', 'desc')` | Order by pivot |

## Custom Pivot Models

| Base Class | Use For |
|------------|---------|
| `Pivot` | Regular many-to-many |
| `MorphPivot` | Polymorphic many-to-many |

→ **Complete examples**: See [ModelRelationships.php.md](templates/ModelRelationships.php.md)
