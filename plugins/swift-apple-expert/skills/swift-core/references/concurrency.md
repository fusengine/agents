---
name: concurrency
description: Swift 6.4 concurrency with async/await, actors, Sendable, nonisolated(nonsending), async defer, cancellation shields, InlineArray, Span
when-to-use: implementing async operations, managing shared state, fixing data races, using Swift 6.2-6.4 features
keywords: async, await, actor, Sendable, Task, MainActor, nonisolated, TaskGroup, InlineArray, Span
priority: high
related: architecture.md, testing.md, performance.md
---

# Swift 6.4 Concurrency

## Swift 6.4 New Features (Xcode 27)

### Async calls in `defer` - SE-0493
`await` is allowed inside `defer`; the call runs to completion before the scope exits.

### Task Cancellation Shields - SE-0504
Run cleanup that must not observe the enclosing task's cancellation.

```swift
func processFile(at url: URL) async throws {
    let handle = try FileHandle(forReadingFrom: url)
    defer {
        await withTaskCancellationShield {
            await flushMetrics(for: url)
            try? handle.close()
        }
    }
    try await processContents(of: handle)
}
```

### Advanced Observation Tracking - SE-0506
`@Observable` types gain fine-grained and continuous change notifications.

---

## Swift 6.2 Features

### nonisolated(nonsending) - SE-0461
Default behavior change: async functions stay on caller's executor.

**Activation:**
```swift
// Build Setting: SWIFT_APPROACHABLE_CONCURRENCY = YES
// Or: -enable-upcoming-feature NonisolatedNonsendingByDefault
```

**Impact:**
- Async functions on classes can access `self` without data races
- Fewer context switches
- Use `@concurrent` for explicit parallelism opt-in

### InlineArray - SE-0453
Fixed-size stack-allocated arrays for performance.

```swift
var colors: InlineArray<3, UInt8> = [255, 128, 64]
```

**Use for:** Graphics (RGB), protocol headers, small fixed buffers.

### Span & RawSpan
Safe non-owning memory views (replaces UnsafePointer).

```swift
func parseHeader(_ data: Span<UInt8>) -> String? {
    guard data.count >= 8 else { return nil }
    let header = data.prefix(8)  // Safe slicing
    return String(bytes: header, encoding: .utf8)
}

// Usage
let array: [UInt8] = [...]
parseHeader(array.span)  // Zero-copy
```

**Features:** Bounds-checking, lifetime tracking, compiler-enforced safety, zero-copy.

### Named Tasks - SE-0469
Name tasks for debugging and profiling.

```swift
Task(name: "ImageDownload") { await downloadImage() }

// In TaskGroups
await withTaskGroup(of: Int.self) { group in
    group.addTask(name: "Worker-1") { await process(1) }
}
```

**Visibility:** Instruments profiler, Xcode debugger, crash logs.

### Task.immediate - SE-0472
Task body runs synchronously on the caller's executor until its first real suspension.

```swift
// Standard: queued, respects backpressure
Task { await operation() }

// Immediate: runs inline until the first suspension
Task.immediate { await operation() }
```

**Use for:** Reducing latency on short tasks.

---

## Core Concepts

### Async/Await
- `async` marks suspendable functions
- `await` suspends until result ready
- `try await` for error propagation

### Actors
Thread-safe state encapsulation. All access serialized.

### Sendable
Types safe to share across concurrency domains.

### @MainActor
Isolates code to main thread for UI.

### Task Groups
`withTaskGroup` for parallel operations with automatic cancellation.

---

## Migration Fixes

| Error | Solution |
|-------|----------|
| "not Sendable" | Make struct Sendable or use actor |
| "actor-isolated" | Add `await` or use `nonisolated` |
| "main actor-isolated" | Use `@MainActor` or `MainActor.run` |

---

## Best Practices

- ✅ Use actors for shared mutable state
- ✅ Mark types Sendable when possible
- ✅ Use `InlineArray` for small fixed collections
- ✅ Use `Span` instead of `UnsafePointer`
- ❌ Don't use locks with actors
- ❌ Don't capture non-Sendable types in Tasks
