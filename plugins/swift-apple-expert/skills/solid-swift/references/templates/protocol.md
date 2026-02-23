---
name: protocol-template
description: Complete Protocol templates for Swift services and repositories
when-to-use: creating protocols, defining contracts, abstracting services
keywords: protocol, contract, interface, template, Swift, Sendable
---

# Protocol Template

## Rules

- Protocols < 30 lines
- Location: `Features/[Feature]/Protocols/`
- Shared protocols: `Core/Protocols/`
- Always mark `: Sendable` for async protocols
- Document contracts with `///`
- Max 5 methods per protocol (ISP)

---

## Service Protocol

```swift
// Features/[Feature]/Protocols/FeatureServiceProtocol.swift

/// Contract for [Feature] data operations.
protocol FeatureServiceProtocol: Sendable {
    /// Fetches feature data.
    /// - Returns: Feature data from API.
    /// - Throws: `FeatureError.fetchFailed` on network failure.
    func fetchData() async throws -> FeatureData

    /// Creates a new feature.
    /// - Parameter dto: Data for new feature.
    /// - Returns: Created feature with server-assigned ID.
    /// - Throws: `FeatureError.validationFailed` if data invalid.
    func create(_ dto: CreateFeatureDTO) async throws -> Feature
}
```

---

## Repository Protocol (CQRS-Lite)

```swift
// Features/[Feature]/Protocols/FeatureReadable.swift
/// Read-only operations for features.
protocol FeatureReadable: Sendable {
    func findById(_ id: String) async throws -> Feature?
    func findAll() async throws -> [Feature]
}

// Features/[Feature]/Protocols/FeatureWritable.swift
/// Write operations for features.
protocol FeatureWritable: Sendable {
    func create(_ dto: CreateFeatureDTO) async throws -> Feature
    func update(_ id: String, dto: UpdateFeatureDTO) async throws -> Feature
    func delete(_ id: String) async throws
}
```

---

## Auth Protocol

```swift
// Features/Auth/Protocols/AuthProviderProtocol.swift
/// Contract for authentication providers (OCP).
///
/// Adding new auth methods (Apple, Google, Facebook) requires
/// only creating a new implementation, no changes to existing code.
protocol AuthProviderProtocol: Sendable {
    /// Signs in with credentials.
    /// - Throws: `AuthError.invalidCredentials` on failure.
    func signIn(credentials: Credentials) async throws -> Session
    /// Signs out current session.
    func signOut() async
}
```

---

## Cacheable Protocol

```swift
// Core/Protocols/Cacheable.swift
/// Types that can be cached with a key and TTL.
protocol Cacheable: Sendable {
    var cacheKey: String { get }
    var cacheDuration: TimeInterval { get }
}

extension Cacheable {
    /// Default cache duration: 5 minutes.
    var cacheDuration: TimeInterval { 300 }
}
```

---

## Protocol Composition

```swift
// Use typealias for common compositions
typealias FeatureCRUD = FeatureReadable & FeatureWritable

// Admin needs full access
final class AdminFeatureService {
    private let repository: FeatureCRUD
    init(repository: FeatureCRUD) {
        self.repository = repository
    }
}

// Report only needs read
final class FeatureReportService {
    private let reader: FeatureReadable
    init(reader: FeatureReadable) {
        self.reader = reader
    }
}
```
