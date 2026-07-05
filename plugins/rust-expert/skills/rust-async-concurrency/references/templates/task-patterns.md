---
name: task-patterns
description: Complete, copy-paste concurrency patterns — JoinSet fan-out, actor task, spawn_blocking.
when-to-use: Load when you need a working reference for concurrent tasks, an actor, or offloading blocking work.
keywords: JoinSet, actor, mpsc, oneshot, spawn_blocking, concurrency, template
priority: medium
---

# Task Patterns (complete)

## Fan-out with JoinSet (surface every result)

```rust
use tokio::task::JoinSet;

/// Fetch many URLs concurrently, collecting each result (never dropping failures).
async fn fetch_all(urls: Vec<String>) -> Vec<Result<String, String>> {
    let mut set: JoinSet<Result<String, String>> = JoinSet::new();

    for url in urls {
        set.spawn(async move {
            // pretend network work
            if url.is_empty() {
                Err("empty url".to_string())
            } else {
                Ok(format!("body of {url}"))
            }
        });
    }

    let mut out = Vec::new();
    while let Some(joined) = set.join_next().await {
        match joined {
            Ok(result) => out.push(result),     // task's own Result
            Err(e) => out.push(Err(format!("task panicked: {e}"))), // JoinError
        }
    }
    out
}
```

---

## Actor task (own the state, message it)

State that requires async work lives in one task; callers talk to it over `mpsc`, replies come back over `oneshot`.

```rust
use tokio::sync::{mpsc, oneshot};

enum Command {
    Get { key: String, reply: oneshot::Sender<Option<String>> },
    Set { key: String, val: String, reply: oneshot::Sender<()> },
}

/// Spawn the owner task and return a handle used to send commands.
fn spawn_store() -> mpsc::Sender<Command> {
    let (tx, mut rx) = mpsc::channel::<Command>(32);

    tokio::spawn(async move {
        let mut map: std::collections::HashMap<String, String> = Default::default();
        while let Some(cmd) = rx.recv().await {
            match cmd {
                Command::Get { key, reply } => {
                    let _ = reply.send(map.get(&key).cloned());
                }
                Command::Set { key, val, reply } => {
                    map.insert(key, val);
                    let _ = reply.send(());
                }
            }
        }
        // all senders dropped → channel closed → task exits cleanly
    });

    tx
}

/// Typed caller helper.
async fn get(store: &mpsc::Sender<Command>, key: &str) -> Option<String> {
    let (reply, rx) = oneshot::channel();
    store.send(Command::Get { key: key.to_string(), reply }).await.ok()?;
    rx.await.ok().flatten()
}
```

---

## Offload blocking work with spawn_blocking

```rust
use std::path::PathBuf;

/// Read a file with the blocking std API without stalling async workers.
async fn read_config(path: PathBuf) -> std::io::Result<String> {
    tokio::task::spawn_blocking(move || std::fs::read_to_string(path))
        .await
        .expect("blocking task panicked")
}
```

---

## Fixed set, fail-fast

```rust
/// Run two independent futures; return early if either errors.
async fn load_pair() -> Result<(u32, u32), String> {
    let (a, b) = tokio::try_join!(load_a(), load_b())?;
    Ok((a, b))
}

async fn load_a() -> Result<u32, String> { Ok(1) }
async fn load_b() -> Result<u32, String> { Ok(2) }
```

---

## Cargo.toml

```toml
[dependencies]
tokio = { version = "1.52", features = ["full"] }
```
