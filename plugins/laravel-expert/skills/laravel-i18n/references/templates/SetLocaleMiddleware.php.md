---
name: SetLocaleMiddleware
description: Complete middleware for setting application locale from URL
keywords: middleware, locale, url, segment
---

# SetLocale Middleware

Complete middleware to set locale from URL segment.

## File: app/Http/Middleware/SetLocale.php

```php
<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

/**
 * Set application locale from URL segment.
 */
final class SetLocale
{
    /**
     * Supported locales.
     *
     * @var array<string>
     */
    private const SUPPORTED_LOCALES = ['en', 'fr', 'de', 'es'];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->segment(1);

        if ($locale !== null && in_array($locale, self::SUPPORTED_LOCALES, true)) {
            App::setLocale($locale);
        }

        return $next($request);
    }
}
```

## Registration: bootstrap/app.php

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        \App\Http\Middleware\SetLocale::class,
    ]);
})
```

## Routes Example

```php
// routes/web.php
Route::prefix('{locale}')
    ->whereIn('locale', ['en', 'fr', 'de', 'es'])
    ->group(function () {
        Route::get('/', [HomeController::class, 'index'])->name('home');
        Route::get('/about', [PageController::class, 'about'])->name('about');
    });
```
