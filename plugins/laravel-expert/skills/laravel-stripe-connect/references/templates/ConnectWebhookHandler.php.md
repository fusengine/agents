---
name: ConnectWebhookHandler
description: Webhook handling for Connect events
when-to-use: Processing Stripe Connect webhook events
keywords: webhooks, events, account, payout, transfer
---

# Connect Webhook Handler

## Controller

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Connect;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;

class ConnectWebhookController extends Controller
{
    public function handle(Request $request): Response
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                config('services.stripe.connect_webhook_secret')
            );
        } catch (\Exception $e) {
            Log::error('Connect webhook signature verification failed', [
                'error' => $e->getMessage(),
            ]);

            return response('Invalid signature', 400);
        }

        $handler = match ($event->type) {
            'account.updated' => $this->handleAccountUpdated(...),
            'account.application.deauthorized' => $this->handleAccountDeauthorized(...),
            'payout.paid' => $this->handlePayoutPaid(...),
            'payout.failed' => $this->handlePayoutFailed(...),
            'payment_intent.succeeded' => $this->handlePaymentSucceeded(...),
            'charge.dispute.created' => $this->handleDisputeCreated(...),
            'charge.dispute.closed' => $this->handleDisputeClosed(...),
            'transfer.created' => $this->handleTransferCreated(...),
            default => null,
        };

        if ($handler) {
            $handler($event->data->object, $event);
        }

        return response('OK', 200);
    }

    private function handleAccountUpdated($account, $event): void
    {
        $seller = Seller::where('stripe_account_id', $account->id)->first();

        if (!$seller) {
            Log::warning('Account updated for unknown seller', [
                'stripe_account_id' => $account->id,
            ]);
            return;
        }

        $wasOnboarded = $seller->isOnboarded();

        $seller->update([
            'charges_enabled' => $account->charges_enabled,
            'payouts_enabled' => $account->payouts_enabled,
            'onboarding_completed_at' => ($account->charges_enabled && $account->payouts_enabled)
                ? ($seller->onboarding_completed_at ?? now())
                : null,
        ]);

        if (!$wasOnboarded && $seller->isOnboarded()) {
            event(new \App\Events\SellerOnboardingCompleted($seller));
        }

        if (!empty($account->requirements->currently_due)) {
            event(new \App\Events\SellerRequiresAction($seller, $account->requirements->currently_due));
        }
    }

    private function handleAccountDeauthorized($account, $event): void
    {
        $seller = Seller::where('stripe_account_id', $account->id)->first();

        if ($seller) {
            $seller->update([
                'charges_enabled' => false,
                'payouts_enabled' => false,
            ]);

            event(new \App\Events\SellerDisconnected($seller));
        }
    }

    private function handlePayoutPaid($payout, $event): void
    {
        $stripeAccountId = $event->account;
        $seller = Seller::where('stripe_account_id', $stripeAccountId)->first();

        if ($seller) {
            event(new \App\Events\SellerPayoutCompleted($seller, [
                'payout_id' => $payout->id,
                'amount' => $payout->amount,
                'currency' => $payout->currency,
                'arrival_date' => $payout->arrival_date,
            ]));
        }
    }

    private function handlePayoutFailed($payout, $event): void
    {
        $stripeAccountId = $event->account;
        $seller = Seller::where('stripe_account_id', $stripeAccountId)->first();

        if ($seller) {
            Log::error('Payout failed', [
                'seller_id' => $seller->id,
                'payout_id' => $payout->id,
                'failure_code' => $payout->failure_code,
                'failure_message' => $payout->failure_message,
            ]);

            event(new \App\Events\SellerPayoutFailed($seller, [
                'payout_id' => $payout->id,
                'failure_code' => $payout->failure_code,
                'failure_message' => $payout->failure_message,
            ]));
        }
    }

    private function handlePaymentSucceeded($paymentIntent, $event): void
    {
        $transaction = Transaction::where('stripe_payment_intent_id', $paymentIntent->id)->first();

        if ($transaction && $transaction->status !== 'completed') {
            $transaction->update([
                'status' => 'completed',
                'stripe_transfer_id' => $paymentIntent->transfer ?? null,
            ]);

            event(new \App\Events\TransactionCompleted($transaction));
        }
    }

    private function handleDisputeCreated($dispute, $event): void
    {
        $transaction = Transaction::where('stripe_payment_intent_id', $dispute->payment_intent)->first();

        if ($transaction) {
            Log::warning('Dispute created', [
                'transaction_id' => $transaction->id,
                'dispute_id' => $dispute->id,
                'amount' => $dispute->amount,
                'reason' => $dispute->reason,
            ]);

            event(new \App\Events\TransactionDisputed($transaction, [
                'dispute_id' => $dispute->id,
                'amount' => $dispute->amount,
                'reason' => $dispute->reason,
                'evidence_due_by' => $dispute->evidence_details->due_by,
            ]));
        }
    }

    private function handleDisputeClosed($dispute, $event): void
    {
        $transaction = Transaction::where('stripe_payment_intent_id', $dispute->payment_intent)->first();

        if ($transaction) {
            $won = $dispute->status === 'won';

            Log::info('Dispute closed', [
                'transaction_id' => $transaction->id,
                'dispute_id' => $dispute->id,
                'status' => $dispute->status,
                'won' => $won,
            ]);

            event(new \App\Events\DisputeResolved($transaction, [
                'dispute_id' => $dispute->id,
                'won' => $won,
            ]));
        }
    }

    private function handleTransferCreated($transfer, $event): void
    {
        Transaction::where('stripe_transfer_id', $transfer->id)
            ->update(['status' => 'transferred']);
    }
}
```

## Event Classes

```php
<?php
// app/Events/SellerOnboardingCompleted.php

declare(strict_types=1);

namespace App\Events;

use App\Models\Seller;
use Illuminate\Foundation\Events\Dispatchable;

class SellerOnboardingCompleted
{
    use Dispatchable;

    public function __construct(
        public Seller $seller
    ) {}
}
```

## Listener Example

```php
<?php
// app/Listeners/SendSellerWelcomeEmail.php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\SellerOnboardingCompleted;
use App\Mail\SellerWelcome;
use Illuminate\Support\Facades\Mail;

class SendSellerWelcomeEmail
{
    public function handle(SellerOnboardingCompleted $event): void
    {
        Mail::to($event->seller->user)
            ->queue(new SellerWelcome($event->seller));
    }
}
```
