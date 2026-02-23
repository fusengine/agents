---
name: model-template
description: Complete Model, DTO, and Error templates for Swift
when-to-use: creating data models, DTOs, custom errors
keywords: model, DTO, error, Sendable, Codable, template, Swift
---

# Model Template

## Rules

- Models < 50 lines
- Location: `Core/Models/` (shared) or `Features/[Feature]/Models/`
- Always `struct` + `Sendable` + `Codable`
- Include `.preview` static for `#Preview`
- No business logic in models

---

## Data Model

```swift
// Core/Models/User.swift
import Foundation

/// User data model.
struct User: Codable, Sendable, Identifiable, Hashable {
    let id: String
    let name: String
    let email: String
    let avatarURL: URL?
    let createdAt: Date
}

// MARK: - Preview

extension User {
    static let preview = User(
        id: "preview-1",
        name: "John Doe",
        email: "john@example.com",
        avatarURL: nil,
        createdAt: .now
    )

    static let previewList: [User] = [
        .preview,
        User(id: "preview-2", name: "Jane Doe", email: "jane@example.com",
             avatarURL: nil, createdAt: .now),
    ]
}
```

---

## DTO (Data Transfer Object)

```swift
// Features/User/Models/CreateUserDTO.swift
import Foundation

/// Data for creating a new user.
struct CreateUserDTO: Codable, Sendable {
    let name: String
    let email: String
    let password: String
}

// MARK: - Preview

extension CreateUserDTO {
    static let preview = CreateUserDTO(
        name: "Test User",
        email: "test@example.com",
        password: "secure123"
    )
}
```

---

## Custom Errors

```swift
// Features/[Feature]/Models/FeatureError.swift
import Foundation

/// Errors specific to [Feature] operations.
enum FeatureError: LocalizedError, Sendable {
    case fetchFailed
    case validationFailed(String)
    case notFound(String)
    case unauthorized

    var errorDescription: String? {
        switch self {
        case .fetchFailed:
            String(localized: "error.feature.fetch_failed")
        case .validationFailed(let reason):
            String(localized: "error.feature.validation \(reason)")
        case .notFound(let id):
            String(localized: "error.feature.not_found \(id)")
        case .unauthorized:
            String(localized: "error.feature.unauthorized")
        }
    }
}
```

---

## Enum Model

```swift
// Core/Models/UserRole.swift

/// Available user roles.
enum UserRole: String, Codable, Sendable, CaseIterable {
    case admin
    case editor
    case viewer

    /// Display name for UI.
    var displayName: String {
        switch self {
        case .admin: String(localized: "role.admin")
        case .editor: String(localized: "role.editor")
        case .viewer: String(localized: "role.viewer")
        }
    }
}
```

