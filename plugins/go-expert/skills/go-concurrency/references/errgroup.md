---
name: errgroup
description: golang.org/x/sync/errgroup — Go, Wait, WithContext, SetLimit, TryGo for parallel work with error aggregation and cancellation
keywords: errgroup, WithContext, SetLimit, TryGo, Wait, parallel, cancellation
---

# errgroup

**Load when:** running goroutines that return errors and you want the first
failure plus automatic context cancellation. Source:
https://pkg.go.dev/golang.org/x/sync/errgroup.

## What it gives you over WaitGroup

`errgroup.Group` is `sync.WaitGroup` plus error handling. It:

- runs each `g.Go(func() error)` in its own goroutine,
- **`Wait()` returns the first non-nil error** from any of them,
- with `WithContext`, the **first goroutine to error cancels the group's
  context**, signaling the rest to stop.

A zero `Group` is valid (no limit, no cancellation). A `Group` must **not** be
reused across different tasks.

## WithContext: cancellation on first error

```go
g, ctx := errgroup.WithContext(ctx)
for _, u := range urls {
    g.Go(func() error {
        return fetch(ctx, u) // ctx is cancelled once any goroutine errors
    })
}
if err := g.Wait(); err != nil {
    return err // the first non-nil error
}
```

The derived `ctx` is also cancelled when `Wait` returns — so downstream
operations reading it will stop.

## SetLimit: bound concurrency

`g.SetLimit(n)` caps active goroutines at `n`; further `g.Go` calls block until a
slot frees. A negative value means no limit; zero blocks all new goroutines.
Do not change the limit while goroutines are active.

```go
g.SetLimit(runtime.NumCPU()) // don't spawn thousands of goroutines at once
```

## TryGo: only if a slot is free

`g.TryGo(func() error) bool` starts the goroutine **only if** the active count is
below the limit, returning whether it started. Use it to shed load instead of
blocking.

## Method summary

| Method | Behavior |
|--------|----------|
| `Go(f func() error)` | Run `f` in a new goroutine (blocks if at limit) |
| `TryGo(f) bool` | Run only if under limit; reports whether it started |
| `SetLimit(n)` | Cap active goroutines at `n` (must be idle to change) |
| `Wait() error` | Block for all `Go` calls; return first non-nil error |

## Important: still don't leak

`errgroup` does not magically prevent leaks. If a `g.Go` function blocks on a
channel that no one drains after an early error, it still leaks. Respect `ctx`
inside every `g.Go` function, and buffer/drain any channels they use. See
[goroutine-leaks.md](goroutine-leaks.md).

## Anti-patterns

- Ignoring `ctx` inside `g.Go` funcs, so cancellation does nothing
- Reusing one `Group` for multiple unrelated task batches
- Unbounded `g.Go` in a loop over a huge slice — use `SetLimit`
- Hand-rolling `WaitGroup` + error channel where `errgroup` already fits
