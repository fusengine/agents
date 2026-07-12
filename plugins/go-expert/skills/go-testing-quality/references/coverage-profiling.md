# Coverage, Race Detector & Profiling

**Load when:** measuring test coverage, hunting data races, or profiling/optimizing
a Go program.

Source: Go standard `testing`, `runtime/pprof`, `net/http/pprof`, and the `go`
tool (`-cover`, `-race`, `-pgo`).

---

## Coverage

```bash
go test ./... -cover                      # summary percentage per package
go test ./... -coverprofile=cover.out     # write a profile
go tool cover -func=cover.out             # per-function coverage
go tool cover -html=cover.out             # annotated source in the browser
```

- Coverage is a **gap-finder, not a target.** 100% is not a goal; it flags
  untested branches. Ask "is this path worth a test?", not "how do I hit the line?".
- `-covermode=atomic` is required when combining coverage with `-race`.
- For cross-package coverage attribution, add `-coverpkg=./...`.

---

## Race detector

```bash
go test ./... -race
go run -race ./cmd/api      # also works for running binaries
```

- **Run `-race` in CI on every PR.** Data races are nondeterministic; without the
  detector they surface as rare, unreproducible production bugs.
- It instruments memory access, so it slows execution ~2–20x and raises memory —
  use it in test/CI, not in the shipped binary.
- A clean `-race` run is not a proof of absence (it only reports races actually
  exercised), so pair it with `t.Parallel()` and realistic concurrency in tests.

---

## Profiling with pprof

Two ways to collect profiles:

**From benchmarks** (offline, targeted):

```bash
go test -bench=. -cpuprofile=cpu.out -memprofile=mem.out
go tool pprof -http=:8080 cpu.out    # interactive flame graph / top / list
```

**From a live server** (import for side effects, then hit the endpoints):

```go
import _ "net/http/pprof" // registers /debug/pprof/* on the default mux
```

```bash
go tool pprof -http=:8080 http://localhost:8080/debug/pprof/profile?seconds=30
go tool pprof http://localhost:8080/debug/pprof/heap
```

Inside pprof: `top` (hottest functions), `list Func` (line-level cost), `web`
(graph). **Profile before optimizing** — intuition about Go hotspots is usually
wrong; allocations and lock contention dominate more often than raw CPU.

---

## PGO (Profile-Guided Optimization)

Since Go 1.21, the compiler can use a production CPU profile to optimize (inlining,
devirtualization) the hot paths of your real workload.

1. Collect a representative CPU profile from production (via `net/http/pprof`).
2. Save it as **`default.pgo`** in the `main` package directory.
3. `go build` picks it up automatically — no flags needed. Verify with
   `go build -pgo=auto` (the default) or point at a file with `-pgo=path`.

Typical gains are single-digit percent — real but modest. Refresh `default.pgo`
periodically as the workload shifts, and commit it so builds are reproducible.

---

## CI baseline

```bash
go vet ./...
go test ./... -race -covermode=atomic -coverprofile=cover.out
```

Add `golangci-lint run` (bundles staticcheck, testifylint, and more) as the quality
gate on top of `go vet`.
