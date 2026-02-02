---
name: ModelBasic.php
description: Complete Eloquent model with all configurations
file-type: php
---

# Basic Model Template

## Standard Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Prunable;

class Post extends Model
{
    use HasFactory, SoftDeletes, Prunable;

    /**
     * The table associated with the model.
     */
    protected $table = 'posts';

    /**
     * The primary key for the model.
     */
    protected $primaryKey = 'id';

    /**
     * Indicates if the model's ID is auto-incrementing.
     */
    public $incrementing = true;

    /**
     * The data type of the primary key.
     */
    protected $keyType = 'int';

    /**
     * Indicates if the model should be timestamped.
     */
    public $timestamps = true;

    /**
     * The storage format of the model's date columns.
     */
    protected $dateFormat = 'Y-m-d H:i:s';

    /**
     * The database connection for the model.
     */
    protected $connection = 'mysql';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'status',
        'published_at',
        'author_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'internal_notes',
    ];

    /**
     * The attributes that should be visible in serialization.
     */
    // protected $visible = ['id', 'title', 'content'];

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = [
        'reading_time',
        'is_published',
    ];

    /**
     * The model's default values for attributes.
     */
    protected $attributes = [
        'status' => 'draft',
        'views' => 0,
    ];

    /**
     * The relationships that should always be loaded.
     */
    protected $with = ['author'];

    /**
     * The relationship counts that should always be loaded.
     */
    protected $withCount = ['comments'];

    /**
     * The relationships that should be touched on save.
     */
    protected $touches = ['author'];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'is_featured' => 'boolean',
            'metadata' => 'array',
            'views' => 'integer',
            'status' => PostStatus::class, // Enum cast
        ];
    }

    /**
     * Get the prunable model query.
     */
    public function prunable(): Builder
    {
        return static::where('deleted_at', '<=', now()->subMonth());
    }

    /**
     * Prepare the model for pruning.
     */
    protected function pruning(): void
    {
        // Clean up related data before pruning
        $this->comments()->delete();
    }
}
```

---

## Model with UUID

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasUuids;

    /**
     * Get the columns that should receive a unique identifier.
     */
    public function uniqueIds(): array
    {
        return ['id', 'public_id'];
    }

    /**
     * Generate a new UUID for the model.
     */
    public function newUniqueId(): string
    {
        return (string) Str::uuid();
    }
}
```

---

## Model with ULID

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasUlids;

    // ULIDs are sortable by creation time
}
```

---

## Model with Scopes

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /**
     * Boot the model.
     */
    protected static function booted(): void
    {
        // Global scope - always applied
        static::addGlobalScope('published', function (Builder $builder) {
            $builder->whereNotNull('published_at');
        });
    }

    /**
     * Scope: Published posts (Laravel 12 attribute syntax)
     */
    #[Scope]
    protected function published(Builder $query): void
    {
        $query->whereNotNull('published_at')
              ->where('published_at', '<=', now());
    }

    /**
     * Scope: Draft posts
     */
    #[Scope]
    protected function draft(Builder $query): void
    {
        $query->whereNull('published_at');
    }

    /**
     * Scope: Popular posts (by views)
     */
    #[Scope]
    protected function popular(Builder $query, int $minViews = 100): void
    {
        $query->where('views', '>=', $minViews);
    }

    /**
     * Scope: By status (dynamic)
     */
    #[Scope]
    protected function ofStatus(Builder $query, string $status): void
    {
        $query->where('status', $status);
    }

    /**
     * Scope: By author
     */
    #[Scope]
    protected function byAuthor(Builder $query, int $authorId): void
    {
        $query->where('author_id', $authorId);
    }

    /**
     * Scope: Recent (last N days)
     */
    #[Scope]
    protected function recent(Builder $query, int $days = 7): void
    {
        $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Scope: Featured
     */
    #[Scope]
    protected function featured(Builder $query): void
    {
        $query->where('is_featured', true);
    }
}

// Usage:
// Post::published()->popular(500)->get();
// Post::draft()->byAuthor($userId)->get();
// Post::ofStatus('review')->recent(30)->get();
// Post::withoutGlobalScope('published')->get(); // Include unpublished
```

---

## Global Scope Class

```php
<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class ActiveScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        $builder->where('active', true);
    }
}

// In Model:
// protected static function booted(): void
// {
//     static::addGlobalScope(new ActiveScope);
// }
```
