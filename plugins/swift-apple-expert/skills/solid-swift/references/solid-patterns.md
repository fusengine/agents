# SOLID Patterns - Swift Code Examples

## S - Single Responsibility

### View Pattern (< 80 lines)

```swift
import SwiftUI

/// User profile view displaying user information.
struct UserProfileView: View {
    let user: User?

    var body: some View {
        Group {
            if let user {
                UserContent(user: user)
            } else {
                ProgressView()
            }
        }
        .navigationTitle("profile.title")
    }
}

// MARK: - Subviews

private struct UserContent: View {
    let user: User

    var body: some View {
        VStack {
            Text(user.name)
            Text(user.email)
        }
    }
}

// MARK: - Preview

#Preview {
    UserProfileView(user: .preview)
}
```

### ViewModel Pattern (< 100 lines)

```swift
import Foundation

/// ViewModel for user profile screen.
@MainActor
@Observable
final class UserProfileViewModel {
    // MARK: - State

    var user: User?
    var isLoading = false
    var error: Error?

    // MARK: - Dependencies

    private let service: UserServiceProtocol

    // MARK: - Init

    init(service: UserServiceProtocol) {
        self.service = service
    }

    // MARK: - Actions

    /// Loads user profile from API.
    func load() async {
        isLoading = true
        defer { isLoading = false }

        do {
            user = try await service.fetchCurrentUser()
        } catch {
            self.error = error
        }
    }
}
```

---

## O - Open/Closed

### Protocol-Based Extensibility

```swift
// Protocols/AuthProviderProtocol.swift
protocol AuthProviderProtocol: Sendable {
    func signIn(credentials: Credentials) async throws -> Session
    func signOut() async
}

// Services/AppleAuthProvider.swift
final class AppleAuthProvider: AuthProviderProtocol {
    func signIn(credentials: Credentials) async throws -> Session {
        // Apple-specific implementation
    }

    func signOut() async {
        // Apple-specific logout
    }
}

// Services/GoogleAuthProvider.swift
final class GoogleAuthProvider: AuthProviderProtocol {
    func signIn(credentials: Credentials) async throws -> Session {
        // Google-specific implementation
    }

    func signOut() async {
        // Google-specific logout
    }
}
```

---

## L - Liskov Substitution

### Protocol Implementation Guarantee

```swift
// Any provider works identically
let auth: AuthProviderProtocol = AppleAuthProvider()
// or
let auth: AuthProviderProtocol = GoogleAuthProvider()

// Both work without client code changes
try await auth.signIn(credentials: creds)
try await auth.signOut()
```

---

## I - Interface Segregation

### Small, Focused Protocols

```swift
// ❌ BAD - Too broad
protocol UserProtocol {
    func fetch() async
    func update() async
    func delete() async
    func sendNotification() async
}

// ✅ GOOD - Separated concerns
protocol Fetchable {
    func fetch() async
}

protocol Updatable {
    func update() async
}

protocol Deletable {
    func delete() async
}

// Clients depend on what they need
class UserRepository: Fetchable, Updatable {
    func fetch() async { }
    func update() async { }
}
```

---

## D - Dependency Inversion

### Service Injection Pattern

```swift
// ViewModel depends on protocol (abstraction)
@Observable
final class UserViewModel {
    private let service: UserServiceProtocol

    init(service: UserServiceProtocol) {
        self.service = service
    }

    func load() async {
        let user = try? await service.fetchCurrentUser()
    }
}

// Protocol definition
protocol UserServiceProtocol: Sendable {
    /// Fetches the current authenticated user.
    func fetchCurrentUser() async throws -> User

    /// Updates user profile.
    func updateUser(_ user: User) async throws -> User
}

// Concrete implementation
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
        // Implementation...
        return user
    }
}

// Injection at app level
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

## Concurrency Patterns

### Actor for Shared State

```swift
actor UserCache {
    private var users: [String: User] = [:]

    func get(_ id: String) -> User? {
        users[id]
    }

    func set(_ user: User) {
        users[user.id] = user
    }
}
```

### @MainActor for UI Updates

```swift
@MainActor
@Observable
final class UserViewModel {
    var user: User?
    var isLoading = false

    func load() async {
        isLoading = true
        defer { isLoading = false }

        user = try? await service.fetchUser()
    }
}
```

### Sendable Types for Concurrency

```swift
// Models must be Sendable for safe concurrent access
struct User: Codable, Sendable {
    let id: String
    let name: String
    let email: String
}
```

### Structured Concurrency

```swift
// ✅ GOOD - Task groups for parallel fetching
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
