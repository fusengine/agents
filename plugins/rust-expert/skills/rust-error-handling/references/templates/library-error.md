# Template: Library Error (thiserror)

A complete typed-error module for a library crate. Callers can `match` on every
variant; `anyhow` never appears in the public API. Compiles on stable 1.96.1.

## Cargo.toml

```toml
[package]
name = "configstore"
version = "0.1.0"
edition = "2024"

[dependencies]
thiserror = "2"
```

## src/error.rs

```rust
//! Public error type for the `configstore` library.
//!
//! Every fallible public function returns `Result<T, ConfigError>` so downstream
//! crates can match on the specific failure and recover.

use thiserror::Error;

/// Errors returned by the config store's public API.
#[derive(Error, Debug)]
pub enum ConfigError {
    /// The config file could not be read from disk.
    #[error("could not read config file")]
    Io(#[from] std::io::Error),

    /// The file contents were not valid UTF-8.
    #[error("config file is not valid UTF-8")]
    Encoding(#[from] std::str::Utf8Error),

    /// A required key was absent.
    #[error("missing required key: {0}")]
    MissingKey(String),

    /// A key held a value of the wrong shape.
    #[error("invalid value for `{key}` (expected {expected}, found {found})")]
    InvalidValue {
        key: String,
        expected: &'static str,
        found: String,
    },
}

/// Convenience alias for the library's public result type.
pub type Result<T> = std::result::Result<T, ConfigError>;
```

## src/lib.rs

```rust
mod error;
pub use error::{ConfigError, Result};

/// Read a required string key from raw config bytes.
///
/// # Errors
/// Returns [`ConfigError::Encoding`] if `raw` is not UTF-8, or
/// [`ConfigError::MissingKey`] if `key` is absent.
pub fn read_key(raw: &[u8], key: &str) -> Result<String> {
    let text = std::str::from_utf8(raw)?; // Utf8Error -> ConfigError via #[from]
    text.lines()
        .find_map(|line| line.strip_prefix(&format!("{key}=")))
        .map(str::to_owned)
        .ok_or_else(|| ConfigError::MissingKey(key.to_owned()))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn reads_present_key() {
        assert_eq!(read_key(b"name=alpha\n", "name").unwrap(), "alpha");
    }

    #[test]
    fn missing_key_is_typed() {
        let err = read_key(b"name=alpha\n", "port").unwrap_err();
        assert!(matches!(err, ConfigError::MissingKey(k) if k == "port"));
    }
}
```

The caller can now write `match err { ConfigError::MissingKey(k) => ..., _ => ... }` —
which would be impossible had the library returned `anyhow::Error`.
