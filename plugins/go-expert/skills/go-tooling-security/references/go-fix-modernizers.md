---
name: go-fix-modernizers
description: Go 1.26 go fix modernizers, //go:fix inline, and PGO
when-to-use: Modernizing code to current idioms, automating API migrations, or enabling PGO
keywords: go fix, modernizers, go:fix inline, analysis, go generate, PGO, default.pgo
priority: medium
related: golangci-lint-v2.md
---

# go fix Modernizers & PGO

**Load when:** modernizing a codebase to current Go idioms, automating your own API migrations, or wiring Profile-Guided Optimization.

## Overview

In Go 1.26 the `go fix` command was rewritten to host Go's *modernizers* — a suite of fixers that update code to modern language and standard-library idioms. It builds on the same analysis framework as `go vet`, so analyzers can both diagnose (in `go vet`) and apply fixes (in `go fix`).
Source: https://go.dev/doc/go1.26

---

## go fix (Go 1.26)

```bash
go fix ./...            # apply the modernizer suite
```

| Fact | Detail |
|------|--------|
| **Suite** | Dozens of fixers modernizing language/library usage |
| **Framework** | `golang.org/x/tools/go/analysis` (shared with `go vet`) |
| **Behavior** | Fixers should not change program behavior |
| **Legacy** | All obsolete historical fixers were removed |

Source: https://go.dev/doc/go1.26

---

## The `//go:fix inline` Directive

Annotate a function or constant so `go fix` inlines its uses at call sites — a source-level inliner for automating your own API migrations (e.g. redirecting callers off a deprecated helper).

```go
//go:fix inline
func OldName(x int) int { return NewName(x) }
```

Docs: https://pkg.go.dev/golang.org/x/tools/go/analysis/passes/inline
Source: https://go.dev/doc/go1.26

---

## Not Changed in 1.26

`go vet`, `go generate`, and `gofmt` have **no documented changes** in the Go 1.26 release notes — the 1.26 tooling change is `go fix`. `go mod init` now writes a lower `go` line (release `1.N` → `go 1.(N-1).0`). `cmd/doc` / `go tool doc` were removed; use `go doc`.
Source: https://go.dev/doc/go1.26

---

## PGO (Profile-Guided Optimization)

PGO is a stable, established Go feature (available since the Go 1.20/1.21 cycle; not a 1.26-specific change). The compiler automatically uses a profile named `default.pgo` in the main package's directory.

```bash
# 1. Collect a CPU profile from a representative workload
go test -cpuprofile=cpu.pprof -bench=.
# 2. Place it as default.pgo next to package main, then build
cp cpu.pprof default.pgo
go build ./...          # PGO applied automatically
```

> Fusengine note: PGO version/status is our general Go knowledge, not attributed to the 1.26 notes (the 1.26 page does not mention PGO). Verify specifics against https://go.dev/doc/pgo before relying on them.

---

## Best Practices

### DO
- Run `go fix ./...` after a toolchain bump, then review the diff and run tests
- Use `//go:fix inline` to retire deprecated APIs across a large codebase
- Base `default.pgo` on a profile from production-representative load

### DON'T
- Assume `go fix` is behavior-neutral without running the test suite
- Attribute PGO details to the 1.26 release notes — they are not there
- Expect `gofmt`/`go vet` behavior to have changed in 1.26

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `go fix` did nothing | Ensure toolchain is Go 1.26+ and files are within the module |
| Inline directive ignored | It must sit immediately above the func/const declaration |
| PGO not applied | Profile must be named `default.pgo` in the `main` package dir |

## Related Templates

- [ci-workflow.md](templates/ci-workflow.md) - Optional `go fix` / diff-check step
