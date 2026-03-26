---
name: solid-csharp
description: SOLID principles for C# 12/.NET 9. Files < 100 lines, interfaces separated, modular architecture. Contracts MANDATORY.
versions:
  csharp: "12"
  dotnet: "9"
user-invocable: true
references: references/principles.md, references/patterns.md
related-skills: solid-detection
---

# SOLID C# - Modular Architecture

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing architecture
2. **fuse-ai-pilot:research-expert** - Verify .NET docs via Context7
3. **fuse-ai-pilot:sniper** - Post-implementation validation

---

## DRY - Reuse Before Creating (MANDATORY)

**Before writing ANY new code:**
1. **Grep the codebase** for similar interfaces, services, or logic
2. Check shared locations: `Core/Services/`, `Core/Contracts/`
3. If similar code exists -> extend/reuse instead of duplicate
4. If code will be used by 2+ features -> create it in `Core/`

---

## Architecture (Modules MANDATORY)

| Layer | Location | Max Lines |
|-------|----------|-----------|
| Controllers | `Modules/[Feature]/Controllers/` | 50 |
| Services | `Modules/[Feature]/Services/` | 100 |
| Repositories | `Modules/[Feature]/Repositories/` | 100 |
| Contracts | `Modules/[Feature]/Contracts/` | 30 |
| Models | `Modules/[Feature]/Models/` | 50 |
| Shared | `Core/{Services,Contracts,Models}/` | - |

**NEVER use flat structure - always `Modules/[Feature]/`**

---

## Critical Rules (MANDATORY)

| Rule | Value |
|------|-------|
| File limit | 100 lines (split at 90) |
| Controllers | < 50 lines, delegate to services |
| Interfaces | `Contracts/` directory ONLY |
| XML docs | Every public member documented |
| DI | Use `Microsoft.Extensions.DependencyInjection` |
| Small interfaces | 1-3 members max |
| Records | Prefer `record` for DTOs and value objects |

---

## Reference Guide

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **SOLID Principles** | [principles.md](references/principles.md) | Quick reference for all 5 principles |
| **Patterns & Structure** | [patterns.md](references/patterns.md) | Directory layout, testing, records |

---

## Forbidden

| Anti-Pattern | Fix |
|--------------|-----|
| Files > 100 lines | Split at 90 |
| Interfaces in impl files | Move to `Contracts/` directory |
| Fat interfaces (4+ members) | Split into focused interfaces |
| Flat project structure | Use `Modules/[Feature]/` |
| `new` for dependencies | Use constructor injection + DI |
| Service Locator pattern | Use constructor injection |
