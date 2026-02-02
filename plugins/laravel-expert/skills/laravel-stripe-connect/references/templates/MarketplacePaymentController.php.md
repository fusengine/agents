---
name: MarketplacePaymentController
description: Payment creation with destination charges and fees
when-to-use: Implementing customer payments with seller transfers
keywords: payments, destination, charges, application-fee, transfer
---

# Marketplace Payment Controller

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Connect;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Seller;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class MarketplacePaymentController extends Controller
{
    private const PLATFORM_FEE_PERCENT = 10;

    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Create payment intent with destination charge.
     */
    public function createPayment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'payment_method_id' => ['required', 'string'],
        ]);

        $product = Product::with('seller')->findOrFail($validated['product_id']);
        $seller = $product->seller;

        if (!$seller->canAcceptPayments()) {
            return response()->json([
                'error' => 'Seller cannot accept payments',
            ], 422);
        }

        $amount = $product->price;
        $platformFee = $this->calculateFee($amount);

        $paymentIntent = PaymentIntent::create([
            'amount' => $amount,
            'currency' => 'eur',
            'payment_method' => $validated['payment_method_id'],
            'confirmation_method' => 'manual',
            'application_fee_amount' => $platformFee,
            'transfer_data' => [
                'destination' => $seller->stripe_account_id,
            ],
            'metadata' => [
                'product_id' => $product->id,
                'seller_id' => $seller->id,
                'buyer_id' => $request->user()->id,
            ],
        ], [
            'idempotency_key' => "payment_{$product->id}_{$request->user()->id}_" . time(),
        ]);

        $transaction = Transaction::create([
            'seller_id' => $seller->id,
            'buyer_id' => $request->user()->id,
            'stripe_payment_intent_id' => $paymentIntent->id,
            'amount' => $amount,
            'platform_fee' => $platformFee,
            'seller_amount' => $amount - $platformFee,
            'currency' => 'eur',
            'status' => 'pending',
        ]);

        return response()->json([
            'payment_intent_id' => $paymentIntent->id,
            'client_secret' => $paymentIntent->client_secret,
            'transaction_id' => $transaction->id,
            'requires_action' => $paymentIntent->status === 'requires_action',
        ]);
    }

    /**
     * Confirm payment after 3D Secure.
     */
    public function confirmPayment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payment_intent_id' => ['required', 'string'],
        ]);

        $paymentIntent = PaymentIntent::retrieve($validated['payment_intent_id']);

        if ($paymentIntent->status === 'requires_confirmation') {
            $paymentIntent->confirm();
        }

        $transaction = Transaction::where('stripe_payment_intent_id', $paymentIntent->id)->first();

        if ($transaction && $paymentIntent->status === 'succeeded') {
            $transaction->update([
                'status' => 'completed',
                'stripe_transfer_id' => $paymentIntent->transfer ?? null,
            ]);
        }

        return response()->json([
            'status' => $paymentIntent->status,
            'succeeded' => $paymentIntent->status === 'succeeded',
        ]);
    }

    /**
     * Create Checkout Session (hosted payment page).
     */
    public function createCheckoutSession(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
        ]);

        $product = Product::with('seller')->findOrFail($validated['product_id']);
        $seller = $product->seller;

        if (!$seller->canAcceptPayments()) {
            return response()->json([
                'error' => 'Seller cannot accept payments',
            ], 422);
        }

        $platformFee = $this->calculateFee($product->price);

        $session = \Stripe\Checkout\Session::create([
            'mode' => 'payment',
            'line_items' => [[
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => $product->name,
                        'description' => $product->description,
                    ],
                    'unit_amount' => $product->price,
                ],
                'quantity' => 1,
            ]],
            'payment_intent_data' => [
                'application_fee_amount' => $platformFee,
                'transfer_data' => [
                    'destination' => $seller->stripe_account_id,
                ],
            ],
            'success_url' => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('checkout.cancel'),
            'metadata' => [
                'product_id' => $product->id,
                'seller_id' => $seller->id,
                'buyer_id' => $request->user()->id,
            ],
        ]);

        return response()->json([
            'checkout_url' => $session->url,
            'session_id' => $session->id,
        ]);
    }

    /**
     * Process refund.
     */
    public function refund(Request $request, Transaction $transaction): JsonResponse
    {
        if ($transaction->isRefunded()) {
            return response()->json([
                'error' => 'Already refunded',
            ], 422);
        }

        $paymentIntent = PaymentIntent::retrieve($transaction->stripe_payment_intent_id);

        $refund = \Stripe\Refund::create([
            'payment_intent' => $paymentIntent->id,
            'reverse_transfer' => true,
            'refund_application_fee' => true,
        ]);

        $transaction->update([
            'status' => 'refunded',
            'refunded_at' => now(),
        ]);

        return response()->json([
            'refund_id' => $refund->id,
            'status' => $refund->status,
        ]);
    }

    private function calculateFee(int $amount): int
    {
        return (int) ceil($amount * self::PLATFORM_FEE_PERCENT / 100);
    }
}
```

## Multi-Seller Order (Separate Charges + Transfers)

```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\CartItem;
use App\Models\Order;
use Stripe\PaymentIntent;
use Stripe\Stripe;
use Stripe\Transfer;

class MultiSellerPaymentService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Create payment for multi-seller cart.
     */
    public function createMultiSellerPayment(Order $order, string $paymentMethodId): array
    {
        $totalAmount = $order->items->sum('price');

        $paymentIntent = PaymentIntent::create([
            'amount' => $totalAmount,
            'currency' => 'eur',
            'payment_method' => $paymentMethodId,
            'confirm' => true,
            'metadata' => [
                'order_id' => $order->id,
            ],
        ]);

        if ($paymentIntent->status === 'succeeded') {
            $this->distributeToSellers($order);
        }

        return [
            'payment_intent_id' => $paymentIntent->id,
            'status' => $paymentIntent->status,
        ];
    }

    /**
     * Transfer funds to each seller.
     */
    private function distributeToSellers(Order $order): void
    {
        $itemsBySeller = $order->items->groupBy('seller_id');

        foreach ($itemsBySeller as $sellerId => $items) {
            $seller = $items->first()->seller;
            $sellerTotal = $items->sum('price');
            $platformFee = (int) ceil($sellerTotal * 0.10);
            $sellerAmount = $sellerTotal - $platformFee;

            $transfer = Transfer::create([
                'amount' => $sellerAmount,
                'currency' => 'eur',
                'destination' => $seller->stripe_account_id,
                'metadata' => [
                    'order_id' => $order->id,
                    'seller_id' => $sellerId,
                ],
            ]);

            foreach ($items as $item) {
                $item->update(['stripe_transfer_id' => $transfer->id]);
            }
        }
    }
}
```
