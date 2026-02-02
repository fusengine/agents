---
name: SubscriptionController
description: Complete subscription management controller
when-to-use: CRUD operations for subscriptions
keywords: subscription, controller, create, cancel, swap, resume
---

# Subscription Controller

## Complete Implementation

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Billing\CreateSubscriptionRequest;
use App\Http\Requests\Billing\SwapSubscriptionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Cashier\Exceptions\IncompletePayment;

/**
 * Handle subscription lifecycle operations.
 */
class SubscriptionController extends Controller
{
    /**
     * Show current subscription status.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $subscription = $user->subscription('default');

        return response()->json([
            'subscribed' => $user->subscribed('default'),
            'on_trial' => $user->onTrial('default'),
            'on_grace_period' => $subscription?->onGracePeriod() ?? false,
            'cancelled' => $subscription?->canceled() ?? false,
            'ends_at' => $subscription?->ends_at?->toIso8601String(),
            'plan' => $user->currentPlan(),
            'payment_method' => $user->hasDefaultPaymentMethod() ? [
                'type' => $user->pm_type,
                'last_four' => $user->pm_last_four,
            ] : null,
        ]);
    }

    /**
     * Create a new subscription.
     */
    public function store(CreateSubscriptionRequest $request): JsonResponse|RedirectResponse
    {
        $user = $request->user();
        $priceId = $request->validated('price_id');
        $paymentMethod = $request->validated('payment_method');

        try {
            $subscription = $user->newSubscription('default', $priceId);

            // Add trial if applicable
            if ($request->boolean('with_trial')) {
                $subscription->trialDays(config('billing.trial_days', 14));
            }

            // Add coupon if provided
            if ($coupon = $request->validated('coupon')) {
                $subscription->withCoupon($coupon);
            }

            $subscription->create($paymentMethod);

            return response()->json([
                'message' => 'Subscription created successfully',
                'subscription' => [
                    'name' => 'default',
                    'status' => 'active',
                ],
            ], 201);

        } catch (IncompletePayment $exception) {
            return response()->json([
                'requires_action' => true,
                'payment_intent' => $exception->payment->id,
                'redirect_url' => route('cashier.payment', [
                    $exception->payment->id,
                    'redirect' => route('billing.success'),
                ]),
            ], 402);
        }
    }

    /**
     * Swap to a different plan.
     */
    public function swap(SwapSubscriptionRequest $request): JsonResponse
    {
        $user = $request->user();
        $subscription = $user->subscription('default');

        if (!$subscription) {
            return response()->json([
                'message' => 'No active subscription found',
            ], 404);
        }

        $newPriceId = $request->validated('price_id');
        $invoiceNow = $request->boolean('invoice_now', false);

        try {
            if ($invoiceNow) {
                $subscription->swapAndInvoice($newPriceId);
            } else {
                $subscription->swap($newPriceId);
            }

            return response()->json([
                'message' => 'Subscription updated successfully',
                'plan' => $user->fresh()->currentPlan(),
            ]);

        } catch (IncompletePayment $exception) {
            return response()->json([
                'requires_action' => true,
                'payment_intent' => $exception->payment->id,
            ], 402);
        }
    }

    /**
     * Cancel subscription at period end.
     */
    public function cancel(Request $request): JsonResponse
    {
        $user = $request->user();
        $subscription = $user->subscription('default');

        if (!$subscription || $subscription->canceled()) {
            return response()->json([
                'message' => 'No active subscription to cancel',
            ], 404);
        }

        $subscription->cancel();

        return response()->json([
            'message' => 'Subscription cancelled',
            'ends_at' => $subscription->ends_at->toIso8601String(),
            'on_grace_period' => true,
        ]);
    }

    /**
     * Cancel subscription immediately.
     */
    public function cancelNow(Request $request): JsonResponse
    {
        $user = $request->user();
        $subscription = $user->subscription('default');

        if (!$subscription) {
            return response()->json([
                'message' => 'No subscription found',
            ], 404);
        }

        $subscription->cancelNow();

        return response()->json([
            'message' => 'Subscription cancelled immediately',
        ]);
    }

    /**
     * Resume a cancelled subscription.
     */
    public function resume(Request $request): JsonResponse
    {
        $user = $request->user();
        $subscription = $user->subscription('default');

        if (!$subscription?->onGracePeriod()) {
            return response()->json([
                'message' => 'Cannot resume subscription',
            ], 400);
        }

        $subscription->resume();

        return response()->json([
            'message' => 'Subscription resumed',
            'status' => 'active',
        ]);
    }

    /**
     * Update subscription quantity.
     */
    public function updateQuantity(Request $request): JsonResponse
    {
        $request->validate([
            'quantity' => ['required', 'integer', 'min:1', 'max:100'],
        ]);

        $user = $request->user();
        $subscription = $user->subscription('default');

        if (!$subscription) {
            return response()->json([
                'message' => 'No subscription found',
            ], 404);
        }

        $subscription->updateQuantity($request->integer('quantity'));

        return response()->json([
            'message' => 'Quantity updated',
            'quantity' => $subscription->quantity,
        ]);
    }
}
```

---

## Form Requests

```php
<?php
// app/Http/Requests/Billing/CreateSubscriptionRequest.php

declare(strict_types=1);

namespace App\Http\Requests\Billing;

use Illuminate\Foundation\Http\FormRequest;

class CreateSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'price_id' => ['required', 'string', 'starts_with:price_'],
            'payment_method' => ['required', 'string', 'starts_with:pm_'],
            'with_trial' => ['sometimes', 'boolean'],
            'coupon' => ['sometimes', 'string', 'max:50'],
        ];
    }
}
```

```php
<?php
// app/Http/Requests/Billing/SwapSubscriptionRequest.php

declare(strict_types=1);

namespace App\Http\Requests\Billing;

use Illuminate\Foundation\Http\FormRequest;

class SwapSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->subscribed('default') ?? false;
    }

    public function rules(): array
    {
        return [
            'price_id' => ['required', 'string', 'starts_with:price_'],
            'invoice_now' => ['sometimes', 'boolean'],
        ];
    }
}
```

---

## Middleware

```php
<?php
// app/Http/Middleware/EnsureSubscribed.php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSubscribed
{
    public function handle(Request $request, Closure $next, string $name = 'default'): Response
    {
        $user = $request->user();

        if (!$user?->subscribed($name)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Subscription required',
                    'subscribe_url' => route('subscribe'),
                ], 403);
            }

            return redirect()->route('subscribe');
        }

        return $next($request);
    }
}
```
