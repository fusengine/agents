---
name: ModelRelationships.php
description: Complete model with all relationship types
file-type: php
---

# Model Relationships Template

## User Model (Has Relations)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{
    HasOne,
    HasMany,
    BelongsTo,
    BelongsToMany,
    HasOneThrough,
    HasManyThrough,
    MorphMany,
    MorphToMany
};

class User extends Model
{
    // ========================================
    // ONE-TO-ONE
    // ========================================

    /**
     * Get the user's profile.
     */
    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }

    /**
     * Get the user's latest order.
     */
    public function latestOrder(): HasOne
    {
        return $this->hasOne(Order::class)->latestOfMany();
    }

    /**
     * Get the user's oldest order.
     */
    public function oldestOrder(): HasOne
    {
        return $this->hasOne(Order::class)->oldestOfMany();
    }

    /**
     * Get the user's largest order.
     */
    public function largestOrder(): HasOne
    {
        return $this->hasOne(Order::class)->ofMany('total', 'max');
    }

    // ========================================
    // ONE-TO-MANY
    // ========================================

    /**
     * Get the user's posts.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * Get the user's published posts.
     */
    public function publishedPosts(): HasMany
    {
        return $this->hasMany(Post::class)
            ->whereNotNull('published_at');
    }

    /**
     * Get the user's comments.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // ========================================
    // MANY-TO-MANY
    // ========================================

    /**
     * The roles that belong to the user.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)
            ->withPivot('granted_by', 'expires_at')
            ->withTimestamps()
            ->as('assignment'); // $role->assignment->expires_at
    }

    /**
     * The teams the user belongs to.
     */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class)
            ->using(TeamMember::class) // Custom pivot model
            ->withPivot('role', 'joined_at')
            ->wherePivot('active', true);
    }

    /**
     * The skills of the user with proficiency.
     */
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class)
            ->withPivot('proficiency')
            ->orderByPivot('proficiency', 'desc');
    }

    // ========================================
    // HAS THROUGH
    // ========================================

    /**
     * Get all posts for the user's teams.
     */
    public function teamPosts(): HasManyThrough
    {
        return $this->hasManyThrough(Post::class, Team::class);
    }

    /**
     * Get the user's country (through address).
     */
    public function country(): HasOneThrough
    {
        return $this->hasOneThrough(Country::class, Address::class);
    }

    // Laravel 12 fluent syntax
    public function deployments(): HasManyThrough
    {
        return $this->through('projects')->has('deployments');
    }

    // ========================================
    // POLYMORPHIC
    // ========================================

    /**
     * Get all images for the user.
     */
    public function images(): MorphMany
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    /**
     * Get the user's avatar (single polymorphic).
     */
    public function avatar(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable')
            ->where('type', 'avatar');
    }

    /**
     * Get all tags for the user (polymorphic many-to-many).
     */
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable')
            ->withTimestamps();
    }
}
```

---

## Post Model (Belongs To)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{
    BelongsTo,
    HasMany,
    MorphTo,
    MorphMany,
    MorphToMany
};

class Post extends Model
{
    /**
     * Parent timestamps to touch on update.
     */
    protected $touches = ['author'];

    /**
     * Get the post's author.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get the post's author with default.
     */
    public function authorWithDefault(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id')
            ->withDefault([
                'name' => 'Guest Author',
            ]);
    }

    /**
     * Get the post's category.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the post's comments.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)
            ->orderBy('created_at', 'desc');
    }

    /**
     * Get the post's approved comments.
     */
    public function approvedComments(): HasMany
    {
        return $this->hasMany(Comment::class)
            ->where('approved', true);
    }

    /**
     * Get the post's tags (polymorphic many-to-many).
     */
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    /**
     * Get the post's images (polymorphic one-to-many).
     */
    public function images(): MorphMany
    {
        return $this->morphMany(Image::class, 'imageable');
    }
}
```

---

## Comment Model (Polymorphic)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, MorphTo};

class Comment extends Model
{
    protected $fillable = ['body', 'user_id'];

    /**
     * Get the parent commentable model (Post or Video).
     */
    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the comment author.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

---

## Tag Model (Inverse Polymorphic)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Tag extends Model
{
    /**
     * Get all posts with this tag.
     */
    public function posts(): MorphToMany
    {
        return $this->morphedByMany(Post::class, 'taggable');
    }

    /**
     * Get all videos with this tag.
     */
    public function videos(): MorphToMany
    {
        return $this->morphedByMany(Video::class, 'taggable');
    }

    /**
     * Get all users with this tag.
     */
    public function users(): MorphToMany
    {
        return $this->morphedByMany(User::class, 'taggable');
    }
}
```

---

## Custom Pivot Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class TeamMember extends Pivot
{
    /**
     * Indicates if the IDs are auto-incrementing.
     */
    public $incrementing = true;

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'joined_at' => 'datetime',
        'is_admin' => 'boolean',
    ];

    /**
     * Get the user that is the team member.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the team.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
```

---

## Morph Map Configuration

```php
<?php
// app/Providers/AppServiceProvider.php

use Illuminate\Database\Eloquent\Relations\Relation;

public function boot(): void
{
    Relation::enforceMorphMap([
        'post' => \App\Models\Post::class,
        'video' => \App\Models\Video::class,
        'user' => \App\Models\User::class,
        'comment' => \App\Models\Comment::class,
    ]);
}
```
