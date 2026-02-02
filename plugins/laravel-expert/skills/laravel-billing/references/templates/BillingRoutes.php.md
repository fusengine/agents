---
name: BillingRoutes
description: Complete route definitions for billing features
when-to-use: Setting up billing routes
keywords: routes, billing, api, web, subscription
---

# Billing Routes

## Web Routes (Checkout & Portal)

```php
<?php
// routes/web.php

use App\Http\Controllers\Billing\CheckoutController;
use App\Http\Controllers\Billing\InvoiceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Billing Web Routes
|--------------------------------------------------------------------------
*/

// Public pricing page
Route::get('/pricing', [CheckoutController::class, 'pricing'])
    ->name('pricing');

// Authenticated billing routes
Route::middleware(['auth', 'verified'])->prefix('billing')->group(function () {
    // Checkout
    Route::post('/checkout', [CheckoutController::class, 'checkout'])
        ->name('checkout');

    Route::post('/checkout/trial', [CheckoutController::class, 'checkoutWithTrial'])
        ->name('checkout.trial');

    Route::post('/checkout/product', [CheckoutController::class, 'checkoutProduct'])
        ->name('checkout.product');

    // Checkout callbacks
    Route::get('/checkout/success', [CheckoutController::class, 'success'])
        ->name('checkout.success');

    Route::get('/checkout/cancel', [CheckoutController::class, 'cancel'])
        ->name('checkout.cancel');

    // Billing Portal
    Route::get('/portal', [CheckoutController::class, 'portal'])
        ->name('billing.portal');

    // Invoices
    Route::get('/invoices', [InvoiceController::class, 'index'])
        ->name('invoices.index');

    Route::get('/invoices/{invoice}/download', [InvoiceController::class, 'download'])
        ->name('invoices.download');
});

// Signed invoice download (no auth - signature validates)
Route::get('/invoices/{invoice}/download-signed', [InvoiceController::class, 'downloadSigned'])
    ->name('invoices.download.signed')
    ->middleware('signed');
```

---

## API Routes (Subscription Management)

```php
<?php
// routes/api.php

use App\Http\Controllers\Billing\SubscriptionController;
use App\Http\Controllers\Billing\CheckoutController;
use App\Http\Controllers\Billing\InvoiceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Billing API Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum'])->prefix('billing')->group(function () {
    // Subscription status
    Route::get('/subscription', [SubscriptionController::class, 'show'])
        ->name('api.subscription.show');

    // Create subscription (for custom checkout flows)
    Route::post('/subscription', [SubscriptionController::class, 'store'])
        ->name('api.subscription.store');

    // Swap plan
    Route::put('/subscription/swap', [SubscriptionController::class, 'swap'])
        ->name('api.subscription.swap');

    // Cancel subscription
    Route::post('/subscription/cancel', [SubscriptionController::class, 'cancel'])
        ->name('api.subscription.cancel');

    Route::post('/subscription/cancel-now', [SubscriptionController::class, 'cancelNow'])
        ->name('api.subscription.cancel-now');

    // Resume subscription
    Route::post('/subscription/resume', [SubscriptionController::class, 'resume'])
        ->name('api.subscription.resume');

    // Update quantity
    Route::put('/subscription/quantity', [SubscriptionController::class, 'updateQuantity'])
        ->name('api.subscription.quantity');

    // Get billing portal URL (for SPA)
    Route::get('/portal-url', [CheckoutController::class, 'portalUrl'])
        ->name('api.billing.portal-url');

    // Invoices
    Route::get('/invoices', [InvoiceController::class, 'index'])
        ->name('api.invoices.index');

    Route::get('/invoices/upcoming', [InvoiceController::class, 'upcoming'])
        ->name('api.invoices.upcoming');

    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])
        ->name('api.invoices.show');

    Route::get('/invoices/{invoice}/url', [InvoiceController::class, 'getSignedUrl'])
        ->name('api.invoices.url');
});
```

---

## Webhook Routes

```php
<?php
// routes/web.php (webhooks must be in web.php for CSRF exclusion)

/*
|--------------------------------------------------------------------------
| Webhook Routes (No CSRF)
|--------------------------------------------------------------------------
*/

// Stripe webhook - handled by Cashier automatically
// Route: POST /stripe/webhook

// If using custom webhook controller:
Route::post('/stripe/webhook', [WebhookController::class, 'handleStripe'])
    ->name('stripe.webhook');

// Paddle webhook - handled by Cashier automatically
// Route: POST /paddle/webhook
```

---

## CSRF Exclusion

```php
<?php
// bootstrap/app.php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->validateCsrfTokens(except: [
            'stripe/*',
            'paddle/*',
        ]);
    })
    ->create();
```

---

## Premium Content Routes (with middleware)

```php
<?php
// routes/web.php

use App\Http\Middleware\EnsureSubscribed;

// Premium routes - require active subscription
Route::middleware(['auth', 'verified', EnsureSubscribed::class])
    ->prefix('premium')
    ->group(function () {
        Route::get('/dashboard', [PremiumController::class, 'dashboard'])
            ->name('premium.dashboard');

        Route::get('/analytics', [PremiumController::class, 'analytics'])
            ->name('premium.analytics');

        Route::get('/exports', [PremiumController::class, 'exports'])
            ->name('premium.exports');
    });

// Or using route middleware alias
Route::middleware(['auth', 'subscribed:default'])
    ->group(function () {
        // Premium routes
    });
```

---

## Register Middleware Alias

```php
<?php
// bootstrap/app.php

use App\Http\Middleware\EnsureSubscribed;

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'subscribed' => EnsureSubscribed::class,
        ]);
    })
    ->create();
```
