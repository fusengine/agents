---
name: rust-web-backend
description: Use when building a REST/HTTP backend in Rust — axum routing, extractors, shared state, middleware, error responses, sqlx database access. Not for raw async/concurrency (rust-async-concurrency).
versions:
  axum: "0.8.9"
  tokio: "1.52"
  sqlx: "0.9"
  tracing: "0.1"
  rust-edition: "2024"
user-invocable: false
references: references/architecture.md, references/error-handling.md, references/database.md, references/observability.md, references/templates/rest-service.md
related-skills: rust-async-concurrency, solid-rust
---

<objective>
This skill covers the 2026 standard Rust web-backend stack: axum 0.8.x routing (including
the /{id} path syntax that replaced /:id) and extractors, sharing state via State<T>,
composing tower-http middleware (trace, cors, timeout, compression), mapping domain errors
to IntoResponse instead of unwrapping in handlers, and sqlx 0.9 database access with
compile-time-checked query!/query_as! (including the .sqlx/ offline cache for CI).

It also names the honest alternatives — sea-orm for an ActiveRecord-style ORM, diesel for a
mature but synchronous alternative needing spawn_blocking — and structured observability via
tracing.

Out of scope: raw async/concurrency primitives (channels, locks, task spawning) belong to
rust-async-concurrency; cross-domain crate selection belongs to rust-ecosystem-crates.
</objective>

# Rust Web Backend

## Agent Workflow (MANDATORY)

Before building the service, spawn in parallel:

1. **fuse-ai-pilot:explore-codebase** — detect the existing router, state, and DB layer
2. **fuse-ai-pilot:research-expert** — verify current axum/sqlx APIs via Context7/Exa (axum 0.8 changed several APIs)
3. **mcp__context7__query-docs** — pull exact extractor/handler signatures

After building, run **fuse-ai-pilot:sniper**.

---

## The 2026 standard stack

| Layer | Crate | Why |
|-------|-------|-----|
| **Runtime** | tokio | De-facto async runtime; everything targets it |
| **HTTP framework** | axum 0.8.x | Tower-based, extractor ergonomics, minimal magic |
| **Middleware** | tower / tower-http | Composable layers (trace, cors, timeout, compression) |
| **Database** | sqlx 0.9 | Async, `query!` compile-time-checked SQL, no DSL; Postgres/MySQL/SQLite |
| **Observability** | tracing + tracing-subscriber | Structured, async-aware spans and logs |

**Honest alternatives:** `sea-orm` (ActiveRecord-style ORM, higher-level than sqlx), `diesel` 2.x (mature, **synchronous** — needs `spawn_blocking` or a sync pool in async apps). Prefer sqlx for the standard stack; reach for these only when their model fits.

---

## Critical Rules

1. **axum 0.8 path syntax is `/{id}`, not `/:id`** — `/*rest` became `/{*rest}`. The old `matchit` syntax will not compile.
2. **Errors implement `IntoResponse`** — never `.unwrap()` in a handler. Map domain errors to a status + body via one app error type.
3. **Share state with `State<T>`, wrapped once** — put the pool/config in an `Arc`-friendly struct; extract it with `State`, do not use globals.
4. **`sqlx::query!` needs `DATABASE_URL` at compile time** — or a committed `.sqlx/` offline cache (`cargo sqlx prepare`). Plan this before CI.
5. **No `#[async_trait]` on axum extractors** — 0.8 uses RPITIT; custom `FromRequestParts` impls must drop the macro.

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Architecture** | [architecture.md](references/architecture.md) | Router, extractors, State, tower middleware layout |
| **Error handling** | [error-handling.md](references/error-handling.md) | App error type + `IntoResponse` |
| **Database** | [database.md](references/database.md) | sqlx pool, `query!`, migrations, alternatives |
| **Observability** | [observability.md](references/observability.md) | tracing spans, subscriber, request logging |

### Templates

| Template | When to Use |
|----------|-------------|
| [rest-service.md](references/templates/rest-service.md) | Complete minimal REST service (router + state + handlers + errors + tracing) |

---

## Quick Reference

### Router with the 0.8 path syntax

```rust
let app = Router::new()
    .route("/users", get(list).post(create))
    .route("/users/{id}", get(show))   // NOT /:id
    .with_state(state);
```

→ See [architecture.md](references/architecture.md)

### Compile-time-checked query

```rust
let user = sqlx::query_as!(User, "SELECT id, name FROM users WHERE id = $1", id)
    .fetch_optional(&pool)
    .await?;
```

→ See [database.md](references/database.md)

---

## Best Practices

### DO
- Keep one app error type that implements `IntoResponse`.
- Layer cross-cutting concerns (trace, timeout, cors) via `tower-http`.
- Verify queries at compile time with `query!`/`query_as!`.

### DON'T
- Use `/:id` route syntax (0.7 and earlier only).
- `.unwrap()` in handlers — return a typed error.
- Reach for diesel in async code without accounting for its sync nature.

---

## Sources (verified)

- tokio.rs/blog/2025-01-01-announcing-axum-0-8-0 — path syntax, Option extractor, `#[async_trait]` removal (fetched 2026-07-05)
- crates.io — axum 0.8.9, sqlx 0.9.0, tokio 1.52.3, tracing 0.1.44 (current at fetch)
