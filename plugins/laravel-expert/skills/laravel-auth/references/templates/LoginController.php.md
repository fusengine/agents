---
name: LoginController.php
description: Authentication controller patterns from official Laravel 12 docs
keywords: login, logout, authentication, controller, session
source: https://laravel.com/docs/12.x/authentication
---

# Authentication Controller Templates

## Basic Login Controller

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /**
     * Handle an authentication attempt.
     */
    public function authenticate(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return redirect()->intended('dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    /**
     * Log the user out of the application.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
```

## Login with Remember Me

```php
use Illuminate\Support\Facades\Auth;

if (Auth::attempt(['email' => $email, 'password' => $password], $remember)) {
    // The user is being remembered...
}

// Check if authenticated via remember me
if (Auth::viaRemember()) {
    // ...
}
```

## Login with Additional Conditions

```php
use Illuminate\Database\Eloquent\Builder;

// Simple condition
if (Auth::attempt(['email' => $email, 'password' => $password, 'active' => 1])) {
    // Authentication was successful...
}

// Complex condition with closure
if (Auth::attempt([
    'email' => $email,
    'password' => $password,
    fn (Builder $query) => $query->has('activeSubscription'),
])) {
    // Authentication was successful...
}

// Conditional authentication
if (Auth::attemptWhen([
    'email' => $email,
    'password' => $password,
], function (User $user) {
    return $user->isNotBanned();
})) {
    // Authentication was successful...
}
```

## Retrieving Authenticated User

```php
use Illuminate\Support\Facades\Auth;

// Via facade
$user = Auth::user();
$id = Auth::id();

// Check if authenticated
if (Auth::check()) {
    // The user is logged in...
}

// Via request
public function update(Request $request): RedirectResponse
{
    $user = $request->user();
    // ...
}
```

## Specifying Guards

```php
// Login with specific guard
if (Auth::guard('admin')->attempt($credentials)) {
    // ...
}

// Get user from guard
$user = Auth::guard('admin')->user();
```

## Single Request Authentication

```php
// No session or cookies created
if (Auth::once($credentials)) {
    // ...
}
```

## Login User Instance

```php
use Illuminate\Support\Facades\Auth;

// Login user directly
Auth::login($user);

// With remember me
Auth::login($user, $remember = true);

// Login by ID
Auth::loginUsingId(1);
Auth::loginUsingId(1, remember: true);
```

## Invalidating Sessions on Other Devices

```php
use Illuminate\Support\Facades\Auth;

// Requires auth.session middleware
Route::middleware(['auth', 'auth.session'])->group(function () {
    Route::get('/', function () {
        // ...
    });
});

// Logout other devices
Auth::logoutOtherDevices($currentPassword);
```

## HTTP Basic Authentication

```php
Route::get('/profile', function () {
    // Only authenticated users may access this route...
})->middleware('auth.basic');
```

## Stateless HTTP Basic Auth Middleware

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateOnceWithBasicAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        return Auth::onceBasic() ?: $next($request);
    }
}
```

## Password Confirmation

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

Route::post('/confirm-password', function (Request $request) {
    if (! Hash::check($request->password, $request->user()->password)) {
        return back()->withErrors([
            'password' => ['The provided password does not match our records.']
        ]);
    }

    $request->session()->passwordConfirmed();

    return redirect()->intended();
})->middleware(['auth', 'throttle:6,1']);
```

## Custom Guard Provider

```php
<?php

namespace App\Providers;

use App\Services\Auth\JwtGuard;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Auth::extend('jwt', function (Application $app, string $name, array $config) {
            return new JwtGuard(Auth::createUserProvider($config['provider']));
        });
    }
}
```

## Closure Request Guard

```php
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

public function boot(): void
{
    Auth::viaRequest('custom-token', function (Request $request) {
        return User::where('token', (string) $request->token)->first();
    });
}
```

## Redirect Middleware Configuration

```php
// bootstrap/app.php
use Illuminate\Http\Request;

->withMiddleware(function (Middleware $middleware): void {
    $middleware->redirectGuestsTo('/login');
    $middleware->redirectUsersTo('/panel');

    // Using closures
    $middleware->redirectGuestsTo(fn (Request $request) => route('login'));
    $middleware->redirectUsersTo(fn (Request $request) => route('panel'));
})
```
