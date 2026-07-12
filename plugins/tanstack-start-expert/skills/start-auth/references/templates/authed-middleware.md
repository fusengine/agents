---
name: authed-middleware
description: Complete _authed layout + authMiddleware + protected server function with RBAC
keywords: createMiddleware, authMiddleware, _authed, beforeLoad, redirect, RBAC, createServerFn
source: https://tanstack.com/start/latest/docs/framework/react/guide/authentication-server-primitives
---

# Authed Layout + Middleware

## Overview

The complete two-layer setup: a `_authed` layout route for UX (redirect unauthenticated users), and an `authMiddleware` that is the real security boundary on every private server function. Includes an RBAC (role) check done in BOTH layers correctly.

---

## Prerequisites

- `@tanstack/react-start`, `@tanstack/react-router` installed
- A session store (`db.sessions`) and a way to read the session token (see session-and-csrf template)

---

## File: src/server/auth-middleware.ts

```ts
/**
 * THE SECURITY BOUNDARY. Attach to every server fn that reads/writes private data.
 * Centralizes session lookup so each handler receives a typed, verified session.
 */
import { createMiddleware } from '@tanstack/react-start'
import { readSessionToken } from './session'
import { db } from '~/db'

export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const token = readSessionToken() // reads the cookie per request
    const session = token ? await db.sessions.findValid(token) : null
    if (!session) throw new Error('Unauthorized')
    return next({ context: { session } })
  },
)

/** Role gate composed on top of authMiddleware. */
export function requireRole(role: 'admin' | 'moderator' | 'user') {
  return createMiddleware({ type: 'function' })
    .middleware([authMiddleware])
    .server(async ({ next, context }) => {
      if (context.session.role !== role) throw new Error('Forbidden')
      return next()
    })
}
```

---

## File: src/server/auth.functions.ts

```ts
/**
 * getCurrentUser is safe to call from beforeLoad (returns null when anonymous).
 * deleteUser is a privileged mutation — authorized in-handler, NOT by any route guard.
 */
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { authMiddleware, requireRole } from './auth-middleware'
import { readSessionToken } from './session'
import { db } from '~/db'

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(async () => {
  const token = readSessionToken()
  const session = token ? await db.sessions.findValid(token) : null
  return session ? db.users.findById(session.userId) : null
})

export const deleteUser = createServerFn({ method: 'POST' })
  .middleware([requireRole('admin')]) // ← real authorization
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    return db.users.delete(data.id)
  })
```

---

## File: src/routes/_authed.tsx

```tsx
/**
 * UX layer: redirect anonymous users to /login and expose the user to children.
 * This does NOT protect deleteUser — that is authorized in its own handler.
 */
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getCurrentUser } from '~/server/auth.functions'

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUser()
    if (!user) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
    return { user } // children read via Route.useRouteContext()
  },
})
```

---

## File: src/routes/_authed/admin.tsx

```tsx
/**
 * Nested RBAC guard for UX. The matching server fn (deleteUser) still enforces
 * requireRole('admin') independently.
 */
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin')({
  beforeLoad: ({ context }) => {
    if (context.user.role !== 'admin') throw redirect({ to: '/unauthorized' })
  },
  component: AdminPanel,
})

function AdminPanel() {
  const { user } = Route.useRouteContext()
  return <h1>Admin — {user.email}</h1>
}
```

---

## Notes

- `deleteUser` is safe even if an attacker bypasses the UI: `requireRole('admin')` runs on every invocation.
- `readSessionToken()` reads the cookie per request — never cache the token at module scope.
- Keep `getCurrentUser` returning `null` (not throwing) so `beforeLoad` can branch cleanly.
