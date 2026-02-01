---
name: data-swiftdata
description: SwiftData for persistence with @Model, @Query, relationships, CloudKit sync
when-to-use: storing app data, creating database models, syncing with iCloud, managing relationships
keywords: SwiftData, Model, Query, Predicate, ModelContext, CloudKit, persistence
priority: high
requires: state-management.md
related: architecture.md
---

# SwiftData Persistence

## When to Use

- Storing structured app data
- Creating database models with relationships
- Syncing data with iCloud/CloudKit
- Querying and filtering data
- Replacing Core Data in new apps

## Key Concepts

### @Model Macro (iOS 17+)
Defines persistent model classes. Automatically generates schema.

**Key Points:**
- Apply to `final class`
- Properties are automatically persisted
- Use `@Attribute(.unique)` for unique constraints
- Use `@Relationship` for associations

### @Query Macro
Declarative data fetching in SwiftUI views.

**Key Points:**
- Automatically updates when data changes
- Supports filtering with `#Predicate`
- Supports sorting with key paths
- Can limit results and paginate

### #Predicate
Type-safe query predicates.

**Key Points:**
- Swift syntax for queries
- Compile-time type checking
- Supports complex conditions
- Combinable with && and ||

### ModelContext
Manages object lifecycle and saves changes.

**Key Points:**
- Inject via `@Environment(\.modelContext)`
- `insert()` for new objects
- `delete()` for removal
- Auto-saves by default

### Relationships
Define associations between models.

**Key Points:**
- `@Relationship` with delete rules
- Inverse relationships for bidirectional
- Cascade delete for dependent data
- Many-to-many supported

### CloudKit Sync
Automatic iCloud synchronization.

**Key Points:**
- Configure in ModelConfiguration
- Private or shared database
- Automatic conflict resolution
- Requires iCloud entitlement

---

## When to Use What

| Solution | Use Case |
|----------|----------|
| @AppStorage | Simple preferences, settings |
| @SceneStorage | Window-specific UI state |
| **SwiftData** | Complex models, relationships |
| Core Data | iOS < 17, advanced migrations |
| Keychain | Sensitive data (tokens, passwords) |
| FileManager | Documents, large files |

---

## Best Practices

- ✅ Use @Attribute(.unique) for identifiers
- ✅ Define deleteRule on relationships
- ✅ Use @Query instead of manual fetches
- ✅ Let auto-save handle persistence
- ✅ Test CloudKit with real devices
- ❌ Don't store sensitive data (use Keychain)
- ❌ Don't store large blobs (use FileManager)
- ❌ Don't create multiple ModelContainers

→ See `templates/swiftdata-model.md` for code examples
