---
name: goroutine-leaks
description: The #1 documented Go concurrency pitfall — unbuffered channel + early return leaks goroutines — plus the Go 1.26 goroutineleak pprof profile
keywords: goroutine leak, unbuffered channel, early return, pprof, goroutineleakprofile, GOEXPERIMENT
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

## Detecting leaks: the Go 1.26 goroutineleak profile

Go 1.26 adds an **experimental** profile that reports leaked goroutines — those
blocked on a concurrency primitive that can never become unblocked (the runtime
proves it via GC reachability). Source: https://go.dev/doc/go1.26.

```bash
# Enable at build time:
GOEXPERIMENT=goroutineleakprofile go build ./...
GOEXPERIMENT=goroutineleakprofile go test -run TestFanOut ./...
```

- Profile name `goroutineleak` in `runtime/pprof`.
- Also exposed via `net/http/pprof` at **`/debug/pprof/goroutineleak`**.
- No runtime overhead unless actively in use.
- Caveat: leaks reachable only through globals or runnable goroutines' locals may
  be missed. Expected to be enabled by default in Go 1.27.

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
