# Fuzzing, Benchmarks & Examples

**Load when:** writing fuzz tests, benchmarks, or runnable example tests.

Source: Go standard `testing` package. Native fuzzing landed in Go 1.18.

---

## Native fuzzing

A fuzz test seeds a corpus and lets the runtime generate new inputs to find edge
cases (panics, crashes, invariant violations) that table tests miss.

```go
func FuzzParseHostPort(f *testing.F) {
    // Seed corpus: representative + tricky inputs.
    f.Add("example.com:8080")
    f.Add("[::1]:80")
    f.Add("")

    f.Fuzz(func(t *testing.T, input string) {
        host, port, err := SplitHostPort(input)
        if err != nil {
            return // rejecting bad input is fine; we hunt panics + invariants
        }
        // Invariant: a successful parse must round-trip.
        if got := net.JoinHostPort(host, port); got != input {
            t.Errorf("round-trip: JoinHostPort(%q,%q)=%q, want %q",
                host, port, got, input)
        }
    })
}
```

Run: `go test -run=Fuzz -fuzz=FuzzParseHostPort` (add `-fuzztime=30s` to bound it).
Crashers are written to `testdata/fuzz/…` and automatically replayed as regression
cases on subsequent `go test` runs — commit them.

**What to fuzz:** parsers, decoders, anything taking untrusted `[]byte`/`string`,
and functions with an invariant you can assert (round-trip, idempotence, no panic).

---

## Benchmarks

```go
func BenchmarkSplitHostPort(b *testing.B) {
    for b.Loop() {          // Go 1.24+ idiom; replaces `for i := 0; i < b.N; i++`
        _, _, _ = SplitHostPort("example.com:8080")
    }
}
```

Run: `go test -bench=. -benchmem` (`-benchmem` reports allocs/op + bytes/op).

- Use `b.ResetTimer()` after expensive setup so it is excluded from timing.
- Use `b.ReportAllocs()` (or `-benchmem`) — allocations are usually the real cost.
- Compare runs with `benchstat` (`golang.org/x/perf/cmd/benchstat`) instead of
  eyeballing single numbers; it reports statistical significance across N runs.
- Keep the result observable (assign to a package var or use `b.Loop`) so the
  compiler cannot optimize the call away.

---

## Example tests

Examples double as compiled, verified documentation. A trailing `// Output:`
comment is checked by `go test`.

```go
func ExampleSplitHostPort() {
    host, port, _ := SplitHostPort("example.com:8080")
    fmt.Println(host, port)
    // Output: example.com 8080
}
```

If output ordering is nondeterministic (e.g. map iteration), use
`// Unordered output:`. Examples appear in `go doc` / pkg.go.dev — they are the
cheapest way to keep docs honest.

---

## Quick reference

| Task | Command |
|------|---------|
| Run one fuzz target | `go test -run=Fuzz -fuzz=FuzzName -fuzztime=30s` |
| Run benchmarks + allocs | `go test -bench=. -benchmem` |
| Compare benchmark runs | `benchstat old.txt new.txt` |
| Verify examples | `go test ./...` (examples run with the rest) |
