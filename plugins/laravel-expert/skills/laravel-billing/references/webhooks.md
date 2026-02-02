---
name: webhooks
description: Webhook handling for Stripe and Paddle payment events
when-to-use: Consult when setting up payment notifications, handling events
keywords: laravel, cashier, webhooks, stripe, paddle, events, notifications
priority: critical
requires: stripe.md
related: subscriptions.md
---

# Webhook Handling

## Why Webhooks are Critical

**Never trust client-side payment confirmations.** Webhooks provide:

- Server-to-server confirmation
- Reliable event delivery
- Handling of async events (3D Secure, delayed charges)
- Subscription lifecycle updates

→ See [templates/WebhookController.php.md](templates/WebhookController.php.md) for implementation

---

## Stripe Webhook Setup

### 1. Register Webhook Endpoint

```bash
# Auto-create in Stripe Dashboard
php artisan cashier:webhook --url="https://yourapp.com/stripe/webhook"
```

### 2. Configure Secret

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Exclude from CSRF

```php
// bootstrap/app.php (Laravel 11+)
->withMiddleware(function (Middleware $middleware) {
    $middleware->validateCsrfTokens(except: [
        'stripe/*',
    ]);
})
```

---

## Important Stripe Events

| Event | When | Action |
|-------|------|--------|
| `customer.subscription.created` | New subscription | Grant access |
| `customer.subscription.updated` | Plan changed | Update features |
| `customer.subscription.deleted` | Cancelled (ended) | Revoke access |
| `invoice.payment_succeeded` | Payment confirmed | Send receipt |
| `invoice.payment_failed` | Payment failed | Notify user |
| `customer.updated` | Customer info changed | Sync data |

---

## Listening to Webhook Events

### Using Laravel Events

```php
// app/Providers/EventServiceProvider.php
use Laravel\Cashier\Events\WebhookReceived;
use Laravel\Cashier\Events\WebhookHandled;

protected $listen = [
    WebhookReceived::class => [
        LogStripeWebhook::class,
    ],
    WebhookHandled::class => [
        ProcessSuccessfulPayment::class,
    ],
];
```

### Custom Listener

```php
// app/Listeners/ProcessSuccessfulPayment.php
use Laravel\Cashier\Events\WebhookHandled;

class ProcessSuccessfulPayment
{
    public function handle(WebhookHandled $event): void
    {
        if ($event->payload['type'] === 'invoice.payment_succeeded') {
            $customerId = $event->payload['data']['object']['customer'];
            $user = User::where('stripe_id', $customerId)->first();

            // Send confirmation email, update records, etc.
            Mail::to($user)->send(new PaymentConfirmation());
        }
    }
}
```

---

## Paddle Webhook Setup

Paddle webhooks are auto-registered at `/paddle/webhook`.

### Events to Handle

```php
use Laravel\Paddle\Events\SubscriptionCreated;
use Laravel\Paddle\Events\SubscriptionCanceled;
use Laravel\Paddle\Events\TransactionCompleted;

protected $listen = [
    SubscriptionCreated::class => [
        SendWelcomeEmail::class,
    ],
    SubscriptionCanceled::class => [
        SendCancellationEmail::class,
    ],
];
```

---

## Local Development with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:8000/stripe/webhook

# In another terminal, trigger events
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
stripe trigger invoice.payment_failed
```

---

## Webhook Security

### Signature Verification

Cashier automatically verifies signatures. Never disable this:

```php
// Cashier handles this - don't bypass!
$payload = $request->getContent();
$signature = $request->header('Stripe-Signature');

// Throws exception if invalid
Webhook::constructEvent($payload, $signature, $secret);
```

### IP Whitelisting (Optional)

For extra security, whitelist Stripe IPs:

```php
// Stripe webhook IPs: https://stripe.com/docs/ips
```

---

## Handling Failed Webhooks

### Retry Logic

Stripe retries failed webhooks with exponential backoff for up to 3 days.

### Idempotency

Always make webhook handlers idempotent:

```php
public function handle(WebhookHandled $event): void
{
    $eventId = $event->payload['id'];

    // Check if already processed
    if (ProcessedWebhook::where('stripe_event_id', $eventId)->exists()) {
        return;
    }

    // Process event
    $this->processEvent($event);

    // Mark as processed
    ProcessedWebhook::create(['stripe_event_id' => $eventId]);
}
```

---

## Common Issues

### Webhook Not Received

1. Check URL is publicly accessible
2. Verify HTTPS (required for production)
3. Check CSRF exclusion
4. Verify webhook secret matches

### Signature Verification Failed

1. Ensure raw body is used (not parsed JSON)
2. Check secret matches exactly
3. Verify no middleware modifying request

### Events Out of Order

Handle gracefully - events may arrive out of order:

```php
// Don't assume subscription.updated comes after subscription.created
// Always check current state before updating
```

→ See [templates/WebhookController.php.md](templates/WebhookController.php.md) for complete example
