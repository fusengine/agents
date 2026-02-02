---
name: FortifySetup.php
description: Laravel Fortify configuration from official Laravel 12 docs
keywords: fortify, authentication, 2fa, registration, password
source: https://laravel.com/docs/12.x/fortify
---

# Fortify Authentication Templates

## Installation

```shell
composer require laravel/fortify
php artisan fortify:install
php artisan migrate
```

## Features Configuration

```php
// config/fortify.php
'features' => [
    Features::registration(),
    Features::resetPasswords(),
    Features::emailVerification(),
    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]),
],
```

## View Configuration

```php
// FortifyServiceProvider boot()
use Laravel\Fortify\Fortify;

public function boot(): void
{
    Fortify::loginView(function () {
        return view('auth.login');
    });

    Fortify::registerView(function () {
        return view('auth.register');
    });

    Fortify::requestPasswordResetLinkView(function () {
        return view('auth.forgot-password');
    });

    Fortify::resetPasswordView(function (Request $request) {
        return view('auth.reset-password', ['request' => $request]);
    });

    Fortify::verifyEmailView(function () {
        return view('auth.verify-email');
    });

    Fortify::confirmPasswordView(function () {
        return view('auth.confirm-password');
    });

    Fortify::twoFactorChallengeView(function () {
        return view('auth.two-factor-challenge');
    });
}
```

## Custom Authentication

```php
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Fortify\Fortify;

Fortify::authenticateUsing(function (Request $request) {
    $user = User::where('email', $request->email)->first();

    if ($user && Hash::check($request->password, $user->password)) {
        return $user;
    }
});
```

## Custom Authentication Pipeline

```php
use Laravel\Fortify\Actions\AttemptToAuthenticate;
use Laravel\Fortify\Actions\CanonicalizeUsername;
use Laravel\Fortify\Actions\EnsureLoginIsNotThrottled;
use Laravel\Fortify\Actions\PrepareAuthenticatedSession;
use Laravel\Fortify\Actions\RedirectIfTwoFactorAuthenticatable;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

Fortify::authenticateThrough(function (Request $request) {
    return array_filter([
        config('fortify.limiters.login') ? null : EnsureLoginIsNotThrottled::class,
        config('fortify.lowercase_usernames') ? CanonicalizeUsername::class : null,
        Features::enabled(Features::twoFactorAuthentication())
            ? RedirectIfTwoFactorAuthenticatable::class
            : null,
        AttemptToAuthenticate::class,
        PrepareAuthenticatedSession::class,
    ]);
});
```

## Custom Redirect Responses

```php
use Laravel\Fortify\Contracts\LogoutResponse;

public function register(): void
{
    $this->app->instance(LogoutResponse::class, new class implements LogoutResponse {
        public function toResponse($request)
        {
            return redirect('/');
        }
    });
}
```

## Two-Factor Authentication Model

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use TwoFactorAuthenticatable;
}
```

## 2FA Blade Templates

```blade
{{-- Enable 2FA --}}
@if (session('status') == 'two-factor-authentication-enabled')
    <div class="mb-4">
        Please finish configuring two-factor authentication below.
    </div>
@endif

{{-- QR Code --}}
{!! $request->user()->twoFactorQrCodeSvg() !!}

{{-- Recovery Codes --}}
@foreach ((array) $request->user()->recoveryCodes() as $code)
    <div>{{ $code }}</div>
@endforeach

{{-- Confirmation Success --}}
@if (session('status') == 'two-factor-authentication-confirmed')
    <div class="mb-4">
        Two-factor authentication confirmed and enabled successfully.
    </div>
@endif
```

## 2FA Endpoints

```
POST   /user/two-factor-authentication       Enable 2FA
DELETE /user/two-factor-authentication       Disable 2FA
POST   /user/confirmed-two-factor-authentication  Confirm 2FA
GET    /user/two-factor-qr-code              Get QR code (XHR)
GET    /user/two-factor-recovery-codes       Get recovery codes
POST   /user/two-factor-recovery-codes       Regenerate codes
POST   /two-factor-challenge                 Verify 2FA code
```

## Password Reset Blade

```blade
{{-- Request sent --}}
@if (session('status'))
    <div class="mb-4 text-green-600">
        {{ session('status') }}
    </div>
@endif

{{-- Reset success --}}
@if (session('status'))
    <div class="mb-4 text-green-600">
        {{ session('status') }}
    </div>
@endif
```

## Email Verification Blade

```blade
@if (session('status') == 'verification-link-sent')
    <div class="mb-4 text-green-600">
        A new email verification link has been emailed to you!
    </div>
@endif
```

## Protected Routes

```php
// Email verification required
Route::get('/dashboard', function () {
    // ...
})->middleware(['verified']);
```

## Disable Views (SPA)

```php
// config/fortify.php
'views' => false,
```

## Custom Registration

```php
// app/Actions/Fortify/CreateNewUser.php
<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'confirmed', 'min:8'],
        ])->validate();

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
        ]);
    }
}
```
