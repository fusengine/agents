---
name: worker-pool
description: Complete fixed-size worker pool — jobs channel, context cancellation, buffered results, no goroutine leaks
keywords: template, worker pool, jobs channel, buffered, context, WaitGroup
---

# Template: Fixed-Size Worker Pool

A pool of N workers draining a jobs channel. Uses a buffered results channel and
a `ctx.Done()` branch so nothing leaks on cancellation or early consumer exit.

```go
package pool

import (
	"context"
	"sync"
)

type Job struct{ ID int }
type Result struct {
	ID  int
	Err error
}

// Run starts `workers` goroutines that process jobs and report on a buffered
// results channel. It is cancellation-safe: workers exit on ctx.Done().
func Run(ctx context.Context, workers int, jobs []Job,
	do func(context.Context, Job) error) <-chan Result {

	// Buffered to len(jobs): a worker can always deposit its result and move on,
	// even if the consumer stops reading early — so senders never strand.
	results := make(chan Result, len(jobs))
	jobCh := make(chan Job)

	var wg sync.WaitGroup
	for range workers {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				select {
				case <-ctx.Done():
					return // clean exit on cancel/timeout
				case job, ok := <-jobCh:
					if !ok {
						return // jobs exhausted → worker exits
					}
					results <- Result{ID: job.ID, Err: do(ctx, job)}
				}
			}
		}()
	}

	// Feeder: push jobs, then close so workers drain and exit.
	go func() {
		defer close(jobCh)
		for _, j := range jobs {
			select {
			case <-ctx.Done():
				return
			case jobCh <- j:
			}
		}
	}()

	// Closer: once all workers finish, close results so the consumer's range ends.
	go func() {
		wg.Wait()
		close(results)
	}()

	return results
}
```

## Consuming

```go
for r := range Run(ctx, 4, jobs, handle) {
	if r.Err != nil {
		log.Printf("job %d failed: %v", r.ID, r.Err)
	}
}
```

## When to prefer errgroup instead

If you just need "run these tasks in parallel, stop on first error, bounded
concurrency," use `errgroup` with `SetLimit` — it is less code and handles the
wait/error/cancel wiring for you. Reach for this explicit pool when you need
long-lived workers, a steady job stream, or per-worker state. See
[errgroup-patterns.md](errgroup-patterns.md).
