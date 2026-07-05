---
name: async-traits
description: async fn in traits (AFIT/RPITIT), the unresolved Send-bound problem, and current workarounds.
when-to-use: Load when defining async methods on a trait, or hitting Send errors when using such a trait behind a generic/Tower-style bound.
keywords: async trait, AFIT, RPITIT, Send bound, RTN, trait_variant, async_trait, dyn
priority: high
related: runtime-and-tasks.md
---

# Async Traits

## Overview

Since Rust 1.75 you can write `async fn` directly in a trait (AFIT), desugared to return-position `impl Trait` in traits (RPITIT). This removed the need for the `#[async_trait]` macro in many cases. But one sharp edge is **not** resolved: you cannot ergonomically require that the returned futures are `Send`. Treat this as a live gotcha, not a solved problem.

---

## What works today

```rust
trait Repository {
    async fn find(&self, id: u64) -> Option<Record>; // AFIT, stable
}
```

- Static dispatch (generics / `impl Trait`) works.
- No `#[async_trait]` needed for these.

---

## The unresolved Send-bound problem

When a caller spawns the future on a multi-threaded runtime (or a Tower/axum-style bound), it needs the returned future to be `Send`. With bare `async fn` in a trait you **cannot** write "every method's future is `Send`" as a clean bound. This is why parts of the ecosystem (notably **Tower**) still avoid bare AFIT in public traits. The ergonomic fix — **Return Type Notation (RTN)**, letting you write `T: Trait<find(..): Send>` — is still in progress on the language side (a 2026 Rust Project Goal target), **not** stabilized. Do not claim it is done.

---

## Current workarounds

| Approach | When | Cost |
|----------|------|------|
| **`trait_variant::make`** | You control the trait and want a `Send` variant generated | Extra crate; generates a parallel `…Send` trait |
| **`impl Future<Output = T> + Send`** | You want an explicit Send bound on one method | Verbose; you write the desugared return by hand |
| **`Box<dyn Future>` (`#[async_trait]`)** | You need `dyn` dispatch or a stable Send story now | One heap alloc per call; the classic fallback |

**`trait_variant` sketch** (generates a `Send`-bounded sibling trait):

```rust
#[trait_variant::make(HttpService: Send)]
trait LocalHttpService {
    async fn call(&self, req: Request) -> Response;
}
// callers needing Send use `HttpService`
```

**Manual Send return** (no macro):

```rust
trait Fetch {
    fn fetch(&self, url: &str)
        -> impl std::future::Future<Output = Bytes> + Send;
}
```

**`dyn` dispatch** still wants boxing today:

```rust
#[async_trait::async_trait]
trait Handler { async fn handle(&self, ev: Event); }
let handlers: Vec<Box<dyn Handler>> = /* ... */;
```

---

## Decision Guide

```
Static dispatch only, no Send needed?      → bare async fn in trait
Static dispatch, need Send futures?         → trait_variant OR manual impl Future + Send
Need dyn (trait objects)?                    → #[async_trait] (Box<dyn Future>)
```

---

## Best Practices

### DO
- Use bare `async fn` in traits for internal, statically-dispatched code.
- Add an explicit `+ Send` return (or `trait_variant`) when futures cross a threaded spawn.
- Keep `#[async_trait]` for `dyn`-dispatched handler collections.

### DON'T
- Assume AFIT gives `Send` futures automatically — it does not.
- Tell users RTN is stable; it is a targeted goal, still unstable.
- Add `#[async_trait]` to code that only needs static dispatch — it costs a boxed alloc per call.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `future is not Send` behind a trait bound | Add `+ Send` return, or use `trait_variant`/`#[async_trait]` |
| Reaching for `#[async_trait]` everywhere | Only needed for `dyn` or a stable Send story |
| Expecting `T: Trait + Send` to cover method futures | It does not; that is the RTN gap |

---

## Related References

- [runtime-and-tasks.md](runtime-and-tasks.md) — why spawn needs Send futures

## Sources (verified)

- tokio.rs/blog/2025-01-01-announcing-axum-0-8-0 — `#[async_trait]` removal via RPITIT
- rust-lang.github.io/async-fundamentals-initiative/roadmap.html — AFIT feature-complete, stabilization proposed; Send-variant ergonomics outstanding
