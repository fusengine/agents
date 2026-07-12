---
name: errgroup-patterns
description: Complete errgroup fan-out — bounded concurrency, context cancellation, safe result collection without leaks
keywords: template, errgroup, WithContext, SetLimit, fan-out, results
---

# Template: Bounded Parallel Fan-Out with errgroup

Complete, leak-free example. `errgroup.WithContext` cancels siblings on the
first error; `SetLimit` bounds concurrency; each goroutine writes to its own
pre-allocated slot, so **no channel is needed** and nothing can strand.

```go
package fetch

import (
	"context"
	"net/http"
	"runtime"

	"golang.org/x/sync/errgroup"
)

// FetchAll fetches every URL in parallel with bounded concurrency.
// The first failure cancels ctx; Wait returns that error.
func FetchAll(ctx context.Context, urls []string) ([]int, error) {
	g, ctx := errgroup.WithContext(ctx)
	g.SetLimit(runtime.NumCPU()) // don't launch thousands of goroutines

	statuses := make([]int, len(urls)) // each goroutine owns index i → no race

	for i, u := range urls {
		g.Go(func() error {
			req, err := http.NewRequestWithContext(ctx, http.MethodGet, u, nil)
			if err != nil {
				return err
			}
			resp, err := http.DefaultClient.Do(req)
			if err != nil {
				return err // cancels ctx; other requests observe ctx.Done()
			}
			defer resp.Body.Close()
			statuses[i] = resp.StatusCode
			return nil
		})
	}

	if err := g.Wait(); err != nil {
		return nil, err
	}
	return statuses, nil
}
```

## Why this cannot leak

- No unbuffered result channel — results go into `statuses[i]`, so there is no
  send that could block after an early return.
- Every request uses `http.NewRequestWithContext(ctx, ...)`, so when the group's
  ctx is cancelled on the first error, in-flight requests abort instead of hanging.
- `SetLimit` caps active goroutines; `g.Go` blocks (it does not spawn) when full.

## Variant: shed load with TryGo

```go
// Only start work if a concurrency slot is free; otherwise queue for later.
if !g.TryGo(task) {
	deferred = append(deferred, task) // handle when capacity returns
}
```
