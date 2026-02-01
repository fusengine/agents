---
name: ApiPermissionSetup
description: Complete API setup with Sanctum and Spatie Permission
keywords: api, sanctum, guard, token, permission
---

# API Permission Setup

Complete setup for API authentication with Spatie Permission.

## File: config/permission.php (Guard Configuration)

```php
<?php

return [
    'models' => [
        'permission' => App\Models\Permission::class,
        'role' => App\Models\Role::class,
    ],

    // Default guard for web
    'defaults' => [
        'guard_name' => 'web',
    ],

    // Teams disabled for API simplicity
    'teams' => false,

    // Cache configuration
    'cache' => [
        'expiration_time' => \DateInterval::createFromDateString('24 hours'),
        'key' => 'spatie.permission.cache',
        'store' => 'default',
    ],
];
```

## File: database/seeders/ApiPermissionSeeder.php

```php
<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Seed API roles and permissions.
 */
final class ApiPermissionSeeder extends Seeder
{
    /**
     * API permissions by category.
     */
    private array $permissions = [
        'users' => [
            'api:users:list',
            'api:users:view',
            'api:users:create',
            'api:users:update',
            'api:users:delete',
        ],
        'posts' => [
            'api:posts:list',
            'api:posts:view',
            'api:posts:create',
            'api:posts:update',
            'api:posts:delete',
            'api:posts:publish',
        ],
        'settings' => [
            'api:settings:view',
            'api:settings:update',
        ],
    ];

    /**
     * API roles and their permissions.
     */
    private array $roles = [
        'api-admin' => '*',
        'api-editor' => [
            'api:posts:list',
            'api:posts:view',
            'api:posts:create',
            'api:posts:update',
            'api:posts:publish',
        ],
        'api-viewer' => [
            'api:users:list',
            'api:users:view',
            'api:posts:list',
            'api:posts:view',
        ],
    ];

    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Create permissions for API guard
        foreach ($this->permissions as $category => $permissions) {
            foreach ($permissions as $permission) {
                Permission::firstOrCreate([
                    'name' => $permission,
                    'guard_name' => 'api',
                ]);
            }
        }

        // Create roles for API guard
        foreach ($this->roles as $roleName => $permissions) {
            $role = Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => 'api',
            ]);

            if ($permissions === '*') {
                $role->syncPermissions(Permission::where('guard_name', 'api')->get());
            } else {
                $role->syncPermissions($permissions);
            }
        }
    }
}
```

## File: routes/api.php

```php
<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Users (with API guard permissions)
    Route::middleware('permission:api:users:list,api')->get('/users', [UserController::class, 'index']);
    Route::middleware('permission:api:users:view,api')->get('/users/{user}', [UserController::class, 'show']);
    Route::middleware('permission:api:users:create,api')->post('/users', [UserController::class, 'store']);
    Route::middleware('permission:api:users:update,api')->put('/users/{user}', [UserController::class, 'update']);
    Route::middleware('permission:api:users:delete,api')->delete('/users/{user}', [UserController::class, 'destroy']);

    // Posts (with API guard permissions)
    Route::middleware('permission:api:posts:list,api')->get('/posts', [PostController::class, 'index']);
    Route::middleware('permission:api:posts:view,api')->get('/posts/{post}', [PostController::class, 'show']);
    Route::middleware('permission:api:posts:create,api')->post('/posts', [PostController::class, 'store']);
    Route::middleware('permission:api:posts:update,api')->put('/posts/{post}', [PostController::class, 'update']);
    Route::middleware('permission:api:posts:delete,api')->delete('/posts/{post}', [PostController::class, 'destroy']);
    Route::middleware('permission:api:posts:publish,api')->post('/posts/{post}/publish', [PostController::class, 'publish']);

    // Admin only
    Route::middleware('role:api-admin,api')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/settings', [SettingsController::class, 'index']);
        Route::put('/settings', [SettingsController::class, 'update']);
    });
});
```

## File: app/Http/Controllers/Api/AuthController.php

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * API Authentication controller.
 */
final class AuthController extends Controller
{
    /**
     * Login and return token with permissions.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'device_name' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken($request->device_name)->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ]);
    }

    /**
     * Get current user with permissions.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'can' => [
                'manage_users' => $user->can('api:users:create'),
                'publish_posts' => $user->can('api:posts:publish'),
                'access_admin' => $user->hasRole('api-admin'),
            ],
        ]);
    }

    /**
     * Logout and revoke token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
```
