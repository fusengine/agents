---
name: server-fn-template
applies-to: "**/src/modules/**/functions/*.ts"
description: createServerFn template - validated server-only RPC (< 40 lines)
---

# Server Function (< 40 lines)

Server functions are type-safe RPCs. On the client, a call becomes a same-origin
fetch; on the server it runs directly. Put DB/secret access here, never in a
bare loader.

## GET with Validator

```typescript
// src/modules/users/src/functions/users.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { userRepo } from '../server/user-repo'
import type { GetUserPayload } from '../interfaces/user.interface'

/**
 * Fetch a user by ID.
 *
 * @param data - Lookup payload with the user id
 * @returns The user view, or throws notFound()
 */
export const getUser = createServerFn({ method: 'GET' })
  .validator((data: GetUserPayload) => data)
  .handler(async ({ data }) => userRepo.findById(data.id))
```

## POST with Zod

```typescript
// src/modules/users/src/functions/create-user.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { CreateUserSchema } from '../validators/user.validator'
import { userRepo } from '../server/user-repo'

/**
 * Create a user from validated input.
 *
 * @returns The created user view
 */
export const createUser = createServerFn({ method: 'POST' })
  .validator(CreateUserSchema)
  .handler(async ({ data }) => userRepo.create(data))
```

## Redirect / Not Found

```typescript
import { createServerFn } from '@tanstack/react-start'
import { redirect, notFound } from '@tanstack/react-router'
import { getCurrentUser } from '../server/session'

/** Guard: throw a redirect when unauthenticated. */
export const requireAuth = createServerFn().handler(async () => {
  const user = await getCurrentUser()
  if (!user) throw redirect({ to: '/login' })
  return user
})
```

---

## Rules

- Max 40 lines.
- Always `.validator()` before `.handler()` — inputs cross the network.
- Import server-only internals from `../server/`, keep them out of client code.
- Read `process.env` **inside** `.handler()`, never at module scope.
- Payload/return types must be serializable (strict mode).
- File name ends in `.functions.ts` — safe to import from anywhere.
