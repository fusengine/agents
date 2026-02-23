---
name: solid-principles
description: Quick reference for all 5 SOLID principles applied to Swift 6 and SwiftUI
when-to-use: overview of SOLID, quick reference, principle selection
keywords: SOLID, overview, Swift 6, SwiftUI, principles, quick reference
priority: high
related: single-responsibility.md, open-closed.md, liskov-substitution.md, interface-segregation.md, dependency-inversion.md
---

# SOLID Principles - Swift Quick Reference

## Principles Overview

| Principle | Summary | Swift Pattern |
|-----------|---------|---------------|
| **SRP** | One responsibility per type | View, ViewModel, Service, Model |
| **OCP** | Open for extension, closed for modification | Protocol-based extensibility |
| **LSP** | Implementations honor protocol contracts | Contract consistency |
| **ISP** | Small, focused protocols | Role-based protocol splitting |
| **DIP** | Depend on protocols, not concrete types | Constructor injection |

---

## Architecture Rules (Features Modular MANDATORY)

```
Sources/
├── App/
│   └── MyApp.swift
├── Features/                    # Feature modules (MANDATORY)
│   ├── Auth/
│   │   ├── Views/
│   │   ├── ViewModels/
│   │   ├── Services/
│   │   └── Protocols/
│   └── Profile/
├── Core/                        # Shared (cross-feature)
│   ├── Services/
│   ├── Models/
│   ├── Protocols/
│   ├── Extensions/
│   └── Utilities/
└── Resources/
```

**NEVER use flat `Sources/` structure - always `Features/[Feature]/`**

---

## File Size Limits

| Type | Max Lines | Split At |
|------|-----------|----------|
| View | 80 | 60 |
| ViewModel | 100 | 80 |
| Service | 100 | 80 |
| Model | 50 | 40 |
| Protocol | 30 | 25 |
| **Any file** | **150** | **120** |

---

## Protocol Location (CRITICAL)

| Scope | Location |
|-------|----------|
| Feature protocols | `Features/[Feature]/Protocols/` |
| Shared protocols | `Core/Protocols/` |
| **FORBIDDEN** | Protocols in implementation files |

---

## Quick Checklist

- [ ] Files < 150 lines (Views < 80)
- [ ] Protocols in `Features/[Feature]/Protocols/` or `Core/Protocols/`
- [ ] ViewModels use `@Observable` + `@MainActor`
- [ ] Dependencies injected via protocols
- [ ] Models are `Sendable` structs
- [ ] Every View has `#Preview`
- [ ] `///` documentation on public APIs
- [ ] No `ObservableObject`, no completion handlers
- [ ] DRY: Grep before creating new code
