---
name: solid-principles
applies-to: "**/src/routes/**/*.tsx, **/src/routes/**/*.ts, **/src/modules/**/*.ts, **/src/modules/**/*.tsx"
description: SOLID overview for TanStack Start - the 5 principles applied to routes, server functions, modules
when-to-use: architecture decisions, code review, refactoring, learning SOLID in a Start project
keywords: SOLID, principles, overview, tanstack start, routes, server functions
priority: high
related: single-responsibility.md, interface-segregation.md, dependency-inversion.md, architecture-patterns.md
---

# SOLID Overview — TanStack Start

Load when making architecture or code-review decisions on a Start project.

| Principle | In TanStack Start terms |
|-----------|-------------------------|
| **S**ingle Responsibility | A route file orchestrates; loaders fetch; server functions hold server logic; components render. One reason to change each. |
| **O**pen/Closed | Extend routes via composition (nested routes, layout routes, `context`), not by editing generated `routeTree.gen.ts` or bloating one route. |
| **L**iskov Substitution | Any service injected into a `createServerFn` handler must honor its interface contract, so implementations stay swappable (real DB vs in-memory test double). |
| **I**nterface Segregation | Loader data, server-function payloads, and router `context` each get a focused type — never one fat "everything" interface. |
| **D**ependency Inversion | Handlers depend on abstractions in `src/interfaces/`, not concrete DB clients; wire the concrete impl at the edge. |

---

## The Start-Specific Overlay

SOLID on Start has one extra axis the generic version lacks: **the execution
boundary**. Every file answers "server, client, or isomorphic?"

- **Isomorphic by default** — route files, loaders, components, plain utilities.
- **Server-only** — anything touching DB, secrets, filesystem → `createServerFn`
  or `createServerOnlyFn`.
- **Client-only** — DOM / `localStorage` / analytics → `createClientOnlyFn` or
  `<ClientOnly>`.

Mixing boundaries in one file is the most common SOLID violation in Start. Keep
server logic in `*.functions.ts` / `*.server.ts`, client logic in components.
Deep dive: the `start-execution-model` skill.

---

## Quick Decision Flow

```text
File > 90 lines?                  → single-responsibility.md (split)
Designing a payload / context?    → interface-segregation.md
Handler news up a DB client?      → dependency-inversion.md
Where does this directory go?     → architecture-patterns.md
Which side does this run on?      → start-execution-model skill
```

---

## Non-Negotiables

- Files < 100 lines (split at 90).
- Types only in `src/interfaces/`.
- JSDoc on every export.
- Never hand-edit `src/routeTree.gen.ts`.
- No feature→feature imports (route through `cores/`).
