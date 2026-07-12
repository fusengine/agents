---
name: architecture
description: axum 0.8 service shape — Router, handlers, extractors, State, and tower/tower-http middleware.
when-to-use: Load when laying out routes, extracting request data, sharing state, or adding middleware layers.
keywords: axum, Router, handler, extractor, State, middleware, tower, tower-http
priority: high
related: error-handling.md, database.md
---

# Architecture

## Overview

An axum service is a `Router` of routes, each mapping a method + path to an async handler. Handlers receive typed **extractors** as arguments and return anything that implements `IntoResponse`. Cross-cutting behavior comes from **tower** layers. Shared dependencies (DB pool, config) travel via `State`.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Router** | `Router::new().route(path, method_router)`. Compose sub-routers with `.nest()` / `.merge()`. |
| **Handler** | `async fn(...) -> impl IntoResponse`. Extractor args are parsed in order. |
| **Extractor** | Turns request parts into typed values: `Path`, `Query`, `Json`, `State`, `HeaderMap`, `Option<T>`. |
| **State** | App-wide deps injected via `.with_state(...)` and pulled with `State<T>`. |
| **Layer** | tower middleware wrapping the whole router or a route (`.layer(...)`). |

---

## Path syntax (axum 0.8)

The `matchit` upgrade in 0.8 changed path params:

| Kind | 0.8 syntax | old (≤0.7) |
|------|-----------|------------|
| single segment | `/users/{id}` | `/users/:id` |
| catch-all | `/files/{*path}` | `/files/*path` |
| literal brace | `{{` / `}}` | — |

Using the old syntax is a hard error.

---

## Extractors

```rust
use axum::extract::{Path, Query, State, Json};

async fn show(
    State(app): State<AppState>,   // shared deps
    Path(id): Path<u64>,           // /users/{id}
) -> impl IntoResponse { /* ... */ }

async fn create(
    State(app): State<AppState>,
    Json(body): Json<CreateUser>,  // JSON body — MUST come last
) -> impl IntoResponse { /* ... */ }
```

Rules:
- Body-consuming extractors (`Json`, `Bytes`, `String`) must be the **last** argument.
- `Option<T>` in 0.8 requires `T: OptionalFromRequestParts` — rejections become error responses, not silent `None`.
- Custom extractors implement `FromRequestParts` / `FromRequest` — **no `#[async_trait]`** in 0.8 (RPITIT).

---

## State

```rust
#[derive(Clone)]
struct AppState {
    pool: sqlx::PgPool,   // pools are cheap to clone (Arc inside)
    config: Config,
}

let app = Router::new()
    .route("/users/{id}", get(show))
    .with_state(AppState { pool, config });
```

`State<T>` requires `T: Clone`. sqlx pools clone cheaply. For large config, wrap in `Arc`.

---

## Middleware (tower-http)

```rust
use tower_http::{trace::TraceLayer, timeout::TimeoutLayer, cors::CorsLayer};
use std::time::Duration;

let app = router
    .layer(TraceLayer::new_for_http())          // request/response spans
    .layer(TimeoutLayer::new(Duration::from_secs(30)))
    .layer(CorsLayer::permissive());
```

Layers apply bottom-up (last added is outermost). Prefer `tower-http` for trace, cors, compression, timeout, and request-body limits over hand-rolled middleware.

---

## Best Practices

### DO
- Group routes with `.nest("/api/v1", api_router)`.
- Keep handlers thin — delegate to a service layer, return `Result<T, AppError>`.
- Put the DB pool + config in one `Clone` `AppState`.

### DON'T
- Place a body extractor before other args.
- Use `/:id`-style paths.
- Add `#[async_trait]` to custom extractors.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Route param not matching | Use `/{id}` not `/:id` |
| "extractor must be last" | Move `Json`/`Bytes`/`String` to the final argument |
| `State` won't compile | Ensure the state type is `Clone` |

---

## Related References

- [error-handling.md](error-handling.md) — handler return type
- [database.md](database.md) — the pool inside State

## Related Templates

- [rest-service.md](templates/rest-service.md) — full router + state + handlers
