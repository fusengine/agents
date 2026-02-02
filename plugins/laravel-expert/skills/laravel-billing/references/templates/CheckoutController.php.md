---
name: CheckoutController
description: Stripe Checkout and Billing Portal implementation
when-to-use: Hosted checkout pages, customer portal
keywords: checkout, portal, stripe, hosted, payment
---

# Checkout Controller

## Stripe Checkout Implementation

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Handle Stripe Checkout and Billing Portal.
 */
class CheckoutController extends Controller
{
    /**
     * Show pricing page with checkout options.
     */
    public function pricing(Request $request): View
    {
        $user = $request->user();

        return view('billing.pricing', [
            'user' => $user,
            'subscribed' => $user?->subscribed('default') ?? false,
            'currentPlan' => $user?->currentPlan(),
            'plans' => $this->getPlans(),
        ]);
    }

    /**
     * Redirect to Stripe Checkout for subscription.
     */
    public function checkout(Request $request): RedirectResponse
    {
        $request->validate([
            'price_id' => ['required', 'string', 'starts_with:price_'],
        ]);

        $user = $request->user();
        $priceId = $request->input('price_id');

        return $user
            ->newSubscription('default', $priceId)
            ->checkout([
                'success_url' => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('checkout.cancel'),
                'allow_promotion_codes' => true,
                'billing_address_collection' => 'required',
            ]);
    }

    /**
     * Redirect to Stripe Checkout with trial.
     */
    public function checkoutWithTrial(Request $request): RedirectResponse
    {
        $request->validate([
            'price_id' => ['required', 'string', 'starts_with:price_'],
        ]);

        $user = $request->user();
        $priceId = $request->input('price_id');

        return $user
            ->newSubscription('default', $priceId)
            ->trialDays(config('billing.trial_days', 14))
            ->checkout([
                'success_url' => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('checkout.cancel'),
            ]);
    }

    /**
     * Handle successful checkout.
     */
    public function success(Request $request): View|RedirectResponse
    {
        $sessionId = $request->query('session_id');

        if (!$sessionId) {
            return redirect()->route('dashboard')
                ->with('error', 'Invalid checkout session');
        }

        $user = $request->user();

        // Verify session (optional but recommended)
        try {
            $session = $user->stripe()->checkout->sessions->retrieve($sessionId);

            if ($session->payment_status !== 'paid' && $session->payment_status !== 'no_payment_required') {
                return redirect()->route('pricing')
                    ->with('error', 'Payment was not completed');
            }
        } catch (\Exception $e) {
            // Session may have expired, but webhook should have processed
        }

        return view('billing.success', [
            'user' => $user->fresh(),
        ]);
    }

    /**
     * Handle cancelled checkout.
     */
    public function cancel(): RedirectResponse
    {
        return redirect()->route('pricing')
            ->with('info', 'Checkout was cancelled');
    }

    /**
     * Redirect to Stripe Billing Portal.
     */
    public function portal(Request $request): RedirectResponse
    {
        return $request->user()->redirectToBillingPortal(
            route('dashboard')
        );
    }

    /**
     * Get billing portal URL (for SPA).
     */
    public function portalUrl(Request $request): array
    {
        return [
            'url' => $request->user()->billingPortalUrl(route('dashboard')),
        ];
    }

    /**
     * One-time product checkout.
     */
    public function checkoutProduct(Request $request): RedirectResponse
    {
        $request->validate([
            'price_id' => ['required', 'string', 'starts_with:price_'],
            'quantity' => ['sometimes', 'integer', 'min:1', 'max:10'],
        ]);

        $user = $request->user();
        $priceId = $request->input('price_id');
        $quantity = $request->integer('quantity', 1);

        return $user->checkout([$priceId => $quantity], [
            'success_url' => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('checkout.cancel'),
            'metadata' => [
                'user_id' => $user->id,
                'product_type' => 'one_time',
            ],
        ]);
    }

    /**
     * Get available plans.
     */
    private function getPlans(): array
    {
        return [
            [
                'name' => 'Monthly',
                'price_id' => config('billing.prices.monthly'),
                'price' => '$9.99',
                'interval' => 'month',
                'features' => [
                    'Feature 1',
                    'Feature 2',
                    'Feature 3',
                ],
            ],
            [
                'name' => 'Yearly',
                'price_id' => config('billing.prices.yearly'),
                'price' => '$99.99',
                'interval' => 'year',
                'badge' => 'Save 17%',
                'features' => [
                    'All Monthly features',
                    'Priority support',
                    'Advanced analytics',
                ],
            ],
        ];
    }
}
```

---

## Blade View Example

```blade
{{-- resources/views/billing/pricing.blade.php --}}

<div class="pricing-grid">
    @foreach($plans as $plan)
        <div class="pricing-card">
            <h3>{{ $plan['name'] }}</h3>
            @if(isset($plan['badge']))
                <span class="badge">{{ $plan['badge'] }}</span>
            @endif
            <p class="price">{{ $plan['price'] }}/{{ $plan['interval'] }}</p>

            <ul>
                @foreach($plan['features'] as $feature)
                    <li>{{ $feature }}</li>
                @endforeach
            </ul>

            @if($subscribed && $currentPlan === $plan['name'])
                <button disabled>Current Plan</button>
            @else
                <form action="{{ route('checkout') }}" method="POST">
                    @csrf
                    <input type="hidden" name="price_id" value="{{ $plan['price_id'] }}">
                    <button type="submit">
                        {{ $subscribed ? 'Switch Plan' : 'Subscribe' }}
                    </button>
                </form>
            @endif
        </div>
    @endforeach
</div>

@if($subscribed)
    <a href="{{ route('billing.portal') }}">Manage Subscription</a>
@endif
```

---

## Guest Checkout

```php
<?php

use Laravel\Cashier\Checkout;

/**
 * Guest checkout (no user required).
 */
public function guestCheckout(Request $request): RedirectResponse
{
    $request->validate([
        'price_id' => ['required', 'string', 'starts_with:price_'],
        'email' => ['required', 'email'],
    ]);

    return Checkout::guest()
        ->create($request->input('price_id'), [
            'success_url' => route('checkout.guest.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('checkout.cancel'),
            'customer_email' => $request->input('email'),
        ]);
}
```
