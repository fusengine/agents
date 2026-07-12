---
name: rest-service
description: Complete minimal axum 0.8 REST service — router, State, extractors, AppError/IntoResponse, sqlx pool, tracing.
when-to-use: Load when scaffolding a new Rust HTTP service and you want a working, idiomatic starting point.
keywords: axum, sqlx, tracing, rest, template, IntoResponse, State, router
priority: medium
---

# Minimal REST Service (complete)

A single-file service showing the standard stack wired together. Split into modules (`routes/`, `error.rs`, `state.rs`, `db.rs`) once it grows past ~100 lines per file (SOLID).

## Cargo.toml

```toml
[package]
name = "api"
version = "0.1.0"
edition = "2024"

[dependencies]
axum = "0.8.9"
tokio = { version = "1.52", features = ["full"] }
sqlx = { version = "0.9", features = ["runtime-tokio", "tls-rustls-ring-webpki", "postgres", "macros"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
thiserror = "2"
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter", "json"] }
tower-http = { version = "0.6", features = ["trace"] }
```

## src/main.rs

```rust
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::postgres::PgPoolOptions;
use tower_http::trace::TraceLayer;
use tracing_subscriber::{fmt, EnvFilter};

#[derive(Clone)]
struct AppState {
    pool: sqlx::PgPool,
}

#[derive(Serialize, sqlx::FromRow)]
struct User {
    id: i64,
    name: String,
}

#[derive(Deserialize)]
struct CreateUser {
    name: String,
}

#[derive(Debug, thiserror::Error)]
enum AppError {
    #[error("not found")]
    NotFound,
    #[error(transparent)]
    Db(#[from] sqlx::Error),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, msg) = match self {
            AppError::NotFound => (StatusCode::NOT_FOUND, "not found".to_string()),
            AppError::Db(e) => {
                tracing::error!(error = %e, "db error");
                (StatusCode::INTERNAL_SERVER_ERROR, "internal error".to_string())
            }
        };
        (status, Json(json!({ "error": msg }))).into_response()
    }
}

/// GET /users/{id}
async fn show(State(app): State<AppState>, Path(id): Path<i64>)
    -> Result<Json<User>, AppError>
{
    let user = sqlx::query_as!(User, "SELECT id, name FROM users WHERE id = $1", id)
        .fetch_optional(&app.pool)
        .await?
        .ok_or(AppError::NotFound)?;
    Ok(Json(user))
}

/// POST /users
async fn create(State(app): State<AppState>, Json(body): Json<CreateUser>)
    -> Result<(StatusCode, Json<User>), AppError>
{
    let user = sqlx::query_as!(
        User,
        "INSERT INTO users (name) VALUES ($1) RETURNING id, name",
        body.name
    )
    .fetch_one(&app.pool)
    .await?;
    Ok((StatusCode::CREATED, Json(user)))
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::try_from_default_env()
            .unwrap_or_else(|_| EnvFilter::new("info,sqlx=warn")))
        .json()
        .init();

    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&std::env::var("DATABASE_URL")?)
        .await?;

    let app = Router::new()
        .route("/users", get(list_placeholder).post(create))
        .route("/users/{id}", get(show)) // 0.8 path syntax
        .layer(TraceLayer::new_for_http())
        .with_state(AppState { pool });

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
    tracing::info!("listening on {}", listener.local_addr()?);
    axum::serve(listener, app).await?;
    Ok(())
}

/// Placeholder so the router compiles; replace with a real list handler.
async fn list_placeholder() -> impl IntoResponse {
    Json(json!({ "users": [] }))
}
```

## Notes

- `axum::serve` + `tokio::net::TcpListener` is the 0.8 serving API (no `Server::bind`).
- `query_as!` needs `DATABASE_URL` at compile time, or a committed `.sqlx/` cache (`cargo sqlx prepare`).
- Add `tower-http` layers (cors, timeout, compression) as needs grow.
- For graceful shutdown, pass `.with_graceful_shutdown(...)` to `axum::serve` (see rust-async-concurrency graceful-shutdown template).
