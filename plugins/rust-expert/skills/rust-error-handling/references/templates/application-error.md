# Template: Application Error (anyhow)

A complete binary entry point using `anyhow` for ergonomic propagation and layered
context. It consumes the library's typed `ConfigError` (see the thiserror template)
transparently through `?`. Compiles on stable 1.96.1.

## Cargo.toml

```toml
[package]
name = "configtool"
version = "0.1.0"
edition = "2024"

[dependencies]
anyhow = "1"
configstore = { path = "../configstore" } # the thiserror library from the other template
```

## src/main.rs

```rust
//! Application entry point. Uses `anyhow` for propagation + context; never exposes
//! `anyhow::Error` to any library — it stays inside the binary.

use anyhow::{bail, Context, Result};

fn main() -> Result<()> {
    let path = std::env::args()
        .nth(1)
        .context("usage: configtool <config-path>")?;

    let port = load_port(&path)
        .with_context(|| format!("failed to load port from {path}"))?;

    println!("configured port: {port}");
    Ok(())
}

/// Read and validate the `port` key from a config file.
///
/// `?` lifts both `std::io::Error` and the library's typed `ConfigError` into
/// `anyhow::Error`; `.context(..)` attaches a breadcrumb at each layer.
fn load_port(path: &str) -> Result<u16> {
    let raw = std::fs::read(path)
        .with_context(|| format!("reading {path}"))?;

    // configstore::read_key returns Result<_, ConfigError>; `?` converts it.
    let value = configstore::read_key(&raw, "port")
        .context("config is missing the `port` key")?;

    let port: u16 = value
        .parse()
        .with_context(|| format!("`port` must be a number, got {value:?}"))?;

    if port < 1024 {
        // ad-hoc, one-off error — no need for a typed variant in a binary
        bail!("port {port} is privileged; choose >= 1024");
    }

    Ok(port)
}
```

## Resulting diagnostics

A missing file produces a full chain instead of a bare OS error:

```text
Error: failed to load port from ./missing.conf

Caused by:
    0: reading ./missing.conf
    1: No such file or directory (os error 2)
```

Set `RUST_BACKTRACE=1` to also capture a backtrace (Rust ≥ 1.65). Note the division of
labor: the **library** defines a typed `ConfigError` with `thiserror`; the
**application** wraps everything in `anyhow` and enriches it with `.context(...)`.
