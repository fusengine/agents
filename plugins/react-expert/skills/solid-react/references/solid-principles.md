---
name: solid-principles
description: SOLID overview - Quick reference for all 5 principles with React application
when-to-use: architecture decisions, code review, refactoring, learning SOLID
keywords: SOLID, principles, overview, architecture, react patterns
priority: high
related: single-responsibility.md, open-closed.md, liskov-substitution.md, interface-segregation.md, dependency-inversion.md
---

# SOLID Principles Overview for React 19

## Quick Reference

| Principle | React Application | Key Symptom of Violation |
|-----------|-------------------|--------------------------|
| **S**ingle Responsibility | 1 component = 1 UI, 1 hook = 1 logic | File > 90 lines |
| **O**pen/Closed | Extend via props/composition | Adding feature = modify existing |
| **L**iskov Substitution | Implementations respect contracts | Mock fails, real works |
| **I**nterface Segregation | Small, focused interfaces | Interface has 10+ methods |
| **D**ependency Inversion | Depend on abstractions | Direct `fetch()` in services |

---

## S - Single Responsibility

**Definition:** One file = One reason to change

**React Application:**
- 1 component = 1 UI concern (rendering only)
- 1 hook = 1 logic concern (data fetching OR state management)
- 1 service = 1 domain (users OR auth OR payments)

**File Limits:**
- Component: 50 lines
- Hook: 30 lines
- Service: 40 lines
- Any file: 100 lines (split at 90)

→ See `single-responsibility.md` for detailed guide
→ See `templates/` for code examples

---

## O - Open/Closed

**Definition:** Open for extension, closed for modification

**React Application:**
- Extend via variant props (`variant="primary"`)
- Use composition (slots: `header`, `footer`)
- Render props for custom rendering
- Strategy pattern for swappable behavior

→ See `open-closed.md` for detailed guide
→ See `templates/component.md` for extensible components

---

## L - Liskov Substitution

**Definition:** Subtypes must be substitutable for base types

**React Application:**
- All implementations respect interface contracts
- Mock and real services behave identically
- Consistent error handling across implementations
- Tests verify substitutability

→ See `liskov-substitution.md` for detailed guide
→ See `templates/interface.md` for contract definitions

---

## I - Interface Segregation

**Definition:** Many small interfaces beat one fat interface

**React Application:**
- Interfaces have < 5 methods
- Props are composable (`TypeA & TypeB`)
- Hooks return focused data
- Contexts split by concern (state vs actions)

→ See `interface-segregation.md` for detailed guide
→ See `templates/interface.md` for segregated interfaces

---

## D - Dependency Inversion

**Definition:** Depend on abstractions, not implementations

**React Application:**
- Services receive dependencies via factory
- No direct `fetch()` or `axios` in services
- Context provides services for DI
- Easy to mock for testing

→ See `dependency-inversion.md` for detailed guide
→ See `templates/factory.md` for DI patterns

---

## Decision Flow

```
Is file > 90 lines?
└─ Yes → Apply SRP (split)

Need to add feature?
└─ Will it modify existing code?
   └─ Yes → Apply OCP (composition)

Creating interface implementation?
└─ Apply LSP (respect contract)

Interface has > 5 methods?
└─ Yes → Apply ISP (split)

Service depends on concrete class?
└─ Yes → Apply DIP (inject abstraction)
```

---

## File Location Summary

| Type | Location |
|------|----------|
| Interfaces | `modules/[feature]/src/interfaces/` |
| Services | `modules/[feature]/src/services/` |
| Hooks | `modules/[feature]/src/hooks/` |
| Stores | `modules/[feature]/src/stores/` |
| Components | `modules/[feature]/components/` |
| Factories | `modules/cores/factories/` |

---

## Where to Find Code Templates?

All templates in `references/templates/`:

| Template | Purpose |
|----------|---------|
| `component.md` | Component patterns |
| `hook.md` | Hook patterns |
| `service.md` | Service with DI |
| `store.md` | Zustand stores |
| `interface.md` | Interface definitions |
| `validator.md` | Zod schemas |
| `factory.md` | Factory/DI patterns |
| `adapter.md` | Adapter patterns |
| `error.md` | Error classes |
| `test.md` | Test patterns |
