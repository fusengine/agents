---
name: solid-principles
description: Quick reference for all 5 SOLID principles applied to Rust 2024+
when-to-use: overview of SOLID, quick reference, principle selection
keywords: SOLID, overview, Rust, principles, quick reference
priority: high
related: single-responsibility.md, open-closed.md, liskov-substitution.md, interface-segregation.md, dependency-inversion.md
---

# SOLID Principles - Rust Quick Reference

## Principles Overview

| Principle | Summary | Rust Pattern |
|-----------|---------|--------------|
| **SRP** | One responsibility per struct/module | Handler, Service, Repository |
| **OCP** | Open for extension, closed for modification | Trait-based extensibility |
| **LSP** | Implementations honor trait contracts | Trait contract consistency |
| **ISP** | Small, focused traits | Role-based trait splitting |
| **DIP** | Depend on traits, not concrete types | Generic bounds + DI |

---

## Architecture Rules (Modules MANDATORY)

```
src/
├── modules/
│   ├── [feature]/
│   │   ├── mod.rs           # Module declaration
│   │   ├── handlers.rs      # HTTP handlers (< 50 lines)
│   │   ├── services.rs      # Business logic (< 100 lines)
│   │   ├── repository.rs    # Data access (< 100 lines)
│   │   ├── traits.rs        # Trait definitions ONLY (< 30 lines)
│   │   └── models.rs        # Domain models (< 50 lines)
│   └── core/                # Shared (cross-feature)
│       ├── services.rs
│       ├── traits.rs
│       └── models.rs
├── lib.rs
└── main.rs
```

**NEVER use flat `src/` structure - always `src/modules/[feature]/`**

---

## File Size Limits

| Type | Max Lines | Split At |
|------|-----------|----------|
| Handler | 50 | 40 |
| Service | 100 | 90 |
| Repository | 100 | 90 |
| Trait | 30 | 25 |
| Model | 50 | 40 |
| **Any file** | **100** | **90** |

---

## Trait Location (CRITICAL)

| Scope | Location |
|-------|----------|
| Feature traits | `src/modules/[feature]/traits.rs` |
| Shared traits | `src/core/traits.rs` |
| **FORBIDDEN** | Traits in implementation files |

---

## Quick Checklist

- [ ] Files < 100 lines
- [ ] Traits in `traits.rs` or `src/core/traits/`
- [ ] Services use generic trait bounds (not concrete types)
- [ ] Error handling with `thiserror`
- [ ] `///` rustdoc on every public item
- [ ] `Result<T, E>` (never unwrap in library code)
- [ ] DRY: Grep before creating new code
