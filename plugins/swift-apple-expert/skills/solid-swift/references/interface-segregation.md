---
name: interface-segregation
description: ISP Guide - Small focused protocols for Swift
when-to-use: fat protocols, unused methods, segregating contracts
keywords: interface segregation, ISP, focused, protocol, small, Swift
priority: high
related: liskov-substitution.md, dependency-inversion.md, templates/protocol.md
---

# Interface Segregation Principle (ISP) for Swift

**Many focused protocols beat one fat protocol**

No type should depend on methods it does not use.

---

## When to Apply ISP?

### Symptoms of Violation

1. **Protocol has 6+ methods** -> Too broad
2. **Type implements methods it never uses** -> Forced dependency
3. **Consumer only needs `fetch()` but gets full CRUD** -> Over-coupled
4. **Adding method to protocol breaks unrelated types** -> Coupled contracts

---

## How to Apply ISP?

### Before (Fat Protocol)

```swift
// Features/User/Protocols/UserProtocol.swift
protocol UserProtocol {
    func fetch() async throws -> User
    func update(_ user: User) async throws
    func delete(_ id: String) async throws
    func sendNotification(_ message: String) async throws
    func generateReport() async throws -> String
    func exportData() async throws -> Data
}
```

### After (Role-Based Protocols)

```swift
// Features/User/Protocols/UserFetchable.swift
protocol UserFetchable: Sendable {
    func fetch() async throws -> User
}

// Features/User/Protocols/UserUpdatable.swift
protocol UserUpdatable: Sendable {
    func update(_ user: User) async throws
}

// Features/User/Protocols/UserDeletable.swift
protocol UserDeletable: Sendable {
    func delete(_ id: String) async throws
}

// Features/User/Protocols/NotificationSender.swift
protocol NotificationSender: Sendable {
    func sendNotification(_ message: String) async throws
}
```

### Compose When Needed

```swift
// Features/User/Services/UserService.swift
final class UserService: UserFetchable, UserUpdatable, UserDeletable {
    func fetch() async throws -> User { /* ... */ }
    func update(_ user: User) async throws { /* ... */ }
    func delete(_ id: String) async throws { /* ... */ }
}

// Read-only consumer depends only on what it needs
@MainActor @Observable
final class UserReportViewModel {
    private let fetcher: UserFetchable

    init(fetcher: UserFetchable) {
        self.fetcher = fetcher
    }
}
```

---

## Splitting Rules

| Criteria | Action |
|----------|--------|
| Read vs Write operations | Split into Fetchable/Updatable |
| Different consumers | Protocol per consumer role |
| Optional capabilities | Separate protocol for optional |
| Notification/Export | Separate from core CRUD |

---

## Swift-Specific Patterns

### Protocol Composition

```swift
// Combine protocols where needed
typealias UserCRUD = UserFetchable & UserUpdatable & UserDeletable

// Use in types that need full access
final class AdminService {
    private let repository: UserCRUD
    init(repository: UserCRUD) {
        self.repository = repository
    }
}
```

### CQRS-Lite

```swift
// Core/Protocols/Queryable.swift
protocol Queryable: Sendable {
    associatedtype Entity
    func findById(_ id: String) async throws -> Entity?
    func findAll() async throws -> [Entity]
}

// Core/Protocols/Commandable.swift
protocol Commandable: Sendable {
    associatedtype Entity
    func create(_ entity: Entity) async throws -> Entity
    func delete(_ id: String) async throws
}
```

---

## ISP Checklist

- [ ] Protocols have < 5 methods each
- [ ] No types with no-op method implementations
- [ ] Consumers only depend on methods they use
- [ ] Protocols in `Features/[Feature]/Protocols/` or `Core/Protocols/`
- [ ] Each protocol has a clear, single role
- [ ] `typealias` for common protocol compositions
