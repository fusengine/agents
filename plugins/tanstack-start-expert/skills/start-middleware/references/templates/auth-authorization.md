---
name: auth-authorization
description: Auth middleware plus a permission-based authorization factory
keywords: auth, authorization, factory, middleware, session, permissions, rbac
---

# Auth + Authorization Middleware

A static `authMiddleware` loads the session from a server-trusted source and
injects it into context. A factory `authorizationMiddleware(permissions)`
composes on top of it for per-function permission checks.

## Usage

Copy into `src/middleware/auth.ts`. Adapt `auth` to your session library.

---

## Middleware

```tsx
// src/middleware/auth.ts
import { createMiddleware } from '@tanstack/react-start'
import { auth } from '~/lib/auth'

// Static base middleware — session loaded from the request cookie/headers
export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.getSession({ headers: request.headers })
    if (!session) throw new Error('Unauthorized')
    return next({ context: { session } }) // typed downstream
  },
)

type Permissions = Record<string, string[]>

// Factory — parameterized authorization, composes with authMiddleware
export function authorizationMiddleware(permissions: Permissions) {
  return createMiddleware({ type: 'function' })
    .middleware([authMiddleware]) // context.session already available
    .server(async ({ next, context }) => {
      const granted = await auth.hasPermission(context.session, permissions)
      if (!granted) throw new Error('Forbidden')
      return next()
    })
}
```

---

## Usage in a Server Function

```tsx
// src/utils/clients.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { authorizationMiddleware } from '~/middleware/auth'

export const getClients = createServerFn()
  .middleware([authorizationMiddleware({ client: ['read'] })])
  .handler(async ({ context }) => {
    // context.session is present and the user has client:read
    return db.clients.findMany({ where: { orgId: context.session.orgId } })
  })

export const deleteClient = createServerFn({ method: 'POST' })
  .middleware([authorizationMiddleware({ client: ['delete'] })])
  .validator((data: { id: string }) => data)
  .handler(async ({ data, context }) =>
    db.clients.delete({ where: { id: data.id, orgId: context.session.orgId } }),
  )
```

---

## Validating Client-Sent Context (trusted access check)

When a client middleware sends an id, verify membership before trusting it:

```tsx
// src/middleware/workspace.ts
import { createMiddleware } from '@tanstack/react-start'
import { z } from 'zod'
import { authMiddleware } from './auth'

export const workspaceMiddleware = createMiddleware({ type: 'function' })
  .middleware([authMiddleware]) // session is server-trusted
  .client(async ({ next, context }) =>
    next({ sendContext: { workspaceId: context.workspaceId } }),
  )
  .server(async ({ next, context }) => {
    const workspaceId = z.string().uuid().parse(context.workspaceId) // 1. shape
    const member = await db.memberships.find({                       // 2. access
      userId: context.session.userId,
      workspaceId,
    })
    if (!member) throw new Error('Not a member of this workspace')
    return next({ context: { workspaceId } })
  })
```
