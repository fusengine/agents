# anyhow — Application Errors

**Load when:** handling errors in a binary or top-level application where you want one
ergonomic error type and rich diagnostic context, not a matchable API.

`anyhow::Error` is a trait-object-based error type: it can wrap **any** error that
implements `std::error::Error`, so `?` propagates everything uniformly. Use it in
application code — **never in a library's public signatures** (it erases the concrete
type, denying callers the ability to match).

## Cargo.toml

```toml
[dependencies]
anyhow = "1"
```

## Result and propagation

Use `anyhow::Result<T>` (alias for `Result<T, anyhow::Error>`) as the return type of
any fallible function, and `?` to propagate:

```rust
use anyhow::Result;

fn get_cluster_info() -> Result<ClusterMap> {
    let config = std::fs::read_to_string("cluster.json")?;
    let map: ClusterMap = serde_json::from_str(&config)?;
    Ok(map)
}
```

## Context — the reason to use anyhow

Attach a human breadcrumb at each layer so a low-level error becomes traceable:

```rust
use anyhow::{Context, Result};

fn load(path: &str) -> Result<Vec<u8>> {
    std::fs::read(path)
        .with_context(|| format!("Failed to read instrs from {path}"))
}
```

Output:

```text
Error: Failed to read instrs from ./path/to/instrs.json

Caused by:
    No such file or directory (os error 2)
```

Use `.context("literal")` for a fixed message and `.with_context(|| ...)` when the
message needs formatting (the closure runs only on the error path).

## Ad-hoc errors and assertions

- **`anyhow!("...")`** — construct a one-off error with interpolation.
- **`bail!("...")`** — early `return Err(anyhow!(...))`.
- **`ensure!(cond, "...")`** — return early if the condition is false.

```rust
use anyhow::{anyhow, bail, ensure};

ensure!(count > 0, "count must be positive, got {count}");
if missing { bail!("Missing attribute: {}", name); }
let e = anyhow!("unexpected state: {:?}", state);
```

## Recovering a concrete error

Even though the type is erased, you can downcast when you need to branch on a specific
underlying error:

```rust
match err.downcast_ref::<DataStoreError>() {
    Some(DataStoreError::Redaction(_)) => { /* handle */ }
    _ => return Err(err),
}
```

## Pairing with thiserror

anyhow ships no derive macro. Define domain error types with `thiserror` (see
[thiserror-libraries.md](thiserror-libraries.md)); anyhow will happily wrap any of them
via `?` because they implement `std::error::Error`. On Rust ≥ 1.65, anyhow captures a
backtrace when the source does not provide one (enable with `RUST_BACKTRACE=1`).

Verify the current API (fuse-browser fast-path on `https://docs.rs/anyhow` → Context7 → Exa).
