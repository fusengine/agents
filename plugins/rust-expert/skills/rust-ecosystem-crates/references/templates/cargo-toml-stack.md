---
name: cargo-toml-stack
description: Complete Cargo.toml for an async Rust web service using the de-facto standard crates
keywords: template, Cargo.toml, tokio, axum, sqlx, serde, tracing
---

# Complete Web-Service Manifest

## Usage

A production-shaped `Cargo.toml` for an async HTTP service. **Every version below is illustrative** — confirm the current release on crates.io or via Context7 before committing.

---

## `Cargo.toml`

```toml
[package]
name = "my-service"
version = "0.1.0"
edition = "2024"
rust-version = "1.85"

[dependencies]
# --- Async runtime (enable only needed features) ---
tokio = { version = "1", features = ["rt-multi-thread", "macros", "net", "signal"] }

# --- Web server (inbound) ---
axum = "0.8"
tower = "0.5"
tower-http = { version = "0.6", features = ["trace"] }

# --- HTTP client (outbound), rustls + JSON only ---
reqwest = { version = "0.12", default-features = false, features = ["json", "rustls-tls"] }

# --- Serialization ---
serde = { version = "1", features = ["derive"] }   # NOTE: 2.0 is NOT released
serde_json = "1"

# --- Database: sqlx (async, compile-time-checked SQL) ---
sqlx = { version = "0.8", default-features = false, features = ["runtime-tokio", "tls-rustls", "postgres", "macros"] }

# --- Errors: anyhow because this is an application binary ---
anyhow = "1"

# --- Observability ---
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter", "json"] }

[dev-dependencies]
proptest = "1"

[lints.clippy]
all = { level = "warn", priority = -1 }
```

---

## `src/main.rs`

```rust
use anyhow::Context;
use axum::{routing::get, Router};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Structured logs; RUST_LOG controls the level via env-filter.
    tracing_subscriber::fmt().with_env_filter("info").init();

    let app = Router::new().route("/health", get(health));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .context("binding :3000")?;

    tracing::info!("listening on :3000");
    axum::serve(listener, app).await.context("serving")?;
    Ok(())
}

async fn health() -> &'static str {
    "ok"
}
```

---

## Notes

- **Verify versions**: the numbers here (axum 0.8, sqlx 0.8, reqwest 0.12, …) drift quickly. Check crates.io before use.
- `serde = "1"` — `2.0` is under discussion, not published.
- `default-features = false` on `reqwest` and `sqlx` avoids pulling native-tls/OpenSSL; explicit `rustls` keeps the build pure-Rust.
- Enable one sqlx database driver (`postgres` here); adding all drivers bloats compile time.
- This is a binary, so errors use `anyhow`. A reusable library crate would define `thiserror` enums instead.
