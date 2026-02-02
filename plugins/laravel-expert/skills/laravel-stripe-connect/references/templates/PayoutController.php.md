---
name: PayoutController
description: Seller payout management and balance viewing
when-to-use: Implementing payout functionality
keywords: payouts, balance, transfers, bank, earnings
---

# Payout Controller

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Connect;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Balance;
use Stripe\Payout;
use Stripe\Stripe;

class PayoutController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Get seller's Stripe balance.
     */
    public function balance(Request $request): JsonResponse
    {
        $seller = $request->user()->seller;

        if (!$seller?->isOnboarded()) {
            return response()->json([
                'error' => 'Complete onboarding first',
            ], 403);
        }

        $balance = Balance::retrieve([
            'stripe_account' => $seller->stripe_account_id,
        ]);

        return response()->json([
            'available' => $this->formatBalances($balance->available),
            'pending' => $this->formatBalances($balance->pending),
        ]);
    }

    /**
     * List seller's payouts.
     */
    public function index(Request $request): JsonResponse
    {
        $seller = $request->user()->seller;

        if (!$seller?->isOnboarded()) {
            return response()->json([
                'error' => 'Complete onboarding first',
            ], 403);
        }

        $payouts = Payout::all([
            'limit' => 20,
        ], [
            'stripe_account' => $seller->stripe_account_id,
        ]);

        return response()->json([
            'payouts' => collect($payouts->data)->map(fn ($payout) => [
                'id' => $payout->id,
                'amount' => $payout->amount,
                'currency' => $payout->currency,
                'status' => $payout->status,
                'arrival_date' => $payout->arrival_date,
                'created' => $payout->created,
            ]),
        ]);
    }

    /**
     * Create instant payout (if available).
     */
    public function createInstant(Request $request): JsonResponse
    {
        $seller = $request->user()->seller;

        if (!$seller?->canReceivePayouts()) {
            return response()->json([
                'error' => 'Payouts not enabled',
            ], 403);
        }

        $validated = $request->validate([
            'amount' => ['required', 'integer', 'min:100'],
            'currency' => ['required', 'string', 'size:3'],
        ]);

        $balance = Balance::retrieve([
            'stripe_account' => $seller->stripe_account_id,
        ]);

        $available = collect($balance->instant_available ?? [])
            ->firstWhere('currency', $validated['currency']);

        if (!$available || $available->amount < $validated['amount']) {
            return response()->json([
                'error' => 'Insufficient instant balance',
                'available' => $available?->amount ?? 0,
            ], 422);
        }

        $payout = Payout::create([
            'amount' => $validated['amount'],
            'currency' => $validated['currency'],
            'method' => 'instant',
        ], [
            'stripe_account' => $seller->stripe_account_id,
        ]);

        return response()->json([
            'payout_id' => $payout->id,
            'status' => $payout->status,
            'arrival_date' => $payout->arrival_date,
        ]);
    }

    /**
     * Get payout schedule.
     */
    public function schedule(Request $request): JsonResponse
    {
        $seller = $request->user()->seller;

        if (!$seller?->hasStripeAccount()) {
            return response()->json([
                'error' => 'No seller account',
            ], 404);
        }

        $account = \Stripe\Account::retrieve($seller->stripe_account_id);

        return response()->json([
            'interval' => $account->settings->payouts->schedule->interval,
            'delay_days' => $account->settings->payouts->schedule->delay_days,
            'weekly_anchor' => $account->settings->payouts->schedule->weekly_anchor ?? null,
            'monthly_anchor' => $account->settings->payouts->schedule->monthly_anchor ?? null,
        ]);
    }

    /**
     * Update payout schedule (platform-controlled).
     */
    public function updateSchedule(Request $request): JsonResponse
    {
        $seller = $request->user()->seller;

        $validated = $request->validate([
            'interval' => ['required', 'in:daily,weekly,monthly,manual'],
            'weekly_anchor' => ['required_if:interval,weekly', 'in:monday,tuesday,wednesday,thursday,friday'],
            'monthly_anchor' => ['required_if:interval,monthly', 'integer', 'min:1', 'max:31'],
        ]);

        $scheduleParams = [
            'interval' => $validated['interval'],
        ];

        if ($validated['interval'] === 'weekly') {
            $scheduleParams['weekly_anchor'] = $validated['weekly_anchor'];
        } elseif ($validated['interval'] === 'monthly') {
            $scheduleParams['monthly_anchor'] = $validated['monthly_anchor'];
        }

        \Stripe\Account::update($seller->stripe_account_id, [
            'settings' => [
                'payouts' => [
                    'schedule' => $scheduleParams,
                ],
            ],
        ]);

        return response()->json([
            'message' => 'Payout schedule updated',
        ]);
    }

    /**
     * Get earnings summary.
     */
    public function earnings(Request $request): JsonResponse
    {
        $seller = $request->user()->seller;

        $period = $request->input('period', 'month');

        $startDate = match ($period) {
            'week' => now()->subWeek(),
            'month' => now()->subMonth(),
            'year' => now()->subYear(),
            default => now()->subMonth(),
        };

        $transactions = $seller->transactions()
            ->where('status', 'completed')
            ->where('created_at', '>=', $startDate)
            ->get();

        return response()->json([
            'period' => $period,
            'total_sales' => $transactions->sum('amount'),
            'total_fees' => $transactions->sum('platform_fee'),
            'net_earnings' => $transactions->sum('seller_amount'),
            'transaction_count' => $transactions->count(),
        ]);
    }

    private function formatBalances(array $balances): array
    {
        return collect($balances)->map(fn ($b) => [
            'amount' => $b->amount,
            'currency' => $b->currency,
        ])->toArray();
    }
}
```
