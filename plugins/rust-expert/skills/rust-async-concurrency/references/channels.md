---
name: channels
description: Choosing between tokio mpsc, oneshot, broadcast, and watch channels vs shared-state locks.
when-to-use: Load when tasks need to communicate, or when message passing is a cleaner fit than a shared lock.
keywords: channel, mpsc, oneshot, broadcast, watch, message passing, actor, backpressure
priority: high
related: shared-state.md, runtime-and-tasks.md
---

# Channels

## Overview

Message passing replaces shared locks by giving one task ownership of a resource; others send it messages. Tokio ships four channel types, each a different producer/consumer shape. Pick by shape, not habit.

---

## The four tokio channels

| Channel | Shape | Use for |
|---------|-------|---------|
| **mpsc** | many producers, one consumer | Work queue; feeding one owner task. Bounded → backpressure. |
| **oneshot** | one producer, one consumer, one value | Returning a single reply to a caller (request/response). |
| **broadcast** | many producers, many consumers, every receiver sees every value | Fan-out events to all subscribers. Slow receivers can lag/drop. |
| **watch** | many producers, many consumers, latest value only | Config/state that receivers only need the newest of. |

For MPMC where only one consumer takes each message, use the external `async-channel` crate — tokio has no such type.

---

## Decision Guide

```
Need a single reply to one caller?        → oneshot
Feed one owner task from many senders?     → mpsc (bounded for backpressure)
Every subscriber must see every event?     → broadcast
Subscribers only need the latest snapshot? → watch
Sharing simple non-async data instead?     → a lock (see shared-state.md)
```

---

## Core patterns

**Request/response = mpsc + oneshot.** The command carries a `oneshot::Sender` for its reply.

```rust
enum Cmd {
    Get { key: String, reply: oneshot::Sender<Option<String>> },
}

// caller
let (tx_reply, rx_reply) = oneshot::channel();
cmd_tx.send(Cmd::Get { key, reply: tx_reply }).await?;
let value = rx_reply.await?;
```

**Bounded mpsc gives backpressure.** `mpsc::channel(32)` makes `send().await` sleep when full, so producers slow to the consumer's pace. `unbounded_channel` removes that safety valve — use only when you can prove the queue stays small.

**Channel closes when all senders drop.** `rx.recv().await` returns `None`; the owner task can then shut its resource down. Clone the `Sender` to add producers; the `mpsc` receiver cannot be cloned.

---

## Best Practices

### DO
- Prefer bounded `mpsc` for backpressure.
- Combine `mpsc` (commands) with `oneshot` (replies) for actor tasks.
- Use `watch` for "latest config wins" instead of polling a lock.

### DON'T
- Default to `unbounded_channel` — it hides overload.
- Use `broadcast` when receivers must never miss a value under load (it drops for laggers).
- Block on `std::sync::mpsc` inside async code — it blocks the worker thread.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Producer outpaces consumer, memory grows | Use a bounded `mpsc` |
| `recv()` returns `None` unexpectedly | All senders dropped — keep a `Sender` alive or handle close |
| broadcast receiver misses messages | Expected under lag; size the buffer or use `mpsc` per consumer |

---

## Related References

- [shared-state.md](shared-state.md) — the lock alternative
- [runtime-and-tasks.md](runtime-and-tasks.md) — spawning the owner task

## Related Templates

- [task-patterns.md](templates/task-patterns.md) — full actor with mpsc + oneshot
- [graceful-shutdown.md](templates/graceful-shutdown.md) — watch for shutdown signal
