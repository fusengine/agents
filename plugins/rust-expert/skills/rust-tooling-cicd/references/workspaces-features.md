---
name: workspaces-features
description: Cargo workspace structure, dependency/metadata inheritance, feature design, and MSRV verification
when-to-use: Load when splitting a crate into a workspace, centralizing versions, or designing feature flags
keywords: workspace, members, workspace.dependencies, features, MSRV, cargo-hack, cargo-machete
priority: high
related: ci-gate.md
---

# Workspaces, Features & MSRV

## Overview

A workspace groups related crates under one `Cargo.lock` and one `target/`, sharing versions and lints through inheritance. Features layer optional functionality on top. Both interact with CI: feature combinations and the minimum supported Rust version (MSRV) must be verified, not assumed.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Virtual manifest** | Root `Cargo.toml` with `[workspace]` but no `[package]`; `resolver` must be set explicitly |
| **`workspace.dependencies`** | Single source of truth for versions; members inherit via `dep.workspace = true` |
| **`workspace.package` / `workspace.lints`** | Shared metadata and lint config inherited by `key.workspace = true` |
| **Feature** | A named, additive set of optional deps/code; features must never be mutually exclusive |
| **MSRV** | The oldest Rust the crate promises to compile on, declared as `rust-version` |

---

## When to Use

| Scenario | Approach |
|----------|----------|
| Several crates share versions | `[workspace.dependencies]` + `dep.workspace = true` |
| No single primary crate | Virtual manifest (`[workspace]`, no `[package]`), set `resolver = "3"` |
| Same lint policy everywhere | `[workspace.lints]` + `[lints] workspace = true` in members |
| Optional integration (e.g. serde support) | A feature gating `#[cfg(feature = "...")]` code + an optional dep |

---

## Feature design rules

Features are **additive**: enabling one must never break another, because Cargo unifies the union of all requested features across the graph. Never use features for mutually-exclusive behavior — a downstream crate that enables both will get both.

Verify combinations explicitly. Testing only the default feature set hides breakage:

```bash
cargo hack --feature-powerset check          # every feature combination compiles
cargo hack --feature-powerset --depth 2 test # bounded powerset, faster
```

---

## MSRV verification

Declare it, then prove it:

```toml
[package]
rust-version = "1.85"   # inheritable via workspace.package
```

```bash
cargo hack check --rust-version --workspace   # checks against declared MSRV
```

`cargo-hack` reads `rust-version` and verifies the crate actually builds on it, catching accidental use of newer std/lang features.

Source: doc.rust-lang.org/stable/cargo — Workspaces reference.

---

## Pruning dependencies

```bash
cargo machete            # lists dependencies declared but never used
cargo machete --fix      # removes them from Cargo.toml
```

Run it periodically; unused deps inflate build time and supply-chain surface.

---

## Decision Guide

```
Do the crates share versions/lints?
├── Yes → workspace.dependencies + workspace.lints, inherit in members
└── No, single crate → plain [package], no [workspace] needed

Is behavior optional?
├── Additive (can coexist) → a feature
└── Mutually exclusive → NOT a feature (use separate crates/APIs)
```

---

## Best Practices

### DO
- Set `resolver = "3"` explicitly in virtual manifests
- Inherit versions, lints, and metadata from the workspace root
- Keep features additive and test the powerset with `cargo hack`
- Declare and CI-verify `rust-version`

### DON'T
- Pin the same crate at different versions across members
- Model mutually-exclusive modes as features
- Assume MSRV — verify it with `cargo hack check --rust-version`

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Virtual manifest without `resolver` | Add `resolver = "3"` (no edition to infer from) |
| Features flip behavior on/off exclusively | Redesign; features are additive |
| MSRV drifts silently | Add `cargo hack check --rust-version` to CI |

---

## Related References

- [ci-gate.md](ci-gate.md) - Where these commands sit in the pipeline

## Related Templates

- [deny-toml.md](templates/deny-toml.md) - Complete workspace root manifest
