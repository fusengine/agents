---
name: runtime-and-tasks
description: Tokio runtime setup, spawning tasks, JoinHandle/JoinSet, spawn_blocking, and the 'static + Send bounds on spawned tasks.
when-to-use: Load when spawning tasks, wiring the runtime, handling JoinHandle results, or offloading blocking work.
keywords: tokio, spawn, JoinHandle, JoinSet, spawn_blocking, runtime, static, Send
priority: high
related: shared-state.md, channels.md
---

# Runtime & Tasks

## Overview

A Tokio task is a lightweight green thread (~single allocation, 64 bytes) created with `tokio::spawn`. The scheduler may run it on any runtime worker thread and may move it between threads at every `.await`. This is the source of the `'static` and `Send` bounds.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **`#[tokio::main]`** | Bootstraps a multi-threaded runtime around `async fn main`. Use `flavor = "current_thread"` for single-threaded. |
| **`tokio::spawn`** | Submits a task to the scheduler, returns a `JoinHandle<T>`. |
| **`'static` bound** | A spawned task must not borrow data owned by the caller. Use `move` and share via `Arc`. |
| **`Send` bound** | All data held **across** an `.await` must be `Send` so the task can migrate threads. |
| **`JoinHandle`** | `.await` yields `Result<T, JoinError>` — `Err` on panic or runtime shutdown. |

---

## Decision Guide

```
Is the work async?
├── Yes → tokio::spawn (task) or run inline with .await
└── No, and it blocks/CPU-bound?
    ├── Short → run inline (fine)
    └── Long → tokio::task::spawn_blocking (never block a worker)
```

---

## `'static` is not "lives forever"

`T: 'static` means the value *could* be kept forever — not that it leaks. A spawned task needs this because the runtime cannot know how long the task lives. Share owned data across tasks with `Arc`, not references.

```rust
let v = Arc::new(vec![1, 2, 3]);
let v2 = Arc::clone(&v);
tokio::spawn(async move {
    println!("{:?}", v2); // owns its handle → 'static
});
```

---

## Never silently drop a JoinHandle

A dropped handle detaches the task; its panic/error vanishes. Surface failures explicitly.

| Pattern | Use for |
|---------|---------|
| `handle.await?` | A single task whose result you need |
| `JoinSet` | A dynamic set of tasks; `join_next().await` yields each result |
| `tokio::try_join!` | A fixed set of futures, fail-fast on first error |

---

## spawn_blocking

`spawn_blocking` moves work to a dedicated blocking thread pool so async workers stay free. Use it for: `std::fs`, blocking DB drivers, heavy CPU loops, `Command` output.

```rust
let contents = tokio::task::spawn_blocking(move || {
    std::fs::read_to_string(path) // blocking API
}).await??;
```

Do NOT `spawn_blocking` for async work — it gives no benefit and wastes a thread.

---

## Best Practices

### DO
- Use `move` on spawned blocks; share via `Arc`.
- Collect concurrent task results with `JoinSet` or `try_join!`.
- Keep `.await` points free of non-`Send` guards.

### DON'T
- Block a runtime worker with sync I/O or CPU loops.
- Discard a `JoinHandle` whose panic would matter.
- Assume a task runs immediately — it is scheduled, not started synchronously.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `future is not Send` on spawn | A non-`Send` value (e.g. `MutexGuard`, `Rc`) is held across `.await` — scope it or restructure |
| Blocking call freezes the app | Wrap it in `spawn_blocking` |
| Panic in task goes unnoticed | `.await` the handle or use `JoinSet` |

---

## Related References

- [shared-state.md](shared-state.md) — what you may hold across `.await`
- [channels.md](channels.md) — coordinating spawned tasks

## Related Templates

- [task-patterns.md](templates/task-patterns.md) — JoinSet, actor, spawn_blocking in full
