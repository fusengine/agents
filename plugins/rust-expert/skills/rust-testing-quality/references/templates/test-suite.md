---
name: test-suite
description: Complete Rust test suite — unit, doc-test, integration, and proptest
keywords: template, unit test, integration, doctest, proptest
---

# Complete Test Suite

## Usage

Copy these files to scaffold all four test kinds for a library crate.

---

## `Cargo.toml` (test dependencies)

```toml
[package]
name = "codec"
version = "0.1.0"
edition = "2024"

[dev-dependencies]
proptest = "1"
```

---

## `src/lib.rs` — unit tests + doc-tests

```rust
//! A tiny reversible u32 <-> bytes codec.

/// Encodes a `u32` as 4 big-endian bytes.
///
/// # Examples
///
/// ```
/// let bytes = codec::encode(513);
/// assert_eq!(bytes, [0, 0, 2, 1]);
/// ```
pub fn encode(n: u32) -> [u8; 4] {
    n.to_be_bytes()
}

/// Decodes 4 big-endian bytes back into a `u32`.
///
/// # Examples
///
/// ```
/// assert_eq!(codec::decode(&[0, 0, 2, 1]), 513);
/// ```
pub fn decode(bytes: &[u8; 4]) -> u32 {
    u32::from_be_bytes(*bytes)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn zero_round_trips() {
        assert_eq!(decode(&encode(0)), 0);
    }

    #[test]
    fn max_round_trips() {
        assert_eq!(decode(&encode(u32::MAX)), u32::MAX);
    }
}
```

---

## `tests/round_trip.rs` — integration + proptest

```rust
//! Black-box integration tests against the public API only.

use codec::{decode, encode};
use proptest::prelude::*;

#[test]
fn known_value() {
    assert_eq!(decode(&encode(513)), 513);
}

proptest! {
    // Property 1: never panics on any input.
    #[test]
    fn never_panics(n in any::<u32>()) {
        let _ = encode(n);
    }

    // Property 2: encode then decode is the identity.
    #[test]
    fn round_trips(n in any::<u32>()) {
        prop_assert_eq!(decode(&encode(n)), n);
    }
}
```

---

## Running it (the full gate)

```bash
# Fast, parallel — unit + integration ONLY (no doc-tests).
cargo nextest run --all-features

# REQUIRED second step — nextest does not run doc-tests.
cargo test --doc
```

---

## Notes

- `proptest-regressions/` appears after the first failure — **commit it**.
- `any::<u32>()` is the `Arbitrary` strategy; use ranges like `0u32..100` to bound inputs.
- Integration tests import `codec` as an external crate, so only `pub` items are reachable.
