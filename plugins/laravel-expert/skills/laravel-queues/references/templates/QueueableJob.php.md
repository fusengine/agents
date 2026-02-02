---
name: QueueableJob
description: Complete job template with retries, backoff, and failure handling
file-type: template
---

# Queueable Job Template

## Standard Job

```php
<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Process order asynchronously.
 */
final class ProcessOrder implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * Number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * Number of seconds to wait before retrying.
     */
    public int $backoff = 60;

    /**
     * Job timeout in seconds.
     */
    public int $timeout = 120;

    /**
     * Number of seconds job stays unique.
     */
    public int $uniqueFor = 3600;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public readonly Order $order,
    ) {}

    /**
     * Unique ID for preventing duplicates.
     */
    public function uniqueId(): string
    {
        return (string) $this->order->id;
    }

    /**
     * Execute the job.
     */
    public function handle(OrderService $orderService): void
    {
        Log::info('Processing order', ['id' => $this->order->id]);

        $orderService->process($this->order);

        Log::info('Order processed', ['id' => $this->order->id]);
    }

    /**
     * Handle job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Order processing failed', [
            'order_id' => $this->order->id,
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
        ]);

        // Optional: Notify admin
        // Notification::route('mail', 'admin@example.com')
        //     ->notify(new JobFailedNotification($this->order, $exception));
    }

    /**
     * Middleware for the job.
     *
     * @return array<int, object>
     */
    public function middleware(): array
    {
        return [
            // Prevent concurrent processing of same order
            new \Illuminate\Queue\Middleware\WithoutOverlapping($this->order->id),
        ];
    }

    /**
     * Tags for Horizon monitoring.
     *
     * @return array<int, string>
     */
    public function tags(): array
    {
        return [
            'order:' . $this->order->id,
            'user:' . $this->order->user_id,
        ];
    }
}
```

## Usage

```php
use App\Jobs\ProcessOrder;

// Basic dispatch
ProcessOrder::dispatch($order);

// Delayed dispatch
ProcessOrder::dispatch($order)->delay(now()->addMinutes(5));

// Specific queue
ProcessOrder::dispatch($order)->onQueue('orders');

// After database transaction commits
DB::transaction(function () use ($order) {
    $order->update(['status' => 'processing']);
    ProcessOrder::dispatch($order)->afterCommit();
});

// Conditional dispatch
ProcessOrder::dispatchIf($order->isPaid(), $order);
```

## Exponential Backoff Variant

```php
/**
 * Calculate backoff with exponential delay.
 *
 * @return array<int, int>
 */
public function backoff(): array
{
    return [10, 30, 60, 120, 300]; // 10s, 30s, 1m, 2m, 5m
}
```

## Retry Until Variant

```php
/**
 * Determine the time at which the job should timeout.
 */
public function retryUntil(): \DateTime
{
    return now()->addHours(24);
}
```
