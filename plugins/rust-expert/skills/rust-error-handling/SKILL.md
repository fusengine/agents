---
name: rust-error-handling
description: Use when designing Rust error handling — picking thiserror for libraries vs anyhow for applications, building typed error enums, converting errors with #[from], and deciding recoverable errors vs panics. Do NOT use for general ownership/borrowing (use rust-core-language) or async runtime errors specifically.
versions:
  rust: "1.96.1"
  thiserror: "2"
  anyhow: "1"
references: references/thiserror-libraries.md, references/anyhow-applications.md, references/error-design.md, references/templates/library-error.md, references/templates/application-error.md
related-skills: rust-core-language
---

# Rust Error Handling

The consensus split: **thiserror for libraries, anyhow for applications.** A library
exposes a typed error its callers can `match`; an application wants one ergonomic error
type and rich context. Getting this boundary right is the whole discipline.

## Agent Workflow (MANDATORY)

1. **fuse-ai-pilot:explore-codebase** — is this crate a library (published API, other
   code depends on it) or a binary/application? That answer picks the tool.
2. **fuse-ai-pilot:research-expert** — confirm current `thiserror` / `anyhow` API
   before writing derives (verification chain: Context7 → Exa → fuse-browser
   fast-path on `docs.rs/thiserror` and `docs.rs/anyhow`).
3. After writing, run **fuse-ai-pilot:sniper** and `cargo clippy`.

## The rule

| Crate kind | Tool | Why |
|------------|------|-----|
| **Library** (others depend on it) | `thiserror` | Typed `enum`, `#[derive(Error)]`, callers can `match` on variants |
| **Application** (binary, top level) | `anyhow` | `anyhow::Result<T>`, `?` everywhere, `.context()` for breadcrumbs |
| **Simple / dep-free** | hand-written `std::error::Error` | No dependency when one or two variants suffice |

## Critical Rules

1. **Never expose `anyhow::Error` in a library's public API.** It erases the type, so
   callers cannot match or handle specific failures. Return a typed `enum` error.
   thiserror is designed to not appear in your public API — switching to/from a
   hand-written impl is not a breaking change.
2. **Applications use `anyhow`; libraries use `thiserror`.** Do not pull `anyhow` into
   a reusable library's signatures.
3. **Add context at each layer** in application code: `.context("...")` /
   `.with_context(|| ...)` turns "No such file or directory" into a traceable chain.
4. **`#[from]` for zero-boilerplate conversion**, so `?` lifts a source error into your
   enum. `#[from]` implies `#[source]` — never write both.
5. **Errors are values; panics are bugs.** Use `Result` for anything a caller could
   reasonably recover from. Reserve `panic!`/`unwrap`/`expect` for broken invariants.

## Reference Guide

### Concepts

| Topic | Reference | Load when |
|-------|-----------|-----------|
| thiserror (libraries) | [thiserror-libraries.md](references/thiserror-libraries.md) | Building a typed error enum for a library API |
| anyhow (applications) | [anyhow-applications.md](references/anyhow-applications.md) | Handling errors in a binary / top-level app |
| Error design | [error-design.md](references/error-design.md) | Shaping enums, `#[from]` conversion, recoverable vs panic, the anyhow/thiserror boundary |

### Templates

| Template | Load when |
|----------|-----------|
| [library-error.md](references/templates/library-error.md) | Need a complete thiserror library error module |
| [application-error.md](references/templates/application-error.md) | Need a complete anyhow application entry point with context |

## Validation Checklist

- [ ] Library errors are a typed `enum` deriving `thiserror::Error` — no `anyhow` in the public API
- [ ] Application code returns `anyhow::Result<T>` and adds `.context(...)`
- [ ] `#[from]` used for source conversions; no redundant `#[source]` alongside it
- [ ] `?` used instead of `unwrap()` on fallible values
- [ ] Panics only guard genuine invariants, with a reason
- [ ] `cargo clippy` clean, sniper passed
