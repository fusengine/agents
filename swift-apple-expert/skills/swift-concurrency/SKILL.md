---
name: swift-concurrency
description: Implement Swift 6 concurrency with async/await, actors, Sendable, Task, MainActor. Use when handling asynchronous operations, managing shared state safely, fixing data race errors, or migrating to Swift 6 strict concurrency.
---

# Swift 6 Concurrency

## Async/Await Basics

```swift
// Async function
func fetchUser(id: String) async throws -> User {
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(User.self, from: data)
}

// Parallel execution
async let users = fetchUsers()
async let posts = fetchPosts()
let (loadedUsers, loadedPosts) = try await (users, posts)

// Task with cancellation
func loadData() {
    task?.cancel()
    task = Task {
        try Task.checkCancellation()
        let data = try await api.fetch()
        guard !Task.isCancelled else { return }
        await MainActor.run { self.items = data }
    }
}
```

## Actors for Thread Safety

```swift
actor DataCache {
    private var storage: [String: Data] = [:]

    func get(_ key: String) -> Data? { storage[key] }
    func set(_ key: String, data: Data) { storage[key] = data }
    func clear() { storage.removeAll() }
}

// Usage - requires await
let cache = DataCache()
await cache.set("user", data: userData)
let data = await cache.get("user")
```

## @MainActor for UI

```swift
@MainActor
final class ViewModel: ObservableObject {
    @Published var items: [Item] = []
    @Published var isLoading = false

    func refresh() async {
        isLoading = true
        defer { isLoading = false }
        items = await repository.fetchItems()
    }
}

// Or mark specific function
func updateUI() async {
    await MainActor.run {
        self.label.text = "Updated"
    }
}
```

## Sendable Protocol

```swift
// Value types - automatic
struct User: Sendable {
    let id: UUID
    let name: String
}

// Reference types - must be immutable + final
final class Config: Sendable {
    let apiKey: String
    init(apiKey: String) { self.apiKey = apiKey }
}

// @unchecked when you manage safety manually
final class ThreadSafeCache: @unchecked Sendable {
    private let lock = NSLock()
    private var storage: [String: Any] = [:]
}

// Closures
func process(completion: @Sendable @escaping () -> Void) {
    Task { completion() }
}
```

## Common Fixes for Swift 6

| Error | Solution |
|-------|----------|
| "not Sendable" | Make struct Sendable or use actor |
| "actor-isolated" | Add `await` or use `nonisolated` |
| "main actor-isolated" | Use `@MainActor` or `MainActor.run` |
| "capture of mutable" | Use `let` or capture in Task |

## Task Groups

```swift
func fetchAllUsers(ids: [String]) async throws -> [User] {
    try await withThrowingTaskGroup(of: User.self) { group in
        for id in ids {
            group.addTask { try await fetchUser(id: id) }
        }
        return try await group.reduce(into: []) { $0.append($1) }
    }
}
```
