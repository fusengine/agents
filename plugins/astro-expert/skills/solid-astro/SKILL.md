---
name: solid-astro
description: Use when applying SOLID principles and clean architecture to Astro projects. Enforces files < 100 lines, src/interfaces/ for types, JSDoc on all exports, modular directory structure, and DRY enforcement.
versions:
  astro: "6"
user-invocable: true
references: references/solid-principles.md, references/file-limits.md, references/interfaces.md, references/architecture.md, references/dry-enforcement.md, references/jsdoc.md, references/templates/component.md, references/templates/layout.md, references/templates/service.md, references/templates/interface.md
related-skills: astro-6, astro-content, astro-styling, astro-i18n
---

# SOLID Astro — Modular Architecture

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze project structure, naming, and existing patterns
2. **fuse-ai-pilot:research-expert** - Verify Astro 6 architecture best practices via Context7/Exa
3. **mcp__context7__query-docs** - Check Astro component API and TypeScript integration

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Codebase Analysis (MANDATORY)

Before ANY implementation:

1. Explore `src/` directory to understand existing architecture
2. Read existing similar files to follow established naming and patterns
3. Grep for similar function/component names before creating new ones
4. Identify where interfaces, utilities, and shared logic live

---

## DRY Enforcement (MANDATORY)

Before writing ANY new code:

1. **Grep for similar logic** — function names, class patterns, component names
2. Check `src/lib/` for existing utilities
3. Check `src/components/` for existing UI components
4. If logic appears in 2+ places → extract to `src/lib/`
5. If types appear in 2+ files → move to `src/interfaces/`

---

## Absolute Rules

- Files < 100 lines — split at 90
- All types in `src/interfaces/` — never in component files
- JSDoc mandatory on all exported functions
- No business logic in `src/pages/`

See `references/architecture.md`, `references/file-limits.md`, `references/solid-principles.md`.

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| SOLID principles | [solid-principles.md](references/solid-principles.md) | Architecture decisions |
| File limits | [file-limits.md](references/file-limits.md) | When and how to split files |
| Interfaces | [interfaces.md](references/interfaces.md) | TypeScript type organization |
| Architecture | [architecture.md](references/architecture.md) | Directory structure |
| DRY enforcement | [dry-enforcement.md](references/dry-enforcement.md) | Avoiding duplication |
| JSDoc | [jsdoc.md](references/jsdoc.md) | Documentation standards |

### Templates

| Template | When to Use |
|----------|-------------|
| [component.md](references/templates/component.md) | Astro component with props + JSDoc |
| [layout.md](references/templates/layout.md) | Layout component with slots |
| [service.md](references/templates/service.md) | Data fetching service function |
| [interface.md](references/templates/interface.md) | TypeScript interface file |

---

## Forbidden

- Files > 100 lines (split at 90)
- TypeScript interfaces in component `.astro` files
- Business logic in `src/pages/` files
- Direct CMS/API calls in components (use `src/lib/` services)
- Copy-pasting logic instead of extracting shared function
- Missing JSDoc on exported functions, components, and types
- `any` TypeScript type
