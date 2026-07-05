---
name: single-responsibility
applies-to: "**/src/routes/**/*.tsx, **/src/routes/**/*.ts, **/src/modules/**/*.ts, **/src/modules/**/*.tsx"
description: SRP for TanStack Start - line limits and split strategy for routes, loaders, server functions
when-to-use: file too long, route doing too much, refactoring, code organization
keywords: single responsibility, SRP, splitting, lines, routes, server functions, loaders
priority: high
related: architecture-patterns.md, templates/route.md, templates/server-fn.md
---

# Single Responsibility Principle (SRP) — Start

**One file = one reason to change.** Load when a route or server function grows.

## Symptoms of Violation

1. **File exceeds 90 lines** → trigger a split.
2. A route file declares types, runs a DB query, AND renders UI.
3. More than 15 imports, or more than 5 exports.
4. `process.env` / DB access sitting directly in a `loader`.

## Line Limits by Type

| File Type | Max Limit | Split Threshold |
|-----------|-----------|-----------------|
| Route component (`src/routes/*.tsx`) | 50 lines | 40 lines |
| Root route (`__root.tsx`) | 60 lines | 50 lines |
| Server function (`*.functions.ts`) | 40 lines | 35 lines |
| Server-only helper (`*.server.ts`) | 80 lines | 70 lines |
| Hook | 30 lines | 25 lines |
| Service | 40 lines | 35 lines |
| Any other file | 100 lines | 90 lines |

---

## How to Split — Modular Paths

```text
src/modules/[feature]/
├── components/               # UI (< 50 lines each)
└── src/
    ├── interfaces/           # Types ONLY  →  xxx.interface.ts
    ├── functions/            # createServerFn wrappers  →  xxx.functions.ts
    ├── server/               # server-only helpers  →  xxx.server.ts
    ├── services/             # business logic  →  xxx.service.ts
    ├── hooks/                # client hooks  →  useXxx.ts
    ├── validators/           # Zod schemas  →  xxx.validator.ts
    └── constants/            # xxx.constants.ts
```

### Split Example

Before — one 150-line `src/routes/dashboard.tsx` mixing everything:

```text
src/routes/dashboard.tsx → types + DB query in loader + validation + UI
```

After — responsibilities separated:

```text
src/modules/dashboard/src/interfaces/dashboard.interface.ts  → Types
src/modules/dashboard/src/server/dashboard.server.ts         → DB queries
src/modules/dashboard/src/functions/dashboard.functions.ts   → createServerFn
src/modules/dashboard/components/DashboardView.tsx           → UI only
src/routes/dashboard.tsx                                     → loader + orchestration
```

---

## File Location Rules

| Content Type | Location |
|--------------|----------|
| Types/Interfaces | `src/modules/[feature]/src/interfaces/` |
| Server functions (`createServerFn`) | `src/modules/[feature]/src/functions/` |
| Server-only helpers | `src/modules/[feature]/src/server/` |
| Business logic | `src/modules/[feature]/src/services/` |
| Client hooks | `src/modules/[feature]/src/hooks/` |
| Validation | `src/modules/[feature]/src/validators/` |
| UI Components | `src/modules/[feature]/components/` |
| Routes | `src/routes/` (orchestrator only) |

---

## Routes Should ONLY

- Import from `modules/` and call server functions in the `loader`.
- Compose components and wire `useLoaderData()`.

## Routes Should NEVER

- Declare types (→ `interfaces/`).
- Run DB / secrets / filesystem in a bare loader (→ `createServerFn`).
- Hold complex state (→ `hooks/`).

Templates: `templates/route.md`, `templates/server-fn.md`.
