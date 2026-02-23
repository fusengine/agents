---
name: solid-rust
description: SOLID principles for Rust 2024+. Files < 100 lines, traits separated, modular architecture. Modules MANDATORY.
versions:
  rust: "2024"
user-invocable: true
references: references/solid-principles.md, references/single-responsibility.md, references/open-closed.md, references/liskov-substitution.md, references/interface-segregation.md, references/dependency-inversion.md, references/architecture-patterns.md, references/templates/module.md, references/templates/service.md, references/templates/trait-def.md, references/templates/handler.md, references/templates/error.md, references/templates/test.md
related-skills: solid-detection
---

# SOLID Rust - Modular Architecture

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing architecture
2. **fuse-ai-pilot:research-expert** - Verify Rust docs via Context7
3. **fuse-ai-pilot:sniper** - Post-implementation validation

---

## DRY - Reuse Before Creating (MANDATORY)

**Before writing ANY new code:**
1. **Grep the codebase** for similar traits, services, or logic
2. Check shared locations: `src/core/services/`, `src/core/traits/`
3. If similar code exists -> extend/reuse instead of duplicate
4. If code will be used by 2+ features -> create it in `src/core/`

---

## Architecture (Modules MANDATORY)

| Layer | Location | Max Lines |
|-------|----------|-----------|
| Handlers | `src/modules/[feature]/handlers.rs` | 50 |
| Services | `src/modules/[feature]/services.rs` | 100 |
| Repositories | `src/modules/[feature]/repository.rs` | 100 |
| Traits | `src/modules/[feature]/traits.rs` | 30 |
| Models | `src/modules/[feature]/models.rs` | 50 |
| Shared | `src/core/{services,traits,models}/` | - |

**NEVER use flat `src/` structure - always `src/modules/[feature]/`**

---

## Critical Rules (MANDATORY)

| Rule | Value |
|------|-------|
| File limit | 100 lines (split at 90) |
| Handlers | < 50 lines, delegate to services |
| Traits | `traits.rs` or `src/core/traits/` ONLY |
| Rustdoc | `///` on every public item |
| Error handling | Use `thiserror` for custom errors |
| Generics | Use trait bounds, not concrete types |

---

## Reference Guide

### Concepts

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **SOLID Overview** | [solid-principles.md](references/solid-principles.md) | Quick reference |
| **SRP** | [single-responsibility.md](references/single-responsibility.md) | Fat structs |
| **OCP** | [open-closed.md](references/open-closed.md) | Adding impls |
| **LSP** | [liskov-substitution.md](references/liskov-substitution.md) | Trait contracts |
| **ISP** | [interface-segregation.md](references/interface-segregation.md) | Fat traits |
| **DIP** | [dependency-inversion.md](references/dependency-inversion.md) | Generics/DI |
| **Architecture** | [architecture-patterns.md](references/architecture-patterns.md) | Modular crate |

### Templates

| Template | When to use |
|----------|-------------|
| [module.md](references/templates/module.md) | Feature module structure |
| [service.md](references/templates/service.md) | Business logic service |
| [trait-def.md](references/templates/trait-def.md) | Trait definition |
| [handler.md](references/templates/handler.md) | HTTP handler (Axum) |
| [error.md](references/templates/error.md) | Custom errors (thiserror) |
| [test.md](references/templates/test.md) | Unit + integration tests |

---

## Forbidden

| Anti-Pattern | Fix |
|--------------|-----|
| Files > 100 lines | Split at 90 |
| Traits in impl files | Move to `traits.rs` |
| `Box<dyn Any>` | Use proper trait bounds |
| Flat `src/` structure | Use `src/modules/[feature]/` |
| Unwrap in library code | Use `Result<T, E>` |
