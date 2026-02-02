---
name: SubscriptionTest
description: Pest tests for billing functionality
when-to-use: Writing tests for subscriptions, payments
keywords: test, pest, phpunit, subscription, billing, stripe
---

# Subscription Tests

## Pest Test Suite

```php
<?php
// tests/Feature/Billing/SubscriptionTest.php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

describe('Subscription Management', function () {
    it('can create a subscription', function () {
        $user = User::factory()->create();

        $subscription = $user->newSubscription('default', 'price_test')
            ->create('pm_card_visa');

        expect($user->subscribed('default'))->toBeTrue()
            ->and($subscription->stripe_status)->toBe('active');
    });

    it('can create subscription with trial', function () {
        $user = User::factory()->create();

        $subscription = $user->newSubscription('default', 'price_test')
            ->trialDays(14)
            ->create('pm_card_visa');

        expect($user->onTrial('default'))->toBeTrue()
            ->and($subscription->trial_ends_at)->not->toBeNull();
    });

    it('can cancel subscription', function () {
        $user = User::factory()->create();
        $user->newSubscription('default', 'price_test')
            ->create('pm_card_visa');

        $subscription = $user->subscription('default');
        $subscription->cancel();

        expect($subscription->canceled())->toBeTrue()
            ->and($subscription->onGracePeriod())->toBeTrue()
            ->and($subscription->ends_at)->not->toBeNull();
    });

    it('can cancel subscription immediately', function () {
        $user = User::factory()->create();
        $user->newSubscription('default', 'price_test')
            ->create('pm_card_visa');

        $subscription = $user->subscription('default');
        $subscription->cancelNow();

        expect($subscription->canceled())->toBeTrue()
            ->and($subscription->onGracePeriod())->toBeFalse();
    });

    it('can resume cancelled subscription during grace period', function () {
        $user = User::factory()->create();
        $user->newSubscription('default', 'price_test')
            ->create('pm_card_visa');

        $subscription = $user->subscription('default');
        $subscription->cancel();

        expect($subscription->onGracePeriod())->toBeTrue();

        $subscription->resume();

        expect($subscription->canceled())->toBeFalse()
            ->and($subscription->ends_at)->toBeNull();
    });

    it('can swap subscription plan', function () {
        $user = User::factory()->create();
        $user->newSubscription('default', 'price_monthly')
            ->create('pm_card_visa');

        $subscription = $user->subscription('default');
        $subscription->swap('price_yearly');

        $subscription->refresh();

        expect($subscription->items->first()->stripe_price)->toBe('price_yearly');
    });
});

describe('Subscription Status API', function () {
    it('returns subscription status for authenticated user', function () {
        $user = User::factory()->create();
        $user->newSubscription('default', 'price_test')
            ->create('pm_card_visa');

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/billing/subscription');

        $response->assertOk()
            ->assertJson([
                'subscribed' => true,
                'on_trial' => false,
                'on_grace_period' => false,
                'cancelled' => false,
            ]);
    });

    it('returns not subscribed for user without subscription', function () {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/billing/subscription');

        $response->assertOk()
            ->assertJson([
                'subscribed' => false,
            ]);
    });
});

describe('Subscription API Operations', function () {
    it('can cancel subscription via API', function () {
        $user = User::factory()->create();
        $user->newSubscription('default', 'price_test')
            ->create('pm_card_visa');

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/billing/subscription/cancel');

        $response->assertOk()
            ->assertJson([
                'on_grace_period' => true,
            ]);

        expect($user->subscription('default')->onGracePeriod())->toBeTrue();
    });

    it('can resume subscription via API', function () {
        $user = User::factory()->create();
        $user->newSubscription('default', 'price_test')
            ->create('pm_card_visa');
        $user->subscription('default')->cancel();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/billing/subscription/resume');

        $response->assertOk();
        expect($user->subscription('default')->canceled())->toBeFalse();
    });

    it('cannot resume already active subscription', function () {
        $user = User::factory()->create();
        $user->newSubscription('default', 'price_test')
            ->create('pm_card_visa');

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/billing/subscription/resume');

        $response->assertStatus(400);
    });
});

describe('Payment Method Handling', function () {
    it('handles declined card', function () {
        $user = User::factory()->create();

        expect(fn () => $user->newSubscription('default', 'price_test')
            ->create('pm_card_chargeDeclined')
        )->toThrow(\Laravel\Cashier\Exceptions\IncompletePayment::class);
    });
});

describe('Invoices', function () {
    it('can list invoices', function () {
        $user = User::factory()->create();
        $user->newSubscription('default', 'price_test')
            ->create('pm_card_visa');

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/billing/invoices');

        $response->assertOk()
            ->assertJsonStructure([
                'invoices' => [
                    '*' => ['id', 'number', 'date', 'total', 'status'],
                ],
            ]);
    });
});
```

---

## Custom Assertions Helper

```php
<?php
// tests/TestCase.php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Assert user has active subscription.
     */
    protected function assertSubscribed(User $user, string $name = 'default'): void
    {
        $this->assertTrue(
            $user->subscribed($name),
            "Failed asserting that user is subscribed to '{$name}'"
        );
    }

    /**
     * Assert user is on trial.
     */
    protected function assertOnTrial(User $user, string $name = 'default'): void
    {
        $this->assertTrue(
            $user->onTrial($name),
            "Failed asserting that user is on trial for '{$name}'"
        );
    }

    /**
     * Assert subscription is on grace period.
     */
    protected function assertOnGracePeriod(User $user, string $name = 'default'): void
    {
        $this->assertTrue(
            $user->subscription($name)?->onGracePeriod() ?? false,
            "Failed asserting that subscription '{$name}' is on grace period"
        );
    }
}
```

---

## Factory State for Subscribed Users

```php
<?php
// database/factories/UserFactory.php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => bcrypt('password'),
        ];
    }

    /**
     * Create user with active subscription.
     */
    public function subscribed(string $plan = 'price_test'): static
    {
        return $this->afterCreating(function (User $user) use ($plan) {
            $user->newSubscription('default', $plan)
                ->create('pm_card_visa');
        });
    }

    /**
     * Create user on trial.
     */
    public function onTrial(int $days = 14): static
    {
        return $this->afterCreating(function (User $user) use ($days) {
            $user->newSubscription('default', 'price_test')
                ->trialDays($days)
                ->create('pm_card_visa');
        });
    }

    /**
     * Create user with cancelled subscription (on grace period).
     */
    public function cancelled(): static
    {
        return $this->afterCreating(function (User $user) {
            $user->newSubscription('default', 'price_test')
                ->create('pm_card_visa');
            $user->subscription('default')->cancel();
        });
    }
}
```

---

## Usage Examples

```php
// Create subscribed user
$user = User::factory()->subscribed()->create();
expect($user->subscribed('default'))->toBeTrue();

// Create user on trial
$user = User::factory()->onTrial(7)->create();
expect($user->onTrial('default'))->toBeTrue();

// Create cancelled user
$user = User::factory()->cancelled()->create();
expect($user->subscription('default')->onGracePeriod())->toBeTrue();
```
