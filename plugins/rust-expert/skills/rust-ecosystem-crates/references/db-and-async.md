---
name: db-and-async
description: Choosing a Rust database crate (sqlx vs sea-orm vs diesel) and wiring the tokio + axum async stack
when-to-use: Load when picking a DB access layer or setting up an async web service
keywords: sqlx, sea-orm, diesel, tokio, axum, async, database
priority: high
requires: crate-decision-map.md
related: crate-decision-map.md
---

# Database & Async Stack

## Overview

Database access is the domain with no single winner — the three leaders trade compile-time safety, async support, and ergonomics differently. The async web stack, by contrast, has converged on `tokio` + `axum`.

---

## Database: the three-way choice

| Crate | Model | Async | Compile-time query checks | Choose when |
|-------|-------|-------|---------------------------|-------------|
| **sqlx** | SQL-first, not an ORM | Yes (native) | Yes — `query!` verifies against a live DB at build time | You want raw SQL with checked queries and async |
| **sea-orm** | Full async ORM | Yes (native, on sqlx) | No (runtime) | You want ORM ergonomics (entities, relations) on async |
| **diesel** | ORM + typed query DSL | Sync core (async via `diesel-async`) | Yes — types enforce schema at compile time | You want the strongest compile-time guarantees, sync-first |

---

## Decision Guide

```
Do you want to write SQL directly?
├── Yes → sqlx (async, compile-time-checked queries)
└── No, I want an ORM
    ├── Async-native + entity model → sea-orm
    └── Maximum compile-time safety, sync-first → diesel (+ diesel-async if needed)
```

Selection criteria in order of usual weight:
1. **Async requirement** — sqlx and sea-orm are async-native; diesel's core is sync.
2. **Compile-time query safety** — sqlx (`query!`) and diesel (type DSL) catch schema drift at build; sea-orm checks at runtime.
3. **SQL vs ORM preference** — sqlx keeps you in SQL; sea-orm/diesel abstract it.

---

## The async web stack

`axum` is the default HTTP framework: it runs on `tokio`, composes with `tower` middleware, and shares the hyper/http types with `reqwest`. This gives one coherent stack for inbound and outbound HTTP.

```rust
use axum::{routing::get, Router};

#[tokio::main]
async fn main() {
    let app = Router::new().route("/health", get(|| async { "ok" }));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

→ See [cargo-toml-stack.md](templates/cargo-toml-stack.md) for the full manifest

---

## Best Practices

### DO
- Pick sqlx when you want async + SQL you can see and check
- Enable only the sqlx driver feature you use (`postgres`, `mysql`, `sqlite`)
- Share one `tokio` runtime between axum (server) and reqwest (client)
- Run `sqlx` in offline mode (`SQLX_OFFLINE=true` + `.sqlx/`) so CI needs no live DB

### DON'T
- Reach for diesel expecting async-native without `diesel-async`
- Assume sea-orm checks queries at compile time (it does not)
- Spin up a second async runtime for the HTTP client

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| CI fails: sqlx needs a DB to check `query!` | Commit `.sqlx/` and set `SQLX_OFFLINE=true` |
| diesel used in async handlers, blocks the runtime | Use `diesel-async` or `spawn_blocking` |
| All sqlx driver features enabled | Enable only the one database driver |

---

## Related References

- [crate-decision-map.md](crate-decision-map.md) - The broader domain map

## Related Templates

- [cargo-toml-stack.md](templates/cargo-toml-stack.md) - Complete web-service manifest
