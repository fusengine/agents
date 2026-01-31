---
name: custom-hooks-patterns
description: Patterns for custom React hooks - naming, composition, return values
when-to-use: reusable logic, shared state patterns, encapsulated effects
keywords: custom hooks, composition, patterns, SOLID
priority: high
related: templates/custom-hooks.md
---

# Custom Hooks Patterns

## Overview

Custom hooks are JavaScript functions that encapsulate reusable logic and follow React's Hooks rules.

**Naming convention:** Always prefix with `use` (e.g., `useUser`, `useFetch`)

---

## Purpose

Custom hooks provide:
- **Reusability** - Share logic across multiple components
- **Separation of concerns** - Keep components focused on rendering
- **Testability** - Test logic independently from UI
- **Composition** - Combine multiple hooks for complex behavior

---

## Return Value Patterns

| Pattern | When to Use | Example |
|---------|-------------|---------|
| **Single Value** | Read-only data, no actions | `useWindowWidth()` |
| **Tuple** | React convention (2-3 values) | `useToggle()`, `useLocalStorage()` |
| **Object** | Multiple values/methods (3+) | `useFetch()`, `useUser()` |

---

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Entity-based | Manages specific resource | `useUser()`, `usePosts()` |
| Functionality | Provides utility | `useDebounce()`, `useMediaQuery()` |
| Action-based | Performs operation | `useFetch()`, `useToggle()` |

---

## SOLID Compliance

1. **Single Responsibility** - One purpose per hook (max 30 lines)
2. **Types in interfaces/** - All types in separate interface files
3. **JSDoc mandatory** - Document every exported hook
4. **Location:**
   - Global: `modules/cores/hooks/`
   - Feature: `modules/[feature]/src/hooks/`

---

## Composition Patterns

| Pattern | Description |
|---------|-------------|
| **Combining hooks** | Build complex hooks from simpler ones |
| **Hook factories** | Create hooks dynamically based on config |
| **Parameterized hooks** | Accept options for flexible behavior |

---

## Anti-Patterns

1. **Multiple responsibilities** - Hook doing too many things
2. **Files >30 lines** - Split into multiple hooks
3. **Types in hook file** - Move to interfaces/
4. **Missing JSDoc** - All exports must be documented

---

## Key Points

- Name with `use` prefix
- Max 30 lines per hook
- Types in `interfaces/`
- JSDoc on all exports
- Test with `renderHook` from Testing Library
- Follow Rules of Hooks (top level only)

→ See `templates/custom-hooks.md` for complete implementations
