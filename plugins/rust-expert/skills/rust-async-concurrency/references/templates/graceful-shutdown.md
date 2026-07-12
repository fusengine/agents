---
name: graceful-shutdown
description: Complete cancellation and graceful-shutdown pattern using a watch signal and tokio::select!.
when-to-use: Load when tasks must stop cleanly on Ctrl-C or a shutdown signal and drain in-flight work.
keywords: shutdown, cancellation, watch, select, ctrl_c, CancellationToken, drain
priority: medium
---

# Graceful Shutdown (complete)

## Pattern

A `watch` channel broadcasts a shutdown flag to every worker. Each worker races its real work against the signal with `tokio::select!`. `main` waits for Ctrl-C, flips the flag, then waits for workers to drain.

```rust
use tokio::sync::watch;
use tokio::task::JoinSet;

#[tokio::main]
async fn main() {
    // false = running, true = shutting down
    let (shutdown_tx, shutdown_rx) = watch::channel(false);

    let mut workers = JoinSet::new();
    for id in 0..4 {
        let mut rx = shutdown_rx.clone();
        workers.spawn(async move {
            worker(id, &mut rx).await;
        });
    }
    drop(shutdown_rx); // main holds no receiver

    // Wait for Ctrl-C, then broadcast shutdown.
    tokio::signal::ctrl_c().await.expect("failed to listen for ctrl_c");
    println!("shutdown requested");
    let _ = shutdown_tx.send(true);

    // Drain: let every worker finish its current unit of work.
    while workers.join_next().await.is_some() {}
    println!("all workers drained");
}

/// A worker that does units of work but stops promptly on the signal.
async fn worker(id: u32, shutdown: &mut watch::Receiver<bool>) {
    loop {
        tokio::select! {
            // React to the shutdown signal.
            changed = shutdown.changed() => {
                if changed.is_ok() && *shutdown.borrow() {
                    println!("worker {id} stopping");
                    break;
                }
            }
            // Otherwise keep doing work.
            _ = do_unit_of_work(id) => {}
        }
    }
}

async fn do_unit_of_work(id: u32) {
    tokio::time::sleep(std::time::Duration::from_millis(200)).await;
    println!("worker {id} did a unit");
}
```

---

## Alternative: tokio-util CancellationToken

For larger trees of tasks, `tokio_util::sync::CancellationToken` composes better than a raw `watch` — child tokens cancel with the parent.

```rust
use tokio_util::sync::CancellationToken;

let token = CancellationToken::new();
let child = token.child_token();

tokio::spawn(async move {
    tokio::select! {
        _ = child.cancelled() => { /* clean up */ }
        _ = long_running() => {}
    }
});

// later, cancels the whole tree:
token.cancel();
```

---

## Cargo.toml

```toml
[dependencies]
tokio = { version = "1.52", features = ["full"] }
tokio-util = "0.7"   # only for the CancellationToken variant
```

---

## Notes

- `select!` cancels the losing branch by dropping its future — make each branch cancel-safe (no half-applied state left behind).
- Always drain (`join_next`) after signalling, or in-flight work is lost.
- `watch::Receiver::borrow()` reads the latest value without consuming it.
