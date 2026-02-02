---
name: EagerLoadingExamples.php
description: Complete eager loading patterns and N+1 prevention
file-type: php
---

# Eager Loading Examples

## Basic Eager Loading

```php
<?php

use App\Models\Post;
use App\Models\User;

// Single relationship
$posts = Post::with('author')->get();

// Multiple relationships
$posts = Post::with(['author', 'category', 'tags'])->get();

// Nested relationships
$posts = Post::with('author.profile')->get();
$posts = Post::with(['author.profile', 'comments.user'])->get();

// Deep nesting
$posts = Post::with('author.posts.comments.user')->get();
```

---

## Selective Column Loading

```php
<?php

// Select specific columns (always include foreign keys!)
$posts = Post::with('author:id,name,avatar')->get();

// Multiple with columns
$posts = Post::with([
    'author:id,name,email',
    'category:id,name,slug',
])->get();

// Nested with columns
$posts = Post::with('comments:id,post_id,body,user_id', 'comments.user:id,name')->get();
```

---

## Constrained Eager Loading

```php
<?php

// Filter related models
$users = User::with(['posts' => function ($query) {
    $query->where('status', 'published');
}])->get();

// Order related models
$users = User::with(['posts' => function ($query) {
    $query->orderBy('created_at', 'desc');
}])->get();

// Limit related models
$users = User::with(['posts' => function ($query) {
    $query->latest()->limit(5);
}])->get();

// Combined constraints
$users = User::with(['posts' => function ($query) {
    $query->where('status', 'published')
          ->where('created_at', '>', now()->subMonth())
          ->orderBy('views', 'desc')
          ->limit(3);
}])->get();

// Laravel 11+ arrow function syntax
$users = User::with([
    'posts' => fn ($q) => $q->published()->latest()->limit(5),
])->get();
```

---

## Lazy Eager Loading

```php
<?php

// Load after initial query
$posts = Post::all();

// Later, when needed
$posts->load('author');
$posts->load(['author', 'comments']);

// With constraints
$posts->load(['comments' => function ($query) {
    $query->where('approved', true);
}]);

// Only if not already loaded
$posts->loadMissing('author');
$posts->loadMissing(['author', 'comments']);
```

---

## Default Eager Loading

```php
<?php

namespace App\Models;

class Post extends Model
{
    /**
     * Always eager load these relationships.
     */
    protected $with = ['author', 'category'];

    /**
     * Always include these counts.
     */
    protected $withCount = ['comments', 'likes'];
}

// Override defaults
$posts = Post::without('author')->get();
$posts = Post::withOnly('category')->get(); // Replaces all defaults
```

---

## Counting Relationships

```php
<?php

// Single count
$posts = Post::withCount('comments')->get();
// Access: $post->comments_count

// Multiple counts
$posts = Post::withCount(['comments', 'likes'])->get();

// Conditional count
$posts = Post::withCount([
    'comments',
    'comments as approved_comments_count' => function ($query) {
        $query->where('approved', true);
    },
])->get();

// Load count later
$posts = Post::all();
$posts->loadCount('comments');
```

---

## Aggregate Loading

```php
<?php

// Sum
$orders = Order::withSum('items', 'price')->get();
// Access: $order->items_sum_price

// Average
$products = Product::withAvg('reviews', 'rating')->get();
// Access: $product->reviews_avg_rating

// Min/Max
$categories = Category::withMin('products', 'price')
    ->withMax('products', 'price')
    ->get();

// Exists check
$users = User::withExists('posts')->get();
// Access: $user->posts_exists (boolean)

// Multiple aggregates
$users = User::query()
    ->withCount('posts')
    ->withSum('orders', 'total')
    ->withAvg('reviews', 'rating')
    ->get();
```

---

## Polymorphic Eager Loading

```php
<?php

// Standard polymorphic
$comments = Comment::with('commentable')->get();

// Type-specific constraints
use Illuminate\Database\Eloquent\Relations\MorphTo;

$activities = Activity::with(['subject' => function (MorphTo $morphTo) {
    $morphTo->morphWith([
        Post::class => ['author', 'tags'],
        Video::class => ['channel'],
        Photo::class => ['album'],
    ]);
}])->get();

// Load morph after query
$activities = Activity::all();
$activities->loadMorph('subject', [
    Post::class => ['author'],
    Video::class => ['channel'],
]);
```

---

## Preventing N+1 Queries

```php
<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Development only - throws exception
        Model::preventLazyLoading(!app()->isProduction());

        // Or custom handling
        Model::handleLazyLoadingViolationUsing(function ($model, $relation) {
            $class = get_class($model);

            logger()->warning("N+1 Query detected: {$class}::{$relation}");

            // Or report to monitoring service
            // Sentry::captureMessage("N+1: {$class}::{$relation}");
        });
    }
}
```

---

## Querying Relationship Existence

```php
<?php

// Has any posts
$users = User::has('posts')->get();

// Has at least N posts
$users = User::has('posts', '>=', 5)->get();

// Has posts with conditions
$users = User::whereHas('posts', function ($query) {
    $query->where('status', 'published');
})->get();

// Doesn't have posts
$users = User::doesntHave('posts')->get();

// Doesn't have with conditions
$users = User::whereDoesntHave('posts', function ($query) {
    $query->where('status', 'draft');
})->get();

// Nested relationship existence
$users = User::whereHas('posts.comments', function ($query) {
    $query->where('approved', true);
})->get();

// Or conditions
$users = User::has('posts')
    ->orHas('comments')
    ->get();

// Polymorphic existence
$comments = Comment::whereHasMorph(
    'commentable',
    [Post::class, Video::class],
    function ($query, $type) {
        $query->where('status', 'published');
    }
)->get();
```

---

## Controller Best Practices

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;

class PostController extends Controller
{
    public function index()
    {
        // ✅ Good: Eager load everything needed
        $posts = Post::query()
            ->with([
                'author:id,name,avatar',
                'category:id,name,slug',
                'tags:id,name',
            ])
            ->withCount('comments')
            ->published()
            ->latest()
            ->paginate(15);

        return view('posts.index', compact('posts'));
    }

    public function show(Post $post)
    {
        // ✅ Good: Load specific relations for detail view
        $post->load([
            'author.profile',
            'category',
            'tags',
            'comments' => fn ($q) => $q->approved()->latest()->with('user:id,name,avatar'),
        ]);

        $post->loadCount(['comments', 'likes']);

        return view('posts.show', compact('post'));
    }
}
```

---

## Performance Comparison

```php
<?php

// ❌ BAD: N+1 Problem (101 queries for 100 posts)
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name; // Query per post!
}

// ✅ GOOD: Eager Loading (2 queries total)
$posts = Post::with('author')->get();
foreach ($posts as $post) {
    echo $post->author->name; // No additional query
}

// ❌ BAD: Loading full model for existence check
if (User::where('email', $email)->first()) { /* 1 query + hydration */ }

// ✅ GOOD: Use exists()
if (User::where('email', $email)->exists()) { /* 1 simple query */ }

// ❌ BAD: Loading full models for count
$count = User::where('active', true)->get()->count(); // Loads all users!

// ✅ GOOD: Use count()
$count = User::where('active', true)->count(); // Just COUNT query
```
