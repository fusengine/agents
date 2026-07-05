---
name: rust-testing-quality
description: Use when writing, organizing, or running Rust tests — unit, integration, doc-tests, property-based (proptest), benchmarks (criterion), or mutation testing (cargo-mutants). Covers test layout, the nextest doctest pitfall, and quality gates. Do NOT use for CI pipeline wiring (use rust-tooling-cicd) or non-Rust test suites.
versions:
  cargo-nextest: "0.9"
  proptest: "1"
  criterion: "0.5"
user-invocable: false
references: references/test-organization.md, references/property-and-mutation.md, references/templates/test-suite.md, references/templates/criterion-bench.md
related-skills: solid-rust, rust-tooling-cicd
---

# Rust Testing & Quality

## Agent Workflow (MANDATORY)

Before ANY test work, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Map existing `tests/`, `#[cfg(test)]`, `benches/`
2. **fuse-ai-pilot:research-expert** - Verify current nextest/proptest/criterion docs via Context7/Exa
3. **mcp__context7__query-docs** - Check crate-specific API (proptest strategies, criterion groups)

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Test kind | Location | Runs the code as |
|-----------|----------|------------------|
| **Unit** | `#[cfg(test)] mod tests` inside the source file | Same crate, sees private items |
| **Integration** | `tests/*.rs` (each file = own crate) | External consumer, public API only |
| **Doc-test** | ` ```rust ` blocks in `///` docs | Compiled + run as examples |
| **Property** | proptest, inside unit or integration | Generated random inputs + shrinking |
| **Benchmark** | `benches/*.rs` with criterion | Statistical timing, not correctness |

---

## Critical Rules

1. **nextest does NOT run doc-tests** - `cargo nextest run` skips them by design. ALWAYS pair with `cargo test --doc`. Never treat a green nextest run as full coverage.
2. **Integration tests see only the public API** - if a test needs private items, it belongs in `#[cfg(test)]`, not `tests/`.
3. **Commit `proptest-regressions/`** - persisted failing seeds must be under version control so failures are reproducible.
4. **`harness = false` for criterion benches** - required in `Cargo.toml`, or the built-in bench harness collides.
5. **Mutation testing is a gate, not a smoke test** - `cargo mutants` is slow; run it in scheduled CI, not on every push.

---

## Architecture

```
my_crate/
├── src/
│   └── lib.rs            # unit tests in #[cfg(test)] + doc-tests in ///
├── tests/
│   └── api.rs            # integration tests (public API)
├── benches/
│   └── throughput.rs     # criterion, harness = false
└── proptest-regressions/ # committed failing seeds
```

→ See [test-suite.md](references/templates/test-suite.md) for the complete example

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Test organization** | [test-organization.md](references/test-organization.md) | Deciding unit vs integration vs doc, running with nextest |
| **Property & mutation** | [property-and-mutation.md](references/property-and-mutation.md) | Adding proptest strategies or cargo-mutants |

### Templates

| Template | When to Use |
|----------|-------------|
| [test-suite.md](references/templates/test-suite.md) | Scaffolding unit + integration + doc + proptest |
| [criterion-bench.md](references/templates/criterion-bench.md) | Adding a criterion benchmark |

---

## Quick Reference

### Run everything (the correct pair)

```bash
cargo nextest run --all-features   # unit + integration, fast, parallel
cargo test --doc                   # doc-tests — NOT covered by nextest
```

### Property test skeleton

```rust
use proptest::prelude::*;

proptest! {
    #[test]
    fn round_trips(n in 0u32..10_000) {
        prop_assert_eq!(decode(&encode(n)), n);
    }
}
```

→ See [test-suite.md](references/templates/test-suite.md) for the full file

---

## Best Practices

### DO
- Run `cargo nextest run` + `cargo test --doc` together in every CI gate
- Keep integration tests black-box against the public API
- Start proptest with the cheapest property: "does not panic"
- Name benches by the operation measured, not the function name

### DON'T
- Assume nextest covered doc-tests — it never does
- Put timing benchmarks in `#[test]` (use criterion in `benches/`)
- Gitignore `proptest-regressions/` — commit it
- Run `cargo mutants` on every push (schedule it instead)
