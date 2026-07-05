---
name: go-testing-quality
description: Write idiomatic Go tests and measure quality — table-driven tests, subtests with t.Run, testify assertions/mocks, native fuzzing, benchmarks, the race detector, coverage, and pprof/PGO profiling. Use when writing or reviewing Go tests, adding coverage, benchmarking, or profiling a Go program. Do NOT use for CI pipeline wiring — golangci-lint, govulncheck (go-tooling-security) — or non-Go test suites.
---

# Go Testing & Quality

Idiomatic, 2026-current testing and quality practices for Go, built on the standard
`testing` package with `testify` where it adds clarity.

**Use when:**
- Writing unit tests for Go code (table-driven, subtests)
- Adding assertions or mocks with `testify` (`assert` / `require` / `mock`)
- Writing fuzz tests, benchmarks, or example tests
- Measuring coverage (`go test -cover`) or chasing race conditions (`-race`)
- Profiling / optimizing with pprof or setting up PGO
- Reviewing an existing Go test suite for quality gaps

**Do NOT use for:**
- Project layout, routing, DB wiring, DI — use `go-architecture`
- SOLID line-limit / interface enforcement — use `fuse-solid:solid-go`
- Non-Go test suites (Pest, Vitest, Jest, cargo test) — use the matching expert
- Security scanning / CVE audit — use `fuse-security`

---

## Decision Map

| Goal | Load |
|------|------|
| Write the standard Go test (table-driven + subtests) | [table-driven.md](references/table-driven.md) |
| Assertions and mocks with testify | [testify-mocks.md](references/testify-mocks.md) |
| Fuzzing, benchmarks, example tests | [fuzzing-benchmarks.md](references/fuzzing-benchmarks.md) |
| Coverage, race detector, pprof, PGO | [coverage-profiling.md](references/coverage-profiling.md) |
| A complete, runnable test file to copy | [templates/table-test.md](references/templates/table-test.md) |

---

## Core Practices (2026)

1. **Table-driven tests are the idiom.** Define a slice of cases, loop, and run
   each as a subtest with `t.Run(tc.name, …)` for isolation and readable output.
2. **`testify` is the de-facto assertion/mock standard.** `assert` for soft checks,
   `require` to abort on failure, `mock` for hand-written mocks, `suite` for
   setup/teardown groups. It is maintained at v1 (no breaking v2).
   Source: https://pkg.go.dev/github.com/stretchr/testify
3. **Fuzzing is native** since Go 1.18 (`func FuzzXxx(f *testing.F)`), and finds
   edge cases table tests miss.
4. **Always run `-race` in CI.** The race detector catches data races that are
   otherwise nondeterministic and unreproducible.
5. **Measure before optimizing.** Benchmarks (`go test -bench`) + pprof profiles
   guide real changes; PGO feeds a production profile back into the compiler.

---

## Workflow

1. **Explore** the code under test and existing test conventions first.
2. **Write table-driven tests** as the default shape ([table-driven.md](references/table-driven.md)).
3. **Add testify** assertions/mocks where they improve readability, not reflexively.
4. **Run** `go test ./... -race -cover` and inspect gaps.
5. **Fuzz / benchmark** hotspots and parsers ([fuzzing-benchmarks.md](references/fuzzing-benchmarks.md)).
6. **Profile** only after a benchmark proves a hotspot ([coverage-profiling.md](references/coverage-profiling.md)).
7. **Validate** with sniper after changes.

---

## Boundaries

Overlaps with `github.com/samber/cc-skills-golang` (community Go skills) — this
skill owns **testing and quality tooling**; architecture/structure lives in
`go-architecture`. Cross-referenced for boundaries only, not copied.
