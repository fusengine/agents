---
name: PassportSetup.php
description: Laravel Passport OAuth2 configuration from official Laravel 12 docs
keywords: passport, oauth2, tokens, authorization, client
source: https://laravel.com/docs/12.x/passport
---

# Passport OAuth2 Templates

## Installation

```shell
php artisan install:api --passport
```

## User Model Setup

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\Contracts\OAuthenticatable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable implements OAuthenticatable
{
    use HasApiTokens;
}
```

## Auth Config

```php
// config/auth.php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
    'api' => [
        'driver' => 'passport',
        'provider' => 'users',
    ],
],
```

## Token Lifetimes

```php
use Carbon\CarbonInterval;
use Laravel\Passport\Passport;

public function boot(): void
{
    Passport::tokensExpireIn(CarbonInterval::days(15));
    Passport::refreshTokensExpireIn(CarbonInterval::days(30));
    Passport::personalAccessTokensExpireIn(CarbonInterval::months(6));
}
```

## Defining Scopes

```php
use Laravel\Passport\Passport;

public function boot(): void
{
    Passport::tokensCan([
        'user:read' => 'Retrieve the user info',
        'orders:create' => 'Place orders',
        'orders:read:status' => 'Check order status',
    ]);

    Passport::defaultScopes([
        'user:read',
        'orders:create',
    ]);
}
```

## Create Clients

```shell
# Authorization code client
php artisan passport:client

# PKCE client (public)
php artisan passport:client --public

# Device flow client
php artisan passport:client --device

# Password grant client
php artisan passport:client --password

# Client credentials client
php artisan passport:client --client

# Personal access client
php artisan passport:client --personal
```

## Authorization Code Grant

```php
use Illuminate\Http\Request;
use Illuminate\Support\Str;

Route::get('/redirect', function (Request $request) {
    $request->session()->put('state', $state = Str::random(40));

    $query = http_build_query([
        'client_id' => 'your-client-id',
        'redirect_uri' => 'https://app.com/callback',
        'response_type' => 'code',
        'scope' => 'user:read orders:create',
        'state' => $state,
    ]);

    return redirect('https://server.test/oauth/authorize?'.$query);
});

Route::get('/callback', function (Request $request) {
    $state = $request->session()->pull('state');

    throw_unless(
        strlen($state) > 0 && $state === $request->state,
        InvalidArgumentException::class
    );

    $response = Http::asForm()->post('https://server.test/oauth/token', [
        'grant_type' => 'authorization_code',
        'client_id' => 'your-client-id',
        'client_secret' => 'your-client-secret',
        'redirect_uri' => 'https://app.com/callback',
        'code' => $request->code,
    ]);

    return $response->json();
});
```

## Personal Access Tokens

```php
use App\Models\User;

$user = User::find($userId);

// Create token
$token = $user->createToken('My Token')->accessToken;

// With scopes
$token = $user->createToken('My Token', ['user:read', 'orders:create'])->accessToken;

// With all scopes
$token = $user->createToken('My Token', ['*'])->accessToken;
```

## Refresh Token

```php
use Illuminate\Support\Facades\Http;

$response = Http::asForm()->post('https://server.test/oauth/token', [
    'grant_type' => 'refresh_token',
    'refresh_token' => 'the-refresh-token',
    'client_id' => 'your-client-id',
    'client_secret' => 'your-client-secret',
    'scope' => 'user:read orders:create',
]);
```

## Revoking Tokens

```php
use Laravel\Passport\Passport;

$token = Passport::token()->find($tokenId);

// Revoke access token
$token->revoke();

// Revoke refresh token
$token->refreshToken?->revoke();

// Revoke all user tokens
User::find($userId)->tokens()->each(function ($token) {
    $token->revoke();
    $token->refreshToken?->revoke();
});
```

## Protecting Routes

```php
Route::get('/user', function () {
    // ...
})->middleware('auth:api');
```

## Scope Middleware

```php
use Laravel\Passport\Http\Middleware\CheckToken;
use Laravel\Passport\Http\Middleware\CheckTokenForAnyScope;

// All scopes required
Route::get('/orders', function () {
    // ...
})->middleware(['auth:api', CheckToken::using('orders:read', 'orders:create')]);

// Any scope
Route::get('/orders', function () {
    // ...
})->middleware(['auth:api', CheckTokenForAnyScope::using('orders:read', 'orders:create')]);
```

## Check Scopes in Code

```php
if ($request->user()->tokenCan('orders:create')) {
    // ...
}
```

## Testing

```php
use Laravel\Passport\Passport;

test('orders can be created', function () {
    Passport::actingAs(
        User::factory()->create(),
        ['orders:create']
    );

    $response = $this->post('/api/orders');
    $response->assertStatus(201);
});

test('servers can be retrieved', function () {
    Passport::actingAsClient(
        Client::factory()->create(),
        ['servers:read']
    );

    $response = $this->get('/api/servers');
    $response->assertStatus(200);
});
```

## Purging Tokens

```shell
php artisan passport:purge
php artisan passport:purge --hours=6
php artisan passport:purge --revoked
php artisan passport:purge --expired
```

## Schedule Purge

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('passport:purge')->hourly();
```
