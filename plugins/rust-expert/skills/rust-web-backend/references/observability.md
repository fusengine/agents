---
name: observability
description: Structured logging and spans with tracing + tracing-subscriber, and request tracing via tower-http.
when-to-use: Load when adding logs, spans, or request-level tracing to the service.
keywords: tracing, tracing-subscriber, span, instrument, TraceLayer, EnvFilter, structured logging
priority: medium
related: architecture.md, error-handling.md
---

# Observability

## Overview

`tracing` is the async-aware logging/diagnostics framework. It records **spans** (a period of work) and **events** (a moment), carrying structured fields — not just strings. `tracing-subscriber` decides how they are filtered and printed. `tower-http`'s `TraceLayer` wires per-request spans automatically.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Event** | A log record: `tracing::info!(user_id, "created")`. Fields are typed key/values. |
| **Span** | Context wrapping work; child events inherit its fields. |
| **`#[instrument]`** | Attribute that wraps a function in a span capturing its args. |
| **Subscriber** | Consumes spans/events; `fmt` prints them, `EnvFilter` selects levels. |
| **`TraceLayer`** | tower-http middleware creating a span per HTTP request. |

---

## Setup

```rust
use tracing_subscriber::{fmt, EnvFilter};

fn init_tracing() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::try_from_default_env()
            .unwrap_or_else(|_| EnvFilter::new("info,sqlx=warn")))
        .json() // or .pretty() in dev
        .init();
}
```

`RUST_LOG=debug,my_app=trace` then controls verbosity at runtime.

---

## Structured events, not string soup

```rust
// GOOD: fields are queryable
tracing::info!(user_id = id, elapsed_ms = took, "user created");

// AVOID: everything crammed into the message
tracing::info!("user {id} created in {took}ms");
```

---

## Instrument a function

```rust
#[tracing::instrument(skip(pool), fields(user_id = id))]
async fn load_user(pool: &sqlx::PgPool, id: i64) -> Result<User, sqlx::Error> {
    // every event in here inherits the span + user_id field
    sqlx::query_as!(User, "SELECT id, name FROM users WHERE id = $1", id)
        .fetch_one(pool)
        .await
}
```

`skip(...)` keeps large/secret args out of the span; `fields(...)` adds explicit ones.

---

## Request tracing

```rust
use tower_http::trace::TraceLayer;

let app = router.layer(TraceLayer::new_for_http());
// emits a span per request with method, path, status, latency
```

---

## Best Practices

### DO
- Emit structured fields; keep the message a short constant.
- Use `#[instrument]` on service functions, `skip` secrets/large values.
- Drive levels with `EnvFilter` / `RUST_LOG`, defaulting noisy crates down (`sqlx=warn`).

### DON'T
- Reach for `println!`/`log` in an async service — use `tracing`.
- Interpolate dynamic data into the message string instead of fields.
- Log secrets or full request bodies.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| No output at all | You never called `.init()` on a subscriber |
| Too noisy | Tighten `EnvFilter` (e.g. `info,sqlx=warn`) |
| Secrets in spans | `#[instrument(skip(...))]` sensitive args |

---

## Related References

- [architecture.md](architecture.md) — where `TraceLayer` sits
- [error-handling.md](error-handling.md) — logging 5xx causes before responding

## Related Templates

- [rest-service.md](templates/rest-service.md) — tracing initialized in `main`
