---
name: SellerOnboardingController
description: Complete seller onboarding with Express accounts
when-to-use: Implementing seller registration and KYC flow
keywords: onboarding, kyc, express, account-link, verification
---

# Seller Onboarding Controller

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Connect;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Stripe\Account;
use Stripe\AccountLink;
use Stripe\Stripe;

class SellerOnboardingController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Start seller onboarding - create Express account.
     */
    public function start(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->seller?->hasStripeAccount()) {
            return response()->json([
                'error' => 'Seller account already exists',
            ], 422);
        }

        $validated = $request->validate([
            'business_name' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'size:2'],
        ]);

        $account = Account::create([
            'type' => 'express',
            'country' => $validated['country'],
            'email' => $user->email,
            'capabilities' => [
                'card_payments' => ['requested' => true],
                'transfers' => ['requested' => true],
            ],
            'business_profile' => [
                'name' => $validated['business_name'],
            ],
        ]);

        $seller = Seller::create([
            'user_id' => $user->id,
            'business_name' => $validated['business_name'],
            'stripe_account_id' => $account->id,
        ]);

        $link = $this->createOnboardingLink($seller);

        return response()->json([
            'seller_id' => $seller->id,
            'onboarding_url' => $link->url,
        ], 201);
    }

    /**
     * Generate onboarding link for incomplete sellers.
     */
    public function continueOnboarding(Request $request): JsonResponse
    {
        $seller = $request->user()->seller;

        if (!$seller?->hasStripeAccount()) {
            return response()->json([
                'error' => 'No seller account found',
            ], 404);
        }

        if ($seller->isOnboarded()) {
            return response()->json([
                'error' => 'Onboarding already completed',
            ], 422);
        }

        $link = $this->createOnboardingLink($seller);

        return response()->json([
            'onboarding_url' => $link->url,
        ]);
    }

    /**
     * Handle return from Stripe onboarding.
     */
    public function complete(Request $request): RedirectResponse
    {
        $seller = $request->user()->seller;

        if (!$seller) {
            return redirect()->route('seller.dashboard')
                ->with('error', 'Seller account not found');
        }

        $this->syncAccountStatus($seller);

        if ($seller->isOnboarded()) {
            return redirect()->route('seller.dashboard')
                ->with('success', 'Onboarding completed! You can now accept payments.');
        }

        return redirect()->route('seller.dashboard')
            ->with('warning', 'Please complete all required information.');
    }

    /**
     * Handle refresh URL (link expired).
     */
    public function refresh(Request $request): RedirectResponse
    {
        $seller = $request->user()->seller;

        if (!$seller?->hasStripeAccount()) {
            return redirect()->route('seller.register');
        }

        $link = $this->createOnboardingLink($seller);

        return redirect($link->url);
    }

    /**
     * Get current onboarding status.
     */
    public function status(Request $request): JsonResponse
    {
        $seller = $request->user()->seller;

        if (!$seller?->hasStripeAccount()) {
            return response()->json([
                'status' => 'not_started',
            ]);
        }

        $account = Account::retrieve($seller->stripe_account_id);

        return response()->json([
            'status' => $this->determineStatus($account),
            'charges_enabled' => $account->charges_enabled,
            'payouts_enabled' => $account->payouts_enabled,
            'requirements' => [
                'currently_due' => $account->requirements->currently_due ?? [],
                'eventually_due' => $account->requirements->eventually_due ?? [],
                'past_due' => $account->requirements->past_due ?? [],
            ],
        ]);
    }

    /**
     * Create Stripe Express dashboard login link.
     */
    public function dashboard(Request $request): JsonResponse
    {
        $seller = $request->user()->seller;

        if (!$seller?->isOnboarded()) {
            return response()->json([
                'error' => 'Complete onboarding first',
            ], 403);
        }

        $link = \Stripe\Account::createLoginLink($seller->stripe_account_id);

        return response()->json([
            'dashboard_url' => $link->url,
        ]);
    }

    private function createOnboardingLink(Seller $seller): AccountLink
    {
        return AccountLink::create([
            'account' => $seller->stripe_account_id,
            'refresh_url' => route('connect.onboarding.refresh'),
            'return_url' => route('connect.onboarding.complete'),
            'type' => 'account_onboarding',
        ]);
    }

    private function syncAccountStatus(Seller $seller): void
    {
        $account = Account::retrieve($seller->stripe_account_id);

        $seller->update([
            'charges_enabled' => $account->charges_enabled,
            'payouts_enabled' => $account->payouts_enabled,
            'onboarding_completed_at' => ($account->charges_enabled && $account->payouts_enabled)
                ? now()
                : null,
        ]);
    }

    private function determineStatus($account): string
    {
        if ($account->charges_enabled && $account->payouts_enabled) {
            return 'complete';
        }

        if (!empty($account->requirements->past_due)) {
            return 'action_required';
        }

        if (!empty($account->requirements->currently_due)) {
            return 'pending';
        }

        return 'restricted';
    }
}
```
