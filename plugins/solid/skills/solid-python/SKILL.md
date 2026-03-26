---
name: solid-python
description: SOLID principles for Python 3.12+. Files < 100 lines, interfaces separated, modular architecture. Modules MANDATORY.
versions:
  python: "3.12"
user-invocable: true
references: references/principles.md, references/patterns.md
related-skills: solid-detection
---

# SOLID Python - Modular Architecture

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing architecture
2. **fuse-ai-pilot:research-expert** - Verify Python docs via Context7
3. **fuse-ai-pilot:sniper** - Post-implementation validation

---

## DRY - Reuse Before Creating (MANDATORY)

**Before writing ANY new code:**
1. **Grep the codebase** for similar interfaces, services, or logic
2. Check shared locations: `core/services/`, `core/interfaces/`
3. If similar code exists -> extend/reuse instead of duplicate
4. If code will be used by 2+ features -> create it in `core/`

---

## Architecture (Modules MANDATORY)

| Layer | Location | Max Lines |
|-------|----------|-----------|
| Routes | `modules/[feature]/routes/` | 50 |
| Services | `modules/[feature]/services/` | 100 |
| Repositories | `modules/[feature]/repositories/` | 100 |
| Interfaces | `modules/[feature]/interfaces/` | 30 |
| Models | `modules/[feature]/models/` | 50 |
| Shared | `core/{services,interfaces,models}/` | - |

**NEVER use flat `src/` structure - always `modules/[feature]/`**

---

## Critical Rules (MANDATORY)

| Rule | Value |
|------|-------|
| File limit | 100 lines (split at 90) |
| Routes | < 50 lines, delegate to services |
| Interfaces | `interfaces/` directory ONLY |
| Docstrings | Every public function documented |
| Type hints | MANDATORY on all signatures |
| Protocols | Use `typing.Protocol` for interfaces |
| Small interfaces | 1-3 methods max |

---

## Reference Guide

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **SOLID Principles** | [principles.md](references/principles.md) | Quick reference for all 5 principles |
| **Patterns & Structure** | [patterns.md](references/patterns.md) | Directory layout, testing, typing |

---

## Forbidden

| Anti-Pattern | Fix |
|--------------|-----|
| Files > 100 lines | Split at 90 |
| Interfaces in impl files | Move to `interfaces/` directory |
| Fat interfaces (4+ methods) | Split into small Protocols |
| Flat `src/` structure | Use `modules/[feature]/` |
| Concrete dependencies | Use Protocol + dependency injection |
| Missing type hints | Add type annotations to all signatures |
