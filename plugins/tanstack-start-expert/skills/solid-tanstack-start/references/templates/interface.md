---
name: interface-template
applies-to: "**/src/modules/**/interfaces/*.ts"
description: TypeScript interface template for Start boundary types (DB row, payload, view)
---

# Interfaces (types ONLY)

One file per concern in `src/modules/[feature]/src/interfaces/`. Keep DB shape,
network payloads, and view shape separate (see interface-segregation.md).

## Domain + Boundary Types

```typescript
// src/modules/users/src/interfaces/user.interface.ts

/** Full persisted row. Stays server-side. */
export interface User {
  id: string
  email: string
  passwordHash: string
  role: UserRole
  createdAt: string
}

/** Roles a user can hold. */
export type UserRole = 'admin' | 'member' | 'guest'

/** Client → server payload for getUser. */
export interface GetUserPayload {
  id: string
}

/** What the loader exposes to components (no secrets). */
export interface UserView {
  id: string
  email: string
  role: UserRole
  createdAt: string
}
```

## Repository Contract (for DIP)

```typescript
// src/modules/users/src/interfaces/user-repo.interface.ts
import type { User } from './user.interface'

/** Persistence contract — any implementation must satisfy it. */
export interface UserRepo {
  findById(id: string): Promise<User | null>
  create(input: Omit<User, 'id' | 'createdAt'>): Promise<User>
}
```

## Router Context

```typescript
// src/modules/cores/interfaces/session.interface.ts

/** Minimal authenticated session shared across all routes. */
export interface Session {
  userId: string
  email: string
}
```

---

## Rules

- No runtime code in these files — types/interfaces only.
- One responsibility per file.
- Import with `import type { ... }` so it erases at runtime.
- Never declare these inside a route or component file.
