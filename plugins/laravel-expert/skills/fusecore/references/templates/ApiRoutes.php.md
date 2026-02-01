---
name: ApiRoutes
description: API routes file for FuseCore module
keywords: routes, api, endpoint, middleware
---

# API Routes Template

API routes file for FuseCore module.

## File: FuseCore/{Module}/Routes/api.php

```php
<?php

declare(strict_types=1);

use FuseCore\Blog\App\Http\Controllers\CategoryController;
use FuseCore\Blog\App\Http\Controllers\PostController;
use FuseCore\Blog\App\Http\Controllers\StatisticsController;
use FuseCore\Blog\App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Blog Module API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('blog')->group(function () {
    Route::get('posts', [PostController::class, 'index']);
    Route::get('posts/{post}', [PostController::class, 'show']);
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('tags', [TagController::class, 'index']);
});

// Protected routes
Route::prefix('blog')->middleware(['auth:sanctum'])->group(function () {
    // Posts CRUD
    Route::post('posts', [PostController::class, 'store']);
    Route::put('posts/{post}', [PostController::class, 'update']);
    Route::delete('posts/{post}', [PostController::class, 'destroy']);

    // Post actions
    Route::post('posts/{post}/publish', [PostController::class, 'publish']);
    Route::post('posts/{post}/unpublish', [PostController::class, 'unpublish']);

    // Statistics
    Route::get('statistics', StatisticsController::class);
});

// Admin routes
Route::prefix('blog/admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('categories', CategoryController::class)->except(['index']);
    Route::apiResource('tags', TagController::class)->except(['index']);
});
```

## Minimal Routes

```php
<?php

declare(strict_types=1);

use FuseCore\Blog\App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('blog/posts', PostController::class);
});
```

## Routes with Named Routes

```php
<?php

declare(strict_types=1);

use FuseCore\Blog\App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::prefix('blog')->name('blog.')->group(function () {
    Route::apiResource('posts', PostController::class)->names([
        'index' => 'posts.index',
        'store' => 'posts.store',
        'show' => 'posts.show',
        'update' => 'posts.update',
        'destroy' => 'posts.destroy',
    ]);
});
```

## Nested Resource Routes

```php
<?php

declare(strict_types=1);

use FuseCore\Blog\App\Http\Controllers\CommentController;
use FuseCore\Blog\App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::prefix('blog')->middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('posts', PostController::class);

    // Nested comments under posts
    Route::apiResource('posts.comments', CommentController::class)
        ->shallow();
});
```

## Routes with Rate Limiting

```php
<?php

declare(strict_types=1);

use FuseCore\Blog\App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::prefix('blog')->group(function () {
    // Public with rate limiting
    Route::middleware(['throttle:60,1'])->group(function () {
        Route::get('posts', [PostController::class, 'index']);
        Route::get('posts/{post}', [PostController::class, 'show']);
    });

    // Authenticated with higher limit
    Route::middleware(['auth:sanctum', 'throttle:120,1'])->group(function () {
        Route::post('posts', [PostController::class, 'store']);
        Route::put('posts/{post}', [PostController::class, 'update']);
        Route::delete('posts/{post}', [PostController::class, 'destroy']);
    });
});
```
