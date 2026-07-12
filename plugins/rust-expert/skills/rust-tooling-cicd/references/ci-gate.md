---
name: ci-gate
description: The canonical Rust CI gate order and the supply-chain checks (cargo-deny, cargo-audit) plus coverage
when-to-use: Load when building or ordering a Rust CI pipeline, or configuring cargo-deny / cargo-audit / coverage
keywords: CI, cargo fmt, clippy, cargo-deny, cargo-audit, llvm-cov, gate order
priority: high
requires: workspaces-features.md
related: workspaces-features.md
---

# The Rust CI Gate

## Overview

A good pipeline orders checks cheapest-and-fastest-failing first, so a formatting slip never waits behind a ten-minute coverage run. Supply-chain checks (`cargo deny`, `cargo audit`) are distinct concerns and both belong in the gate.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Fail-fast ordering** | Format/lint are seconds; tests/coverage are minutes — run the fast ones first |
| **cargo-deny** | Policy engine: `licenses`, `bans` (incl. duplicate versions), `advisories`, `sources` |
| **cargo-audit** | RustSec advisory scan of `Cargo.lock` for known CVEs |
| **cargo-llvm-cov** | Source-based line/region coverage via LLVM instrumentation |

---

## The canonical gate order

```bash
cargo fmt --all -- --check                                   # 1. style (seconds)
cargo clippy --all-targets --all-features -- -D warnings     # 2. lints, warnings = errors
cargo deny check                                             # 3. licenses/bans/advisories/sources
cargo audit                                                  # 4. RustSec CVE scan
cargo nextest run --all-features                             # 5. unit + integration
cargo test --doc                                             # 6. doc-tests (nextest skips these)
cargo llvm-cov --all-features --workspace                    # 7. coverage (slowest)
```

Steps 1–2 catch the majority of PR problems in seconds. Steps 3–4 protect the supply chain. Steps 5–6 are the test gate (see rust-testing-quality). Step 7 runs last because instrumentation is the slowest.

---

## cargo-deny vs cargo-audit

They overlap on advisories but are NOT redundant:

| Tool | Covers |
|------|--------|
| `cargo deny check` | Licenses, banned/duplicate crates, unknown sources, AND advisories |
| `cargo audit` | RustSec advisory DB only, focused and fast |

`cargo deny check` runs **all** its checks by default (`licenses`, `bans`, `advisories`, `sources`), each falling back to a default config if unspecified. Keep both: `deny` enforces policy, `audit` is a focused second opinion many teams already trust.

Source: embarkstudios.github.io/cargo-deny — Checks index.

---

## Decision Guide

```
Where does a new check belong?
├── Deterministic + fast (fmt, clippy) → early, fail-fast
├── Supply-chain (deny, audit) → middle, before tests
└── Expensive (coverage, mutation) → late or scheduled
```

---

## Coverage notes

`cargo llvm-cov` wraps the build with LLVM source-based coverage. To combine with nextest and still count doc-tests, run coverage over both runners; export `--lcov` for upload to a coverage service.

---

## Best Practices

### DO
- Order the gate cheapest-first
- Use `-D warnings` so clippy findings fail CI
- Cache `~/.cargo` and `target/` between runs
- Run `cargo deny check` AND `cargo audit`

### DON'T
- Put coverage before lint/format
- Drop `cargo deny` because `audit` ran (different scope)
- Allow warnings to pass silently

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Coverage runs first, wastes minutes on a fmt typo | Reorder: fmt/clippy first |
| clippy warnings don't fail CI | Add `-- -D warnings` |
| No `deny.toml` committed | Commit the policy so it is reviewed |

---

## Related References

- [workspaces-features.md](workspaces-features.md) - `cargo hack` powerset/MSRV steps

## Related Templates

- [ci-workflow.md](templates/ci-workflow.md) - Full GitHub Actions pipeline
- [deny-toml.md](templates/deny-toml.md) - Supply-chain policy
