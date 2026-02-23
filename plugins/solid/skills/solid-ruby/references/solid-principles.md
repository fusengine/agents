---
name: solid-principles
description: Quick reference for all 5 SOLID principles applied to Ruby 3.3+ / Rails 8
when-to-use: overview of SOLID, quick reference, principle selection
keywords: SOLID, overview, Ruby, Rails, principles, quick reference
priority: high
related: single-responsibility.md, open-closed.md, liskov-substitution.md, interface-segregation.md, dependency-inversion.md
---

# SOLID Principles - Ruby Quick Reference

## Principles Overview

| Principle | Summary | Ruby Pattern |
|-----------|---------|--------------|
| **SRP** | One responsibility per class | Controller, Service, Query object |
| **OCP** | Open for extension, closed for modification | Strategy/Module-based extensibility |
| **LSP** | Implementations honor duck type contracts | Contract consistency |
| **ISP** | Small, focused modules/concerns | Role-based module splitting |
| **DIP** | Depend on abstractions (duck typing) | Constructor injection |

---

## Architecture Rules (Modules MANDATORY)

```
app/
├── modules/
│   ├── [feature]/
│   │   ├── controllers/     # HTTP handlers (< 50 lines)
│   │   ├── services/        # Business logic (< 100 lines)
│   │   ├── repositories/    # Data access (< 100 lines)
│   │   ├── contracts/       # Duck typing modules ONLY (< 30 lines)
│   │   ├── models/          # ActiveRecord (< 50 lines)
│   │   └── concerns/        # Shared behavior
│   └── core/                # Shared (cross-feature)
│       ├── services/
│       ├── contracts/
│       └── concerns/
└── config/
```

**NEVER use flat `app/` structure - always `app/modules/[feature]/`**

---

## File Size Limits

| Type | Max Lines | Split At |
|------|-----------|----------|
| Controller | 50 | 40 |
| Service | 100 | 90 |
| Repository | 100 | 90 |
| Contract | 30 | 25 |
| Model | 50 | 40 |
| **Any file** | **100** | **90** |

---

## Contract Location (CRITICAL)

| Scope | Location |
|-------|----------|
| Feature contracts | `app/modules/[feature]/contracts/` |
| Shared contracts | `app/modules/core/contracts/` |
| **FORBIDDEN** | Contracts in implementation files |

**Ruby uses duck typing**: Contracts are modules defining expected interface.

---

## Quick Checklist

- [ ] Files < 100 lines
- [ ] Contracts in `modules/[feature]/contracts/` or `modules/core/contracts/`
- [ ] Services accept duck-typed dependencies
- [ ] `# frozen_string_literal: true` in every file
- [ ] YARD documentation on public methods
- [ ] Thin controllers (delegate to services)
- [ ] DRY: Grep before creating new code
