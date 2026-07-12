---
name: rust-core-language
description: Use when writing or reviewing idiomatic Rust — edition 2024 features, ownership/borrowing design, and correcting the pitfalls that show up in LLM-generated Rust (clone tax, unwrap infestation, String vs &str, indexed loops, over-annotated lifetimes). Do NOT use for error-type design (use rust-error-handling), async runtimes, or SOLID/file-layout rules (use fuse-solid:solid-rust).
versions:
  rust: "1.96.1"
  edition: "2024"
references: references/edition-2024.md, references/ownership-borrowing.md, references/llm-pitfalls.md, references/templates/idiomatic-code.md
related-skills: rust-error-handling, fuse-solid:solid-rust
---

# Rust Core Language

Idiomatic Rust for stable **1.96.1**, **edition 2024**. This skill covers what the
compiler will not catch for you: ownership design that avoids gratuitous cloning,
and the recurring failure modes of machine-generated Rust.

## Agent Workflow (MANDATORY)

1. **fuse-ai-pilot:research-expert** — confirm the current stable version and any
   feature's stabilization release before relying on it (versions move fast).
2. **fuse-ai-pilot:explore-codebase** — read the crate's `edition` in `Cargo.toml`
   and its existing ownership conventions before adding code.
3. After writing code, run **fuse-ai-pilot:sniper** and `cargo clippy`.

Never state a stabilization version from memory — verify against
`doc.rust-lang.org/releases.html`.

## Overview

| Topic | When |
|-------|------|
| Edition 2024 features | Setting up a crate, using let chains / async closures |
| Ownership & borrowing | Designing function signatures and data flow |
| LLM pitfalls | Reviewing or repairing generated Rust before merge |

## Critical Rules

1. **Borrow before you own.** Take `&T` / `&str` / `&[T]` in parameters unless the
   function must keep the value. See [ownership-borrowing.md](references/ownership-borrowing.md).
2. **`.clone()` needs a reason.** A clone to silence a borrow-checker error is a
   design smell (the "clone tax"). Redesign ownership first; clone only when a
   second owner genuinely exists.
3. **No `.unwrap()` / `.expect()` on fallible values without a written justification.**
   Grep for them before merge. Prefer `?`, `match`, or a documented invariant.
4. **`Arc::clone(&x)` over `x.clone()`** for reference-counted handles — it makes the
   cheap pointer-copy explicit and distinguishes it from a deep clone.
5. **Iterators over indexed loops.** Prefer `iter()/map()/filter()/collect()` to
   `for i in 0..len { v[i] }` — no bounds-check noise, no off-by-one.
6. **Let elision work.** Do not annotate lifetimes the compiler can infer.

## Verified Facts (source-checked)

- **Edition 2024** stabilized in Rust **1.85.0** (2025-02-20), RFC #3501.
- **Let chains** (`if let A = x && let B = y && cond`) stabilized in **1.88.0**
  (2025-06-26), **edition 2024 only** — depends on the `if let` temporary-scope change.
- **Async closures** (`async || { .. }`) stabilized in **1.85.0**.
- **`gen` blocks are UNSTABLE** — feature gate `#![feature(gen_blocks)]`, tracking
  issue rust-lang/rust#117078, RFC #3513. Do NOT use on stable; the returned
  iterators are not yet fused and the syntax may still change.

## Reference Guide

### Concepts

| Topic | Reference | Load when |
|-------|-----------|-----------|
| Edition 2024 | [edition-2024.md](references/edition-2024.md) | Configuring `edition`, using let chains / async closures, checking feature stability |
| Ownership & borrowing | [ownership-borrowing.md](references/ownership-borrowing.md) | Choosing owned vs borrowed params, designing lifetimes, sharing with Rc/Arc |
| LLM pitfalls | [llm-pitfalls.md](references/llm-pitfalls.md) | Reviewing generated Rust for clone tax, unwrap infestation, String/&str, indexed loops |

### Templates

| Template | Load when |
|----------|-----------|
| [idiomatic-code.md](references/templates/idiomatic-code.md) | Need copy-paste examples of borrow-first signatures, iterator chains, and let chains |

## Validation Checklist

- [ ] `Cargo.toml` declares `edition = "2024"` if edition-2024 features are used
- [ ] No `.clone()` added purely to satisfy the borrow checker
- [ ] Every `.unwrap()`/`.expect()` has a justifying comment or is provably infallible
- [ ] Parameters take references unless ownership is required
- [ ] No lifetime annotations the compiler can elide
- [ ] `cargo clippy` clean, sniper passed
