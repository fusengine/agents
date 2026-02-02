---
name: sanctum-setup
description: Complete Laravel Sanctum setup for API tokens and SPA authentication
keywords: sanctum, api, token, spa, authentication, abilities, mobile
source: https://laravel.com/docs/12.x/sanctum
---

# Sanctum Complete Setup

## Installation

```bash
php artisan install:api
```

This publishes the Sanctum configuration and creates the `personal_access_tokens` migration.

---

## User Model

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * User model with Sanctum API tokens.
 */
final class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
```

---

## Configuration

```php
// config/sanctum.php
return [
    // Stateful domains for SPA authentication
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
        env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
    ))),

    // Token expiration in minutes (null = never expires)
    'expiration' => 525600, // 1 year

    // Token prefix for database
    'token_prefix' => '',
];
```

---

## SPA Authentication Setup

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->statefulApi();
})
```

```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'supports_credentials' => true,
];
```

---

## Mobile Token Endpoint

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
 * Mobile authentication controller.
 */
final class TokenController extends Controller
{
    /**
     * Issue API token for mobile app.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
            'device_name' => ['required', 'string', 'max:255'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create token with abilities
        $token = $user->createToken(
            $request->device_name,
            ['read', 'write'],  // abilities
            now()->addDays(30)   // expiration
        );

        return response()->json([
            'user' => $user,
            'token' => $token->plainTextToken,
        ]);
    }

    /**
     * Revoke current token.
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Token revoked']);
    }

    /**
     * Revoke all tokens.
     */
    public function destroyAll(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'All tokens revoked']);
    }
}
```

---

## Token Abilities (Scopes)

```php
// Creating tokens with abilities
$token = $user->createToken('api', ['posts:read', 'posts:write']);

// Checking abilities
if ($user->tokenCan('posts:write')) {
    // Can write posts
}

if ($user->tokenCant('admin:access')) {
    // Cannot access admin
}
```

---

## Protecting Routes

```php
// routes/api.php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // Any authenticated user
    Route::get('/user', fn (Request $request) => $request->user());

    // Requires specific ability
    Route::get('/posts', PostController::class)
        ->middleware('ability:posts:read');

    // Requires all abilities
    Route::post('/posts', [PostController::class, 'store'])
        ->middleware('abilities:posts:read,posts:write');
});
```

---

## Ability Middleware Setup

```php
// bootstrap/app.php
use Laravel\Sanctum\Http\Middleware\CheckAbilities;
use Laravel\Sanctum\Http\Middleware\CheckForAnyAbility;

->withMiddleware(function (Middleware $middleware): void {
    $middleware->alias([
        'abilities' => CheckAbilities::class,
        'ability' => CheckForAnyAbility::class,
    ]);
})
```

---

## SPA Authentication Flow

```javascript
// 1. Get CSRF cookie
await axios.get('/sanctum/csrf-cookie');

// 2. Login (creates session)
await axios.post('/login', { email, password });

// 3. Access protected routes (uses session cookie)
const user = await axios.get('/api/user');

// Configure Axios
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
```

---

## Pruning Expired Tokens

```php
// routes/console.php or AppServiceProvider
use Illuminate\Support\Facades\Schedule;

Schedule::command('sanctum:prune-expired --hours=24')->daily();
```

---

## Testing

```php
<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

final class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_access_protected_route(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user, ['posts:read']);

        $response = $this->getJson('/api/posts');

        $response->assertOk();
    }

    public function test_user_cannot_access_without_ability(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user, ['posts:read']);

        $response = $this->postJson('/api/posts', ['title' => 'Test']);

        $response->assertForbidden();
    }
}
```
