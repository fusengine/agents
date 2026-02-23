---
name: solid-principles
description: Quick reference for all 5 SOLID principles applied to Java 21+
when-to-use: overview of SOLID, quick reference, principle selection
keywords: SOLID, overview, Java, principles, quick reference
priority: high
related: single-responsibility.md, open-closed.md, liskov-substitution.md, interface-segregation.md, dependency-inversion.md
---

# SOLID Principles - Java Quick Reference

## Principles Overview

| Principle | Summary | Java Pattern |
|-----------|---------|--------------|
| **SRP** | One responsibility per class | Controller, Service, Repository |
| **OCP** | Open for extension, closed for modification | Interface-based extensibility |
| **LSP** | Implementations honor interface contracts | Contract consistency |
| **ISP** | Small, focused interfaces | Role-based interface splitting |
| **DIP** | Depend on interfaces, not concrete classes | Constructor injection |

---

## Architecture Rules (Modules MANDATORY)

```
src/main/java/com/app/
├── modules/
│   ├── [feature]/
│   │   ├── controllers/     # HTTP handlers (< 50 lines)
│   │   ├── services/        # Business logic (< 100 lines)
│   │   ├── repositories/    # Data access (< 100 lines)
│   │   ├── interfaces/      # Contracts ONLY (< 30 lines)
│   │   └── models/          # DTOs, records (< 50 lines)
│   └── core/                # Shared (cross-feature)
│       ├── services/
│       ├── interfaces/
│       └── models/
└── Application.java
```

**NEVER use flat package structure - always `modules/[feature]/`**

---

## File Size Limits

| Type | Max Lines | Split At |
|------|-----------|----------|
| Controller | 50 | 40 |
| Service | 100 | 90 |
| Repository | 100 | 90 |
| Interface | 30 | 25 |
| Model/DTO | 50 | 40 |
| **Any file** | **100** | **90** |

---

## Interface Location (CRITICAL)

| Scope | Location |
|-------|----------|
| Feature interfaces | `modules/[feature]/interfaces/` |
| Shared interfaces | `modules/core/interfaces/` |
| **FORBIDDEN** | Interfaces in implementation files |

---

## Quick Checklist

- [ ] Files < 100 lines
- [ ] Interfaces in `modules/[feature]/interfaces/` or `modules/core/interfaces/`
- [ ] Services depend on interfaces (constructor injection)
- [ ] DTOs use `record` (Java 16+)
- [ ] Sealed classes for restricted hierarchies (Java 17+)
- [ ] Javadoc on every public method
- [ ] DRY: Grep before creating new code
