---
name: ChainedJobs
description: Job chain for sequential workflow
file-type: template
---

# Chained Jobs Template

## Order Processing Chain

### Step 1: Validate Order

```php
<?php

declare(strict_types=1);

namespace App\Jobs\OrderChain;

use App\Models\Order;
use App\Exceptions\OrderValidationException;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Step 1: Validate order data.
 */
final class ValidateOrder implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 1;

    public function __construct(
        public readonly Order $order,
    ) {}

    public function handle(): void
    {
        Log::info('Validating order', ['id' => $this->order->id]);

        if (!$this->order->hasItems()) {
            throw new OrderValidationException('Order has no items');
        }

        if (!$this->order->hasValidPayment()) {
            throw new OrderValidationException('Invalid payment method');
        }

        $this->order->update(['status' => 'validated']);

        Log::info('Order validated', ['id' => $this->order->id]);
    }
}
```

### Step 2: Process Payment

```php
<?php

declare(strict_types=1);

namespace App\Jobs\OrderChain;

use App\Models\Order;
use App\Services\PaymentService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Step 2: Process payment.
 */
final class ProcessPayment implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 3;
    public int $backoff = 30;

    public function __construct(
        public readonly Order $order,
    ) {}

    public function handle(PaymentService $paymentService): void
    {
        Log::info('Processing payment', ['order_id' => $this->order->id]);

        $paymentService->charge($this->order);

        $this->order->update(['status' => 'paid']);

        Log::info('Payment processed', ['order_id' => $this->order->id]);
    }

    public function failed(\Throwable $e): void
    {
        $this->order->update(['status' => 'payment_failed']);

        Log::error('Payment failed', [
            'order_id' => $this->order->id,
            'error' => $e->getMessage(),
        ]);
    }
}
```

### Step 3: Fulfill Order

```php
<?php

declare(strict_types=1);

namespace App\Jobs\OrderChain;

use App\Models\Order;
use App\Services\FulfillmentService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Step 3: Fulfill order (ship items).
 */
final class FulfillOrder implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 3;
    public int $timeout = 300;

    public function __construct(
        public readonly Order $order,
    ) {}

    public function handle(FulfillmentService $fulfillment): void
    {
        Log::info('Fulfilling order', ['order_id' => $this->order->id]);

        $tracking = $fulfillment->ship($this->order);

        $this->order->update([
            'status' => 'shipped',
            'tracking_number' => $tracking,
        ]);

        Log::info('Order shipped', [
            'order_id' => $this->order->id,
            'tracking' => $tracking,
        ]);
    }
}
```

### Step 4: Send Confirmation

```php
<?php

declare(strict_types=1);

namespace App\Jobs\OrderChain;

use App\Models\Order;
use App\Notifications\OrderShippedNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Step 4: Notify customer.
 */
final class SendOrderConfirmation implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 3;

    public function __construct(
        public readonly Order $order,
    ) {}

    public function handle(): void
    {
        $this->order->user->notify(
            new OrderShippedNotification($this->order)
        );

        $this->order->update(['status' => 'completed']);
    }
}
```

## Dispatching the Chain

```php
<?php

use App\Jobs\OrderChain\{
    ValidateOrder,
    ProcessPayment,
    FulfillOrder,
    SendOrderConfirmation
};
use App\Models\Order;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Log;

final class OrderService
{
    public function processOrder(Order $order): void
    {
        Bus::chain([
            new ValidateOrder($order),
            new ProcessPayment($order),
            new FulfillOrder($order),
            new SendOrderConfirmation($order),
        ])
        ->catch(function (\Throwable $e) use ($order) {
            Log::error('Order chain failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);

            $order->update(['status' => 'failed']);

            // Notify admin
            $order->user->notify(new OrderFailedNotification($order, $e));
        })
        ->onQueue('orders')
        ->dispatch();
    }
}
```

## Multiple Chains in Batch

```php
<?php

use Illuminate\Support\Facades\Bus;

// Process multiple orders in parallel, each with its own chain
$orders = Order::where('status', 'pending')->get();

$chains = $orders->map(fn(Order $order) => Bus::chain([
    new ValidateOrder($order),
    new ProcessPayment($order),
    new FulfillOrder($order),
    new SendOrderConfirmation($order),
]));

Bus::batch($chains->all())
    ->name('Process Orders')
    ->dispatch();
```
