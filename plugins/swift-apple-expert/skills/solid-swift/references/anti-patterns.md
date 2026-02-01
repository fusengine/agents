---
name: anti-patterns
description: Common SOLID violations in Swift with code examples and fixes
when-to-use: reviewing code quality, identifying anti-patterns, refactoring legacy code, learning SOLID by counter-examples
keywords: anti-patterns, violations, bad code, refactoring, SOLID, single responsibility, dependency injection
priority: high
related: solid-patterns.md
---

# Anti-Patterns - Common Violations & Fixes

## Single Responsibility Violations

### ❌ BAD: View Does Everything

```swift
struct UserView: View {
    @State private var user: User?
    @State private var isLoading = false

    var body: some View {
        // fetching, validation, formatting, rendering...
        VStack {
            if isLoading {
                ProgressView()
            } else if let user {
                Text(user.name)
                Button("Save") {
                    // validation logic
                    // API call logic
                    // state update logic
                }
            }
        }
        .onAppear {
            isLoading = true
            Task {
                let url = URL(string: "https://api.example.com/user")!
                let (data, _) = try await URLSession.shared.data(from: url)
                user = try JSONDecoder().decode(User.self, from: data)
                isLoading = false
            }
        }
    }
}
```

### ✅ FIXED: Separation of Concerns

```swift
// Models/User.swift
struct User: Codable, Sendable {
    let id: String
    let name: String
}

// Protocols/UserServiceProtocol.swift
protocol UserServiceProtocol: Sendable {
    func fetchUser() async throws -> User
}

// Services/UserService.swift
final class UserService: UserServiceProtocol {
    func fetchUser() async throws -> User {
        let url = URL(string: "https://api.example.com/user")!
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode(User.self, from: data)
    }
}

// ViewModels/UserViewModel.swift
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
        user = try? await service.fetchUser()
    }
}

// Views/UserView.swift
struct UserView: View {
    @State private var viewModel: UserViewModel

    var body: some View {
        if viewModel.isLoading {
            ProgressView()
        } else if let user = viewModel.user {
            UserContent(user: user)
        }
    }
}

private struct UserContent: View {
    let user: User

    var body: some View {
        VStack {
            Text(user.name)
            Button("Save") { }
        }
    }
}
```

---

## Open/Closed Violations

### ❌ BAD: Hardcoded Auth Logic

```swift
final class LoginView: View {
    @State private var email = ""
    @State private var password = ""

    var body: some View {
        Button("Sign In") {
            Task {
                let creds = Credentials(email: email, password: password)

                // Hard-coded Apple auth
                if isAppleAuth {
                    let credential = try await ASAuthorizationAppleIDProvider()
                        .performRequests(for: [.init()])
                } else {
                    // Hard-coded Google auth
                    let credential = try await GoogleSignIn.signIn()
                }
            }
        }
    }
}
```

### ✅ FIXED: Protocol-Based Extensibility

```swift
// Protocols/AuthProviderProtocol.swift
protocol AuthProviderProtocol: Sendable {
    func signIn(credentials: Credentials) async throws -> Session
    func signOut() async
}

// Services/AppleAuthProvider.swift
final class AppleAuthProvider: AuthProviderProtocol {
    func signIn(credentials: Credentials) async throws -> Session {
        let credential = try await ASAuthorizationAppleIDProvider()
            .performRequests(for: [.init()])
        // Apple-specific logic
        return Session(token: "...")
    }

    func signOut() async { }
}

// Services/GoogleAuthProvider.swift
final class GoogleAuthProvider: AuthProviderProtocol {
    func signIn(credentials: Credentials) async throws -> Session {
        let credential = try await GoogleSignIn.signIn()
        return Session(token: "...")
    }

    func signOut() async { }
}

// Views/LoginView.swift
struct LoginView: View {
    @State private var email = ""
    @State private var password = ""
    let authProvider: AuthProviderProtocol

    var body: some View {
        Button("Sign In") {
            Task {
                let creds = Credentials(email: email, password: password)
                try await authProvider.signIn(credentials: creds)
            }
        }
    }
}
```

---

## Interface Segregation Violations

### ❌ BAD: Bloated Protocol

```swift
protocol UserProtocol {
    func fetch() async throws -> User
    func update(_ user: User) async throws
    func delete(_ id: String) async throws
    func sendNotification(_ message: String) async throws
    func generateReport() async throws -> String
    func validatePassword(_ password: String) -> Bool
    func exportData() async throws -> Data
}

// Implementers must implement everything, even unused methods
final class UserService: UserProtocol {
    func fetch() async throws -> User { }
    func update(_ user: User) async throws { }
    func delete(_ id: String) async throws { }
    func sendNotification(_ message: String) async throws { }
    func generateReport() async throws -> String { }
    func validatePassword(_ password: String) -> Bool { }
    func exportData() async throws -> Data { }
}
```

### ✅ FIXED: Segregated Interfaces

```swift
// Protocols/UserFetchable.swift
protocol UserFetchable: Sendable {
    func fetch() async throws -> User
}

// Protocols/UserUpdatable.swift
protocol UserUpdatable: Sendable {
    func update(_ user: User) async throws
}

// Protocols/UserDeletable.swift
protocol UserDeletable: Sendable {
    func delete(_ id: String) async throws
}

// Protocols/NotificationSender.swift
protocol NotificationSender: Sendable {
    func sendNotification(_ message: String) async throws
}

// Services/UserService.swift
final class UserService: UserFetchable, UserUpdatable, UserDeletable {
    func fetch() async throws -> User { }
    func update(_ user: User) async throws { }
    func delete(_ id: String) async throws { }
}

// Services/NotificationService.swift
final class NotificationService: NotificationSender {
    func sendNotification(_ message: String) async throws { }
}
```

---

## Dependency Inversion Violations

### ❌ BAD: Direct Dependency on Concrete Types

```swift
@Observable
final class UserViewModel {
    var user: User?

    // ❌ Hard-coded dependency
    private let service = UserService()

    func load() async {
        user = try? await service.fetchCurrentUser()
    }
}

// Impossible to test with mock
let viewModel = UserViewModel() // Can't inject mock
```

### ✅ FIXED: Dependency Injection

```swift
// Protocol (abstraction)
protocol UserServiceProtocol: Sendable {
    func fetchCurrentUser() async throws -> User
}

// Concrete implementation
final class UserService: UserServiceProtocol {
    func fetchCurrentUser() async throws -> User {
        let url = URL(string: "https://api.example.com/me")!
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode(User.self, from: data)
    }
}

// Mock for testing
final class MockUserService: UserServiceProtocol {
    let mockUser: User?
    let mockError: Error?

    init(mockUser: User? = nil, mockError: Error? = nil) {
        self.mockUser = mockUser
        self.mockError = mockError
    }

    func fetchCurrentUser() async throws -> User {
        if let error = mockError {
            throw error
        }
        return mockUser ?? User.preview
    }
}

// ViewModel accepts protocol
@MainActor
@Observable
final class UserViewModel {
    var user: User?
    private let service: UserServiceProtocol

    init(service: UserServiceProtocol) {
        self.service = service
    }

    func load() async {
        user = try? await service.fetchCurrentUser()
    }
}

// Production
let viewModel = UserViewModel(service: UserService())

// Testing
let viewModel = UserViewModel(service: MockUserService(mockUser: .preview))
```

---

## Architecture Violations

### ❌ BAD: Protocols Mixed with Implementation

```swift
// ❌ Protocol in same file as implementation
final class UserService {
    // Protocol definition
    protocol UserServiceProtocol {
        func fetch() async throws -> User
    }

    // Implementation
    func fetch() async throws -> User { }
}
```

### ✅ FIXED: Separated Files

```
Sources/
├── Protocols/
│   └── UserServiceProtocol.swift
└── Services/
    └── UserService.swift
```

**Protocols/UserServiceProtocol.swift**
```swift
protocol UserServiceProtocol: Sendable {
    func fetch() async throws -> User
}
```

**Services/UserService.swift**
```swift
final class UserService: UserServiceProtocol {
    func fetch() async throws -> User { }
}
```

---

## Concurrency Violations

### ❌ BAD: Missing @MainActor on UI ViewModel

```swift
@Observable
final class UserViewModel {
    var user: User?  // Shared mutable state without isolation

    func load() async {
        // Background thread operations
        user = try? await service.fetchCurrentUser()  // ⚠️ Data race!
    }
}
```

### ✅ FIXED: @MainActor for UI

```swift
@MainActor
@Observable
final class UserViewModel {
    var user: User?  // Protected by @MainActor

    func load() async {
        user = try? await service.fetchCurrentUser()  // Safe
    }
}
```

### ❌ BAD: Non-Sendable Types in Async

```swift
class NonSendableUser {
    var name: String
}

actor UserCache {
    func store(_ user: NonSendableUser) {  // ⚠️ Error: Non-Sendable
        // ...
    }
}
```

### ✅ FIXED: Sendable Types

```swift
struct User: Sendable {
    let name: String
}

actor UserCache {
    func store(_ user: User) {  // ✅ Safe
        // ...
    }
}
```

---

## File Size Violations

### ❌ BAD: Monolithic File (> 150 lines)

```swift
// UserView.swift - 200+ lines
// Contains: View, 3 subviews, state management, API logic
struct UserView: View {
    @State var user: User?
    @State var isLoading: Bool
    // ... 50 lines of state

    var body: some View {
        // ... 150 lines of UI
    }
}
```

### ✅ FIXED: Split into Multiple Files

```
Views/
├── UserView.swift (40 lines - main view)
├── UserHeader.swift (30 lines - subview)
├── UserContent.swift (35 lines - subview)
└── UserFooter.swift (25 lines - subview)

ViewModels/
└── UserViewModel.swift (50 lines)
```

**Views/UserView.swift**
```swift
struct UserView: View {
    @State private var viewModel: UserViewModel

    var body: some View {
        VStack {
            UserHeader(user: viewModel.user)
            UserContent(user: viewModel.user)
            UserFooter()
        }
        .task { await viewModel.load() }
    }
}
```
