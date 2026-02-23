---
name: concurrency-patterns
description: Swift 6 concurrency patterns - actors, @MainActor, Sendable, structured concurrency
when-to-use: async operations, shared state, UI updates, parallel fetching
keywords: concurrency, actor, MainActor, Sendable, async, await, Swift 6
priority: high
related: single-responsibility.md, dependency-inversion.md, templates/viewmodel.md
---

# Concurrency Patterns - Swift 6

## Actor for Shared State

```swift
// Core/Services/UserCache.swift
/// Thread-safe user cache using actor isolation.
actor UserCache {
    private var users: [String: User] = [:]

    /// Gets cached user by ID.
    func get(_ id: String) -> User? {
        users[id]
    }

    /// Caches a user.
    func set(_ user: User) {
        users[user.id] = user
    }

    /// Clears all cached users.
    func clear() {
        users.removeAll()
    }
}
```

---

## @MainActor for UI Updates

**ALL ViewModels MUST use `@MainActor`:**

```swift
// Features/User/ViewModels/UserViewModel.swift
@MainActor
@Observable
final class UserViewModel {
    var user: User?
    var isLoading = false

    private let service: UserServiceProtocol

    init(service: UserServiceProtocol) {
        self.service = service
    }

    func load() async {
        isLoading = true
        defer { isLoading = false }
        user = try? await service.fetchCurrentUser()
    }
}
```

---

## Sendable Types

**ALL models passed across concurrency boundaries MUST be Sendable:**

```swift
// Core/Models/User.swift
struct User: Codable, Sendable, Identifiable {
    let id: String
    let name: String
    let email: String
}

// Core/Models/Credentials.swift
struct Credentials: Sendable {
    let email: String
    let password: String
}
```

**Rules:**
- `struct` with `let` properties -> automatically Sendable
- `class` -> must be `final class` with `@unchecked Sendable` or use actor
- Protocols used in async context -> mark `: Sendable`

---

## Structured Concurrency

### Parallel Fetching with async let

```swift
// Features/Dashboard/Services/DashboardService.swift
/// Loads all dashboard data in parallel.
func loadDashboard() async throws -> Dashboard {
    async let user = fetchUser()
    async let stats = fetchStats()
    async let notifications = fetchNotifications()

    return Dashboard(
        user: try await user,
        stats: try await stats,
        notifications: try await notifications
    )
}
```

### TaskGroup for Dynamic Tasks

```swift
/// Fetches multiple users in parallel.
func fetchUsers(ids: [String]) async throws -> [User] {
    try await withThrowingTaskGroup(of: User.self) { group in
        for id in ids {
            group.addTask { try await self.fetchUser(id: id) }
        }
        return try await group.reduce(into: []) { $0.append($1) }
    }
}
```

---

## Concurrency Checklist

- [ ] ViewModels marked `@MainActor`
- [ ] Models are `Sendable` structs
- [ ] Protocols in async context marked `: Sendable`
- [ ] Shared mutable state protected by `actor`
- [ ] Parallel operations use `async let` or `TaskGroup`
- [ ] No `DispatchQueue.main.async` (use `@MainActor`)
- [ ] No completion handlers (use `async/await`)
