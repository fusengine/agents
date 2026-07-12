---
name: architecture-patterns
applies-to: "**/src/routes/**/*.tsx, **/src/router.tsx, **/src/modules/**/*.ts, **/src/modules/**/*.tsx"
description: TanStack Start modular architecture - route tree, feature modules, cores, generated files
when-to-use: project setup, architecture decisions, code organization, directory layout
keywords: architecture, modular, structure, route tree, modules, cores, tanstack start
priority: high
related: single-responsibility.md, templates/route.md, templates/server-fn.md
---

# Architecture Patterns — TanStack Start

Load when deciding where a directory or file belongs in a Start project.

## Top-Level Layout

```text
src/
├── routes/                    # File-based routes (owned by the plugin's generator)
│   ├── __root.tsx             # Document shell: HeadContent, Outlet, Scripts
│   ├── index.tsx
│   └── [feature]/...
├── modules/                   # ALL business logic here
│   ├── cores/                 # Shared, global to the app
│   │   ├── components/        # Shared UI (Button, Modal)
│   │   ├── interfaces/        # Shared contracts (HttpClient, Db)
│   │   ├── lib/               # Utilities, formatters
│   │   └── server/            # Shared server-only helpers (db client)
│   └── [feature]/
│       ├── components/
│       └── src/{interfaces,functions,server,services,hooks,validators}
├── router.tsx                 # getRouter() factory
├── routeTree.gen.ts           # GENERATED — never edit by hand
└── env.d.ts                   # ImportMetaEnv + ProcessEnv typings
```

---

## Generated Files (Do Not Touch)

`src/routeTree.gen.ts` is produced by the `tanstackStart()` Vite plugin every
dev/build. Hand edits are overwritten and break route type inference. To change
routes, add/rename files in `src/routes/`. Add it to lint-ignore, not to reviews.

---

## Feature Module Structure

Each feature is self-contained:

```text
src/modules/[feature]/
├── components/          # UI (< 50 lines each)
└── src/
    ├── interfaces/      # Types ONLY
    ├── functions/       # createServerFn wrappers (client-safe to import)
    ├── server/          # server-only helpers (*.server.ts)
    ├── services/        # business logic
    ├── hooks/           # client hooks wrapping server functions
    └── validators/      # Zod schemas (client-safe)
```

The `functions/` vs `server/` split mirrors the official Start convention:
`.functions.ts` exports `createServerFn` wrappers (safe to import anywhere);
`.server.ts` holds server-only internals imported only inside handlers.

---

## Import Rules

```typescript
// 1. Route imports module components + functions
// src/routes/users.tsx
import { UserList } from '~/modules/users/components/UserList'
import { getUsers } from '~/modules/users/src/functions/users.functions'

// 2. Feature imports cores (shared)
import { Button } from '~/modules/cores/components/Button'

// 3. Feature imports its own src
import type { User } from '../src/interfaces/user.interface'

// 4. FORBIDDEN: feature importing another feature
import { OrderList } from '~/modules/orders/components/OrderList' // ❌ move to cores/
```

---

## Route Composition (Open/Closed)

```typescript
// src/routes/users.$id.tsx — extend by adding files, not editing the tree
export const Route = createFileRoute('/users/$id')({
  loader: ({ params }) => getUser({ data: { id: params.id } }),
  component: UserPage,
})
```

Root context is typed once with `createRootRouteWithContext<RouterContext>()`
and extended per route via `beforeLoad` — never by widening one giant type.

---

## State Management Strategy

| State Type | Solution |
|------------|----------|
| Server state | Route loaders + `createServerFn` (or TanStack Query) |
| URL state | TanStack Router search params (`validateSearch`) |
| Component state | `useState` |
| Global UI state | Zustand |

---

## Forbidden Patterns

| Pattern | Why | Solution |
|---------|-----|----------|
| Editing `routeTree.gen.ts` | Generated | Add files in `src/routes/` |
| Types in a route file | Violates SRP | → `interfaces/` |
| DB/secrets in a loader | Leaks to client | → `createServerFn` |
| Feature → feature import | Tight coupling | → `cores/` |
| Barrel exports | Bundle bloat | Direct imports |
