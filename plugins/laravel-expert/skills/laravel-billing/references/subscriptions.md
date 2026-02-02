---
name: subscriptions
description: Subscription lifecycle management - create, cancel, swap, pause
when-to-use: Consult when managing subscription state changes
keywords: laravel, cashier, subscriptions, cancel, swap, pause, trial, grace
priority: high
requires: stripe.md
related: webhooks.md, invoices.md
---

# Subscription Management

## Subscription Lifecycle

```
Created → Active → Cancelled → Ended
           ↓          ↓
        On Trial   Grace Period
           ↓
        Past Due
```

Understanding each state is critical for proper access control.

→ See [templates/SubscriptionController.php.md](templates/SubscriptionController.php.md) for implementation

---

## Creating Subscriptions

### Basic Subscription (Stripe)

```php
$user->newSubscription('default', 'price_monthly')
    ->create($paymentMethodId);
```

### With Trial Period

```php
// Trial days
$user->newSubscription('default', 'price_monthly')
    ->trialDays(14)
    ->create($paymentMethodId);

// Trial until date
$user->newSubscription('default', 'price_monthly')
    ->trialUntil(now()->addMonth())
    ->create($paymentMethodId);
```

### Without Payment Method (Trial Only)

```php
$user->newSubscription('default', 'price_monthly')
    ->trialDays(14)
    ->create();  // No payment method required
```

### Multi-Price Subscription

```php
$user->newSubscription('default', ['price_base', 'price_addon'])
    ->create($paymentMethodId);
```

---

## Checking Subscription Status

### Basic Checks

```php
// Has any active subscription named 'default'?
$user->subscribed('default');

// Subscribed to specific price?
$user->subscribedToPrice('price_premium', 'default');

// On trial?
$user->onTrial('default');

// On generic trial (no subscription yet)?
$user->onGenericTrial();
```

### Subscription Object Checks

```php
$subscription = $user->subscription('default');

// Is active (including trial and grace)?
$subscription->active();

// Recurring (active, not on grace period)?
$subscription->recurring();

// Cancelled?
$subscription->canceled();

// On grace period (cancelled but still active)?
$subscription->onGracePeriod();

// Ended (grace period over)?
$subscription->ended();

// Past due (payment failed)?
$subscription->pastDue();

// Incomplete (needs payment action)?
$subscription->incomplete();
```

---

## Cancelling Subscriptions

### Cancel at Period End (Recommended)

```php
$subscription = $user->subscription('default');
$subscription->cancel();

// User keeps access until period ends
if ($subscription->onGracePeriod()) {
    // Show "Your subscription ends on {date}"
    echo $subscription->ends_at->format('M j, Y');
}
```

### Cancel Immediately

```php
$subscription->cancelNow();
// Access revoked immediately
```

### Cancel and Refund (Stripe)

```php
$subscription->cancelNowAndInvoice();
```

---

## Resuming Subscriptions

Only works during grace period:

```php
$subscription = $user->subscription('default');

if ($subscription->onGracePeriod()) {
    $subscription->resume();
}
```

---

## Changing Plans (Swap)

### Simple Swap

```php
$subscription = $user->subscription('default');
$subscription->swap('price_yearly');
```

### Swap and Invoice Immediately

```php
$subscription->swapAndInvoice('price_yearly');
```

### Swap Without Proration

```php
$subscription->noProrate()->swap('price_yearly');
```

### Swap Multiple Prices

```php
$subscription->swap(['price_new_base', 'price_new_addon']);
```

---

## Subscription Quantities

For per-seat or usage-based billing:

```php
$subscription = $user->subscription('default');

// Update quantity
$subscription->updateQuantity(10);

// Increment/decrement
$subscription->incrementQuantity(2);
$subscription->decrementQuantity(1);

// Increment and invoice immediately
$subscription->incrementAndInvoice(5);
```

---

## Subscription Anchors

Bill on specific day of month:

```php
$user->newSubscription('default', 'price_monthly')
    ->anchorBillingCycleOn(1)  // 1st of month
    ->create($paymentMethodId);
```

---

## Grace Periods: Why They Matter

**Always implement grace periods:**

1. User cancels → `onGracePeriod() = true`
2. User keeps access until `ends_at`
3. User can resume before `ends_at`
4. After `ends_at` → `ended() = true`, revoke access

```php
// Middleware example
public function handle($request, $next)
{
    $user = $request->user();

    if (!$user->subscribed('default')) {
        return redirect('subscribe');
    }

    // Allow access during grace period
    return $next($request);
}
```

---

## Subscription Modifiers (Stripe)

Add coupons or promotions:

```php
$user->newSubscription('default', 'price_monthly')
    ->withCoupon('LAUNCH20')
    ->create($paymentMethodId);

// Apply to existing subscription
$user->subscription('default')->applyCoupon('SUMMER10');
```

---

## Multiple Subscriptions

```php
// Premium subscription
$user->newSubscription('premium', 'price_premium')->create($pm);

// Add-on subscription
$user->newSubscription('addon', 'price_storage')->create($pm);

// Check specific subscription
$user->subscribed('premium');
$user->subscribed('addon');
```

→ See [templates/SubscriptionController.php.md](templates/SubscriptionController.php.md) for full implementation
