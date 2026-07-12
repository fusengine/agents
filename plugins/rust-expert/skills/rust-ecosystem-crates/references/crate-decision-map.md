---
name: crate-decision-map
description: Per-domain crate choices for Rust with selection criteria, error strategy, and observability
when-to-use: Load when picking a crate for serialization, CLI, HTTP, errors, or logging
keywords: serde, clap, reqwest, thiserror, anyhow, tracing, crate selection
priority: high
related: db-and-async.md
---

# Crate Decision Map

## Overview

Rust's ecosystem has settled on de-facto standards for most domains. Defaulting to them buys documentation, interop, and maintenance. The judgment calls are error handling (library vs app) and database access (see db-and-async.md).

---

## Key Concepts

| Domain | Standard | Why it won |
|--------|----------|-----------|
| **Serialization** | `serde` + `serde_json` | Derive macros, format-agnostic, universal ecosystem support |
| **CLI** | `clap` derive | Struct-driven parsing, auto help/version, subcommands |
| **Async runtime** | `tokio` | Largest ecosystem, the default most libraries assume |
| **HTTP client** | `reqwest` | Async, JSON, TLS, built on hyper |
| **Errors (lib)** | `thiserror` | Zero-cost derive of typed error enums |
| **Errors (app)** | `anyhow` | `Result<T>` with `.context()`, no enum boilerplate |
| **Observability** | `tracing` | Async-aware spans, structured fields, subscriber ecosystem |

---

## The serde 2.0 caveat

`serde 2.0` is **discussed but not released**. Today, depend on `serde = "1"`. Writing `2` will not resolve. Re-check crates.io before assuming any new major has shipped — that is the one fact most likely to be stale in this document.

---

## Error strategy: the one real decision

| Context | Crate | Rule |
|---------|-------|------|
| Library (published API) | `thiserror` | Callers must `match` on your error → give them a typed enum |
| Application / binary | `anyhow` | You just propagate with context → `anyhow::Result<T>` |

Never return `anyhow::Error` from a library: it erases the type and forces downstream crates to string-match. `thiserror` costs a few lines of derive and keeps errors matchable.

---

## Decision Guide

```
What am I building?
├── A published library → thiserror for errors, minimal deps
└── An application/binary → anyhow for errors, tokio runtime

Which serialization format?
├── JSON → serde + serde_json
├── TOML/YAML → serde + serde_toml / serde_yaml
└── Binary → serde + bincode / postcard
```

---

## Observability

Use `tracing` for instrumentation and `tracing-subscriber` to configure output (env-filter, JSON, fmt). Prefer `#[tracing::instrument]` on async functions over ad-hoc `println!`; spans carry context across `.await` points where a logger cannot.

---

## Best Practices

### DO
- Default to the standard unless a concrete constraint rules it out
- Verify the current version on crates.io before writing it
- Enable only the tokio/reqwest features you need (they are large)
- Choose `thiserror` vs `anyhow` by library-vs-app, not by taste

### DON'T
- Write `serde = "2"` (unreleased)
- Leak `anyhow::Error` through a public API
- Pull `reqwest` default features when you only need JSON over rustls

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Library returns `anyhow::Error` | Define a `thiserror` enum |
| `serde = "2"` in Cargo.toml | Use `serde = "1"` |
| Guessing a crate's patch version | Look it up on crates.io / Context7 |

---

## Related References

- [db-and-async.md](db-and-async.md) - Database and runtime choices

## Related Templates

- [cargo-toml-stack.md](templates/cargo-toml-stack.md) - Complete web-service manifest
