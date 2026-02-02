---
name: WebhookController
description: Custom webhook handling for Stripe events
when-to-use: Processing payment webhooks, custom event handling
keywords: webhook, stripe, events, listener, notification
---

# Webhook Handling

## Event Listener Approach (Recommended)

```php
<?php
// app/Listeners/HandleStripeWebhook.php

declare(strict_types=1);

namespace App\Listeners;

use App\Mail\PaymentFailed;
use App\Mail\SubscriptionCancelled;
use App\Mail\SubscriptionCreated;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Laravel\Cashier\Events\WebhookHandled;

/**
 * Handle Stripe webhook events.
 */
class HandleStripeWebhook
{
    public function handle(WebhookHandled $event): void
    {
        $payload = $event->payload;
        $type = $payload['type'];

        match ($type) {
            'customer.subscription.created' => $this->handleSubscriptionCreated($payload),
            'customer.subscription.deleted' => $this->handleSubscriptionDeleted($payload),
            'invoice.payment_succeeded' => $this->handlePaymentSucceeded($payload),
            'invoice.payment_failed' => $this->handlePaymentFailed($payload),
            'customer.updated' => $this->handleCustomerUpdated($payload),
            default => $this->logUnhandledEvent($type),
        };
    }

    private function handleSubscriptionCreated(array $payload): void
    {
        $customerId = $payload['data']['object']['customer'];
        $user = User::where('stripe_id', $customerId)->first();

        if (!$user) {
            Log::warning('Subscription created for unknown customer', ['stripe_id' => $customerId]);
            return;
        }

        Mail::to($user)->queue(new SubscriptionCreated($user));

        Log::info('Subscription created', [
            'user_id' => $user->id,
            'subscription_id' => $payload['data']['object']['id'],
        ]);
    }

    private function handleSubscriptionDeleted(array $payload): void
    {
        $customerId = $payload['data']['object']['customer'];
        $user = User::where('stripe_id', $customerId)->first();

        if (!$user) {
            return;
        }

        Mail::to($user)->queue(new SubscriptionCancelled($user));

        Log::info('Subscription deleted', [
            'user_id' => $user->id,
        ]);
    }

    private function handlePaymentSucceeded(array $payload): void
    {
        $customerId = $payload['data']['object']['customer'];
        $amount = $payload['data']['object']['amount_paid'];
        $invoiceId = $payload['data']['object']['id'];

        Log::info('Payment succeeded', [
            'customer' => $customerId,
            'amount' => $amount,
            'invoice' => $invoiceId,
        ]);
    }

    private function handlePaymentFailed(array $payload): void
    {
        $customerId = $payload['data']['object']['customer'];
        $user = User::where('stripe_id', $customerId)->first();

        if (!$user) {
            return;
        }

        Mail::to($user)->queue(new PaymentFailed($user));

        Log::warning('Payment failed', [
            'user_id' => $user->id,
            'invoice' => $payload['data']['object']['id'],
        ]);
    }

    private function handleCustomerUpdated(array $payload): void
    {
        $customerId = $payload['data']['object']['id'];
        $user = User::where('stripe_id', $customerId)->first();

        if ($user) {
            // Sync any updated customer data if needed
            Log::info('Customer updated', ['user_id' => $user->id]);
        }
    }

    private function logUnhandledEvent(string $type): void
    {
        Log::debug('Unhandled Stripe webhook event', ['type' => $type]);
    }
}
```

---

## Register Listener

```php
<?php
// app/Providers/EventServiceProvider.php

use App\Listeners\HandleStripeWebhook;
use Laravel\Cashier\Events\WebhookHandled;
use Laravel\Cashier\Events\WebhookReceived;

protected $listen = [
    WebhookHandled::class => [
        HandleStripeWebhook::class,
    ],
    // Optional: Log all received webhooks
    WebhookReceived::class => [
        LogWebhookReceived::class,
    ],
];
```

---

## Idempotent Webhook Processing

```php
<?php
// app/Listeners/IdempotentWebhookHandler.php

declare(strict_types=1);

namespace App\Listeners;

use App\Models\ProcessedWebhook;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Events\WebhookHandled;

class IdempotentWebhookHandler
{
    public function handle(WebhookHandled $event): void
    {
        $eventId = $event->payload['id'];

        // Check if already processed
        if (ProcessedWebhook::where('stripe_event_id', $eventId)->exists()) {
            Log::info('Webhook already processed', ['event_id' => $eventId]);
            return;
        }

        // Process the event
        $this->processEvent($event);

        // Mark as processed
        ProcessedWebhook::create([
            'stripe_event_id' => $eventId,
            'type' => $event->payload['type'],
            'processed_at' => now(),
        ]);
    }

    private function processEvent(WebhookHandled $event): void
    {
        // Your processing logic
    }
}
```

```php
<?php
// Migration for ProcessedWebhook

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('processed_webhooks', function (Blueprint $table) {
            $table->id();
            $table->string('stripe_event_id')->unique();
            $table->string('type');
            $table->timestamp('processed_at');
            $table->timestamps();

            $table->index('created_at');
        });
    }
};
```

---

## Paddle Webhook Listener

```php
<?php
// app/Listeners/HandlePaddleWebhook.php

declare(strict_types=1);

namespace App\Listeners;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Laravel\Paddle\Events\SubscriptionCreated;
use Laravel\Paddle\Events\SubscriptionCanceled;
use Laravel\Paddle\Events\TransactionCompleted;

class HandleSubscriptionCreated
{
    public function handle(SubscriptionCreated $event): void
    {
        $billable = $event->billable;
        $subscription = $event->subscription;

        Mail::to($billable->email)->queue(new WelcomeEmail($subscription));

        Log::info('Paddle subscription created', [
            'user_id' => $billable->id,
            'subscription_id' => $subscription->paddle_id,
        ]);
    }
}

class HandleSubscriptionCanceled
{
    public function handle(SubscriptionCanceled $event): void
    {
        $billable = $event->billable;

        Mail::to($billable->email)->queue(new CancellationEmail());

        Log::info('Paddle subscription canceled', [
            'user_id' => $billable->id,
        ]);
    }
}
```

---

## CSRF Exclusion

```php
<?php
// bootstrap/app.php (Laravel 11+)

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->validateCsrfTokens(except: [
            'stripe/*',
            'paddle/*',
        ]);
    })
    ->create();
```
