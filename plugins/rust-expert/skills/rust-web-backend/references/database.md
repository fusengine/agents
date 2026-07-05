---
name: database
description: sqlx pool, compile-time-checked query! macros, migrations, offline mode, and ORM alternatives.
when-to-use: Load when adding database access — connecting a pool, writing checked queries, running migrations, or picking sqlx vs sea-orm vs diesel.
keywords: sqlx, query, query_as, PgPool, migrate, offline, sea-orm, diesel, DATABASE_URL
priority: high
related: architecture.md, error-handling.md
---

# Database

## Overview

sqlx is the standard-stack choice: async, driver-per-database (Postgres/MySQL/SQLite), and — its headline feature — `query!`/`query_as!` macros that **check your SQL against a live database at compile time**. No ORM DSL; you write SQL.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Pool** | `PgPool` (etc.) — cheap to clone, holds the connections. Put it in `AppState`. |
| **`query!`** | Checked SQL returning an anonymous record; column types verified at compile time. |
| **`query_as!`** | Same, mapping rows onto your struct. |
| **`query`/`query_as` (fn)** | Runtime-checked variants when compile-time checking isn't possible (dynamic SQL). |
| **Migrations** | `sqlx::migrate!()` embeds `migrations/*.sql`; `cargo sqlx migrate run` applies them. |
| **Offline mode** | `cargo sqlx prepare` writes `.sqlx/` so CI compiles without a live DB. |

---

## Connect

```rust
use sqlx::postgres::PgPoolOptions;

let pool = PgPoolOptions::new()
    .max_connections(10)
    .connect(&std::env::var("DATABASE_URL")?)
    .await?;
```

---

## Checked queries

```rust
// mapped onto a struct
let user = sqlx::query_as!(
    User,
    "SELECT id, name FROM users WHERE id = $1",
    id
)
.fetch_optional(&pool)
.await?;

// insert returning a value
let id: i64 = sqlx::query_scalar!(
    "INSERT INTO users (name) VALUES ($1) RETURNING id",
    name
)
.fetch_one(&pool)
.await?;
```

The macros need `DATABASE_URL` set at **compile** time (or a committed `.sqlx/` cache). This is the one setup cost to plan for — especially in CI.

---

## Migrations

```rust
sqlx::migrate!("./migrations").run(&pool).await?; // embeds & applies at startup
```

```
migrations/
├── 0001_create_users.sql
└── 0002_add_email.sql
```

---

## Decision Guide

```
Want SQL + compile-time safety, async?     → sqlx (standard)
Want ActiveRecord-style ORM, less SQL?      → sea-orm
Mature, rich query DSL, OK with sync?        → diesel 2.x (sync!)
```

**diesel is synchronous** — in an async app you must run it via `spawn_blocking` or a sync connection pool, or use `diesel-async`. Do not drop diesel calls directly onto async workers. **sea-orm** builds on sqlx and trades raw SQL for a higher-level entity API.

---

## Best Practices

### DO
- Store one pool in `AppState`; clone it into queries.
- Prefer `query!`/`query_as!` for compile-time safety.
- Commit `.sqlx/` (offline cache) so CI builds without a DB.

### DON'T
- Open a new connection per request.
- Interpolate values into SQL strings — always use bind params (`$1`).
- Call synchronous diesel on an async worker without `spawn_blocking`.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Build fails: `DATABASE_URL must be set` | Set it, or run `cargo sqlx prepare` and commit `.sqlx/` |
| Type mismatch from `query!` | Align Rust type with column type (e.g. `i64` for `BIGINT`) |
| diesel blocks the runtime | Wrap in `spawn_blocking` or use `diesel-async` |

---

## Related References

- [architecture.md](architecture.md) — pool inside `State`
- [error-handling.md](error-handling.md) — `sqlx::Error` → `AppError`

## Related Templates

- [rest-service.md](templates/rest-service.md) — pool wired end-to-end
