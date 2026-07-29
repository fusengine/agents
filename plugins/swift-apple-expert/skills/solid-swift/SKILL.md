---
name: solid-swift
description: Use when applying SOLID principles to Swift 6/SwiftUI code — file-size limits, protocol separation, @Observable, actors, feature-modular architecture.
versions:
  swift: "6.2"
  ios: "26"
user-invocable: true
references: references/solid-principles.md, references/single-responsibility.md, references/open-closed.md, references/liskov-substitution.md, references/interface-segregation.md, references/dependency-inversion.md, references/concurrency-patterns.md, references/anti-patterns.md, references/templates/view.md, references/templates/viewmodel.md, references/templates/service.md, references/templates/protocol.md, references/templates/model.md
related-skills: swift-core, swiftui-core, ios, macos, ipados, watchos, visionos, tvos
---

<objective>
Enforces SOLID and DRY principles for Swift 6 and SwiftUI (iOS 26+) projects: a mandatory Features/[Feature]/ modular directory structure (never a flat Sources/ layout), strict file-size limits (100 lines, split at 90, with per-layer budgets for Views/ViewModels/Services/Protocols), protocols separated into their own Protocols/ directories, @Observable + @MainActor for ViewModels, Sendable structs for models, and mandatory #Preview on every View.

Covers all five SOLID principles with dedicated references (SRP, OCP, LSP, ISP, DIP), concurrency patterns (actors, @MainActor, Sendable), an anti-pattern catalog, and code templates for views, view models, services, protocols, and models.

Requires grepping the codebase for reusable protocols/services before writing new code, and checking shared locations (Core/Extensions/, Core/Utilities/, Core/Protocols/) before duplicating logic used by 2+ features.
</objective>

# SOLID Swift - Apple Best Practices 2026

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing architecture
2. **fuse-ai-pilot:research-expert** - Verify Swift/Apple docs via Apple Docs MCP + Context7
3. **XcodeBuildMCP** - Build validation after code changes. Then run **fuse-ai-pilot:sniper**.

---

## DRY - Reuse Before Creating (MANDATORY)

**Before writing ANY new code:**
1. **Grep the codebase** for similar protocols, services, or logic
2. Check shared locations: `Core/Extensions/`, `Core/Utilities/`, `Core/Protocols/`
3. If similar code exists -> extend/reuse instead of duplicate
4. If code will be used by 2+ features -> create it in `Core/` directly

---

## Architecture (Features Modular MANDATORY)

| Layer | Location | Max Lines |
|-------|----------|-----------|
| Views | `Features/[Feature]/Views/` | 80 |
| ViewModels | `Features/[Feature]/ViewModels/` | 100 |
| Services | `Features/[Feature]/Services/` | 100 |
| Protocols | `Features/[Feature]/Protocols/` | 30 |
| Shared | `Core/{Models,Protocols,Services,Extensions,Utilities}/` | - |

**NEVER use flat `Sources/` structure - always `Features/[Feature]/`**

---

## Critical Rules (MANDATORY)

| Rule | Value |
|------|-------|
| File limit | 100 lines (split at 90) |
| ViewModels | `@MainActor @Observable` |
| Protocols | `Features/[Feature]/Protocols/` or `Core/Protocols/` ONLY |
| Models | `Sendable` structs |
| Documentation | `///` on all public APIs |
| Previews | Every View MUST have `#Preview` |

---

## Reference Guide

### Concepts

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **SOLID Overview** | [solid-principles.md](references/solid-principles.md) | Quick reference all principles |
| **SRP** | [single-responsibility.md](references/single-responsibility.md) | Fat views/VMs, splitting files |
| **OCP** | [open-closed.md](references/open-closed.md) | Adding providers, extensibility |
| **LSP** | [liskov-substitution.md](references/liskov-substitution.md) | Protocol contracts, testing |
| **ISP** | [interface-segregation.md](references/interface-segregation.md) | Fat protocols, splitting |
| **DIP** | [dependency-inversion.md](references/dependency-inversion.md) | Injection, testing, mocking |
| **Concurrency** | [concurrency-patterns.md](references/concurrency-patterns.md) | Actors, @MainActor, Sendable |
| **Anti-Patterns** | [anti-patterns.md](references/anti-patterns.md) | Code smells detection |

### Templates

| Template | When to use |
|----------|-------------|
| [view.md](references/templates/view.md) | SwiftUI View with subviews and #Preview |
| [viewmodel.md](references/templates/viewmodel.md) | @Observable ViewModel with @MainActor |
| [service.md](references/templates/service.md) | API Service, Mock, Cache actor |
| [protocol.md](references/templates/protocol.md) | Service protocol, CQRS, Auth |
| [model.md](references/templates/model.md) | Model, DTO, Error, Enum |

---

## Forbidden

| Anti-Pattern | Fix |
|--------------|-----|
| Files > 100 lines | Split at 90 |
| Protocols in impl files | Move to `Protocols/` directory |
| `ObservableObject` | Use `@Observable` |
| Completion handlers | Use `async/await` |
| Missing `#Preview` | Add preview for every View |
| Non-Sendable in async | Use `struct` with `let` |
| Flat `Sources/` structure | Use `Features/[Feature]/` |
