---
name: JobTest
description: Complete job testing with fakes, assertions, and integration tests
file-type: template
---

# Job Testing Template

## Unit Test: Job Logic

```php
<?php

declare(strict_types=1);

namespace Tests\Unit\Jobs;

use App\Jobs\ProcessOrder;
use App\Models\Order;
use App\Services\OrderService;
use Mockery\MockInterface;
use Tests\TestCase;

final class ProcessOrderTest extends TestCase
{
    public function test_processes_order_successfully(): void
    {
        // Arrange
        $order = Order::factory()->create(['status' => 'pending']);

        $this->mock(OrderService::class, function (MockInterface $mock) use ($order) {
            $mock->shouldReceive('process')
                ->with($order)
                ->once();
        });

        // Act
        $job = new ProcessOrder($order);
        $job->handle(app(OrderService::class));

        // Assert - check side effects in service mock
    }

    public function test_failed_method_logs_error(): void
    {
        // Arrange
        $order = Order::factory()->create();
        $job = new ProcessOrder($order);
        $exception = new \Exception('Test error');

        // Expect log
        \Log::shouldReceive('error')
            ->once()
            ->withArgs(function ($message, $context) use ($order) {
                return str_contains($message, 'failed')
                    && $context['order_id'] === $order->id;
            });

        // Act
        $job->failed($exception);
    }
}
```

## Feature Test: Job Dispatch

```php
<?php

declare(strict_types=1);

namespace Tests\Feature\Jobs;

use App\Jobs\ProcessOrder;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

final class ProcessOrderDispatchTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_dispatches_job_on_creation(): void
    {
        Queue::fake();

        $order = Order::factory()->create();
        $order->startProcessing(); // Method that dispatches job

        Queue::assertPushed(ProcessOrder::class, function ($job) use ($order) {
            return $job->order->id === $order->id;
        });
    }

    public function test_job_dispatched_on_correct_queue(): void
    {
        Queue::fake();

        $order = Order::factory()->create();
        ProcessOrder::dispatch($order)->onQueue('orders');

        Queue::assertPushedOn('orders', ProcessOrder::class);
    }

    public function test_job_not_dispatched_for_cancelled_order(): void
    {
        Queue::fake();

        $order = Order::factory()->cancelled()->create();
        $order->startProcessing();

        Queue::assertNotPushed(ProcessOrder::class);
    }

    public function test_delayed_dispatch(): void
    {
        Queue::fake();

        $order = Order::factory()->create();
        ProcessOrder::dispatch($order)->delay(now()->addMinutes(5));

        Queue::assertPushed(ProcessOrder::class, function ($job) {
            return $job->delay !== null;
        });
    }
}
```

## Testing Job Chains

```php
<?php

declare(strict_types=1);

namespace Tests\Feature\Jobs;

use App\Jobs\OrderChain\{ValidateOrder, ProcessPayment, FulfillOrder};
use App\Models\Order;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

final class OrderChainTest extends TestCase
{
    public function test_order_chain_dispatched_correctly(): void
    {
        Queue::fake();

        $order = Order::factory()->create();

        Bus::chain([
            new ValidateOrder($order),
            new ProcessPayment($order),
            new FulfillOrder($order),
        ])->dispatch();

        Queue::assertPushedWithChain(ValidateOrder::class, [
            ProcessPayment::class,
            FulfillOrder::class,
        ]);
    }
}
```

## Testing Batches

```php
<?php

declare(strict_types=1);

namespace Tests\Feature\Jobs;

use App\Jobs\ProcessImage;
use App\Models\Image;
use Illuminate\Bus\PendingBatch;
use Illuminate\Support\Facades\Bus;
use Tests\TestCase;

final class ImageBatchTest extends TestCase
{
    public function test_batch_created_with_correct_jobs(): void
    {
        Bus::fake();

        $images = Image::factory()->count(3)->create();

        // Code that creates batch
        $this->imageService->processBatch($images);

        Bus::assertBatched(function (PendingBatch $batch) {
            return $batch->jobs->count() === 3
                && $batch->jobs->first() instanceof ProcessImage;
        });
    }

    public function test_batch_has_correct_name(): void
    {
        Bus::fake();

        $images = Image::factory()->count(3)->create();
        $this->imageService->processBatch($images);

        Bus::assertBatched(function (PendingBatch $batch) {
            return $batch->name === 'Process Images';
        });
    }
}
```

## Integration Test: Actually Run Job

```php
<?php

declare(strict_types=1);

namespace Tests\Integration\Jobs;

use App\Jobs\ProcessOrder;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class ProcessOrderIntegrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_job_updates_order_status(): void
    {
        // Arrange
        $order = Order::factory()->create(['status' => 'pending']);

        // Act - Run job synchronously
        ProcessOrder::dispatchSync($order);

        // Assert
        $this->assertEquals('processed', $order->fresh()->status);
    }

    public function test_job_handles_missing_model(): void
    {
        $order = Order::factory()->create();
        $orderId = $order->id;

        // Create job with order
        $job = new ProcessOrder($order);

        // Delete order
        $order->delete();

        // Job should handle gracefully (if $deleteWhenMissingModels = true)
        // Otherwise expect ModelNotFoundException
        $this->expectNotToPerformAssertions();
    }
}
```

## Testing Middleware

```php
<?php

declare(strict_types=1);

namespace Tests\Unit\Jobs\Middleware;

use App\Jobs\Middleware\EnsureActiveSubscription;
use App\Jobs\SyncUserData;
use App\Models\User;
use Tests\TestCase;

final class EnsureActiveSubscriptionTest extends TestCase
{
    public function test_allows_subscribed_user(): void
    {
        $user = User::factory()->subscribed()->create();
        $job = new SyncUserData($user);

        $called = false;
        $middleware = new EnsureActiveSubscription();

        $middleware->handle($job, function () use (&$called) {
            $called = true;
        });

        $this->assertTrue($called);
    }

    public function test_blocks_unsubscribed_user(): void
    {
        $user = User::factory()->create(['subscribed' => false]);
        $job = new SyncUserData($user);

        $called = false;
        $middleware = new EnsureActiveSubscription();

        $middleware->handle($job, function () use (&$called) {
            $called = true;
        });

        $this->assertFalse($called);
    }
}
```

## Assertion Reference

```php
// Job assertions
Queue::assertPushed(ProcessOrder::class);
Queue::assertPushed(ProcessOrder::class, 3);  // Exact count
Queue::assertPushedOn('orders', ProcessOrder::class);
Queue::assertNotPushed(ProcessOrder::class);
Queue::assertNothingPushed();

// Chain assertions
Queue::assertPushedWithChain(FirstJob::class, [SecondJob::class]);

// Batch assertions
Bus::assertBatched(fn(PendingBatch $batch) => $batch->jobs->count() === 5);

// Conditional callback
Queue::assertPushed(ProcessOrder::class, function ($job) {
    return $job->order->id === $expectedId;
});
```
