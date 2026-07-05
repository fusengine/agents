---
name: property-and-mutation
description: Property-based testing with proptest, benchmarking with criterion, and mutation testing with cargo-mutants
when-to-use: Load when adding generated-input tests, statistical benchmarks, or measuring test-suite effectiveness
keywords: proptest, property based, criterion, benchmark, cargo-mutants, mutation testing
priority: medium
requires: test-organization.md
related: test-organization.md
---

# Property, Benchmark & Mutation Testing

## Overview

Example-based tests check the cases you thought of. Property tests, benchmarks, and mutation testing each attack a different blind spot: unthought-of inputs, performance regressions, and weak assertions.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **proptest** | Generates random inputs from a `Strategy`, and on failure *shrinks* to a minimal reproducer |
| **criterion** | Runs a benchmark many times, reports a statistically-confident time range and regression verdict |
| **cargo-mutants** | Mutates your source (e.g. flips `<` to `<=`) and reruns tests; a surviving mutant means a missing assertion |

---

## When to Use

| Scenario | Approach |
|----------|----------|
| Parsers, codecs, invariants over a large input space | proptest |
| A round-trip property (`decode(encode(x)) == x`) | proptest with a range/regex strategy |
| Confirming an optimization actually helped | criterion benchmark, compare runs |
| Auditing whether tests actually catch bugs | cargo-mutants (scheduled, not per-push) |

---

## proptest essentials

A strategy is anything implementing `proptest::strategy::Strategy` — integer ranges (`0u32..100`), regexes for strings (`"[0-9]{4}"`), or composed via `prop_compose!`. Inside `proptest! { }`, use `prop_assert_eq!` instead of `assert_eq!` to avoid noisy panics on intermediate failures.

On failure, proptest writes the minimal seed to `proptest-regressions/`. **Commit that directory** so the exact failing case reruns everywhere.

Source: proptest-rs.github.io/proptest — getting-started.

---

## criterion essentials

Criterion benches live in `benches/*.rs` and require `harness = false` in `Cargo.toml`. Wrap inputs in `black_box()` so the optimizer cannot constant-fold the work away. `cargo bench` prints a time range and, across runs, a "Performance has improved/regressed" verdict.

Source: bheisler.github.io/criterion.rs — getting_started.

---

## cargo-mutants essentials

`cargo mutants` is an emerging practice for measuring suite quality. It is slow (it rebuilds and reruns per mutation), so gate it behind a scheduled/nightly CI job, not every commit. A *missed* mutant (tests still pass after the code was broken) marks an untested behavior.

---

## Decision Guide

```
What blind spot am I closing?
├── Untried inputs → proptest
├── Performance regression → criterion (benches/, harness=false)
└── Weak/absent assertions → cargo-mutants (scheduled CI)
```

---

## Best Practices

### DO
- Start with the "never panics" property before correctness properties
- Use `prop_assert_eq!` inside `proptest!`
- `black_box()` benchmark inputs and outputs
- Run cargo-mutants nightly and triage survivors

### DON'T
- Reimplement the function inside the property (generate output → check parse-back instead)
- Forget `harness = false` for criterion
- Run mutation testing on every push

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `proptest-regressions/` gitignored | Commit it for reproducible failures |
| Bench numbers look identical/zero | Wrap with `black_box()` |
| criterion bench fails to link | Add `harness = false` under `[[bench]]` |

---

## Related References

- [test-organization.md](test-organization.md) - Where proptest tests live

## Related Templates

- [test-suite.md](templates/test-suite.md) - proptest block in context
- [criterion-bench.md](templates/criterion-bench.md) - Complete criterion bench
