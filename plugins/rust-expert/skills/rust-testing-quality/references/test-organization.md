---
name: test-organization
description: Where each kind of Rust test lives and how to run them, including the nextest doc-test pitfall
when-to-use: Load when deciding unit vs integration vs doc-test, or wiring up cargo-nextest
keywords: cfg test, integration, doctest, nextest, cargo test --doc
priority: high
related: property-and-mutation.md
---

# Test Organization & Running

## Overview

Rust has three first-class test kinds with different visibility and different runners. Choosing the wrong location is the most common structural mistake; forgetting doc-tests under nextest is the most common CI gap.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Unit test** | `#[cfg(test)] mod tests` in the same file; compiled with the crate, sees private items |
| **Integration test** | A file in `tests/`; compiled as a separate crate, sees only `pub` items |
| **Doc-test** | A ` ```rust ` fenced block in a `///` comment; compiled and run as a real example |

---

## When to Use

| Scenario | Approach |
|----------|----------|
| Testing a private helper or invariant | Unit test in `#[cfg(test)]` |
| Verifying the crate's public contract | Integration test in `tests/` |
| Proving a doc example still compiles | Doc-test (no extra file) |
| Shared setup across integration files | `tests/common/mod.rs` (a `mod.rs` subdir is NOT itself a test crate) |

---

## The nextest doc-test pitfall

`cargo-nextest` is a faster, parallel test runner, but it **does not build or run doc-tests** — this is a documented limitation, not a bug. A green `cargo nextest run` therefore says nothing about your `///` examples.

```bash
cargo nextest run --all-features   # unit + integration ONLY
cargo test --doc                   # doc-tests — REQUIRED as a second step
```

Treat these two commands as a single indivisible gate. In CI, run both; never drop `cargo test --doc` because "nextest already passed."

Source: nexte.st/docs/running — nextest runs the same targets as `cargo test` **except** doc-tests.

---

## Decision Guide

```
Does the test need private items?
├── Yes → unit test in #[cfg(test)] mod tests
└── No  → is it exercising the public contract end-to-end?
    ├── Yes → integration test in tests/*.rs
    └── No, it documents usage → doc-test in /// block
```

---

## Common Patterns

### Conditional compilation

| When | What |
|------|------|
| Test-only helpers | Put behind `#[cfg(test)]` so they never ship in release builds |
| Test-only deps | Declare under `[dev-dependencies]`, never `[dependencies]` |

### Shared integration fixtures

| When | What |
|------|------|
| Multiple `tests/*.rs` need setup | `tests/common/mod.rs`, imported via `mod common;` |

---

## Best Practices

### DO
- Pair `cargo nextest run` with `cargo test --doc` in every gate
- Keep integration tests black-box (public API only)
- Put shared fixtures in `tests/common/mod.rs`

### DON'T
- Rely on nextest for doc-test coverage
- Reach into private items from `tests/` (it will not compile)
- Ship test helpers in the crate (guard with `#[cfg(test)]`)

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| CI only runs `cargo nextest run` | Add `cargo test --doc` step |
| Integration test needs a private fn | Move it to `#[cfg(test)]` unit test |
| `tests/common.rs` is run as tests | Rename to `tests/common/mod.rs` |

---

## Related References

- [property-and-mutation.md](property-and-mutation.md) - Randomized and mutation coverage

## Related Templates

- [test-suite.md](templates/test-suite.md) - Complete unit + integration + doc example
