# Edition 2024

**Load when:** setting a crate's `edition`, using let chains or async closures, or
deciding whether a language feature is safe to use on stable.

Editions are opt-in, per-crate language epochs that let breaking syntax changes ship
without splitting the ecosystem. Edition 2024 is the largest to date and is required
by several recent features.

## Enabling it

```toml
# Cargo.toml
[package]
edition = "2024"    # requires Rust >= 1.85.0
```

Migrate an existing crate with `cargo fix --edition` then bump the field.

## Features gated on edition 2024

### Let chains — stable since 1.88.0 (2024 edition ONLY)

Chain `let` bindings with `&&` inside `if`/`while`, intermixed with boolean tests.
Bindings are visible in later links and in the body:

```rust
if let Channel::Stable(v) = release_info()
    && let Semver { major, minor, .. } = v
    && major == 1
    && minor == 88
{
    // v, major, minor all in scope here
}
```

This depends on the edition-2024 `if let` temporary-scope change; it will NOT compile
on the 2021 edition. Do not claim otherwise.

### Async closures — stable since 1.85.0

```rust
let load = async |id: u32| -> Result<Row, DbError> { db.fetch(id).await };
let row = load(7).await?;
```

Async closures implement the `AsyncFn`/`AsyncFnMut`/`AsyncFnOnce` traits, so they can
be passed to combinators that expect them (unlike the old `|| async { .. }` workaround
that returned an opaque future and captured awkwardly).

## Notable edition-2024 behavior changes

These are hard errors or default-deny lints in 2024 — generated code written for older
editions often trips them:

- `unsafe extern` blocks: `extern` blocks now require the `unsafe` keyword.
- Unsafe attributes: `#[no_mangle]`, `#[link_section]`, `#[export_name]` must be wrapped
  as `#[unsafe(no_mangle)]` etc.
- References to `static mut` are a deny-by-default error — use `&raw const`/`&raw mut`
  or a safe abstraction (`OnceLock`, `Atomic*`).
- `unsafe_op_in_unsafe_fn` warns by default: unsafe operations inside an `unsafe fn`
  still need an explicit `unsafe {}` block.

## Do NOT use on stable

`gen` blocks / `gen fn` are **unstable** (feature gate `#![feature(gen_blocks)]`,
tracking issue rust-lang/rust#117078, RFC #3513). The generated iterators are not yet
fused and the keyword is still under discussion. For stable code, write an explicit
`Iterator` impl or return `impl Iterator<Item = _>` from a combinator chain.

## Verify before relying

Feature stabilization versions change; confirm against
`https://doc.rust-lang.org/releases.html` and the feature's release blog post rather
than trusting memory.
