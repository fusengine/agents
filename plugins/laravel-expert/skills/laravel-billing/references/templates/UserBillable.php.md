---
name: UserBillable
description: User model with Billable trait for Stripe or Paddle
when-to-use: Setting up billing on User model
keywords: user, billable, trait, stripe, paddle, model
---

# User Model with Billable Trait

## Stripe Version

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;

/**
 * User model with Stripe billing capabilities.
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $stripe_id
 * @property string|null $pm_type
 * @property string|null $pm_last_four
 * @property \Carbon\Carbon|null $trial_ends_at
 */
class User extends Authenticatable
{
    use HasFactory;
    use Notifiable;
    use Billable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'trial_ends_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if user has premium access.
     */
    public function hasPremiumAccess(): bool
    {
        return $this->subscribed('default')
            || $this->onTrial('default')
            || $this->onGenericTrial();
    }

    /**
     * Get the user's current plan name.
     */
    public function currentPlan(): ?string
    {
        $subscription = $this->subscription('default');

        if (!$subscription) {
            return null;
        }

        // Map price IDs to plan names
        $plans = [
            config('billing.prices.monthly') => 'Monthly',
            config('billing.prices.yearly') => 'Yearly',
        ];

        foreach ($subscription->items as $item) {
            if (isset($plans[$item->stripe_price])) {
                return $plans[$item->stripe_price];
            }
        }

        return 'Unknown';
    }

    /**
     * Check if subscription is on grace period.
     */
    public function isOnGracePeriod(): bool
    {
        $subscription = $this->subscription('default');

        return $subscription?->onGracePeriod() ?? false;
    }

    /**
     * Get days remaining in trial or grace period.
     */
    public function daysRemaining(): ?int
    {
        $subscription = $this->subscription('default');

        if ($subscription?->onGracePeriod()) {
            return now()->diffInDays($subscription->ends_at);
        }

        if ($this->onTrial('default')) {
            return now()->diffInDays($subscription->trial_ends_at);
        }

        if ($this->onGenericTrial()) {
            return now()->diffInDays($this->trial_ends_at);
        }

        return null;
    }
}
```

---

## Paddle Version

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Paddle\Billable;

/**
 * User model with Paddle billing capabilities.
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $paddle_id
 * @property \Carbon\Carbon|null $trial_ends_at
 */
class User extends Authenticatable
{
    use HasFactory;
    use Notifiable;
    use Billable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'trial_ends_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if user has premium access.
     */
    public function hasPremiumAccess(): bool
    {
        return $this->subscribed('default')
            || $this->onTrial('default')
            || $this->onGenericTrial();
    }

    /**
     * Check if subscription is paused (Paddle-specific).
     */
    public function isPaused(): bool
    {
        return $this->subscription('default')?->paused() ?? false;
    }
}
```

---

## Migration

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Cashier migrations handle this, but for reference:
        Schema::table('users', function (Blueprint $table) {
            $table->string('stripe_id')->nullable()->index();
            $table->string('pm_type')->nullable();
            $table->string('pm_last_four', 4)->nullable();
            $table->timestamp('trial_ends_at')->nullable();
        });
    }
};
```

---

## Config File

```php
<?php
// config/billing.php

return [
    'prices' => [
        'monthly' => env('STRIPE_PRICE_MONTHLY', 'price_xxx'),
        'yearly' => env('STRIPE_PRICE_YEARLY', 'price_xxx'),
    ],

    'trial_days' => env('BILLING_TRIAL_DAYS', 14),

    'grace_period_days' => env('BILLING_GRACE_DAYS', 7),
];
```
