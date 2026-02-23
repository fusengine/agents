---
name: dependency-inversion
description: DIP Guide - Depend on protocols via constructor injection for Swift
when-to-use: tight coupling, service architecture, testing, mocking, swapping providers
keywords: dependency inversion, DIP, injection, protocol, Swift, testing
priority: high
related: open-closed.md, interface-segregation.md, templates/service.md, templates/viewmodel.md
---

# Dependency Inversion Principle (DIP) for Swift

**Depend on protocols (abstractions), not concrete types**

---

## When to Apply DIP?

### Symptoms of Violation

1. **`let service = UserService()` in ViewModel** -> Tight coupling
2. **Cannot test without real API** -> Missing abstraction
3. **Changing provider modifies 10+ files** -> Cascading changes
4. **`URLSession.shared` directly in ViewModel** -> No abstraction layer

---

## Protocol Location (Features Modular MANDATORY)

| Scope | Location |
|-------|----------|
| Feature protocols | `Features/[Feature]/Protocols/` |
| Shared protocols | `Core/Protocols/` |
| **FORBIDDEN** | Protocols in implementation files |

```
Features/User/
├── Protocols/
│   └── UserServiceProtocol.swift    # Contract
├── Services/
│   └── UserService.swift            # Implementation
└── ViewModels/
    └── UserViewModel.swift          # Depends on protocol
```

---

## How to Apply DIP?

### Step 1: Define Protocol

```swift
// Features/User/Protocols/UserServiceProtocol.swift
/// Contract for user data operations.
protocol UserServiceProtocol: Sendable {
    /// Fetches the current authenticated user.
    func fetchCurrentUser() async throws -> User
    /// Updates user profile.
    func updateUser(_ user: User) async throws -> User
}
```

### Step 2: Create Implementation

```swift
// Features/User/Services/UserService.swift
final class UserService: UserServiceProtocol {
    private let session: URLSession

    init(session: URLSession = .shared) {
        self.session = session
    }

    func fetchCurrentUser() async throws -> User {
        let url = URL(string: "https://api.example.com/me")!
        let (data, _) = try await session.data(from: url)
        return try JSONDecoder().decode(User.self, from: data)
    }

    func updateUser(_ user: User) async throws -> User {
        // PUT request implementation
        return user
    }
}
```

### Step 3: Inject in ViewModel

```swift
// Features/User/ViewModels/UserViewModel.swift
@MainActor @Observable
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

### Step 4: Wire at App Level

```swift
// App/MyApp.swift
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(UserViewModel(service: UserService()))
        }
    }
}
```

---

## Anti-Patterns

| Anti-Pattern | Fix |
|--------------|-----|
| `let service = UserService()` | Inject `UserServiceProtocol` |
| `URLSession.shared` in ViewModel | Wrap in service protocol |
| Protocol in same file as impl | Move to `Features/[Feature]/Protocols/` |
| Singletons for services | Constructor injection |

---

## DIP Checklist

- [ ] Protocols in `Features/[Feature]/Protocols/` or `Core/Protocols/`
- [ ] ViewModels depend on protocols, not concrete types
- [ ] No `let service = ConcreteType()` in business logic
- [ ] Injection at app level or parent view
- [ ] Tests use mock implementations
- [ ] No `URLSession.shared` directly in ViewModels
