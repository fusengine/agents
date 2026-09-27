---
name: goroutine-leaks
description: The #1 documented Go concurrency pitfall — unbuffered channel + early return leaks goroutines — plus the goroutineleak pprof profile (experiment in Go 1.26, GA in Go 1.27)
keywords: goroutine leak, unbuffered channel, early return, pprof, goroutineleak, goroutineleakprofile, GOEXPERIMENT
---

# Goroutine Leaks

**Load when:** fanning out goroutines that report back over a channel, or
diagnosing rising goroutine counts / memory in production.

## The pitfall (officially documented in Go 1.26)

A goroutine sending on an **unbuffered** channel blocks until someone receives.
If the collector returns **early** (e.g. on the first error), the remaining
senders block forever — they leak. This exact case ships as a code example in
the Go 1.26 release notes. Source: https://go.dev/doc/go1.26.

```go
func processWorkItems(ws []workItem) ([]workResult, error) {
    ch := make(chan result) // UNBUFFERED
    for _, w := range ws {
        go func() {
            res, err := processWorkItem(w)
            ch <- result{res, err} // blocks until received
        }()
    }

    var results []workResult
    for range len(ws) {
        r := <-ch
        if r.err != nil {
            return nil, r.err // EARLY RETURN → un-received senders leak
        }
        results = append(results, r.res)
    }
    return results, nil
}
```

Because `ch` is unbuffered, once `processWorkItems` returns early the remaining
`processWorkItem` goroutines are stranded on `ch <- ...` and never exit.

## Fix 1 — buffer the channel to the number of senders

Every send can then complete without a receiver, so an early return strands no one:

```go
ch := make(chan result, len(ws)) // buffered: sends never block
```

## Fix 2 — use errgroup with a context

Let `errgroup` own the wait, the first error, and the cancellation. Have workers
respect `ctx` instead of blocking on a channel nobody will drain:

```go
g, ctx := errgroup.WithContext(ctx)
results := make([]workResult, len(ws))
for i, w := range ws {
    g.Go(func() error {
        res, err := processWorkItem(ctx, w)
        if err != nil {
            return err // cancels ctx; siblings observe ctx.Done()
        }
        results[i] = res
        return nil
    })
}
if err := g.Wait(); err != nil {
    return nil, err
}
```

## Detecting leaks: the goroutineleak profile (GA in Go 1.27)

Go 1.26 introduced an experimental profile that reports leaked goroutines — those
blocked on a concurrency primitive that can never become unblocked (the runtime
proves it via GC reachability). **Go 1.27 makes it generally available** and
deletes the `goroutineleakprofile` GOEXPERIMENT. Sources: https://go.dev/doc/go1.27
(Runtime → Goroutine leak profile), https://go.dev/doc/go1.26.

```go
// No build flag needed on Go 1.27+. Predefined profile in runtime/pprof:
if err := pprof.Lookup("goroutineleak").WriteTo(os.Stderr, 1); err != nil {
    return fmt.Errorf("write goroutineleak profile: %w", err)
}
```

- Profile name `goroutineleak` in `runtime/pprof` (predefined, like `goroutine`).
- Also exposed via `net/http/pprof` at **`/debug/pprof/goroutineleak`**.
- On Go 1.26 only: `GOEXPERIMENT=goroutineleakprofile go test ./...` (flag removed in 1.27).
- Caveat: leaks reachable only through globals or runnable goroutines' locals may
  be missed.

Run it in tests, CI, and production to catch this class of bug before users do.

## Detecting races: -race

Orthogonal but essential — data races are a different failure than leaks:

```bash
go test -race ./...   # required in CI; a green run without -race proves nothing
```

## Anti-patterns

- Unbuffered result channel + any early return / break in the collector loop
- Spawning goroutines that block on a channel no one is guaranteed to drain
- Trusting goroutine counts by eye instead of the leak profile
- Shipping concurrent code untested under `-race`
