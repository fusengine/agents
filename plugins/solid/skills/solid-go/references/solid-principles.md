---
name: solid-principles
description: Quick reference for all 5 SOLID principles applied to Go 1.23+
when-to-use: overview of SOLID, quick reference, principle selection
keywords: SOLID, overview, Go, principles, quick reference
priority: high
related: single-responsibility.md, open-closed.md, liskov-substitution.md, interface-segregation.md, dependency-inversion.md
---

# SOLID Principles - Go Quick Reference

## Principles Overview

| Principle | Summary | Go Pattern |
|-----------|---------|------------|
| **SRP** | One responsibility per struct | Handler, Service, Repository |
| **OCP** | Open for extension, closed for modification | Interface-based extensibility |
| **LSP** | Implementations honor interface contracts | Implicit interface compliance |
| **ISP** | Small, focused interfaces (Go idiom!) | 1-3 methods per interface |
| **DIP** | Accept interfaces, return structs | Constructor injection |

---

## Architecture Rules (Modules MANDATORY)

```
internal/
├── modules/
│   ├── [feature]/
│   │   ├── handlers/        # HTTP handlers (< 50 lines)
│   │   ├── services/        # Business logic (< 100 lines)
│   │   ├── repositories/    # Data access (< 100 lines)
│   │   ├── ports/           # Interfaces ONLY (< 30 lines)
│   │   └── models/          # Domain models (< 50 lines)
│   └── core/                # Shared (cross-feature)
│       ├── services/
│       ├── ports/
│       └── models/
├── pkg/                     # Public shared packages
└── cmd/                     # Entry points
```

**NEVER use flat `internal/` structure - always `internal/modules/[feature]/`**

---

## File Size Limits

| Type | Max Lines | Split At |
|------|-----------|----------|
| Handler | 50 | 40 |
| Service | 100 | 90 |
| Repository | 100 | 90 |
| Interface (Port) | 30 | 25 |
| Model | 50 | 40 |
| **Any file** | **100** | **90** |

---

## Interface Location (CRITICAL)

| Scope | Location |
|-------|----------|
| Feature ports | `internal/modules/[feature]/ports/` |
| Shared ports | `internal/core/ports/` |
| **FORBIDDEN** | Interfaces in implementation files |

**Go idiom**: Define interfaces where they are USED, not where implemented.

---

## Quick Checklist

- [ ] Files < 100 lines
- [ ] Interfaces in `ports/` (1-3 methods each)
- [ ] Accept interfaces, return structs
- [ ] Constructor functions for dependency injection
- [ ] Error handling with custom error types
- [ ] Godoc on every exported function
- [ ] DRY: Grep before creating new code
