---
name: SocialiteController.php
description: Laravel Socialite OAuth controller from official Laravel 12 docs
keywords: socialite, oauth, social login, github, google
source: https://laravel.com/docs/12.x/socialite
---

# Socialite OAuth Templates

## Installation

```shell
composer require laravel/socialite
```

## Configuration

```php
// config/services.php
'github' => [
    'client_id' => env('GITHUB_CLIENT_ID'),
    'client_secret' => env('GITHUB_CLIENT_SECRET'),
    'redirect' => 'http://example.com/auth/github/callback',
],

'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => 'http://example.com/auth/google/callback',
],
```

## Basic Routes

```php
use Laravel\Socialite\Socialite;

Route::get('/auth/redirect', function () {
    return Socialite::driver('github')->redirect();
});

Route::get('/auth/callback', function () {
    $user = Socialite::driver('github')->user();

    // $user->token
});
```

## Complete Controller

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Socialite;

class SocialiteController extends Controller
{
    /**
     * Redirect to OAuth provider.
     */
    public function redirect(string $provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    /**
     * Handle OAuth callback.
     */
    public function callback(string $provider)
    {
        $socialUser = Socialite::driver($provider)->user();

        $user = User::updateOrCreate([
            'provider' => $provider,
            'provider_id' => $socialUser->id,
        ], [
            'name' => $socialUser->name,
            'email' => $socialUser->email,
            'provider_token' => $socialUser->token,
            'provider_refresh_token' => $socialUser->refreshToken,
        ]);

        Auth::login($user);

        return redirect('/dashboard');
    }
}
```

## Routes for Controller

```php
Route::get('/auth/{provider}/redirect', [SocialiteController::class, 'redirect']);
Route::get('/auth/{provider}/callback', [SocialiteController::class, 'callback']);
```

## User Migration

```php
// Add columns for social auth
Schema::table('users', function (Blueprint $table) {
    $table->string('provider')->nullable();
    $table->string('provider_id')->nullable();
    $table->string('provider_token')->nullable();
    $table->string('provider_refresh_token')->nullable();

    $table->unique(['provider', 'provider_id']);
});
```

## Access Scopes

```php
use Laravel\Socialite\Socialite;

// Add scopes
return Socialite::driver('github')
    ->scopes(['read:user', 'public_repo'])
    ->redirect();

// Replace all scopes
return Socialite::driver('github')
    ->setScopes(['read:user', 'public_repo'])
    ->redirect();
```

## Optional Parameters

```php
use Laravel\Socialite\Socialite;

return Socialite::driver('google')
    ->with(['hd' => 'example.com'])
    ->redirect();
```

## Slack Bot Token

```php
use Laravel\Socialite\Socialite;

// Redirect for bot token
return Socialite::driver('slack')
    ->asBotUser()
    ->setScopes(['chat:write', 'chat:write.public', 'chat:write.customize'])
    ->redirect();

// Get bot user
$user = Socialite::driver('slack')->asBotUser()->user();
```

## Retrieving User Details

```php
use Laravel\Socialite\Socialite;

Route::get('/auth/callback', function () {
    $user = Socialite::driver('github')->user();

    // OAuth 2.0 providers
    $token = $user->token;
    $refreshToken = $user->refreshToken;
    $expiresIn = $user->expiresIn;

    // OAuth 1.0 providers
    $token = $user->token;
    $tokenSecret = $user->tokenSecret;

    // All providers
    $user->getId();
    $user->getNickname();
    $user->getName();
    $user->getEmail();
    $user->getAvatar();
});
```

## User From Token

```php
use Laravel\Socialite\Socialite;

// If you already have a token
$user = Socialite::driver('github')->userFromToken($token);
```

## Stateless Authentication

```php
use Laravel\Socialite\Socialite;

// For API authentication (no session)
return Socialite::driver('google')->stateless()->user();
```

## Supported Providers

```
facebook
x (Twitter)
linkedin-openid
google
github
gitlab
bitbucket
slack
slack-openid
```

## Community Providers

```
# https://socialiteproviders.com/
composer require socialiteproviders/discord
composer require socialiteproviders/twitch
composer require socialiteproviders/spotify
# etc.
```

---

## Testing with Socialite::fake()

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Tests\TestCase;

final class SocialiteTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_github(): void
    {
        Socialite::fake('github', (new SocialiteUser)->map([
            'id' => 'github-123',
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]));

        $response = $this->get('/auth/github/callback');

        $response->assertRedirect('/dashboard');

        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'provider_id' => 'github-123',
        ]);
    }

    public function test_fake_user_with_tokens(): void
    {
        $fakeUser = (new SocialiteUser)->map([
            'id' => 'google-456',
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
        ])->setToken('fake-token')
          ->setRefreshToken('fake-refresh-token')
          ->setExpiresIn(3600)
          ->setApprovedScopes(['read', 'write']);

        Socialite::fake('google', $fakeUser);

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect('/dashboard');
    }
}
```
