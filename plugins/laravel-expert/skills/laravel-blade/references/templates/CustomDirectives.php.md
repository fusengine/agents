---
name: CustomDirectives.php
description: Complete examples of custom Blade directives and conditionals
file-type: php
---

# Custom Directives - Complete Examples

## Service Provider Setup

```php
<?php
// app/Providers/BladeServiceProvider.php

namespace App\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class BladeServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->registerCustomConditionals();
        $this->registerCustomDirectives();
    }

    private function registerCustomConditionals(): void
    {
        // @admin / @endadmin
        Blade::if('admin', function () {
            return auth()->check() && auth()->user()->isAdmin();
        });

        // @role('editor') / @endrole
        Blade::if('role', function (string $role) {
            return auth()->check() && auth()->user()->hasRole($role);
        });

        // @subscribed('pro') / @endsubscribed
        Blade::if('subscribed', function (string $plan = null) {
            if (!auth()->check()) {
                return false;
            }

            return $plan
                ? auth()->user()->subscribedToPlan($plan)
                : auth()->user()->subscribed();
        });

        // @feature('dark-mode') / @endfeature
        Blade::if('feature', function (string $feature) {
            return config("features.{$feature}", false);
        });

        // @disk('s3') / @elsedisk('local') / @enddisk
        Blade::if('disk', function (string $driver) {
            return config('filesystems.default') === $driver;
        });

        // @locale('en') / @endlocale
        Blade::if('locale', function (string $locale) {
            return app()->getLocale() === $locale;
        });

        // @impersonating / @endimpersonating
        Blade::if('impersonating', function () {
            return session()->has('impersonator_id');
        });
    }

    private function registerCustomDirectives(): void
    {
        // @datetime($date) - Format Carbon date
        Blade::directive('datetime', function (string $expression) {
            return "<?php echo ($expression)->format('M j, Y g:i A'); ?>";
        });

        // @date($date) - Format date only
        Blade::directive('date', function (string $expression) {
            return "<?php echo ($expression)->format('M j, Y'); ?>";
        });

        // @time($date) - Format time only
        Blade::directive('time', function (string $expression) {
            return "<?php echo ($expression)->format('g:i A'); ?>";
        });

        // @money($amount, 'USD') - Format currency
        Blade::directive('money', function (string $expression) {
            return "<?php echo \App\Helpers\MoneyHelper::format($expression); ?>";
        });

        // @markdown($content) - Render markdown
        Blade::directive('markdown', function (string $expression) {
            return "<?php echo \Illuminate\Support\Str::markdown($expression); ?>";
        });

        // @nl2br($text) - Newlines to <br>
        Blade::directive('nl2br', function (string $expression) {
            return "<?php echo nl2br(e($expression)); ?>";
        });

        // @truncate($text, 100) - Truncate with ellipsis
        Blade::directive('truncate', function (string $expression) {
            return "<?php echo \Illuminate\Support\Str::limit($expression); ?>";
        });

        // @route('name', ['param' => 'value']) - Generate URL
        Blade::directive('routeIs', function (string $expression) {
            return "<?php if(request()->routeIs($expression)): ?>";
        });

        // @endrouteIs
        Blade::directive('endrouteIs', function () {
            return '<?php endif; ?>';
        });
    }
}
```

## Register Service Provider

```php
<?php
// bootstrap/providers.php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\BladeServiceProvider::class, // Add this
];
```

## Money Helper

```php
<?php
// app/Helpers/MoneyHelper.php

namespace App\Helpers;

use NumberFormatter;

class MoneyHelper
{
    public static function format(
        float $amount,
        string $currency = 'USD',
        string $locale = null
    ): string {
        $locale = $locale ?? app()->getLocale();

        $formatter = new NumberFormatter($locale, NumberFormatter::CURRENCY);

        return $formatter->formatCurrency($amount, $currency);
    }
}
```

## Usage Examples

```blade
{{-- Custom Conditionals --}}

{{-- @admin --}}
@admin
    <a href="{{ route('admin.dashboard') }}">Admin Panel</a>
@endadmin

{{-- @role with @elserole --}}
@role('super-admin')
    <x-super-admin-tools />
@elserole('admin')
    <x-admin-tools />
@elserole('editor')
    <x-editor-tools />
@endrole

{{-- @subscribed --}}
@subscribed
    <x-premium-content />
@else
    <x-upgrade-prompt />
@endsubscribed

{{-- @subscribed with plan --}}
@subscribed('enterprise')
    <x-enterprise-features />
@endsubscribed

{{-- @feature flag --}}
@feature('dark-mode')
    <x-dark-mode-toggle />
@endfeature

{{-- @disk --}}
@disk('s3')
    <p>Files are stored on Amazon S3</p>
@elsedisk('local')
    <p>Files are stored locally</p>
@enddisk

{{-- @locale --}}
@locale('fr')
    <p>Bienvenue sur notre site</p>
@endlocale

@locale('en')
    <p>Welcome to our site</p>
@endlocale

{{-- @impersonating --}}
@impersonating
    <div class="impersonation-banner">
        You are impersonating {{ auth()->user()->name }}.
        <a href="{{ route('impersonate.stop') }}">Stop</a>
    </div>
@endimpersonating


{{-- Custom Directives --}}

{{-- @datetime --}}
<p>Created: @datetime($post->created_at)</p>
{{-- Output: Created: Jan 15, 2024 3:30 PM --}}

{{-- @date --}}
<p>Published: @date($post->published_at)</p>
{{-- Output: Published: Jan 15, 2024 --}}

{{-- @money --}}
<p>Price: @money($product->price, 'EUR')</p>
{{-- Output: Price: €29.99 --}}

{{-- @markdown --}}
<div class="prose">
    @markdown($post->content)
</div>

{{-- @truncate --}}
<p>@truncate($post->excerpt, 150)</p>
{{-- Output: First 150 characters... --}}

{{-- @nl2br --}}
<p>@nl2br($comment->body)</p>
{{-- Converts newlines to <br> tags --}}

{{-- @routeIs --}}
<nav>
    <a href="/" @routeIs('home') class="active" @endrouteIs>Home</a>
    <a href="/about" @routeIs('about') class="active" @endrouteIs>About</a>
</nav>
```

## Testing Custom Directives

```php
<?php
// tests/Feature/BladeDirectivesTest.php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Blade;
use Tests\TestCase;

class BladeDirectivesTest extends TestCase
{
    public function test_admin_directive_shows_for_admins(): void
    {
        $admin = User::factory()->admin()->create();
        $this->actingAs($admin);

        $result = Blade::render('@admin ADMIN CONTENT @endadmin');

        $this->assertStringContainsString('ADMIN CONTENT', $result);
    }

    public function test_admin_directive_hides_for_users(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $result = Blade::render('@admin ADMIN CONTENT @endadmin');

        $this->assertStringNotContainsString('ADMIN CONTENT', $result);
    }

    public function test_money_directive_formats_currency(): void
    {
        $result = Blade::render('@money(29.99, "USD")');

        $this->assertStringContainsString('$29.99', $result);
    }

    public function test_datetime_directive_formats_date(): void
    {
        $date = now()->setDate(2024, 1, 15)->setTime(15, 30);

        $result = Blade::render(
            '@datetime($date)',
            ['date' => $date]
        );

        $this->assertStringContainsString('Jan 15, 2024', $result);
        $this->assertStringContainsString('3:30 PM', $result);
    }
}
```
