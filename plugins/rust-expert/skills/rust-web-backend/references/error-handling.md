---
name: error-handling
description: One app error type that implements IntoResponse, mapping domain/DB errors to HTTP status + JSON body.
when-to-use: Load when a handler can fail and you need typed error responses instead of unwrap/panic.
keywords: IntoResponse, error, thiserror, status code, Result, axum, anyhow
priority: high
related: architecture.md, database.md
---

# Error Handling

## Overview

axum handlers return `impl IntoResponse`; for fallible ones, return `Result<T, AppError>` where `AppError` implements `IntoResponse`. This gives every failure a status code and a consistent body, and lets you use `?` freely inside handlers. Never `.unwrap()` in a handler.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **`AppError`** | Single enum of failure kinds for the whole app. |
| **`IntoResponse`** | Converts `AppError` into an HTTP response (status + JSON). |
| **`From` impls** | Let `?` turn library errors (sqlx, validation) into `AppError`. |
| **`thiserror`** | Derives `Display`/`Error` for the enum ergonomically. |

---

## Pattern

```rust
use axum::{http::StatusCode, response::{IntoResponse, Response}, Json};
use serde_json::json;

#[derive(Debug, thiserror::Error)]
enum AppError {
    #[error("not found")]
    NotFound,
    #[error("invalid input: {0}")]
    Validation(String),
    #[error(transparent)]
    Db(#[from] sqlx::Error),   // `?` on a query converts automatically
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            AppError::NotFound => (StatusCode::NOT_FOUND, self.to_string()),
            AppError::Validation(_) => (StatusCode::BAD_REQUEST, self.to_string()),
            AppError::Db(ref e) => {
                tracing::error!(error = %e, "database error");
                (StatusCode::INTERNAL_SERVER_ERROR, "internal error".to_string())
            }
        };
        (status, Json(json!({ "error": message }))).into_response()
    }
}
```

Handler using it:

```rust
async fn show(State(app): State<AppState>, Path(id): Path<u64>)
    -> Result<Json<User>, AppError>
{
    let user = sqlx::query_as!(User, "SELECT id, name FROM users WHERE id = $1", id as i64)
        .fetch_optional(&app.pool)
        .await?                       // sqlx::Error → AppError via From
        .ok_or(AppError::NotFound)?;  // None → 404
    Ok(Json(user))
}
```

---

## Decision Guide

```
Failure is expected + client-facing?  → a named AppError variant (400/404/409)
Failure is a leaked internal error?   → log details, return 500 with a generic body
Prototyping / binary glue?            → anyhow::Error, but wrap it in AppError at the edge
```

Do not leak internal error strings (DB messages, paths) to clients — log them, return a generic 500 body.

---

## Best Practices

### DO
- Keep one `AppError` per service; add variants as needed.
- Implement `From` for library errors so `?` just works.
- Log 5xx causes with `tracing::error!` before returning a sanitized body.

### DON'T
- `.unwrap()` / `.expect()` in a handler.
- Return raw `sqlx::Error` text to the client.
- Scatter ad-hoc `(StatusCode, String)` tuples across handlers.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `?` won't compile in handler | Add a `From<LibError>` for `AppError` |
| Handler panics → connection reset | Return `Result<_, AppError>` instead of unwrapping |
| DB internals leak to client | Log the error, respond with a generic message |

---

## Related References

- [architecture.md](architecture.md) — handler return types
- [observability.md](observability.md) — logging the 5xx cause

## Related Templates

- [rest-service.md](templates/rest-service.md) — AppError wired into a full service
