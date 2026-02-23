---
name: service-template
description: Complete Service template with URLSession and protocol conformance
when-to-use: creating services, API calls, business logic
keywords: service, URLSession, API, template, Swift
---

# Service Template

## Rules

- Services < 100 lines
- Location: `Features/[Feature]/Services/`
- Shared services: `Core/Services/`
- Always conform to protocol
- Mark as `final class` (or `actor` for shared state)

---

## API Service

```swift
// Features/[Feature]/Services/FeatureService.swift
import Foundation

/// Handles [Feature] API operations.
final class FeatureService: FeatureServiceProtocol {
    private let session: URLSession
    private let decoder: JSONDecoder

    init(session: URLSession = .shared) {
        self.session = session
        self.decoder = JSONDecoder()
        self.decoder.dateDecodingStrategy = .iso8601
    }

    /// Fetches feature data from API.
    func fetchData() async throws -> FeatureData {
        let url = URL(string: "https://api.example.com/features")!
        let (data, response) = try await session.data(from: url)

        guard let http = response as? HTTPURLResponse,
              (200...299).contains(http.statusCode) else {
            throw FeatureError.fetchFailed
        }

        return try decoder.decode(FeatureData.self, from: data)
    }

    /// Creates a new feature.
    func create(_ dto: CreateFeatureDTO) async throws -> Feature {
        var request = URLRequest(url: URL(string: "https://api.example.com/features")!)
        request.httpMethod = "POST"
        request.httpBody = try JSONEncoder().encode(dto)
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let (data, _) = try await session.data(for: request)
        return try decoder.decode(Feature.self, from: data)
    }
}
```

---

## Mock Service (for Tests)

```swift
// Tests/Mocks/MockFeatureService.swift
final class MockFeatureService: FeatureServiceProtocol {
    var mockData: FeatureData?
    var mockError: Error?
    var createCallCount = 0

    func fetchData() async throws -> FeatureData {
        if let error = mockError { throw error }
        return mockData ?? .preview
    }

    func create(_ dto: CreateFeatureDTO) async throws -> Feature {
        createCallCount += 1
        if let error = mockError { throw error }
        return Feature(id: "mock-id", name: dto.name)
    }
}
```

---

## Cache Service (Actor)

```swift
// Core/Services/CacheService.swift
/// Thread-safe generic cache using actor isolation.
actor CacheService<Key: Hashable, Value: Sendable> {
    private var storage: [Key: CacheEntry<Value>] = [:]
    private let ttl: TimeInterval

    init(ttl: TimeInterval = 300) {
        self.ttl = ttl
    }

    /// Gets cached value if not expired.
    func get(_ key: Key) -> Value? {
        guard let entry = storage[key],
              Date().timeIntervalSince(entry.timestamp) < ttl else {
            return nil
        }
        return entry.value
    }

    /// Stores value in cache.
    func set(_ key: Key, value: Value) {
        storage[key] = CacheEntry(value: value, timestamp: Date())
    }

    /// Clears all cached entries.
    func clear() {
        storage.removeAll()
    }
}

private struct CacheEntry<Value> {
    let value: Value
    let timestamp: Date
}
```
