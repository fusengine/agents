---
name: open-closed
description: OCP Guide - Protocol-based extensibility for Swift
when-to-use: adding new providers, auth methods, payment gateways, notification channels
keywords: open closed, OCP, protocol, extensibility, provider, Swift
priority: high
related: liskov-substitution.md, dependency-inversion.md, templates/protocol.md, templates/service.md
---

# Open/Closed Principle (OCP) for Swift

**Open for extension, closed for modification**

Add new behavior by creating new types, not modifying existing ones.

---

## When to Apply OCP?

### Symptoms of Violation

1. **`if/else` or `switch` for type selection** -> Hard-coded logic
2. **Adding provider requires modifying existing files** -> Not extensible
3. **Authentication with inline Apple/Google logic** -> Coupled
4. **New feature requires touching 5+ files** -> Cascading changes

---

## How to Apply OCP?

### Step 1: Define Protocol

```swift
// Features/Auth/Protocols/AuthProviderProtocol.swift
/// Contract for authentication providers.
protocol AuthProviderProtocol: Sendable {
    /// Sign in with credentials.
    /// - Throws: `AuthError` on failure
    func signIn(credentials: Credentials) async throws -> Session
    /// Sign out current session.
    func signOut() async
}
```

### Step 2: Create Implementations

```swift
// Features/Auth/Services/AppleAuthProvider.swift
final class AppleAuthProvider: AuthProviderProtocol {
    func signIn(credentials: Credentials) async throws -> Session {
        // Apple Sign In implementation
        return Session(token: "...")
    }
    func signOut() async { /* Apple logout */ }
}

// Features/Auth/Services/GoogleAuthProvider.swift
final class GoogleAuthProvider: AuthProviderProtocol {
    func signIn(credentials: Credentials) async throws -> Session {
        // Google Sign In implementation
        return Session(token: "...")
    }
    func signOut() async { /* Google logout */ }
}
```

### Step 3: Use Protocol in Consumer

```swift
// Features/Auth/ViewModels/LoginViewModel.swift
@MainActor @Observable
final class LoginViewModel {
    private let authProvider: AuthProviderProtocol

    init(authProvider: AuthProviderProtocol) {
        self.authProvider = authProvider
    }

    func signIn(email: String, password: String) async {
        let creds = Credentials(email: email, password: password)
        _ = try? await authProvider.signIn(credentials: creds)
    }
}
```

### Adding a New Provider (No Modifications!)

```swift
// Features/Auth/Services/FacebookAuthProvider.swift
final class FacebookAuthProvider: AuthProviderProtocol {
    func signIn(credentials: Credentials) async throws -> Session { ... }
    func signOut() async { ... }
}
// Zero changes to LoginViewModel, Views, or other providers
```

---

## Swift-Specific OCP Patterns

### Protocol with Default Implementation

```swift
// Core/Protocols/Cacheable.swift
protocol Cacheable {
    var cacheKey: String { get }
    var cacheDuration: TimeInterval { get }
}

extension Cacheable {
    var cacheDuration: TimeInterval { 300 } // Default 5 min
}
```

### Enum with Protocol Conformance

```swift
// Extend behavior without modifying enum
protocol Displayable {
    var displayName: String { get }
    var icon: String { get }
}

extension UserRole: Displayable {
    var displayName: String { /* ... */ }
    var icon: String { /* ... */ }
}
```

---

## OCP Checklist

- [ ] New features add files, don't modify existing ones
- [ ] Protocols defined in `Features/[Feature]/Protocols/`
- [ ] No `switch` on type to select behavior (use protocol)
- [ ] Default implementations via protocol extensions
- [ ] All providers conform to shared protocol
