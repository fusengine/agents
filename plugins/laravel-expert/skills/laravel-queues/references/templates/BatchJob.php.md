---
name: BatchJob
description: Batchable job with progress tracking and cancellation
file-type: template
---

# Batch Job Template

## Batchable Job Class

```php
<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Image;
use App\Services\ImageProcessingService;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Process image as part of a batch.
 */
final class ProcessImage implements ShouldQueue
{
    use Batchable;
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 3;
    public int $timeout = 60;

    public function __construct(
        public readonly Image $image,
    ) {}

    /**
     * Execute the job.
     */
    public function handle(ImageProcessingService $service): void
    {
        // Check if batch was cancelled
        if ($this->batch()?->cancelled()) {
            Log::info('Batch cancelled, skipping image', [
                'image_id' => $this->image->id,
            ]);
            return;
        }

        Log::info('Processing image', ['id' => $this->image->id]);

        $service->process($this->image);

        Log::info('Image processed', ['id' => $this->image->id]);
    }

    /**
     * Handle job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Image processing failed', [
            'image_id' => $this->image->id,
            'batch_id' => $this->batch()?->id,
            'error' => $exception->getMessage(),
        ]);
    }

    /**
     * Tags for Horizon.
     *
     * @return array<int, string>
     */
    public function tags(): array
    {
        return [
            'image:' . $this->image->id,
            'batch:' . ($this->batch()?->id ?? 'none'),
        ];
    }
}
```

## Dispatching Batch

```php
<?php

use App\Jobs\ProcessImage;
use App\Models\Image;
use Illuminate\Bus\Batch;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Log;

// Get images to process
$images = Image::where('status', 'pending')->get();

// Create jobs array
$jobs = $images->map(fn(Image $image) => new ProcessImage($image))->all();

// Dispatch batch with callbacks
$batch = Bus::batch($jobs)
    ->then(function (Batch $batch) {
        Log::info('All images processed successfully', [
            'batch_id' => $batch->id,
            'total_jobs' => $batch->totalJobs,
        ]);
    })
    ->catch(function (Batch $batch, \Throwable $e) {
        Log::error('Batch had failures', [
            'batch_id' => $batch->id,
            'failed_jobs' => $batch->failedJobs,
            'error' => $e->getMessage(),
        ]);
    })
    ->finally(function (Batch $batch) {
        Log::info('Batch finished', [
            'batch_id' => $batch->id,
            'progress' => $batch->progress(),
        ]);
    })
    ->name('Process Images')
    ->onQueue('images')
    ->allowFailures()  // Continue processing even if some jobs fail
    ->dispatch();

// Store batch ID for progress tracking
return $batch->id;
```

## Progress Tracking Controller

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Bus;

final class BatchProgressController extends Controller
{
    public function show(string $batchId): JsonResponse
    {
        $batch = Bus::findBatch($batchId);

        if (!$batch) {
            return response()->json(['error' => 'Batch not found'], 404);
        }

        return response()->json([
            'id' => $batch->id,
            'name' => $batch->name,
            'progress' => $batch->progress(),
            'total_jobs' => $batch->totalJobs,
            'pending_jobs' => $batch->pendingJobs,
            'failed_jobs' => $batch->failedJobs,
            'finished' => $batch->finished(),
            'cancelled' => $batch->cancelled(),
            'created_at' => $batch->createdAt,
            'finished_at' => $batch->finishedAt,
        ]);
    }

    public function cancel(string $batchId): JsonResponse
    {
        $batch = Bus::findBatch($batchId);

        if (!$batch) {
            return response()->json(['error' => 'Batch not found'], 404);
        }

        $batch->cancel();

        return response()->json(['message' => 'Batch cancelled']);
    }
}
```

## Frontend Progress (Livewire)

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Bus;
use Livewire\Component;

final class BatchProgress extends Component
{
    public string $batchId;
    public int $progress = 0;
    public bool $finished = false;

    public function mount(string $batchId): void
    {
        $this->batchId = $batchId;
    }

    public function checkProgress(): void
    {
        $batch = Bus::findBatch($this->batchId);

        if ($batch) {
            $this->progress = $batch->progress();
            $this->finished = $batch->finished();
        }
    }

    public function render()
    {
        return view('livewire.batch-progress');
    }
}
```
