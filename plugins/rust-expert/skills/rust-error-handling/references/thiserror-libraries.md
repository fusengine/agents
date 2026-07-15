# thiserror — Library Errors

**Load when:** building a typed error type for a library whose callers need to inspect
or match on specific failures.

`thiserror` provides a derive macro for the standard `std::error::Error` trait. It
generates the `Display`, `Error::source`, and `From` impls you would otherwise write by
hand — and it **does not appear in your public API**. Switching between a hand-written
impl and thiserror (or back) is not a breaking change, so it is safe for published
crates.

## Cargo.toml

```toml
[dependencies]
thiserror = "2"
```

## Core derive

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum DataStoreError {
    #[error("data store disconnected")]
    Disconnect(#[from] std::io::Error),

    #[error("the data for key `{0}` is not available")]
    Redaction(String),

    #[error("invalid header (expected {expected:?}, found {found:?})")]
    InvalidHeader { expected: String, found: String },

    #[error("unknown data store error")]
    Unknown,
}
```

## Attributes you will actually use

- **`#[error("...")]`** — generates `Display`. Interpolates fields: `{var}` /
  `{0}` for named / tuple fields, `{var:?}` for `Debug`, plus extra format args that may
  be arbitrary expressions (`#[error("bad {0} (max {max})", max = i32::MAX)]`).
- **`#[from]`** — generates a `From<SourceError>` impl for that variant so `?` converts
  automatically. The variant must hold only the source (plus an optional backtrace).
  `#[from]` **implies `#[source]`** — do not write both.
- **`#[source]`** — marks the underlying error returned by `Error::source()`, enabling
  the `Caused by:` chain. A field literally named `source` is picked up automatically.
- **`#[error(transparent)]`** — forward `Display` and `source` straight to the inner
  error with no added message. Use it for an "anything else" catch-all variant, or to
  wrap a private inner error behind an opaque public type.

## Opaque public error (keep internals free to change)

```rust
// Public, opaque, easy to keep backward-compatible.
#[derive(Error, Debug)]
#[error(transparent)]
pub struct PublicError(#[from] ErrorRepr);

// Private; free to change across minor versions.
#[derive(Error, Debug)]
enum ErrorRepr {
    #[error("io failure")]
    Io(#[from] std::io::Error),
}
```

## Rules

- Return a typed `enum` (or opaque struct) — never `anyhow::Error` — from a library's
  public functions, so callers can `match` and recover.
- One variant per distinct failure mode the caller might handle differently.
- Prefer `#[from]` for sources so `?` stays boilerplate-free.
- thiserror is documented as the library-side companion to `anyhow` (application side).

Verify the current API before relying on an attribute's exact behavior
(fuse-browser fast-path on `https://docs.rs/thiserror` → Context7 → Exa).
