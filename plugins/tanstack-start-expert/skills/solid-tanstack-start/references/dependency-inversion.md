---
name: dependency-inversion
applies-to: "**/src/modules/**/functions/*.ts, **/src/modules/**/services/*.ts, **/src/modules/**/server/*.ts"
description: DIP for TanStack Start - server function handlers depend on abstractions, not concrete clients
when-to-use: handler news up a DB client, tight coupling, testing server functions, mocking
keywords: dependency inversion, DIP, injection, abstraction, server function, service, testing
priority: high
related: interface-segregation.md, single-responsibility.md, templates/server-fn.md
---

# Dependency Inversion Principle (DIP) — Start

**Depend on abstractions, not implementations.** Load when a `createServerFn`
handler or service instantiates a concrete DB/HTTP client directly.

## The Problem

```typescript
// ❌ Handler is welded to Prisma — untestable, hard to swap
export const getUser = createServerFn({ method: 'GET' })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const prisma = new PrismaClient() // concrete, per-call, no seam
    return prisma.user.findUnique({ where: { id: data.id } })
  })
```

## The Fix — Abstraction + Thin Server Layer

Define the contract in `interfaces/`, implement it once in `server/`, and let the
handler call the abstraction:

```typescript
// src/modules/users/src/interfaces/user-repo.interface.ts
import type { User } from './user.interface'

/** Persistence contract for users — any impl must satisfy this. */
export interface UserRepo {
  findById(id: string): Promise<User | null>
}
```

```typescript
// src/modules/users/src/server/user-repo.ts
import '@tanstack/react-start/server-only' // guarantees server-only
import type { UserRepo } from '../interfaces/user-repo.interface'
import { db } from '~/modules/cores/server/db'

/** Concrete repo backed by the shared DB client. */
export const userRepo: UserRepo = {
  findById: (id) => db.user.findUnique({ where: { id } }),
}
```

```typescript
// src/modules/users/src/functions/users.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { userRepo } from '../server/user-repo'

/** Fetch a user by ID (server-only via createServerFn). */
export const getUser = createServerFn({ method: 'GET' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => userRepo.findById(data.id))
```

---

## Why This Respects the Boundary

- The **handler** depends on `UserRepo` (an abstraction), not Prisma.
- The concrete impl lives in a `*.server.ts` / `server-only`-marked file, so it
  can never be pulled into a client bundle.
- Tests inject a fake `UserRepo` — no DB, no network, deterministic.

## Testing With an Injected Double

```typescript
const fakeRepo: UserRepo = { findById: async () => ({ id: '1', email: 'a@b.c' }) }
// call the handler logic against fakeRepo — no real DB needed
```

---

## Rules

- Contracts live in `src/interfaces/`.
- Concrete clients live in `server/` behind `server-only`.
- Handlers import the abstraction, wired at the edge.
- Never `new SomeClient()` inside a handler on every call.

Template: `templates/server-fn.md`.
