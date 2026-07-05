---
name: rust-ecosystem-crates
description: Use when choosing crates for a Rust project — serialization, CLI, async runtime, web, database, HTTP client, error handling, observability. Provides a domain→crate decision map of the de-facto 2026 standards, with selection criteria. Do NOT use for API usage details of a chosen crate (load the matching domain skill, or verify via Context7 → Exa → fuse-browser fast-path on docs.rs/crates.io).
versions:
  serde: "1"
  tokio: "1"
  clap: "4"
user-invocable: false
references: references/crate-decision-map.md, references/db-and-async.md, references/templates/cargo-toml-stack.md
related-skills: rust-tooling-cicd, solid-rust
---

# Rust Ecosystem & Crates

## Agent Workflow (MANDATORY)

Before ANY crate selection, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Read existing `Cargo.toml` to match established choices
2. **fuse-ai-pilot:research-expert** - Confirm the CURRENT version + maintenance status on crates.io via Context7/Exa
3. **mcp__context7__query-docs** - Pull the chosen crate's current API before writing code

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview — the decision map

| Domain | De-facto standard (2026) | Reach for it when |
|--------|--------------------------|-------------------|
| **Serialization** | `serde` (+ `serde_json`) | Any (de)serialization; derive `Serialize`/`Deserialize` |
| **CLI parsing** | `clap` (derive API) | Argument parsing, subcommands, help generation |
| **Async runtime** | `tokio` | Almost all async I/O; the ecosystem default |
| **Web framework** | `axum` | HTTP servers on tokio + tower middleware |
| **HTTP client** | `reqwest` | Outbound HTTP, JSON, TLS |
| **Database** | `sqlx` / `sea-orm` / `diesel` | See db-and-async.md for the choice |
| **Error (libraries)** | `thiserror` | Typed error enums in a library's public API |
| **Error (apps)** | `anyhow` | Ergonomic `Result` with context in binaries |
| **Observability** | `tracing` (+ `tracing-subscriber`) | Structured, async-aware logs and spans |

---

## Critical Rules

1. **ALWAYS verify the current version before writing a `Cargo.toml`** - versions move faster than this skill. Confirm on crates.io or via Context7; never paste a remembered patch number.
2. **`serde 2.0` is NOT stable** - it is under discussion. Depend on `serde = "1"` today; do not write `2.0`.
3. **`thiserror` for libraries, `anyhow` for applications** - never expose `anyhow::Error` in a library's public API.
4. **One async runtime** - standardize on `tokio`; mixing runtimes causes executor conflicts.
5. **Match existing choices first** - read the project's `Cargo.toml` before introducing a competing crate.

---

## Architecture

```
Cargo.toml
├── [dependencies]
│   ├── serde / serde_json        # data
│   ├── tokio (features = [...])  # runtime
│   ├── axum / reqwest            # web in/out
│   ├── sqlx | sea-orm | diesel   # persistence (pick one)
│   ├── thiserror | anyhow        # errors (lib vs app)
│   └── tracing / tracing-subscriber
```

→ See [cargo-toml-stack.md](references/templates/cargo-toml-stack.md) for a complete manifest

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Decision map** | [crate-decision-map.md](references/crate-decision-map.md) | Choosing per domain, error strategy, observability |
| **DB & async** | [db-and-async.md](references/db-and-async.md) | sqlx vs sea-orm vs diesel, tokio + axum wiring |

### Templates

| Template | When to Use |
|----------|-------------|
| [cargo-toml-stack.md](references/templates/cargo-toml-stack.md) | Scaffolding a web-service manifest |

---

## Quick Reference

### Error handling split

```rust
// Library: typed, matchable errors.
#[derive(thiserror::Error, Debug)]
pub enum StoreError {
    #[error("not found: {0}")]
    NotFound(String),
}

// Application: contextual, any error.
use anyhow::Context;
let cfg = std::fs::read_to_string(path).context("reading config")?;
```

→ See [crate-decision-map.md](references/crate-decision-map.md) for the full rationale

---

## Best Practices

### DO
- Verify each crate's current version on crates.io before committing it
- Standardize on `tokio` and enable only the features you use
- Use `thiserror` in libraries, `anyhow` in binaries
- Prefer the crate the project already uses over a "better" alternative

### DON'T
- Write `serde = "2"` — it is not stable
- Hardcode a remembered patch version without checking
- Expose `anyhow::Error` from a library API
- Mix async runtimes in one binary
