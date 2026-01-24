---
name: laravel-eloquent
description: Master Eloquent ORM with relationships, scopes, casts, observers, and query optimization. Use when creating models, defining relationships, writing queries, or optimizing database access.
user-invocable: false
---

# Laravel Eloquent ORM

## Documentation

### Eloquent Core
- [eloquent.md](docs/eloquent.md) - Eloquent ORM basics
- [eloquent-relationships.md](docs/eloquent-relationships.md) - Relationships
- [eloquent-collections.md](docs/eloquent-collections.md) - Eloquent collections
- [eloquent-mutators.md](docs/eloquent-mutators.md) - Accessors, mutators & casting
- [eloquent-serialization.md](docs/eloquent-serialization.md) - Serialization
- [eloquent-factories.md](docs/eloquent-factories.md) - Model factories
- [eloquent-resources.md](docs/eloquent-resources.md) - API Resources

### Collections & Search
- [collections.md](docs/collections.md) - Laravel collections
- [scout.md](docs/scout.md) - Full-text search

## Model Template

```php
<?php

declare(strict_types=1);

namespace App\Models;

final class Post extends Model
{
    protected $fillable = ['title', 'slug', 'content', 'user_id'];

    protected function casts(): array
    {
        return [
            'status' => PostStatus::class,
            'published_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', PostStatus::Published);
    }
}
```

## Query Optimization

```php
// Eager loading (prevent N+1)
$posts = Post::with(['user', 'comments.user'])->get();

// Chunking for large datasets
User::chunk(100, function ($users) {
    foreach ($users as $user) { }
});
```
