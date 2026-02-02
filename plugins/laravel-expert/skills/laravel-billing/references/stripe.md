---
name: stripe
description: Laravel Cashier Stripe - subscription billing with Stripe
when-to-use: Consult when implementing Stripe payments, subscriptions
keywords: laravel, cashier, stripe, billing, subscriptions, payments
priority: high
related: paddle.md, subscriptions.md, webhooks.md
---

# Laravel Cashier Stripe

## What is Cashier Stripe?

Laravel Cashier Stripe provides an expressive interface to Stripe's subscription billing services. It handles:

- Subscription management (create, cancel, resume, swap)
- Subscription quantities
- Invoices and receipts
- Payment method management
- Stripe Checkout integration
- Customer billing portal

**Key insight**: Stripe is a payment processor. You are the merchant of record, responsible for taxes and compliance.

→ See [templates/UserBillable.php.md](templates/UserBillable.php.md) for model setup

---

## Installation

```bash
composer require laravel/cashier

php artisan vendor:publish --tag="cashier-migrations"
php artisan migrate
```

---

## Configuration

### Environment Variables

```env
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### User Model Setup

```php
use Laravel\Cashier\Billable;

class User extends Authenticatable
{
    use Billable;
}
```

### Database Columns Added

Cashier adds to `users` table:
- `stripe_id` - Stripe customer ID
- `pm_type` - Payment method type
- `pm_last_four` - Last 4 digits
- `trial_ends_at` - Trial end date

Creates tables:
- `subscriptions` - Subscription records
- `subscription_items` - Multi-price subscriptions

---

## When to Use Stripe vs Paddle

| Scenario | Recommendation |
|----------|----------------|
| B2B SaaS | Stripe |
| High volume (>$1M/year) | Stripe |
| Need Connect/Marketplace | Stripe |
| Custom checkout experience | Stripe |
| Global B2C with tax compliance | Paddle |
| Early-stage startup | Paddle |

---

## Stripe Customer

```php
// Create or get Stripe customer
$stripeCustomer = $user->createOrGetStripeCustomer();

// Update customer info
$user->updateStripeCustomer([
    'name' => $user->name,
    'email' => $user->email,
]);

// Get Stripe customer ID
$stripeId = $user->stripe_id;
```

---

## Price IDs

Always use **Price IDs** (not Product IDs) for subscriptions:

```php
// In Stripe Dashboard: Products > Your Product > Pricing
// Format: price_xxxxxxxxxxxxx

$user->newSubscription('default', 'price_monthly')->create($pm);
```

Store price IDs in config:

```php
// config/billing.php
return [
    'prices' => [
        'monthly' => env('STRIPE_PRICE_MONTHLY'),
        'yearly' => env('STRIPE_PRICE_YEARLY'),
    ],
];
```

---

## Handling Incomplete Payments

3D Secure and SCA require user action:

```php
use Laravel\Cashier\Exceptions\IncompletePayment;

try {
    $subscription = $user->newSubscription('default', 'price_id')
        ->create($paymentMethod);
} catch (IncompletePayment $exception) {
    return redirect()->route('cashier.payment', [
        $exception->payment->id,
        'redirect' => route('billing.success'),
    ]);
}
```

---

## Stripe CLI for Local Development

```bash
# Install
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:8000/stripe/webhook

# Trigger test events
stripe trigger payment_intent.succeeded
```

→ See [webhooks.md](webhooks.md) for webhook handling
→ See [templates/SubscriptionController.php.md](templates/SubscriptionController.php.md) for complete example
