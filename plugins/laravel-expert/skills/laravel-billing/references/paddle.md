---
name: paddle
description: Laravel Cashier Paddle - subscription billing with Paddle as MoR
when-to-use: Consult when implementing Paddle payments, global tax compliance
keywords: laravel, cashier, paddle, billing, subscriptions, MoR, taxes
priority: high
related: stripe.md, subscriptions.md, webhooks.md
---

# Laravel Cashier Paddle

## What is Cashier Paddle?

Laravel Cashier Paddle integrates with Paddle as a **Merchant of Record (MoR)**. Paddle handles:

- Tax collection and remittance globally
- VAT/GST compliance
- Fraud protection
- Invoice generation (from Paddle)

**Key insight**: Paddle is the merchant, you are the vendor. This simplifies compliance but reduces control.

→ See [templates/UserBillable.php.md](templates/UserBillable.php.md) for model setup

---

## Installation

```bash
composer require laravel/cashier-paddle

php artisan vendor:publish --tag="cashier-paddle-migrations"
php artisan migrate
```

---

## Configuration

### Environment Variables

```env
PADDLE_SELLER_ID=your_seller_id
PADDLE_CLIENT_SIDE_TOKEN=your_client_token
PADDLE_API_KEY=your_api_key
PADDLE_WEBHOOK_SECRET=your_webhook_secret
PADDLE_SANDBOX=true
```

### config/cashier.php

```php
return [
    'seller_id' => env('PADDLE_SELLER_ID'),
    'client_side_token' => env('PADDLE_CLIENT_SIDE_TOKEN'),
    'api_key' => env('PADDLE_API_KEY'),
    'webhook_secret' => env('PADDLE_WEBHOOK_SECRET'),
    'sandbox' => env('PADDLE_SANDBOX', false),
    'currency' => env('CASHIER_CURRENCY', 'USD'),
    'currency_locale' => env('CASHIER_CURRENCY_LOCALE', 'en'),
];
```

### User Model Setup

```php
use Laravel\Paddle\Billable;

class User extends Authenticatable
{
    use Billable;  // Note: Laravel\Paddle\Billable (not Cashier)
}
```

---

## Key Differences from Stripe

| Feature | Stripe | Paddle |
|---------|--------|--------|
| **Trait** | `Laravel\Cashier\Billable` | `Laravel\Paddle\Billable` |
| **Customer ID** | `stripe_id` | `paddle_id` |
| **Checkout** | Redirect or embedded | Overlay or inline |
| **Pause** | Not native | Built-in pause/resume |
| **Portal** | Hosted by Stripe | Update URL from Paddle |

---

## Creating Subscriptions

Paddle uses a checkout-based flow:

```php
// Generate checkout URL
$checkout = $user->subscribe('price_premium_monthly', 'premium')
    ->returnTo(route('subscription.success'));

// In Blade
<x-paddle-button :checkout="$checkout">
    Subscribe Now
</x-paddle-button>
```

### Checkout Options

```php
$checkout = $user->checkout([
    'price_basic' => 1,
    'price_addon' => 2,
])
->customData(['ref' => 'partner123'])
->returnTo(route('success'));
```

---

## Pause and Resume (Paddle-specific)

```php
$subscription = $user->subscription('default');

// Pause at next billing cycle
$subscription->pause();

// Pause immediately
$subscription->pauseNow();

// Pause until specific date
$subscription->pauseUntil(now()->addMonths(2));

// Check if paused
if ($subscription->paused()) {
    // Handle paused state
}

// Resume
$subscription->resume();
```

---

## Transactions vs Invoices

Paddle uses transactions instead of invoices:

```php
// Get all transactions
$transactions = $user->transactions;

foreach ($transactions as $transaction) {
    echo $transaction->paddle_id;
    echo $transaction->invoice_number;
    echo $transaction->total();  // "$50.00"
    echo $transaction->tax();    // "$5.00"
}

// Download invoice PDF
return $transaction->redirectToInvoicePdf();
```

---

## Update Payment Method

```php
$subscription = $user->subscription('default');

// Redirect to Paddle's update page
return $subscription->redirectToUpdatePaymentMethod();

// Or get URL
$url = $subscription->paymentMethodUpdateUrl();
```

---

## When to Choose Paddle

**Choose Paddle if:**
- Selling B2C globally
- Want automated tax compliance
- Early-stage startup
- Don't want to manage VAT/GST

**Choose Stripe if:**
- Need full control
- B2B focus
- High volume (lower fees)
- Need Stripe Connect

→ See [subscriptions.md](subscriptions.md) for subscription management
→ See [webhooks.md](webhooks.md) for webhook handling
