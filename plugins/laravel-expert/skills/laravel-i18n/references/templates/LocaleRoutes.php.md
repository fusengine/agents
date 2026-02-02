---
name: LocaleRoutes
description: URL-based locale routing with prefix
file-type: php
---

# Locale Routes

Complete URL-based locale routing with automatic redirects.

## app/Http/Middleware/SetLocaleFromUrl.php

```php
<?php

namespace App\Http\Middleware;

use App\Enums\Locale;
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

class SetLocaleFromUrl
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->segment(1);

        if ($this->isValidLocale($locale)) {
            App::setLocale($locale);
            Carbon::setLocale($locale);

            // Make named routes include locale automatically
            URL::defaults(['locale' => $locale]);
        }

        return $next($request);
    }

    /**
     * Check if locale is valid.
     */
    private function isValidLocale(?string $locale): bool
    {
        if ($locale === null) {
            return false;
        }

        return Locale::tryFrom($locale) !== null;
    }
}
```

## app/Http/Middleware/RedirectToLocale.php

```php
<?php

namespace App\Http\Middleware;

use App\Enums\Locale;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class RedirectToLocale
{
    /**
     * Redirect requests without locale prefix.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $segment = $request->segment(1);

        // Already has valid locale
        if (Locale::tryFrom($segment) !== null) {
            return $next($request);
        }

        // Determine best locale
        $locale = $this->detectLocale($request);

        // Redirect to localized URL
        $path = $request->path();
        $query = $request->getQueryString();

        $url = "/{$locale}/{$path}";
        if ($query) {
            $url .= "?{$query}";
        }

        return redirect($url);
    }

    /**
     * Detect best locale for user.
     */
    private function detectLocale(Request $request): string
    {
        // 1. User preference (if authenticated)
        if ($user = $request->user()) {
            $preferred = $user->preferred_language;
            if (Locale::tryFrom($preferred) !== null) {
                return $preferred;
            }
        }

        // 2. Session
        $session = Session::get('locale');
        if (Locale::tryFrom($session) !== null) {
            return $session;
        }

        // 3. Browser Accept-Language
        $browser = $request->getPreferredLanguage(Locale::values());
        if ($browser) {
            return $browser;
        }

        // 4. Default
        return config('app.locale');
    }
}
```

## bootstrap/app.php

```php
<?php

use App\Http\Middleware\RedirectToLocale;
use App\Http\Middleware\SetLocaleFromUrl;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'locale.url' => SetLocaleFromUrl::class,
            'locale.redirect' => RedirectToLocale::class,
        ]);
    })
    ->create();
```

## routes/web.php

```php
<?php

use Illuminate\Support\Facades\Route;

// Redirect root to localized version
Route::get('/', function () {
    return redirect('/' . app()->getLocale());
})->middleware('locale.redirect');

// Localized routes
Route::prefix('{locale}')
    ->where(['locale' => 'en|fr|es|de'])
    ->middleware(['locale.url'])
    ->group(function () {

        Route::get('/', [HomeController::class, 'index'])
            ->name('home');

        Route::get('/about', [AboutController::class, 'index'])
            ->name('about');

        Route::resource('posts', PostController::class);

        Route::middleware(['auth'])->group(function () {
            Route::get('/dashboard', [DashboardController::class, 'index'])
                ->name('dashboard');

            Route::get('/settings', [SettingsController::class, 'index'])
                ->name('settings');
        });
    });

// API routes (no locale prefix)
Route::prefix('api')->group(function () {
    Route::get('/translations/{locale}', function (string $locale) {
        $path = lang_path("{$locale}.json");

        if (!file_exists($path)) {
            abort(404);
        }

        return response()->json(
            json_decode(file_get_contents($path), true)
        );
    })->name('api.translations');
});
```

## app/helpers.php

```php
<?php

if (!function_exists('localized_route')) {
    /**
     * Generate localized route URL.
     */
    function localized_route(
        string $name,
        array $parameters = [],
        ?string $locale = null
    ): string {
        $locale = $locale ?? app()->getLocale();

        return route($name, array_merge(
            ['locale' => $locale],
            $parameters
        ));
    }
}

if (!function_exists('switch_locale_url')) {
    /**
     * Get current URL with different locale.
     */
    function switch_locale_url(string $locale): string
    {
        $segments = request()->segments();

        // Replace first segment (locale) or prepend
        if (count($segments) > 0 && strlen($segments[0]) === 2) {
            $segments[0] = $locale;
        } else {
            array_unshift($segments, $locale);
        }

        $path = implode('/', $segments);
        $query = request()->getQueryString();

        return url($path) . ($query ? "?{$query}" : '');
    }
}
```

## composer.json (autoload helpers)

```json
{
    "autoload": {
        "files": [
            "app/helpers.php"
        ]
    }
}
```

## Usage in Blade

```blade
{{-- Navigation links --}}
<nav>
    <a href="{{ localized_route('home') }}">{{ __('Home') }}</a>
    <a href="{{ localized_route('posts.index') }}">{{ __('Posts') }}</a>
    <a href="{{ localized_route('about') }}">{{ __('About') }}</a>
</nav>

{{-- Language switcher --}}
<div class="locale-switcher">
    @foreach(\App\Enums\Locale::cases() as $locale)
        <a href="{{ switch_locale_url($locale->value) }}"
           @class(['active' => app()->getLocale() === $locale->value])>
            {{ $locale->label() }}
        </a>
    @endforeach
</div>

{{-- Post link --}}
<a href="{{ localized_route('posts.show', ['post' => $post]) }}">
    {{ $post->title }}
</a>
```

## SEO: Hreflang Tags

```blade
{{-- In layout head --}}
@foreach(\App\Enums\Locale::cases() as $locale)
    <link rel="alternate"
          hreflang="{{ $locale->value }}"
          href="{{ switch_locale_url($locale->value) }}">
@endforeach
<link rel="alternate" hreflang="x-default" href="{{ switch_locale_url('en') }}">
```
