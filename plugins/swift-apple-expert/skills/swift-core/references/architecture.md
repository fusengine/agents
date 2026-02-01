---
name: architecture
description: Swift app architecture with MVVM, Clean Architecture, dependency injection, repository patterns
when-to-use: structuring iOS/macOS projects, creating ViewModels, implementing DI, organizing code layers
keywords: MVVM, Clean Architecture, Observable, ViewModel, Repository, DI, dependency injection
priority: high
requires: concurrency.md
related: testing.md, performance.md
---

# Swift Architecture Patterns

## When to Use

- Starting new iOS/macOS project
- Creating ViewModels with @Observable
- Implementing dependency injection
- Separating data/domain/presentation layers
- Designing testable architecture

## Recommended Pattern: MVVM + Clean Architecture

### Layer Responsibilities

| Layer | Contains | Depends On |
|-------|----------|------------|
| **Presentation** | View, ViewModel | Domain |
| **Domain** | Entity, UseCase, Protocol | Nothing |
| **Data** | Repository, DataSource, DTO | Domain |

### Key Principles

1. **Domain is independent** - No imports from other layers
2. **Dependency inversion** - Depend on protocols, not implementations
3. **Single responsibility** - Each class has one reason to change

---

## Key Concepts

### @Observable ViewModel (iOS 17+)
Modern replacement for ObservableObject. Simpler, automatic tracking.

**Key Points:**
- No `@Published` needed - properties auto-tracked
- No `objectWillChange` publisher
- Views update only when accessed properties change
- Use `@MainActor` for UI updates

### Repository Pattern
Abstracts data source from business logic.

**Key Points:**
- Protocol defines interface
- Implementation handles API/database
- ViewModel depends on protocol
- Easy to mock for testing

### Dependency Injection
Pass dependencies instead of creating them.

**Methods:**
- Constructor injection (preferred)
- Environment injection (SwiftUI)
- Container/Registry pattern

### Feature Modules
Organize code by feature, not by type.

**Structure:**
- `Features/UserProfile/Views/`
- `Features/UserProfile/ViewModels/`
- `Features/UserProfile/Models/`

---

## Project Structure

```
App/
├── Features/
│   └── UserProfile/
│       ├── Views/ProfileView.swift
│       ├── ViewModels/ProfileViewModel.swift
│       └── Models/User.swift
├── Core/
│   ├── Network/NetworkService.swift
│   ├── Persistence/DataRepository.swift
│   └── DI/Container.swift
└── Shared/
    ├── Components/
    └── Extensions/
```

---

## Best Practices

- ✅ Use @Observable for ViewModels (not ObservableObject)
- ✅ Define protocols for all dependencies
- ✅ Keep ViewModels under 150 lines
- ✅ One ViewModel per View
- ✅ Use constructor injection
- ❌ Don't access network directly from Views
- ❌ Don't put business logic in Views
- ❌ Don't create circular dependencies

→ See `templates/mvvm-observable.md` for code examples
