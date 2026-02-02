---
name: checkout
description: Stripe Checkout, Paddle overlay, and customer billing portal
when-to-use: Consult when implementing hosted checkout or billing portal
keywords: laravel, cashier, checkout, portal, stripe, paddle, hosted
priority: medium
requires: stripe.md
related: subscriptions.md, payment-methods.md
---

# Checkout and Billing Portal

## Stripe Checkout

Stripe Checkout is a hosted payment page. Benefits:
- PCI compliant (no card handling)
- Mobile optimized
- Supports Apple Pay, Google Pay
- Built-in address collection

→ See [templates/CheckoutController.php.md](templates/CheckoutController.php.md) for implementation

---

## Checkout for Subscriptions

```php
use Laravel\Cashier\Cashier;

Route::get('/checkout', function (Request $request) {
    return $request->user()
        ->newSubscription('default', 'price_monthly')
        ->checkout([
            'success_url' => route('checkout.success'),
            'cancel_url' => route('checkout.cancel'),
        ]);
});
```

### With Trial Period

```php
return $user
    ->newSubscription('default', 'price_monthly')
    ->trialDays(14)
    ->checkout([
        'success_url' => route('success'),
        'cancel_url' => route('cancel'),
    ]);
```

### With Coupon

```php
return $user
    ->newSubscription('default', 'price_monthly')
    ->withCoupon('LAUNCH20')
    ->checkout([
        'success_url' => route('success'),
        'cancel_url' => route('cancel'),
    ]);
```

---

## Checkout for One-Time Products

```php
return $user->checkout('price_one_time', [
    'success_url' => route('success') . '?session_id={CHECKOUT_SESSION_ID}',
    'cancel_url' => route('cancel'),
]);

// Multiple products
return $user->checkout([
    'price_product_a' => 2,
    'price_product_b' => 1,
], [
    'success_url' => route('success'),
    'cancel_url' => route('cancel'),
]);
```

---

## Guest Checkout (No User)

```php
use Laravel\Cashier\Checkout;

return Checkout::guest()
    ->create('price_one_time', [
        'success_url' => route('success') . '?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url' => route('cancel'),
    ]);
```

---

## Checkout Session Options

```php
return $user->checkout('price_monthly', [
    'success_url' => route('success'),
    'cancel_url' => route('cancel'),

    // Collect shipping address
    'shipping_address_collection' => [
        'allowed_countries' => ['US', 'CA'],
    ],

    // Collect phone number
    'phone_number_collection' => [
        'enabled' => true,
    ],

    // Allow promo codes
    'allow_promotion_codes' => true,

    // Pre-fill email
    'customer_email' => $user->email,

    // Custom metadata
    'metadata' => [
        'user_id' => $user->id,
    ],
]);
```

---

## Verifying Checkout Success

```php
Route::get('/checkout/success', function (Request $request) {
    $sessionId = $request->get('session_id');

    if (!$sessionId) {
        return redirect('/');
    }

    // Verify session and get details
    $session = $request->user()->stripe()->checkout->sessions->retrieve($sessionId);

    if ($session->payment_status === 'paid') {
        return view('checkout.success', [
            'session' => $session,
        ]);
    }

    return redirect('/checkout');
});
```

---

## Stripe Billing Portal

Self-service portal where customers can:
- Update payment method
- View invoices
- Cancel/resume subscription
- Change plan (if configured)

### Redirect to Portal

```php
Route::get('/billing-portal', function (Request $request) {
    return $request->user()->redirectToBillingPortal(route('dashboard'));
});
```

### Get Portal URL

```php
$url = $user->billingPortalUrl(route('dashboard'));
```

### Configure Portal in Stripe Dashboard

1. Go to **Settings > Billing > Customer portal**
2. Enable features you want to allow:
   - Update payment methods
   - View invoice history
   - Cancel subscriptions
   - Change plans
3. Set branding and colors

---

## Paddle Checkout

Paddle uses overlay or inline checkout:

### Overlay Checkout

```php
$checkout = $user->subscribe('price_premium_monthly', 'premium')
    ->returnTo(route('subscription.success'));
```

```blade
<x-paddle-button :checkout="$checkout" class="btn btn-primary">
    Subscribe Now
</x-paddle-button>

@paddleJS
```

### Inline Checkout

```blade
<x-paddle-checkout
    :checkout="$checkout"
    id="paddle-checkout"
    :height="600"
/>

@paddleJS
```

---

## Paddle Customer Portal

Paddle doesn't have a full portal like Stripe, but provides:

```php
// Update payment method
return $subscription->redirectToUpdatePaymentMethod();

// Cancel subscription
return $subscription->redirectToCancel();
```

---

## Checkout Best Practices

### DO
- Use `{CHECKOUT_SESSION_ID}` placeholder in success URL
- Verify session server-side
- Handle webhook for reliable confirmation
- Test with Stripe CLI

### DON'T
- Trust client-side redirect alone
- Skip session verification
- Forget cancel URL handling
