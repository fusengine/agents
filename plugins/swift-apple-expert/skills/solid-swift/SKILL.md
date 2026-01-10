---
name: solid-swift
description: SOLID principles for Swift 6 and SwiftUI (iOS 26+). Apple recommended patterns, @Observable, actors, Preview-driven development.
---

# SOLID Swift - Apple Best Practices 2025

## Current Date (CRITICAL)

**Today: January 2026** - ALWAYS use the current year for your searches.
Search with "2025" or "2026", NEVER with past years.

## MANDATORY: Research Before Coding

**CRITICAL: Check today's date first, then search documentation and web BEFORE writing any code.**

1. **Use Context7** to query Swift/SwiftUI official documentation
2. **Use Exa web search** with current year for latest trends
3. **Check Apple WWDC** of current year for new APIs
4. **Verify API availability** for iOS/macOS current versions

```text
WORKFLOW:
1. Check date → 2. Research docs + web (current year) → 3. Apply latest patterns → 4. Code
```

**Search queries (replace YYYY with current year):**
- `Swift [feature] YYYY best practices`
- `SwiftUI [component] YYYY new APIs`
- `Apple WWDC YYYY [topic]`

Never assume - always verify current APIs and patterns exist for the current year.

---

## Codebase Analysis (MANDATORY)

**Before ANY implementation:**
1. Explore project structure to understand architecture
2. Read existing related files to follow established patterns
3. Identify naming conventions, coding style, and patterns used
4. Understand data flow and dependencies

**Continue implementation by:**
- Following existing patterns and conventions
- Matching the coding style already in place
- Respecting the established architecture
- Integrating with existing services/components

## DRY - Reuse Before Creating (MANDATORY)

**Before writing ANY new code:**
1. Search existing codebase for similar functionality
2. Check shared locations: `Core/Extensions/`, `Core/Utilities/`, `Core/Protocols/`
3. If similar code exists → extend/reuse instead of duplicate

**When creating new code:**
- Extract repeated logic (3+ occurrences) into shared helpers
- Place shared utilities in `Core/Utilities/`
- Use Extensions for type enhancements
- Document reusable functions with `///`

---

## Absolute Rules (MANDATORY)

### 1. Files < 150 lines

- **Split at 120 lines** - Never exceed 150
- Views < 80 lines (extract subviews at 30+)
- ViewModels < 100 lines
- Services < 100 lines
- Models < 50 lines

### 2. Protocols Separated

```text
Sources/
├── Protocols/           # Protocols ONLY
│   ├── UserServiceProtocol.swift
│   └── AuthProviderProtocol.swift
├── Services/            # Implementations
│   └── UserService.swift
├── ViewModels/          # @Observable classes
│   └── UserViewModel.swift
└── Views/               # SwiftUI Views
    └── UserView.swift
```

### 3. Swift Documentation Mandatory

```swift
/// Fetches user by ID from remote API.
///
/// - Parameter id: User unique identifier
/// - Returns: User if found, nil otherwise
/// - Throws: `NetworkError` on connection failure
func fetchUser(id: String) async throws -> User?
```

### 4. Preview-Driven Development (Apple)

Every View MUST have a `#Preview`:

```swift
#Preview {
    UserProfileView(user: .preview)
}

#Preview("Loading State") {
    UserProfileView(user: nil)
}
```

---

## Apple Architecture 2025

### Recommended: @Observable + Services

```text
Sources/
├── App/
│   └── MyApp.swift
├── Features/                # Feature modules
│   ├── Auth/
│   │   ├── Views/
│   │   ├── ViewModels/
│   │   ├── Services/
│   │   └── Protocols/
│   └── Profile/
├── Core/                    # Shared
│   ├── Services/
│   ├── Models/
│   ├── Protocols/
│   └── Extensions/
└── Resources/
```

### @Observable over ObservableObject

```swift
// ❌ OLD - ObservableObject
class UserViewModel: ObservableObject {
    @Published var user: User?
}

// ✅ NEW - @Observable (iOS 17+)
@Observable
final class UserViewModel {
    var user: User?
    var isLoading = false

    private let service: UserServiceProtocol

    init(service: UserServiceProtocol) {
        self.service = service
    }
}
```

---

## SOLID Principles for Swift

### S - Single Responsibility

1 type = 1 purpose

```swift
// ❌ BAD - View does everything
struct UserView: View {
    @State private var user: User?

    var body: some View {
        // fetching, validation, formatting, rendering...
    }
}

// ✅ GOOD - Separation
struct UserView: View {
    @State private var viewModel: UserViewModel

    var body: some View {
        UserContent(user: viewModel.user)
    }
}
```

### O - Open/Closed

Protocols for extensibility

```swift
// Protocols/AuthProviderProtocol.swift
protocol AuthProviderProtocol: Sendable {
    func signIn(credentials: Credentials) async throws -> Session
    func signOut() async
}

// Services/AppleAuthProvider.swift
final class AppleAuthProvider: AuthProviderProtocol { }

// Services/GoogleAuthProvider.swift
final class GoogleAuthProvider: AuthProviderProtocol { }
```

### L - Liskov Substitution

All implementations respect contracts

```swift
// Any provider works
let auth: AuthProviderProtocol = AppleAuthProvider()
// or
let auth: AuthProviderProtocol = GoogleAuthProvider()

// Both work identically
try await auth.signIn(credentials: creds)
```

### I - Interface Segregation

Small, focused protocols

```swift
// ❌ BAD - Too broad
protocol UserProtocol {
    func fetch() async
    func update() async
    func delete() async
    func sendNotification() async
}

// ✅ GOOD - Separated
protocol Fetchable { func fetch() async }
protocol Updatable { func update() async }
protocol Deletable { func delete() async }
```

### D - Dependency Inversion

Depend on protocols, inject implementations

```swift
// ViewModel depends on protocol
@Observable
final class UserViewModel {
    private let service: UserServiceProtocol

    init(service: UserServiceProtocol) {
        self.service = service
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

## Swift 6 Concurrency

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

### @MainActor for UI

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

### Sendable Types

```swift
// Models must be Sendable for concurrency
struct User: Codable, Sendable {
    let id: String
    let name: String
    let email: String
}
```

### Structured Concurrency

```swift
// ✅ GOOD - Task groups
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

---

## SwiftUI Templates

### View (< 80 lines)

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

### ViewModel (< 100 lines)

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

### Protocol

```swift
import Foundation

/// Protocol for user-related operations.
protocol UserServiceProtocol: Sendable {
    /// Fetches the current authenticated user.
    func fetchCurrentUser() async throws -> User

    /// Updates user profile.
    func updateUser(_ user: User) async throws -> User
}
```

### Service

```swift
import Foundation

/// Implementation of UserServiceProtocol using URLSession.
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
```

---

## Localization (MANDATORY)

All user-facing text MUST use String Catalogs:

```swift
// ✅ GOOD - Localized
Text("profile.welcome.title")
Button("button.save") { }

// With interpolation
Text("profile.greeting \(user.name)")

// ❌ BAD - Hardcoded
Text("Welcome!")
Button("Save") { }
```

Key naming: `module.screen.element`

---

## iOS 26 / WWDC 2025

### Liquid Glass Design

```swift
.glassBackgroundEffect()
.liquidGlass()
```

### SwiftUI Performance

- 6x faster list loading
- 16x faster updates on macOS
- Use SwiftUI Performance Instrument

### 3D Layouts (visionOS)

```swift
SpatialLayout {
    Model3D(named: "object")
}
```

---

## Response Guidelines

1. **Research first** - MANDATORY: Search Context7 + Exa before ANY code
2. **Show complete code** - Working examples, not snippets
3. **Explain decisions** - Why this pattern over alternatives
4. **Include previews** - Always add #Preview for views
5. **Handle errors** - Never ignore, always handle gracefully
6. **Consider accessibility** - VoiceOver, Dynamic Type
7. **Document code** - /// for public APIs

---

## Forbidden

- ❌ Coding without researching docs first (ALWAYS research)
- ❌ Using outdated APIs without checking current year docs
- ❌ Files > 150 lines
- ❌ Protocols in implementation files
- ❌ ObservableObject (use @Observable)
- ❌ Completion handlers (use async/await)
- ❌ Missing #Preview
- ❌ Hardcoded strings (use String Catalogs)
- ❌ Force unwrap without validation
- ❌ Missing /// documentation
- ❌ Views > 80 lines without extraction
- ❌ Non-Sendable types in async contexts
