---
name: relationships-polymorphic
description: Polymorphic relationships - MorphTo, MorphMany, MorphToMany
when-to-use: Comments on posts/videos, tags on multiple models
keywords: morphTo, morphMany, morphOne, morphToMany, morphedByMany, polymorphic
---

# Polymorphic Relationships

## Decision Tree

```
What polymorphic type?
├── One parent, one child per type → morphOne / morphTo
├── One parent, many children → morphMany / morphTo
├── Many-to-many polymorphic → morphToMany / morphedByMany
└── Custom morph map? → Relation::enforceMorphMap()
```

## Polymorphic Types

| Type | Example | Relationship |
|------|---------|--------------|
| **One-to-One** | Image on User or Post | `morphOne` / `morphTo` |
| **One-to-Many** | Comments on Posts, Videos | `morphMany` / `morphTo` |
| **Many-to-Many** | Tags on Posts, Videos | `morphToMany` / `morphedByMany` |

## Database Structure

| Table | Columns |
|-------|---------|
| `comments` | `id, body, commentable_id, commentable_type` |
| `images` | `id, url, imageable_id, imageable_type` |
| `taggables` | `tag_id, taggable_id, taggable_type` |

## One-to-One Polymorphic

| On Parent (Post, User) | On Child (Image) |
|------------------------|------------------|
| `morphOne(Image::class, 'imageable')` | `morphTo()` |

## One-to-Many Polymorphic

| On Parent (Post, Video) | On Child (Comment) |
|-------------------------|-------------------|
| `morphMany(Comment::class, 'commentable')` | `morphTo()` |

## Many-to-Many Polymorphic

| On Taggable (Post, Video) | On Tag (inverse) |
|---------------------------|------------------|
| `morphToMany(Tag::class, 'taggable')` | `morphedByMany(Post::class, 'taggable')` |

## MorphTo Retrieval

| Method | Purpose |
|--------|---------|
| `$comment->commentable` | Get parent (Post or Video) |
| `$comment->commentable_type` | Get parent class |
| `$comment->commentable_id` | Get parent ID |

## Custom Morph Map

| Benefit | Implementation |
|---------|---------------|
| Shorter type names | `Relation::enforceMorphMap([...])` |
| Decoupled from class names | In `AppServiceProvider::boot()` |
| Refactoring safe | Type stored as alias, not FQCN |

## Morph Map Configuration

| Method | Purpose |
|--------|---------|
| `Relation::enforceMorphMap([...])` | Require all types mapped |
| `Relation::morphMap([...])` | Optional mapping |
| `Relation::getMorphedModel($alias)` | Get class from alias |

## Constrained Eager Loading

| Method | Purpose |
|--------|---------|
| `with('commentable')` | Load all types |
| `MorphTo::constrain([...])` | Type-specific constraints |

## Creating Polymorphic

| Method | Purpose |
|--------|---------|
| `$post->comments()->create([...])` | Create with auto-type |
| `$comment->commentable()->associate($post)` | Associate parent |

## Querying Polymorphic

| Method | Purpose |
|--------|---------|
| `whereHasMorph('commentable', [Post::class], fn)` | Filter by type |
| `whereHasMorph('commentable', '*', fn)` | All types |
| `whereMorphedTo('commentable', $post)` | Specific parent |

## Polymorphic Pivot

| Method | Purpose |
|--------|---------|
| `withPivot('created_by')` | Include pivot data |
| `using(Taggable::class)` | Custom pivot model (extends MorphPivot) |

→ **Complete examples**: See [ModelRelationships.php.md](templates/ModelRelationships.php.md)
