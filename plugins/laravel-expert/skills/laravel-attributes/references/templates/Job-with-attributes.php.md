---
name: job-with-attributes-template
description: Complete queue Job using only Laravel 13 attributes
---

# Template: Job with attributes

```php
<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Podcast;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\Attributes\{
    Backoff,
    Connection,
    FailOnTimeout,
    MaxExceptions,
    Queue,
    Timeout,
    Tries,
    UniqueFor,
};
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

#[Connection('redis')]
#[Queue('podcasts')]
#[Tries(5)]
#[Timeout(120)]
#[Backoff([10, 30, 60])]
#[MaxExceptions(3)]
#[FailOnTimeout]
#[UniqueFor(3600)]
final class ProcessPodcast implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Podcast $podcast)
    {
    }

    /**
     * Unique lock key.
     */
    public function uniqueId(): string
    {
        return (string) $this->podcast->id;
    }

    public function handle(): void
    {
        // ... process the podcast ...
    }
}
```

## Before / After

### Before (Laravel <=12)

```php
class ProcessPodcast implements ShouldQueue, ShouldBeUnique
{
    public $connection = 'redis';
    public $queue = 'podcasts';
    public $tries = 5;
    public $timeout = 120;
    public $backoff = [10, 30, 60];
    public $maxExceptions = 3;
    public $failOnTimeout = true;
    public $uniqueFor = 3600;
}
```

### After (Laravel 13)

See template above.
