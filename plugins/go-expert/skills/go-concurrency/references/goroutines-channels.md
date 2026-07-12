---
name: goroutines-channels
description: Goroutines, channels (buffered vs unbuffered), select, and choosing sync.WaitGroup vs channels vs errgroup
keywords: goroutine, channel, buffered, unbuffered, select, WaitGroup, close
---

# Goroutines & Channels

**Load when:** deciding between channels and `sync.WaitGroup`, sizing a channel
buffer, or writing `select` loops.

## Goroutines are cheap, but not free to leak

`go f()` starts a goroutine. It is lightweight, but every goroutine you start
**must have a guaranteed path to exit** — otherwise it leaks (blocked forever,
holding memory). See [goroutine-leaks.md](goroutine-leaks.md).

## Channels: buffered vs unbuffered

- **Unbuffered** (`make(chan T)`): send blocks until a receiver is ready.
  Synchronization is the point — but a sender strands if the receiver goes away.
- **Buffered** (`make(chan T, n)`): send blocks only when the buffer is full.
  Sizing the buffer to the number of senders lets each send complete even if the
  consumer stops reading (critical for the early-return leak).

Rule of thumb: the **sender** closes the channel, never the receiver, and only
when no more values will be sent. Closing signals "done" to `range` receivers.

```go
func produce(out chan<- int) {
    defer close(out) // sender closes exactly once
    for i := range 5 {
        out <- i
    }
}
```

## select: multiplex and stay cancellable

`select` waits on multiple channel operations. Always include the context's
`Done()` so a blocked goroutine can unwind on cancellation:

```go
select {
case v := <-in:
    process(v)
case <-ctx.Done():
    return ctx.Err() // never block forever
}
```

## sync.WaitGroup vs channels vs errgroup

| Need | Use |
|------|-----|
| Wait for N goroutines, **no** results/errors | `sync.WaitGroup` |
| Pass **results** between goroutines | channels |
| Wait for N goroutines **that return errors** + cancel on first failure | `errgroup` (see [errgroup.md](errgroup.md)) |

`sync.WaitGroup` counts; it does **not** carry values or errors. If your
goroutines return errors, reaching for a raw `WaitGroup` plus a hand-rolled
error channel is exactly what `errgroup` replaces — prefer `errgroup`.

```go
var wg sync.WaitGroup // zero value is ready to use
for _, job := range jobs {
    wg.Add(1)
    go func() {
        defer wg.Done()
        run(job) // side effects only; no error to propagate
    }()
}
wg.Wait()
```

## Data races need -race, not luck

Sharing a variable across goroutines without synchronization is a data race even
if it "works". Protect shared state with a `sync.Mutex`, an atomic, or by
confining it to one goroutine and communicating over channels. Verify with
`go test -race ./...` — see [goroutine-leaks.md](goroutine-leaks.md) for the
complementary leak profile.

## Anti-patterns

- Starting a goroutine with no exit path (no `ctx`, no closed channel)
- Closing a channel from the receiver, or closing it twice
- Using `WaitGroup` to gather errors instead of `errgroup`
- `select` without a `<-ctx.Done()` branch on a potentially blocking op
