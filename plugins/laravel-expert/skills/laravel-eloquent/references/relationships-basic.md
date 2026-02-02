---
name: relationships-basic
description: Basic Eloquent relationships - HasOne, HasMany, BelongsTo
when-to-use: One-to-One, One-to-Many relationships
keywords: hasOne, hasMany, belongsTo, foreign key, inverse
---

# Basic Relationships

## Decision Tree

```
What type of relationship?
├── One record owns one record → HasOne / BelongsTo
├── One record owns many records → HasMany / BelongsTo
├── Many records own many records → See relationships-many-to-many.md
└── Polymorphic → See relationships-polymorphic.md
```

## Relationship Types

| Relationship | Foreign Key On | Example |
|--------------|----------------|---------|
| `hasOne` | Related table | User has one Phone |
| `belongsTo` | Current table | Phone belongs to User |
| `hasMany` | Related table | Post has many Comments |

## Method Signatures

| Method | Parameters |
|--------|------------|
| `hasOne($related, $foreignKey, $localKey)` | Related model, FK, local PK |
| `belongsTo($related, $foreignKey, $ownerKey)` | Related model, FK, owner PK |
| `hasMany($related, $foreignKey, $localKey)` | Related model, FK, local PK |

## Convention vs Custom Keys

| Convention | Custom |
|------------|--------|
| `user_id` on phones | `hasOne(Phone::class, 'owner_id')` |
| `id` as local key | `hasOne(Phone::class, 'user_id', 'uuid')` |

## Inverse Relationships

| Forward | Inverse |
|---------|---------|
| `User::hasOne(Phone)` | `Phone::belongsTo(User)` |
| `User::hasMany(Post)` | `Post::belongsTo(User)` |

## Default Models

| Method | Purpose |
|--------|---------|
| `withDefault()` | Return empty model if null |
| `withDefault([...])` | Return model with defaults |

## Querying Relationships

| Method | Purpose |
|--------|---------|
| `$user->posts` | Get related (lazy load) |
| `$user->posts()` | Get query builder |
| `$user->posts()->where()` | Add constraints |

## Creating Related Models

| Method | Purpose |
|--------|---------|
| `$user->posts()->create([...])` | Create and associate |
| `$user->posts()->save($post)` | Save existing model |
| `$user->posts()->saveMany([...])` | Save multiple |
| `$post->user()->associate($user)` | Set belongsTo |
| `$post->user()->dissociate()` | Remove belongsTo |

## Existence Queries

| Method | SQL |
|--------|-----|
| `has('posts')` | WHERE EXISTS |
| `has('posts', '>=', 5)` | WHERE count >= 5 |
| `doesntHave('posts')` | WHERE NOT EXISTS |
| `whereHas('posts', fn)` | WHERE EXISTS with constraints |
| `whereDoesntHave('posts', fn)` | WHERE NOT EXISTS with constraints |

## Counting

| Method | Result |
|--------|--------|
| `withCount('posts')` | Adds `posts_count` |
| `withCount(['posts', 'comments'])` | Multiple counts |
| `withCount(['posts' => fn])` | Conditional count |

→ **Complete examples**: See [ModelRelationships.php.md](templates/ModelRelationships.php.md)
