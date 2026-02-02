---
name: DunningService
description: Failed payment recovery with grace periods and notifications
when-to-use: Handling payment failures and recovery
keywords: dunning, failed, payment, recovery, grace, notifications
---

# Dunning Implementation

## Webhook Listener

```php
<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Mail\PaymentFailed;
use App\Mail\PaymentFailedFinal;
use App\Mail\PaymentRecovered;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Laravel\Cashier\Events\WebhookHandled;

class HandlePaymentFailure
{
    public function handle(WebhookHandled $event): void
    {
        match ($event->payload['type']) {
            'invoice.payment_failed' => $this->handleFailed($event->payload),
            'invoice.payment_succeeded' => $this->handleRecovered($event->payload),
            'customer.subscription.updated' => $this->handleStatusChange($event->payload),
            default => null,
        };
    }

    private function handleFailed(array $payload): void
    {
        $invoice = $payload['data']['object'];
        $user = User::where('stripe_id', $invoice['customer'])->first();

        if (!$user) {
            return;
        }

        $attemptCount = $invoice['attempt_count'] ?? 1;

        // Different email based on attempt
        $mail = match (true) {
            $attemptCount === 1 => new PaymentFailed($user, $invoice),
            $attemptCount >= 4 => new PaymentFailedFinal($user, $invoice),
            default => new PaymentFailed($user, $invoice),
        };

        Mail::to($user)->queue($mail);
    }

    private function handleRecovered(array $payload): void
    {
        $invoice = $payload['data']['object'];
        $subscription = Subscription::where('stripe_id', $invoice['subscription'])->first();

        if (!$subscription || $subscription->stripe_status !== 'past_due') {
            return;
        }

        Mail::to($subscription->owner)->queue(
            new PaymentRecovered($subscription->owner)
        );
    }

    private function handleStatusChange(array $payload): void
    {
        $stripeSubscription = $payload['data']['object'];
        $subscription = Subscription::where('stripe_id', $stripeSubscription['id'])->first();

        if (!$subscription) {
            return;
        }

        // Track status changes for analytics
        activity()
            ->on($subscription)
            ->withProperties([
                'old_status' => $payload['data']['previous_attributes']['status'] ?? null,
                'new_status' => $stripeSubscription['status'],
            ])
            ->log('subscription_status_changed');
    }
}
```

## Grace Period Middleware

```php
<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckSubscriptionGrace
{
    private const GRACE_DAYS = 7;

    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        $subscription = $user?->subscription('default');

        // Active subscription - allow
        if ($subscription?->active() && $subscription->stripe_status === 'active') {
            return $next($request);
        }

        // Past due - check grace period
        if ($subscription?->stripe_status === 'past_due') {
            $failedAt = $subscription->updated_at;
            $graceEnds = $failedAt->addDays(self::GRACE_DAYS);

            if ($graceEnds->isFuture()) {
                // Still in grace period - allow with warning
                session()->flash('billing_warning', [
                    'message' => 'Your payment failed. Please update your payment method.',
                    'grace_ends' => $graceEnds->diffForHumans(),
                    'update_url' => route('billing.portal'),
                ]);

                return $next($request);
            }
        }

        // Grace period expired or no subscription
        return $request->expectsJson()
            ? response()->json(['error' => 'Subscription required'], 403)
            : redirect()->route('billing.suspended');
    }
}
```

## Dunning Email Scheduler

```php
<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Mail\DunningReminder;
use App\Mail\DunningUrgent;
use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendDunningEmails implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        // Day 3: Reminder
        $this->sendReminders(3);

        // Day 5: Urgent
        $this->sendUrgent(5);

        // Day 7: Final warning
        $this->sendFinal(7);
    }

    private function sendReminders(int $day): void
    {
        Subscription::where('stripe_status', 'past_due')
            ->whereDate('updated_at', today()->subDays($day))
            ->with('owner')
            ->chunk(100, function ($subscriptions) {
                foreach ($subscriptions as $subscription) {
                    Mail::to($subscription->owner)
                        ->queue(new DunningReminder($subscription));
                }
            });
    }

    private function sendUrgent(int $day): void
    {
        Subscription::where('stripe_status', 'past_due')
            ->whereDate('updated_at', today()->subDays($day))
            ->with('owner')
            ->chunk(100, function ($subscriptions) {
                foreach ($subscriptions as $subscription) {
                    Mail::to($subscription->owner)
                        ->queue(new DunningUrgent($subscription));
                }
            });
    }

    private function sendFinal(int $day): void
    {
        Subscription::where('stripe_status', 'past_due')
            ->whereDate('updated_at', today()->subDays($day))
            ->with('owner')
            ->chunk(100, function ($subscriptions) {
                foreach ($subscriptions as $subscription) {
                    Mail::to($subscription->owner)
                        ->queue(new DunningFinal($subscription));
                }
            });
    }
}
```

## Email Templates

```php
<?php
// app/Mail/PaymentFailed.php

declare(strict_types=1);

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailable;

class PaymentFailed extends Mailable
{
    public function __construct(
        public User $user,
        public array $invoice
    ) {}

    public function build(): self
    {
        $portalUrl = $this->user->billingPortalUrl(route('dashboard'));

        return $this->subject('Action Required: Payment Failed')
            ->markdown('emails.billing.payment-failed', [
                'user' => $this->user,
                'amount' => number_format($this->invoice['amount_due'] / 100, 2),
                'updateUrl' => $portalUrl,
                'graceDays' => 7,
            ]);
    }
}
```

```blade
{{-- resources/views/emails/billing/payment-failed.blade.php --}}

@component('mail::message')
# Payment Failed

Hi {{ $user->name }},

We couldn't process your payment of **${{ $amount }}**.

Your access will remain active for **{{ $graceDays }} days** while we retry.

@component('mail::button', ['url' => $updateUrl])
Update Payment Method
@endcomponent

If you have questions, reply to this email.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
```

## Expiration Warning Job

```php
<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Mail\CardExpiringSoon;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendCardExpirationWarnings implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        User::whereNotNull('stripe_id')
            ->chunk(100, function ($users) {
                foreach ($users as $user) {
                    $this->checkCard($user);
                }
            });
    }

    private function checkCard(User $user): void
    {
        $pm = $user->defaultPaymentMethod();

        if (!$pm || $pm->type !== 'card') {
            return;
        }

        $expiry = \Carbon\Carbon::create(
            $pm->card->exp_year,
            $pm->card->exp_month,
            1
        )->endOfMonth();

        $daysUntilExpiry = now()->diffInDays($expiry, false);

        if ($daysUntilExpiry <= 30 && $daysUntilExpiry > 0) {
            Mail::to($user)->queue(new CardExpiringSoon($user, $daysUntilExpiry));
        }
    }
}
```

## Scheduler

```php
// routes/console.php

Schedule::job(new SendDunningEmails)->dailyAt('10:00');
Schedule::job(new SendCardExpirationWarnings)->weekly();
```
