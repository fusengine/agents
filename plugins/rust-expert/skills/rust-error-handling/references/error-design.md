# Error Design

**Load when:** shaping error enums, wiring `#[from]` conversions, or deciding between a
recoverable `Result` and a `panic!`.

## The library/application boundary

This is the decision that dictates everything else:

```
your crate is a LIBRARY  ─► typed enum via thiserror ─► callers can match & recover
your crate is a BINARY   ─► anyhow::Result + .context ─► one type, rich diagnostics
```

A single workspace often has both: inner library crates each expose their own
`thiserror` enum; the top-level binary uses `anyhow` and lets `?` absorb them all. Never
leak `anyhow::Error` upward through a library boundary — it erases the type and strips
callers of any ability to branch on the failure.

## Designing the enum

- **One variant per recoverable failure mode** the caller might treat differently. If
  two failures are always handled identically, one variant is enough.
- **Carry the source**, not a stringified copy of it. Use `#[from]` so `?` converts and
  the `Caused by:` chain stays intact:

```rust
#[derive(thiserror::Error, Debug)]
pub enum ConfigError {
    #[error("could not read config file")]
    Io(#[from] std::io::Error),        // ? on fs ops lifts into this variant

    #[error("config is not valid TOML")]
    Parse(#[from] toml::de::Error),

    #[error("missing required key: {0}")]
    MissingKey(String),                 // domain-specific, constructed by hand
}
```

- **`#[from]` implies `#[source]`.** Do not annotate both on the same field.
- **Add a message per variant** with `#[error("...")]`; it becomes the `Display` output.
- For an opaque public type that hides its internals, wrap a private repr with
  `#[error(transparent)]` (see [thiserror-libraries.md](thiserror-libraries.md)).

## `#[from]` vs manual construction

- `#[from]` when a foreign error maps one-to-one onto a variant and `?` should convert it.
- Manual `Variant(...)` (or `.map_err(...)`) when you need to add fields, choose among
  several variants for the same source type, or attach domain context.

## Recoverable errors vs panics

| Situation | Use |
|-----------|-----|
| Caller could plausibly handle it (I/O, parse, not-found, bad input) | `Result<T, E>` |
| A broken internal invariant that should be impossible | `panic!` / `unreachable!` |
| A value the surrounding logic guarantees is present | `expect("why it holds")` |

`Result` is for expected, recoverable conditions; a panic signals a bug in the program
itself, not a runtime condition to handle. Do not use `unwrap()`/`expect()` as a
shortcut around a `Result` a caller could have handled — propagate with `?` instead.
When an `expect` is genuinely justified, its message should state the invariant that
makes it infallible.

## Quick decision list

1. Library or binary? → thiserror enum vs anyhow.
2. Distinct handling per failure? → separate variants; else merge.
3. Source maps cleanly? → `#[from]`; else construct manually with context.
4. Recoverable? → `Result`. Impossible-if-correct? → `panic!`.
