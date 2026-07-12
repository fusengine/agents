---
name: rust-async-concurrency
description: Use when writing async Rust — spawning tasks, sharing state across tasks/threads, choosing channels vs mutexes, or hitting Send-bound errors with async traits. Covers tokio runtime, Mutex/RwLock/atomics, mpsc/oneshot/broadcast/watch, spawn_blocking, and the async-fn-in-traits Send problem. Do NOT use for HTTP service structure — routing, extractors, middleware (use rust-web-backend) — or sync-only ownership questions (use rust-core-language).
versions:
  tokio: "1.52"
  rust-edition: "2024"
user-invocable: false
references: references/runtime-and-tasks.md, references/shared-state.md, references/channels.md, references/async-traits.md, references/templates/task-patterns.md, references/templates/graceful-shutdown.md
related-skills: rust-web-backend, solid-rust
---

# Rust Async & Concurrency

## Agent Workflow (MANDATORY)

Before writing async code, spawn in parallel:

1. **fuse-ai-pilot:explore-codebase** — find the existing runtime, channel, and lock patterns already in use
2. **fuse-ai-pilot:research-expert** — verify current tokio/crate APIs via Context7/Exa (async APIs churn)
3. **mcp__context7__query-docs** — pull exact signatures for the primitives you touch

After writing, run **fuse-ai-pilot:sniper**.

---

## Runtime Landscape

| Runtime | Reality |
|---------|---------|
| **tokio** | The de-facto standard. Almost every async crate (axum, sqlx, reqwest, tonic) targets it. Default choice. |
| **async-std** | Niche, effectively in maintenance mode. Do not pick for new work. |
| **smol** | Niche, small/embeddable. Only for constrained or embedded contexts. |

Default to tokio unless a hard constraint says otherwise.

---

## Critical Rules

1. **`std::sync::Mutex` first** — it is faster. Reach for `tokio::sync::Mutex` ONLY when the guard must be held across an `.await`. Otherwise scope the guard so its destructor runs before the await.
2. **`Arc<Mutex<T>>` is not the default** — analyze contention first. Read-dominated → `RwLock`; a simple counter → atomics; work that is itself async → a task + message passing.
3. **Never drop a `JoinHandle` you care about** — a dropped `tokio::spawn` handle silently swallows the task's panic/error. `.await` it, or use `JoinSet`/`tracing` to surface failures.
4. **`spawn_blocking` for heavy sync work** — CPU-bound loops or blocking I/O (std file, blocking DB driver) starve the runtime if run on an async worker. Offload them.
5. **`Send` across `.await`** — everything held across an await point must be `Send` for `tokio::spawn`. A `std::sync::MutexGuard` is NOT `Send`; holding one across an await is a compile error (and async-mutex guards that *are* `Send` deadlock instead).

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Runtime & tasks** | [runtime-and-tasks.md](references/runtime-and-tasks.md) | spawn, JoinHandle, JoinSet, spawn_blocking, `'static` bound |
| **Shared state** | [shared-state.md](references/shared-state.md) | Choosing Mutex vs RwLock vs atomics vs actor task |
| **Channels** | [channels.md](references/channels.md) | Picking mpsc / oneshot / broadcast / watch |
| **Async traits** | [async-traits.md](references/async-traits.md) | `async fn` in traits + the Send-bound problem |

### Templates

| Template | When to Use |
|----------|-------------|
| [task-patterns.md](references/templates/task-patterns.md) | Concurrent tasks, JoinSet, actor pattern, spawn_blocking |
| [graceful-shutdown.md](references/templates/graceful-shutdown.md) | Cancellation, shutdown signal, draining tasks |

---

## Quick Reference

### Scope the guard, don't hold it across `.await`

```rust
// GOOD: lock released before the await
{
    let mut db = state.lock().unwrap();
    db.insert(key, value);
} // guard dropped here
do_async_work().await;
```

→ See [shared-state.md](references/shared-state.md)

### Pick the channel by shape

```rust
// one value back to a caller → oneshot
// many producers, one consumer → mpsc
// fan-out same value to all → broadcast
// latest-value-only state → watch
```

→ See [channels.md](references/channels.md)

---

## Best Practices

### DO
- Measure contention before choosing a lock; prefer the cheapest primitive that fits.
- Surface task failures: `.await` handles, or collect them with `JoinSet`.
- Move heavy synchronous work to `spawn_blocking`.

### DON'T
- Reach for `tokio::sync::Mutex` by reflex — it wraps a sync mutex internally and rarely helps throughput.
- Fire-and-forget a `tokio::spawn` whose result or panic matters.
- Assume `async fn` in traits gives you `Send` futures — it does not (see async-traits.md).

---

## Sources (verified)

- tokio.rs/tokio/tutorial — shared-state, spawning, channels (fetched 2026-07-05)
- rust-lang.github.io/async-fundamentals-initiative/roadmap.html — AFIT status
- crates.io — tokio 1.52.3 (current at fetch)
