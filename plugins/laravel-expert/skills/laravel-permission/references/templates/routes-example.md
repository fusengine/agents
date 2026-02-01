---
name: routes-example
description: Complete routes with permission middleware
keywords: routes, middleware, permission, role
---

# Routes with Permissions

## File: routes/web.php

```php
<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ArticleController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', fn () => view('welcome'));

// Authenticated routes
Route::middleware(['auth'])->group(function () {
    // Dashboard - any authenticated user
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Articles - permission-based
    Route::prefix('articles')->group(function () {
        Route::get('/', [ArticleController::class, 'index'])
            ->middleware('permission:view articles')
            ->name('articles.index');

        Route::get('/create', [ArticleController::class, 'create'])
            ->middleware('permission:create articles')
            ->name('articles.create');

        Route::post('/', [ArticleController::class, 'store'])
            ->middleware('permission:create articles')
            ->name('articles.store');

        Route::get('/{article}/edit', [ArticleController::class, 'edit'])
            ->middleware('permission:edit articles')
            ->name('articles.edit');

        Route::put('/{article}', [ArticleController::class, 'update'])
            ->middleware('permission:edit articles')
            ->name('articles.update');

        Route::delete('/{article}', [ArticleController::class, 'destroy'])
            ->middleware('permission:delete articles')
            ->name('articles.destroy');

        Route::post('/{article}/publish', [ArticleController::class, 'publish'])
            ->middleware('permission:publish articles')
            ->name('articles.publish');
    });

    // Admin routes - role-based
    Route::prefix('admin')
        ->middleware('role:admin')
        ->group(function () {
            Route::get('/users', [UserController::class, 'index'])
                ->name('admin.users.index');

            Route::get('/settings', [SettingsController::class, 'index'])
                ->name('admin.settings.index');
        });
});
```

## Resource Routes Alternative

```php
Route::middleware(['auth', 'permission:manage articles'])->group(function () {
    Route::resource('articles', ArticleController::class);
});
```
