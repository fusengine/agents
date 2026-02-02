---
name: testing
description: Testing billing with test cards, Stripe CLI, and PHPUnit
when-to-use: Consult when writing tests for billing functionality
keywords: laravel, cashier, testing, stripe, paddle, test cards, phpunit
priority: high
requires: stripe.md
related: webhooks.md
---

# Testing Billing

## Test Environment Setup

### Environment Variables

```env
# .env.testing
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# Paddle
PADDLE_SANDBOX=true
```

→ See [templates/SubscriptionTest.php.md](templates/SubscriptionTest.php.md) for examples

---

## Stripe Test Cards

### Successful Payments

| Card Number | Description |
|-------------|-------------|
| `4242424242424242` | Visa, succeeds |
| `5555555555554444` | Mastercard, succeeds |
| `378282246310005` | Amex, succeeds |

### 3D Secure / SCA

| Card Number | Description |
|-------------|-------------|
| `4000002500003155` | Requires authentication |
| `4000002760003184` | Requires auth, succeeds |
| `4000008260003178` | Requires auth, then fails |

### Declined Cards

| Card Number | Description |
|-------------|-------------|
| `4000000000000002` | Generic decline |
| `4000000000009995` | Insufficient funds |
| `4000000000009987` | Lost card |
| `4000000000009979` | Stolen card |
| `4100000000000019` | Fraudulent |

### Special Cases

| Card Number | Description |
|-------------|-------------|
| `4000000000000341` | Attaching fails |
| `4000000000000127` | CVC check fails |
| `4000000000000069` | Expired card |

---

## Payment Method Tokens for Tests

```php
// These tokens work in test mode without Stripe.js
'pm_card_visa'              // Visa that succeeds
'pm_card_visa_debit'        // Visa debit
'pm_card_mastercard'        // Mastercard
'pm_card_amex'              // American Express
'pm_card_discover'          // Discover
'pm_card_threeDSecure2Required' // Requires 3DS
'pm_card_chargeDeclined'    // Always declines
```

---

## Testing Subscriptions

### Basic Subscription Test

```php
use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SubscriptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_subscribe(): void
    {
        $user = User::factory()->create();

        $subscription = $user->newSubscription('default', 'price_test')
            ->create('pm_card_visa');

        $this->assertTrue($user->subscribed('default'));
        $this->assertDatabaseHas('subscriptions', [
            'user_id' => $user->id,
            'name' => 'default',
            'stripe_status' => 'active',
        ]);
    }

    public function test_user_can_cancel_subscription(): void
    {
        $user = User::factory()->create();
        $user->newSubscription('default', 'price_test')
            ->create('pm_card_visa');

        $subscription = $user->subscription('default');
        $subscription->cancel();

        $this->assertTrue($subscription->onGracePeriod());
        $this->assertNotNull($subscription->ends_at);
    }
}
```

### Testing with Sanctum

```php
use Laravel\Sanctum\Sanctum;

public function test_api_subscription_check(): void
{
    $user = User::factory()->create();
    $user->newSubscription('default', 'price_test')
        ->create('pm_card_visa');

    Sanctum::actingAs($user);

    $response = $this->getJson('/api/subscription/status');

    $response->assertJson([
        'subscribed' => true,
        'plan' => 'default',
    ]);
}
```

---

## Testing Webhooks

### Simulating Webhook Events

```php
use Illuminate\Support\Facades\Event;
use Laravel\Cashier\Events\WebhookReceived;

public function test_webhook_creates_subscription(): void
{
    Event::fake([WebhookReceived::class]);

    $payload = [
        'type' => 'customer.subscription.created',
        'data' => [
            'object' => [
                'id' => 'sub_test123',
                'customer' => 'cus_test123',
                'status' => 'active',
            ],
        ],
    ];

    $response = $this->postJson('/stripe/webhook', $payload, [
        'Stripe-Signature' => $this->generateSignature($payload),
    ]);

    $response->assertOk();
    Event::assertDispatched(WebhookReceived::class);
}
```

### Using Stripe CLI

```bash
# Terminal 1: Start webhook forwarding
stripe listen --forward-to localhost:8000/stripe/webhook

# Terminal 2: Trigger events
stripe trigger customer.subscription.created
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
```

---

## Testing Checkout

```php
public function test_checkout_redirects_to_stripe(): void
{
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get('/checkout');

    $response->assertRedirect();
    $this->assertStringContainsString('checkout.stripe.com', $response->headers->get('Location'));
}
```

---

## Mocking Stripe API

For unit tests that don't need real API calls:

```php
use Laravel\Cashier\Cashier;
use Stripe\StripeClient;
use Mockery;

public function test_subscription_status_check(): void
{
    $mock = Mockery::mock(StripeClient::class);
    $mock->shouldReceive('subscriptions->retrieve')
        ->andReturn((object) ['status' => 'active']);

    Cashier::setStripeClient($mock);

    // Your test logic
}
```

---

## Paddle Sandbox Testing

```env
PADDLE_SANDBOX=true
```

Paddle sandbox uses test data automatically - no special cards needed.

---

## Test Helpers

### Create Subscribed User Factory

```php
// database/factories/UserFactory.php
public function subscribed(): static
{
    return $this->afterCreating(function (User $user) {
        $user->newSubscription('default', 'price_test')
            ->create('pm_card_visa');
    });
}

// Usage
$user = User::factory()->subscribed()->create();
```

### Custom Assertions

```php
// tests/TestCase.php
protected function assertSubscribed(User $user, string $name = 'default'): void
{
    $this->assertTrue(
        $user->subscribed($name),
        "User is not subscribed to '{$name}'"
    );
}

protected function assertOnGracePeriod(User $user, string $name = 'default'): void
{
    $this->assertTrue(
        $user->subscription($name)?->onGracePeriod(),
        "User subscription '{$name}' is not on grace period"
    );
}
```

---

## Best Practices

### DO
- Use test API keys
- Test both success and failure cases
- Test 3D Secure flows
- Use `RefreshDatabase` trait
- Test webhook handlers

### DON'T
- Use production keys in tests
- Skip webhook testing
- Ignore edge cases (declined cards, expired)
- Mock everything (some real API calls are valuable)
