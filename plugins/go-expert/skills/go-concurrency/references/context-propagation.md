---
name: context-propagation
description: context.Context as first parameter, strict propagation, cancellation, deadlines, and what NOT to put in a context
keywords: context, ctx, cancellation, deadline, timeout, WithCancel, propagation
---

# Context Propagation

**Load when:** threading cancellation/deadlines through call chains or wiring
`context` into goroutines and `errgroup`.

## The rules

1. **`ctx context.Context` is the first parameter** of any function that does
   I/O, blocks, or spawns goroutines. Name it `ctx`.
2. **Propagate, don't store.** Pass `ctx` down the call chain; never keep a
   `context.Context` in a struct field. A stored ctx outlives its request and
   defeats cancellation.
3. **Derive, then always cancel.** `WithCancel`/`WithTimeout`/`WithDeadline`
   return a `cancel` func — call it (usually `defer cancel()`) to release
   resources even on the success path.
4. **Respect cancellation.** Blocking operations must select on `<-ctx.Done()`
   and return `ctx.Err()`.

## Cancellation and deadlines

```go
func fetchAll(ctx context.Context, urls []string) error {
    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel() // releases the timer even if we return early

    g, ctx := errgroup.WithContext(ctx)
    for _, u := range urls {
        g.Go(func() error { return fetch(ctx, u) })
    }
    return g.Wait()
}
```

The incoming `ctx` is the parent; every derived context is cancelled when the
parent is, so cancellation flows outward-in automatically.

## Reacting to Done inside a goroutine

```go
func worker(ctx context.Context, jobs <-chan Job) error {
    for {
        select {
        case <-ctx.Done():
            return ctx.Err() // unwinds on cancel/timeout
        case job, ok := <-jobs:
            if !ok {
                return nil // channel closed → clean exit
            }
            if err := handle(ctx, job); err != nil {
                return err
            }
        }
    }
}
```

## What NOT to put in a context

`context.WithValue` is for **request-scoped** data that crosses API boundaries
(trace/span ids, auth principal) — not for passing optional function parameters
or dependencies. Use typed, unexported keys to avoid collisions:

```go
type traceKey struct{}
ctx = context.WithValue(ctx, traceKey{}, id)
```

Passing a logger or DB handle through the context instead of as an explicit
argument is an anti-pattern; make dependencies visible in the signature.

## Anti-patterns

- Storing `context.Context` in a struct
- Passing `context.Background()`/`nil` deep in a call chain instead of the real ctx
- Deriving a context with a cancel func and never calling `cancel`
- Blocking operations that never check `ctx.Done()`
- Smuggling required dependencies through `WithValue`
