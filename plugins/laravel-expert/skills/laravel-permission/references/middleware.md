---
name: middleware
description: Spatie Permission middleware for route protection
when-to-use: Protecting routes with role/permission checks
keywords: middleware, route, protection, role, permission
priority: high
related: spatie-permission.md
---

# Permission Middleware

## Available Middleware

| Middleware | Usage |
|------------|-------|
| `role:admin` | User must have role |
| `permission:edit articles` | User must have permission |
| `role_or_permission:admin\|edit` | Either role or permission |

## Route Examples

```php
// Single role
Route::middleware(['role:admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index']);
});

// Single permission
Route::middleware(['permission:publish articles'])->group(function () {
    Route::post('/publish', [ArticleController::class, 'publish']);
});

// Multiple roles (OR)
Route::middleware(['role:admin|writer'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});

// Role OR permission
Route::middleware(['role_or_permission:admin|edit articles'])->group(function () {
    Route::get('/editor', [EditorController::class, 'index']);
});
```

## Controller Middleware

```php
class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:admin');
    }
}
```

## Multiple Guards

```php
Route::middleware(['role:admin,api'])->group(function () {
    // Routes for admin role using api guard
});
```
