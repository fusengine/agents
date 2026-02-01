---
name: routing-examples
description: Detailed routing code examples for Laravel API
keywords: routing, examples, api, versioning, groups
---

# Routing Examples

## Basic API Routes

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\PostController;

// Simple routes
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);
Route::post('/posts', [PostController::class, 'store']);
Route::put('/posts/{post}', [PostController::class, 'update']);
Route::delete('/posts/{post}', [PostController::class, 'destroy']);
```

## Resource Routes

```php
// Full API resource (index, store, show, update, destroy)
Route::apiResource('posts', PostController::class);

// Multiple resources
Route::apiResources([
    'posts' => PostController::class,
    'comments' => CommentController::class,
]);

// Partial resource
Route::apiResource('posts', PostController::class)
    ->only(['index', 'show']);

Route::apiResource('posts', PostController::class)
    ->except(['destroy']);
```

## Versioned API Structure

```php
<?php
// routes/api.php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API V1 Routes
|--------------------------------------------------------------------------
*/
Route::prefix('v1')->name('v1.')->group(function () {
    // Public routes
    Route::get('posts', [V1\PostController::class, 'index']);
    Route::get('posts/{post}', [V1\PostController::class, 'show']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('posts', V1\PostController::class)
            ->except(['index', 'show']);
        Route::apiResource('users', V1\UserController::class);
    });
});

/*
|--------------------------------------------------------------------------
| API V2 Routes
|--------------------------------------------------------------------------
*/
Route::prefix('v2')->name('v2.')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('posts', V2\PostController::class);
    });
});
```

## Route Parameters

```php
// Required parameter
Route::get('/posts/{post}', [PostController::class, 'show']);

// Optional parameter
Route::get('/posts/{post?}', [PostController::class, 'show']);

// Multiple parameters
Route::get('/users/{user}/posts/{post}', [PostController::class, 'show']);

// Constraints
Route::get('/posts/{post}', [PostController::class, 'show'])
    ->where('post', '[0-9]+');

Route::get('/posts/{post}', [PostController::class, 'show'])
    ->whereNumber('post');

Route::get('/categories/{category}', [CategoryController::class, 'show'])
    ->whereAlpha('category');
```

## Model Binding

```php
// Implicit binding (uses 'id' by default)
Route::get('/posts/{post}', [PostController::class, 'show']);
// Controller receives Post $post

// Custom key
Route::get('/posts/{post:slug}', [PostController::class, 'show']);
// Finds by slug column

// Scoped binding (post must belong to user)
Route::get('/users/{user}/posts/{post}', [PostController::class, 'show'])
    ->scopeBindings();

// Soft deleted models
Route::get('/posts/{post}', [PostController::class, 'show'])
    ->withTrashed();
```

## Middleware Groups

```php
// Single middleware
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('posts', PostController::class);
});

// Multiple middleware
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::apiResource('posts', PostController::class);
});

// Middleware with parameters
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::apiResource('posts', PostController::class);
});

// Role/permission middleware (with Spatie)
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('users', UserController::class);
});
```

## Named Routes

```php
// Named route
Route::get('/posts', [PostController::class, 'index'])->name('posts.index');

// Name prefix in group
Route::name('api.')->group(function () {
    Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
    // Full name: api.posts.index
});

// Generate URL
$url = route('posts.index');
$url = route('posts.show', ['post' => 1]);
```

## Nested Resources

```php
// Nested resource
Route::apiResource('posts.comments', CommentController::class);
// Creates: /posts/{post}/comments, /posts/{post}/comments/{comment}

// Shallow nesting (only nest store)
Route::apiResource('posts.comments', CommentController::class)->shallow();
// Nested: /posts/{post}/comments (index, store)
// Not nested: /comments/{comment} (show, update, destroy)
```

## Singleton Resources

```php
// Singleton (no ID in URL)
Route::singleton('profile', ProfileController::class);
// /profile (GET show, PUT update)

// API singleton
Route::apiSingleton('profile', ProfileController::class);
```

## Rate Limiting

```php
// In AppServiceProvider boot()
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

RateLimiter::for('uploads', function (Request $request) {
    return Limit::perMinute(10)->by($request->user()->id);
});

// Apply to routes
Route::middleware('throttle:api')->group(function () {
    Route::apiResource('posts', PostController::class);
});

Route::post('/upload', [UploadController::class, 'store'])
    ->middleware('throttle:uploads');
```

## Fallback Routes

```php
// API 404 fallback
Route::fallback(function () {
    return response()->json([
        'message' => 'Not Found',
    ], 404);
});
```
