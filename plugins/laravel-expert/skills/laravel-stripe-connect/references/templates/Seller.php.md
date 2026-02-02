---
name: Seller
description: Seller model with Stripe Connect integration
when-to-use: Creating the connected account holder model
keywords: seller, model, connected-account, stripe
---

# Seller Model

## Model

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Seller extends Model
{
    protected $fillable = [
        'user_id',
        'business_name',
        'stripe_account_id',
        'charges_enabled',
        'payouts_enabled',
        'onboarding_completed_at',
    ];

    protected $casts = [
        'charges_enabled' => 'boolean',
        'payouts_enabled' => 'boolean',
        'onboarding_completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function isOnboarded(): bool
    {
        return $this->charges_enabled && $this->payouts_enabled;
    }

    public function canAcceptPayments(): bool
    {
        return $this->charges_enabled;
    }

    public function canReceivePayouts(): bool
    {
        return $this->payouts_enabled;
    }

    public function hasStripeAccount(): bool
    {
        return $this->stripe_account_id !== null;
    }

    public function needsOnboarding(): bool
    {
        return $this->hasStripeAccount() && !$this->isOnboarded();
    }
}
```

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
        Schema::create('sellers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('business_name');
            $table->string('stripe_account_id')->nullable()->unique();
            $table->boolean('charges_enabled')->default(false);
            $table->boolean('payouts_enabled')->default(false);
            $table->timestamp('onboarding_completed_at')->nullable();
            $table->timestamps();

            $table->index('stripe_account_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sellers');
    }
};
```

## Transaction Model

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'seller_id',
        'buyer_id',
        'stripe_payment_intent_id',
        'stripe_transfer_id',
        'amount',
        'platform_fee',
        'seller_amount',
        'currency',
        'status',
        'refunded_at',
    ];

    protected $casts = [
        'amount' => 'integer',
        'platform_fee' => 'integer',
        'seller_amount' => 'integer',
        'refunded_at' => 'datetime',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function isRefunded(): bool
    {
        return $this->refunded_at !== null;
    }
}
```

## Transaction Migration

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained();
            $table->foreignId('buyer_id')->constrained('users');
            $table->string('stripe_payment_intent_id')->unique();
            $table->string('stripe_transfer_id')->nullable();
            $table->integer('amount');
            $table->integer('platform_fee');
            $table->integer('seller_amount');
            $table->string('currency', 3)->default('eur');
            $table->string('status')->default('pending');
            $table->timestamp('refunded_at')->nullable();
            $table->timestamps();

            $table->index(['seller_id', 'status']);
            $table->index('stripe_payment_intent_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
```
