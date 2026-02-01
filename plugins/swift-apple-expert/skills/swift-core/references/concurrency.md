---
name: concurrency
description: Swift 6 concurrency with async/await, actors, Sendable, TaskGroups, MainActor
when-to-use: implementing async operations, managing shared state, fixing data races, migrating to Swift 6 strict concurrency
keywords: async, await, actor, Sendable, Task, MainActor, nonisolated, TaskGroup
priority: high
related: architecture.md, testing.md, performance.md
---

# Swift 6 Concurrency

## When to Use

- Async operations (network, file I/O, database)
- Shared mutable state across threads
- Parallel data processing
- Migrating to Swift 6 strict concurrency
- Fixing data race warnings

## Key Concepts

### Async/Await
Replaces completion handlers. Cleaner syntax, better error handling.

**Key Points:**
- `async` marks functions that can suspend
- `await` suspends until result is ready
- Errors propagate naturally with `try await`

### Actors
Thread-safe encapsulation of mutable state. All access is serialized automatically.

**Key Points:**
- Properties and methods are isolated by default
- Requires `await` for external access
- Use for caches, shared state managers
- Replace classes with locks

### Sendable Protocol
Marks types safe to share across concurrency domains.

**Key Points:**
- Structs with Sendable properties are automatic
- Classes must be `final` + immutable OR `@unchecked Sendable`
- Closures passed to Tasks must be `@Sendable`

### @MainActor
Isolates code to main thread for UI operations.

**Key Points:**
- Apply to ViewModels that update UI
- Use `MainActor.run {}` for specific code blocks
- Entire class or specific methods

### nonisolated(nonsending) (Swift 6.2)
Methods that can be called without await but don't cross isolation boundaries.

**Key Points:**
- Read-only access to actor state
- No await required
- Cannot be called from different isolation domain

### Task Groups
Parallel execution with structured concurrency.

**Key Points:**
- `withTaskGroup` for parallel operations
- Results collected as they complete
- Automatic cancellation propagation

---

## Common Swift 6 Migration Fixes

| Error | Solution |
|-------|----------|
| "not Sendable" | Make struct Sendable or use actor |
| "actor-isolated" | Add `await` or use `nonisolated` |
| "main actor-isolated" | Use `@MainActor` or `MainActor.run` |
| "capture of mutable" | Use `let` or capture in Task |
| "Sending poses risk" | Mark closure `@Sendable` |

---

## Best Practices

- ✅ Use actors for shared mutable state
- ✅ Mark types Sendable when possible
- ✅ Use nonisolated for read-only methods
- ✅ Prefer async/await over completion handlers
- ✅ Use TaskGroups for parallel operations
- ❌ Don't use locks with actors
- ❌ Don't capture non-Sendable types in Tasks
- ❌ Don't block main thread with heavy async work

→ See `templates/actor-pattern.md` for code examples
