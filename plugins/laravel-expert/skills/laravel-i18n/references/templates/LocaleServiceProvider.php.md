---
name: LocaleServiceProvider
description: Complete localization service provider with helpers
file-type: php
---

# Locale Service Provider

Complete service provider for centralized localization with formatting helpers.

## config/app.php

```php
<?php

return [
    'locale' => env('APP_LOCALE', 'en'),
    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),

    // Add custom config
    'available_locales' => ['en', 'fr', 'es', 'de'],
];
```

## app/Enums/Locale.php

```php
<?php

namespace App\Enums;

enum Locale: string
{
    case EN = 'en';
    case FR = 'fr';
    case ES = 'es';
    case DE = 'de';

    /**
     * Get human-readable label.
     */
    public function label(): string
    {
        return match($this) {
            self::EN => 'English',
            self::FR => 'Français',
            self::ES => 'Español',
            self::DE => 'Deutsch',
        };
    }

    /**
     * Get all locale values as array.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get locales as options for select.
     */
    public static function options(): array
    {
        return collect(self::cases())
            ->mapWithKeys(fn($locale) => [
                $locale->value => $locale->label()
            ])
            ->toArray();
    }
}
```

## app/Services/LocalizationService.php

```php
<?php

namespace App\Services;

use App\Enums\Locale;
use Carbon\Carbon;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use NumberFormatter;

class LocalizationService
{
    private ?NumberFormatter $numberFormatter = null;
    private ?NumberFormatter $currencyFormatter = null;

    /**
     * Set the application locale.
     */
    public function setLocale(string $locale): bool
    {
        if (!$this->isValidLocale($locale)) {
            return false;
        }

        App::setLocale($locale);
        Session::put('locale', $locale);
        Carbon::setLocale($locale);

        // Clear cached formatters
        $this->numberFormatter = null;
        $this->currencyFormatter = null;

        // Update user preference if authenticated
        if ($user = auth()->user()) {
            $user->updateQuietly(['preferred_language' => $locale]);
        }

        return true;
    }

    /**
     * Get current locale.
     */
    public function getLocale(): string
    {
        return App::currentLocale();
    }

    /**
     * Check if locale is valid.
     */
    public function isValidLocale(string $locale): bool
    {
        return Locale::tryFrom($locale) !== null;
    }

    /**
     * Get available locales.
     */
    public function getAvailableLocales(): array
    {
        return Locale::options();
    }

    /**
     * Format number according to locale.
     */
    public function formatNumber(float $value, int $decimals = 2): string
    {
        $formatter = $this->getNumberFormatter();
        $formatter->setAttribute(NumberFormatter::FRACTION_DIGITS, $decimals);

        return $formatter->format($value);
    }

    /**
     * Format currency according to locale.
     */
    public function formatCurrency(float $amount, string $currency = 'USD'): string
    {
        return $this->getCurrencyFormatter()->formatCurrency($amount, $currency);
    }

    /**
     * Format percentage according to locale.
     */
    public function formatPercent(float $value): string
    {
        $formatter = new NumberFormatter(
            $this->getLocale(),
            NumberFormatter::PERCENT
        );

        return $formatter->format($value);
    }

    /**
     * Get cached number formatter.
     */
    private function getNumberFormatter(): NumberFormatter
    {
        if ($this->numberFormatter === null) {
            $this->numberFormatter = new NumberFormatter(
                $this->getLocale(),
                NumberFormatter::DECIMAL
            );
        }

        return $this->numberFormatter;
    }

    /**
     * Get cached currency formatter.
     */
    private function getCurrencyFormatter(): NumberFormatter
    {
        if ($this->currencyFormatter === null) {
            $this->currencyFormatter = new NumberFormatter(
                $this->getLocale(),
                NumberFormatter::CURRENCY
            );
        }

        return $this->currencyFormatter;
    }
}
```

## app/Providers/LocaleServiceProvider.php

```php
<?php

namespace App\Providers;

use App\Services\LocalizationService;
use Carbon\Carbon;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class LocaleServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(LocalizationService::class);

        // Alias for convenience
        $this->app->alias(LocalizationService::class, 'localization');
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Sync Carbon locale with app locale
        Carbon::setLocale(App::currentLocale());

        // Log missing translations in development
        if ($this->app->environment('local')) {
            $this->app['translator']->setMissingTranslationKeyCallback(
                function (string $key, array $replace, string $locale) {
                    Log::warning("Missing translation: {$key} [{$locale}]");
                }
            );
        }

        // Register Blade directives
        $this->registerBladeDirectives();
    }

    /**
     * Register custom Blade directives.
     */
    private function registerBladeDirectives(): void
    {
        // @money(100.50, 'EUR')
        Blade::directive('money', function ($expression) {
            return "<?php echo app('localization')->formatCurrency({$expression}); ?>";
        });

        // @number(1234.56)
        Blade::directive('number', function ($expression) {
            return "<?php echo app('localization')->formatNumber({$expression}); ?>";
        });

        // @percent(0.15)
        Blade::directive('percent', function ($expression) {
            return "<?php echo app('localization')->formatPercent({$expression}); ?>";
        });

        // @date($carbon, 'LL')
        Blade::directive('localdate', function ($expression) {
            [$date, $format] = explode(',', $expression . ", 'LL'");
            return "<?php echo ({$date})->isoFormat({$format}); ?>";
        });
    }
}
```

## bootstrap/providers.php

```php
<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\LocaleServiceProvider::class,
];
```

## Usage in Controllers

```php
<?php

namespace App\Http\Controllers;

use App\Services\LocalizationService;

class SettingsController extends Controller
{
    public function updateLocale(
        Request $request,
        LocalizationService $localization
    ) {
        $validated = $request->validate([
            'locale' => ['required', 'string', 'max:5'],
        ]);

        if (!$localization->setLocale($validated['locale'])) {
            return back()->withErrors(['locale' => __('Invalid locale')]);
        }

        return back()->with('success', __('Language updated'));
    }
}
```

## Usage in Blade

```blade
{{-- Format money --}}
<span class="price">@money($product->price, 'EUR')</span>

{{-- Format number --}}
<span>@number($views)</span>

{{-- Format percentage --}}
<span>@percent($discount)</span>

{{-- Localized date --}}
<time>@localdate($post->created_at, 'LL')</time>

{{-- Locale switcher --}}
<select name="locale" onchange="this.form.submit()">
    @foreach(app('localization')->getAvailableLocales() as $code => $label)
        <option value="{{ $code }}" @selected(app()->getLocale() === $code)>
            {{ $label }}
        </option>
    @endforeach
</select>
```
