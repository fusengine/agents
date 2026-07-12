# Template: Idiomatic Core Rust (edition 2024)

Copy-paste patterns for borrow-first signatures, iterator chains, and let chains.
Compiles on stable 1.96.1 with `edition = "2024"`.

```rust
//! Idiomatic edition-2024 patterns: borrow-first APIs, iterator pipelines,
//! let chains, and explicit shared ownership.

use std::sync::Arc;

/// A parsed record. Owns its data; callers borrow it.
#[derive(Debug, Clone)]
pub struct Record {
    pub id: u32,
    pub name: String,
    pub tags: Vec<String>,
}

/// Borrow-first: takes `&[Record]` and `&str`, so every caller works without
/// surrendering ownership. Returns owned results only where new data is produced.
pub fn names_with_tag<'a>(records: &'a [Record], tag: &str) -> Vec<&'a str> {
    records
        .iter()
        .filter(|r| r.tags.iter().any(|t| t == tag))
        .map(|r| r.name.as_str())
        .collect()
}

/// Iterator pipeline instead of an indexed loop; `?` for propagation.
pub fn max_id(records: &[Record]) -> Option<u32> {
    records.iter().map(|r| r.id).max()
}

/// Let chains (stable 1.88.0, edition 2024): flatten nested `if let` + guards.
pub fn describe(record: Option<&Record>) -> String {
    if let Some(r) = record
        && let Some(first_tag) = r.tags.first()
        && r.id != 0
    {
        format!("record {} ({}) tagged '{first_tag}'", r.id, r.name)
    } else {
        "no describable record".to_owned()
    }
}

/// Explicit shared ownership across threads: clone the handle, not the data.
pub fn spawn_workers(config: Arc<Record>) -> Vec<std::thread::JoinHandle<u32>> {
    (0..4)
        .map(|_| {
            let cfg = Arc::clone(&config); // cheap refcount bump, not a deep copy
            std::thread::spawn(move || cfg.id)
        })
        .collect()
}

/// Async closure (stable 1.85.0): implements `AsyncFn`, so it composes.
pub async fn load_all<F>(ids: &[u32], loader: F) -> Vec<u32>
where
    F: AsyncFn(u32) -> u32,
{
    let mut out = Vec::with_capacity(ids.len());
    for &id in ids {
        out.push(loader(id).await);
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample() -> Vec<Record> {
        vec![
            Record { id: 1, name: "alpha".into(), tags: vec!["x".into()] },
            Record { id: 2, name: "beta".into(), tags: vec!["y".into()] },
        ]
    }

    #[test]
    fn filters_by_tag() {
        let recs = sample();
        assert_eq!(names_with_tag(&recs, "x"), vec!["alpha"]);
    }

    #[test]
    fn computes_max_id() {
        assert_eq!(max_id(&sample()), Some(2));
    }
}
```

## Cargo.toml

```toml
[package]
name = "core-demo"
version = "0.1.0"
edition = "2024"   # required for let chains and async closures used above
```
