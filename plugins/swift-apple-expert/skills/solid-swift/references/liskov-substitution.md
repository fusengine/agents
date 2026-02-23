---
name: liskov-substitution
description: LSP Guide - Protocol contract consistency for Swift
when-to-use: implementing protocols, swapping providers, testing compliance, mock behavior
keywords: liskov, substitution, LSP, contract, protocol, Swift, testing
priority: high
related: open-closed.md, interface-segregation.md, templates/protocol.md
---

# Liskov Substitution Principle (LSP) for Swift

**Any implementation can replace another without breaking behavior**

If code depends on a protocol, every conforming type must honor the contract.

---

## When to Apply LSP?

### Symptoms of Violation

1. **Switching provider breaks the app** -> Behavior inconsistency
2. **Mock works but real implementation fails** -> Contract unclear
3. **Implementation throws unexpected errors** -> Contract mismatch
4. **Subclass ignores parent methods** -> Bad inheritance

---

## Contract Rules

### Document Expected Behavior

```swift
// Features/User/Protocols/UserServiceProtocol.swift
protocol UserServiceProtocol: Sendable {
    /// Fetches user by ID.
    /// - Returns: User if found, nil otherwise. Never throws for missing users.
    /// - Throws: `NetworkError` only on connection failure.
    func fetchUser(id: String) async throws -> User?

    /// Creates a new user.
    /// - Throws: `ValidationError` if email already exists.
    func createUser(_ dto: CreateUserDTO) async throws -> User
}
```

**ALL implementations MUST:**
- Return `nil` from `fetchUser()` for missing users (never throw)
- Only throw `NetworkError` on connection failures
- Only throw `ValidationError` from `createUser()` for duplicates

---

## How to Verify LSP?

### Contract Tests

```swift
// Tests/Contracts/UserServiceContractTests.swift
protocol UserServiceContractTests {
    func makeService() -> UserServiceProtocol
}

extension UserServiceContractTests {
    func testFetchMissingUserReturnsNil() async throws {
        let service = makeService()
        let result = try await service.fetchUser(id: "nonexistent")
        XCTAssertNil(result)
    }

    func testCreateUserReturnsUser() async throws {
        let service = makeService()
        let user = try await service.createUser(.preview)
        XCTAssertNotNil(user.id)
    }
}

// Tests/Services/UserServiceTests.swift
final class UserServiceTests: XCTestCase, UserServiceContractTests {
    func makeService() -> UserServiceProtocol {
        UserService(session: .shared)
    }
}

// Tests/Mocks/MockUserServiceTests.swift
final class MockUserServiceTests: XCTestCase, UserServiceContractTests {
    func makeService() -> UserServiceProtocol {
        MockUserService(mockUser: .preview)
    }
}
```

---

## Common LSP Violations in Swift

| Violation | Fix |
|-----------|-----|
| Service throws generic `Error` | Throw specific error per contract |
| `fetchUser()` throws for missing | Return `nil` as contract says |
| Mock returns different shapes | Match exact return types |
| Implementation ignores protocol method | Remove protocol conformance |

---

## Swift-Specific Rules

### Protocol with Associated Types

```swift
protocol Repository {
    associatedtype Entity: Sendable
    func findById(_ id: String) async throws -> Entity?
    func save(_ entity: Entity) async throws -> Entity
}
// ALL conforming types must respect return type contracts
```

### Swapping at App Level

```swift
// If you swap this:
let service: UserServiceProtocol = UserService()
// For this:
let service: UserServiceProtocol = MockUserService()
// ALL consumers must work unchanged
```

---

## LSP Checklist

- [ ] Protocol contracts documented with `///`
- [ ] Return types match across all implementations
- [ ] Error types are consistent and documented
- [ ] Contract tests exist per protocol
- [ ] All implementations pass same contract tests
- [ ] Swapping provider at injection point breaks nothing
