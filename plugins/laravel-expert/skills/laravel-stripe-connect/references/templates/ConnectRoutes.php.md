---
name: ConnectRoutes
description: Complete route definitions for Stripe Connect
when-to-use: Setting up Connect routes
keywords: routes, api, webhooks, middleware
---

# Connect Routes

## Web Routes (Webhooks)

```php
<?php
// routes/web.php

use App\Http\Controllers\Connect\ConnectWebhookController;
use Illuminate\Support\Facades\Route;

// Webhook route - excluded from CSRF
Route::post('/stripe/connect/webhook', [ConnectWebhookController::class, 'handle'])
    ->name('stripe.connect.webhook')
    ->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);
```

## API Routes

```php
<?php
// routes/api.php

use App\Http\Controllers\Connect\MarketplacePaymentController;
use App\Http\Controllers\Connect\PayoutController;
use App\Http\Controllers\Connect\SellerOnboardingController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->prefix('connect')->name('connect.')->group(function () {

    // Seller Onboarding
    Route::prefix('onboarding')->name('onboarding.')->group(function () {
        Route::post('/start', [SellerOnboardingController::class, 'start'])->name('start');
        Route::post('/continue', [SellerOnboardingController::class, 'continueOnboarding'])->name('continue');
        Route::get('/status', [SellerOnboardingController::class, 'status'])->name('status');
    });

    // Seller Dashboard (requires onboarded seller)
    Route::middleware(['seller.onboarded'])->group(function () {
        Route::get('/dashboard', [SellerOnboardingController::class, 'dashboard'])->name('dashboard');

        // Payouts
        Route::prefix('payouts')->name('payouts.')->group(function () {
            Route::get('/balance', [PayoutController::class, 'balance'])->name('balance');
            Route::get('/', [PayoutController::class, 'index'])->name('index');
            Route::post('/instant', [PayoutController::class, 'createInstant'])->name('instant');
            Route::get('/schedule', [PayoutController::class, 'schedule'])->name('schedule');
            Route::put('/schedule', [PayoutController::class, 'updateSchedule'])->name('schedule.update');
            Route::get('/earnings', [PayoutController::class, 'earnings'])->name('earnings');
        });
    });

    // Payments (buyer actions)
    Route::prefix('payments')->name('payments.')->group(function () {
        Route::post('/create', [MarketplacePaymentController::class, 'createPayment'])->name('create');
        Route::post('/confirm', [MarketplacePaymentController::class, 'confirmPayment'])->name('confirm');
        Route::post('/checkout', [MarketplacePaymentController::class, 'createCheckoutSession'])->name('checkout');
        Route::post('/{transaction}/refund', [MarketplacePaymentController::class, 'refund'])->name('refund');
    });
});
```

## Onboarding Return Routes (Web)

```php
<?php
// routes/web.php (add to existing)

use App\Http\Controllers\Connect\SellerOnboardingController;

Route::middleware(['auth'])->prefix('connect')->name('connect.')->group(function () {
    Route::get('/onboarding/complete', [SellerOnboardingController::class, 'complete'])
        ->name('onboarding.complete');
    Route::get('/onboarding/refresh', [SellerOnboardingController::class, 'refresh'])
        ->name('onboarding.refresh');
});
```

## Middleware

```php
<?php
// app/Http/Middleware/EnsureSellerOnboarded.php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureSellerOnboarded
{
    public function handle(Request $request, Closure $next)
    {
        $seller = $request->user()?->seller;

        if (!$seller?->isOnboarded()) {
            return response()->json([
                'error' => 'Seller onboarding required',
                'onboarding_url' => route('connect.onboarding.continue'),
            ], 403);
        }

        return $next($request);
    }
}
```

## Register Middleware

```php
<?php
// bootstrap/app.php

use App\Http\Middleware\EnsureSellerOnboarded;

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'seller.onboarded' => EnsureSellerOnboarded::class,
        ]);
    })
    ->create();
```

## Config

```php
<?php
// config/services.php

return [
    // ... other services

    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
        'connect_webhook_secret' => env('STRIPE_CONNECT_WEBHOOK_SECRET'),
    ],
];
```

## Environment Variables

```env
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_...
```
