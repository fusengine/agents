---
name: FeatureFlags
description: Laravel Pennant setup for plan-based features
when-to-use: Limiting features by subscription tier
keywords: features, flags, pennant, plans, limits, tiers
---

# Feature Flags Implementation

## Pennant Setup

```bash
composer require laravel/pennant
php artisan vendor:publish --provider="Laravel\Pennant\PennantServiceProvider"
php artisan migrate
```

## Feature Definitions

```php
<?php
// app/Providers/AppServiceProvider.php

declare(strict_types=1);

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\ServiceProvider;
use Laravel\Pennant\Feature;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->defineFeatures();
    }

    private function defineFeatures(): void
    {
        // Boolean features
        Feature::define('export-pdf', fn (User $user) =>
            $user->hasFeature('export-pdf')
        );

        Feature::define('advanced-analytics', fn (User $user) =>
            $user->hasFeature('advanced-analytics')
        );

        Feature::define('api-access', fn (User $user) =>
            $user->hasFeature('api-access')
        );

        Feature::define('priority-support', fn (User $user) =>
            $user->hasFeature('priority-support')
        );

        // Numeric limits
        Feature::define('project-limit', fn (User $user) =>
            $user->getPlanLimit('projects')
        );

        Feature::define('team-member-limit', fn (User $user) =>
            $user->getPlanLimit('team_members')
        );

        Feature::define('api-rate-limit', fn (User $user) =>
            $user->getPlanLimit('api_calls')
        );
    }
}
```

## HasPlanFeatures Trait

```php
<?php
// app/Models/Concerns/HasPlanFeatures.php

declare(strict_types=1);

namespace App\Models\Concerns;

use Laravel\Pennant\Feature;

trait HasPlanFeatures
{
    public function hasFeature(string $feature): bool
    {
        $subscription = $this->subscription('default');

        if (!$subscription || !$subscription->active()) {
            return $this->getFreeFeatures()->contains($feature);
        }

        $planFeatures = $this->getPlanFeatures($subscription);

        return in_array($feature, $planFeatures, true);
    }

    public function getPlanLimit(string $limitType): int
    {
        $subscription = $this->subscription('default');

        if (!$subscription || !$subscription->active()) {
            return config("billing.limits.free.{$limitType}", 0);
        }

        $priceId = $subscription->items->first()?->stripe_price;
        $plan = $this->getPlanFromPrice($priceId);

        return config("billing.limits.{$plan}.{$limitType}", 0);
    }

    public function canUseFeature(string $feature): bool
    {
        return Feature::active($feature);
    }

    public function getFeatureLimit(string $feature): int
    {
        return Feature::value($feature) ?? 0;
    }

    public function checkLimit(string $limitType, int $current): bool
    {
        $limit = $this->getPlanLimit($limitType);

        return $limit === -1 || $current < $limit;
    }

    private function getPlanFeatures($subscription): array
    {
        $priceId = $subscription->items->first()?->stripe_price;
        $plan = $this->getPlanFromPrice($priceId);

        return config("billing.features.{$plan}", []);
    }

    private function getFreeFeatures(): \Illuminate\Support\Collection
    {
        return collect(config('billing.features.free', []));
    }

    private function getPlanFromPrice(?string $priceId): string
    {
        $priceMap = config('billing.price_to_plan', []);

        return $priceMap[$priceId] ?? 'free';
    }

    public function purgeFeatureCache(): void
    {
        Feature::for($this)->purge();
    }
}
```

## Config

```php
<?php
// config/billing.php

return [
    'price_to_plan' => [
        env('STRIPE_PRICE_BASIC') => 'basic',
        env('STRIPE_PRICE_PREMIUM') => 'premium',
        env('STRIPE_PRICE_ENTERPRISE') => 'enterprise',
    ],

    'features' => [
        'free' => [
            'export-csv',
        ],
        'basic' => [
            'export-csv',
            'basic-analytics',
        ],
        'premium' => [
            'export-csv',
            'export-pdf',
            'advanced-analytics',
            'api-access',
        ],
        'enterprise' => [
            'export-csv',
            'export-pdf',
            'advanced-analytics',
            'api-access',
            'priority-support',
            'custom-branding',
        ],
    ],

    'limits' => [
        'free' => [
            'projects' => 2,
            'team_members' => 1,
            'api_calls' => 100,
            'storage_gb' => 1,
        ],
        'basic' => [
            'projects' => 10,
            'team_members' => 3,
            'api_calls' => 1000,
            'storage_gb' => 10,
        ],
        'premium' => [
            'projects' => 50,
            'team_members' => 20,
            'api_calls' => 50000,
            'storage_gb' => 100,
        ],
        'enterprise' => [
            'projects' => -1, // unlimited
            'team_members' => -1,
            'api_calls' => -1,
            'storage_gb' => -1,
        ],
    ],
];
```

## Blade Directives

```blade
{{-- Check boolean feature --}}
@feature('advanced-analytics')
    <x-advanced-charts :data="$data" />
@else
    <x-upgrade-prompt
        feature="Advanced Analytics"
        plan="Premium"
    />
@endfeature

{{-- Check limit --}}
@if(auth()->user()->checkLimit('projects', $projectCount))
    <button>Create Project</button>
@else
    <x-limit-reached
        type="projects"
        current="{{ $projectCount }}"
        limit="{{ auth()->user()->getPlanLimit('projects') }}"
    />
@endif
```

## Middleware

```php
<?php
// app/Http/Middleware/RequireFeature.php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Pennant\Feature;

class RequireFeature
{
    public function handle(Request $request, Closure $next, string $feature)
    {
        if (!Feature::active($feature)) {
            return $request->expectsJson()
                ? response()->json([
                    'error' => 'Feature not available on your plan',
                    'feature' => $feature,
                    'upgrade_url' => route('billing.plans'),
                ], 403)
                : redirect()->route('billing.upgrade', ['feature' => $feature]);
        }

        return $next($request);
    }
}
```

## Cache Purge on Plan Change

```php
<?php
// app/Listeners/PurgeFeatureCacheOnPlanChange.php

declare(strict_types=1);

namespace App\Listeners;

use Laravel\Cashier\Events\WebhookHandled;
use Laravel\Pennant\Feature;

class PurgeFeatureCacheOnPlanChange
{
    public function handle(WebhookHandled $event): void
    {
        if (!in_array($event->payload['type'], [
            'customer.subscription.created',
            'customer.subscription.updated',
            'customer.subscription.deleted',
        ])) {
            return;
        }

        $customerId = $event->payload['data']['object']['customer'];
        $user = \App\Models\User::where('stripe_id', $customerId)->first();

        if ($user) {
            Feature::for($user)->purge();
        }
    }
}
```

## Routes

```php
// routes/web.php

Route::middleware(['auth', 'feature:api-access'])->group(function () {
    Route::get('/api-keys', [ApiKeyController::class, 'index']);
});

Route::middleware(['auth', 'feature:advanced-analytics'])->group(function () {
    Route::get('/analytics/advanced', [AnalyticsController::class, 'advanced']);
});
```
