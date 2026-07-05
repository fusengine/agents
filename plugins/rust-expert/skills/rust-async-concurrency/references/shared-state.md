---
name: shared-state
description: Choosing between std/tokio Mutex, RwLock, atomics, and the actor pattern; holding guards across .await.
when-to-use: Load when sharing mutable state across tasks/threads or seeing a Send error from a held lock guard.
keywords: Mutex, RwLock, atomic, Arc, MutexGuard, await, contention, actor
priority: high
related: runtime-and-tasks.md, channels.md
---

# Shared State

## Overview

Sharing mutable state across tasks has two families of solutions: **guard it with a lock**, or **give one task ownership and message it**. Use a lock for simple, non-async data; use a task for anything that needs async work while it holds the state.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **`std::sync::Mutex`** | Blocks the OS thread. Fast. Correct in async code *if* the guard is not held across `.await`. |
| **`tokio::sync::Mutex`** | Yields to the scheduler; can be held across `.await`. Wraps a sync mutex internally — rarely a throughput win. |
| **`RwLock`** | Many readers OR one writer. Pays off only when reads dominate. |
| **Atomics** | Lock-free for a single integer/bool/pointer. Best for counters/flags. |
| **Actor task** | One task owns the state; others send messages. Serializes access without a shared lock. |

---

## Decision Guide

```
Do I hold the data across an .await?
├── No  → std::sync::Mutex (scope the guard)
└── Yes → is the state itself doing async work?
    ├── Yes → actor task + channel (see channels.md)
    └── No  → restructure to release the lock first;
              only if impossible → tokio::sync::Mutex

Just a counter/flag? → atomics (AtomicU64, AtomicBool)
Reads ≫ writes?      → RwLock
```

---

## The rule: don't hold a std guard across `.await`

A `std::sync::MutexGuard` is **not `Send`**, so a task holding one across an await fails to compile. The fix is to scope the guard so its destructor runs first — an explicit `drop(guard)` is NOT enough, because Send is computed from lexical scope.

```rust
// COMPILES: guard dropped at block end, before the await
async fn incr(state: &Mutex<i32>) {
    {
        let mut n = state.lock().unwrap();
        *n += 1;
    } // guard gone
    do_async().await;
}

// FAILS: drop(n) does not change the computed scope
async fn bad(state: &Mutex<i32>) {
    let mut n = state.lock().unwrap();
    *n += 1;
    drop(n);
    do_async().await; // still "not Send"
}
```

The safest shape: wrap the lock in a struct and only touch it in **non-async** methods.

```rust
struct Counter { inner: Mutex<i32> }
impl Counter {
    fn incr(&self) { *self.inner.lock().unwrap() += 1; } // not async
}
```

---

## `Arc<Mutex<T>>` is not a default

Wrapping everything in `Arc<Mutex<_>>` hides contention. Before it:

| Situation | Better primitive |
|-----------|------------------|
| Single integer/bool | `Arc<AtomicU64>` / `AtomicBool` |
| Read-dominated map/config | `Arc<RwLock<T>>` |
| State needs async work | actor task + `mpsc` |
| Truly shared, write-heavy, sync | `Arc<Mutex<T>>` (justified) |

---

## Best Practices

### DO
- Default to `std::sync::Mutex` and keep critical sections tiny.
- Reach for atomics/`RwLock` when the access shape justifies it.
- Model async-owning-state as an actor task.

### DON'T
- Use `tokio::sync::Mutex` reflexively — measure first.
- Rely on `drop(guard)` to satisfy `Send`; use a scope.
- Beware guards that *are* `Send` (some crates): they compile but can deadlock if held across `.await`.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `future cannot be sent between threads` | Scope the `std` guard before the await |
| `tokio::Mutex` everywhere, no speedup | Switch back to `std::sync::Mutex`, scope guards |
| Deadlock with a Send-able async guard | Don't hold across `.await`; restructure |

---

## Related References

- [runtime-and-tasks.md](runtime-and-tasks.md) — why the Send bound exists
- [channels.md](channels.md) — the actor alternative

## Related Templates

- [task-patterns.md](templates/task-patterns.md) — actor pattern in full
