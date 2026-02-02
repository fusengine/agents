---
name: payment-methods
description: Managing payment methods - cards, wallets, updates
when-to-use: Consult when adding, updating, or removing payment methods
keywords: laravel, cashier, payment, cards, methods, stripe, wallet
priority: medium
requires: stripe.md
related: subscriptions.md, checkout.md
---

# Payment Methods

## Overview

Payment methods in Cashier represent stored cards, bank accounts, or digital wallets. Stripe stores these securely - you only handle tokens.

---

## Getting Payment Methods

```php
// Default payment method
$paymentMethod = $user->defaultPaymentMethod();

if ($paymentMethod) {
    echo $paymentMethod->card->brand;      // "visa"
    echo $paymentMethod->card->last4;      // "4242"
    echo $paymentMethod->card->exp_month;  // 12
    echo $paymentMethod->card->exp_year;   // 2025
}

// All payment methods of a type
$cards = $user->paymentMethods('card');
$sepas = $user->paymentMethods('sepa_debit');
```

---

## Checking Payment Methods

```php
// Has any payment method?
if ($user->hasPaymentMethod()) {
    // User can be charged
}

// Has default payment method?
if ($user->hasDefaultPaymentMethod()) {
    // Has a preferred method set
}

// Check stored values (from database)
$type = $user->pm_type;        // "card"
$last4 = $user->pm_last_four;  // "4242"
```

---

## Adding Payment Methods

### Using Stripe.js (Recommended)

```javascript
// Frontend: Collect card with Stripe Elements
const stripe = Stripe('pk_test_...');
const elements = stripe.elements();
const cardElement = elements.create('card');

// On form submit
const { setupIntent, error } = await stripe.confirmCardSetup(
    clientSecret,
    {
        payment_method: {
            card: cardElement,
            billing_details: { name: 'John Doe' }
        }
    }
);

// Send setupIntent.payment_method to backend
```

### Backend: Save Payment Method

```php
// Add payment method
$user->addPaymentMethod($paymentMethodId);

// Add and set as default
$user->updateDefaultPaymentMethod($paymentMethodId);
```

---

## Setup Intents

For adding cards without immediate charge:

```php
// Create setup intent
$intent = $user->createSetupIntent();

// Pass to frontend
return view('billing.add-card', [
    'intent' => $intent,
]);
```

```blade
{{-- In Blade --}}
<input id="client-secret" type="hidden" value="{{ $intent->client_secret }}">
```

---

## Updating Default Payment Method

```php
// From payment method ID
$user->updateDefaultPaymentMethod($paymentMethodId);

// This also updates pm_type and pm_last_four columns
```

---

## Removing Payment Methods

```php
// Remove specific payment method
$paymentMethod = $user->findPaymentMethod($paymentMethodId);
$paymentMethod->delete();

// Or directly
$user->deletePaymentMethod($paymentMethodId);

// Remove all cards
$user->deletePaymentMethods('card');
```

---

## Payment Method Types

| Type | Use Case |
|------|----------|
| `card` | Credit/debit cards |
| `sepa_debit` | European bank transfers |
| `us_bank_account` | US ACH payments |
| `link` | Stripe Link (one-click) |

```php
// Check type
$paymentMethod = $user->defaultPaymentMethod();

if ($paymentMethod->type === 'card') {
    echo "Card ending in " . $paymentMethod->card->last4;
} elseif ($paymentMethod->type === 'sepa_debit') {
    echo "Bank account ending in " . $paymentMethod->sepa_debit->last4;
}
```

---

## Card Expiration Handling

### Check for Expiring Cards

```php
// Get cards expiring soon
$expiringCards = User::whereNotNull('stripe_id')
    ->get()
    ->filter(function ($user) {
        $pm = $user->defaultPaymentMethod();
        if (!$pm || $pm->type !== 'card') return false;

        $expiry = Carbon::create(
            $pm->card->exp_year,
            $pm->card->exp_month,
            1
        )->endOfMonth();

        return $expiry->lessThan(now()->addMonth());
    });
```

### Notify Users

```php
// Scheduled job
$expiringCards->each(function ($user) {
    Mail::to($user)->send(new CardExpiringNotification($user));
});
```

---

## Automatic Card Updates

Stripe automatically updates cards when:
- Card is reissued (new expiry)
- Card number changes (some networks)

Listen for webhook:

```php
if ($event->payload['type'] === 'payment_method.automatically_updated') {
    $customerId = $event->payload['data']['object']['customer'];
    // Sync updated info if needed
}
```

---

## Paddle Payment Methods

Paddle handles payment methods differently:

```php
$subscription = $user->subscription('default');

// Redirect to update payment
return $subscription->redirectToUpdatePaymentMethod();

// Get URL
$url = $subscription->paymentMethodUpdateUrl();
```

---

## Best Practices

### DO
- Use Stripe.js for PCI compliance
- Store only pm_type and pm_last_four locally
- Handle card expiration proactively
- Use setup intents for card collection

### DON'T
- Store full card numbers (PCI violation)
- Skip payment method verification
- Ignore expiring cards
- Allow subscriptions without payment method (except trials)
