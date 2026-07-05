---
name: data-boundary
description: Why route guards are UX, and where auth must actually be enforced in Start
when-to-use: Before writing ANY auth code — understanding the security boundary
keywords: beforeLoad, server-function, authorization, boundary, middleware, security
priority: high
source: https://tanstack.com/start/latest/docs/framework/react/guide/authentication-server-primitives
---

# The Data/API Boundary

## Overview

Authentication in Start has two distinct layers. Confusing them is the most common and most dangerous mistake:

- **Route/UI layer** (`beforeLoad`, `redirect`) — keeps users out of *screens* they can't use. This is **UX**.
- **Data/API layer** (server-function handler/middleware) — authorizes the actual read/write of private data. This is the **security boundary**.

---

## Key Concepts

| Layer | Primitive | Protects | Bypassable? |
|-------|-----------|----------|-------------|
| Route/UI | `beforeLoad` + `redirect` | The rendered screen | **Yes** — the server fn is still callable directly |
| Data/API | `authMiddleware` in handler | The data itself | No — every call path hits it |

**A route guard is NOT a data authorization boundary.** Server functions and server routes are API endpoints reachable independently of the route that renders their caller. Auth must be enforced in the handler (or its middleware) for the endpoint that touches private data.

---

## Why beforeLoad is not enough

```
User navigates to /admin
  └─ beforeLoad redirects if not admin  ← only stops the *navigation*

Attacker POSTs directly to the deleteUser server fn
  └─ no route was ever loaded            ← beforeLoad never runs
  └─ ONLY authMiddleware in the handler stops this
```

The server fn's generated RPC endpoint exists regardless of whether the UI route was visited. Craft the request, replay a captured one, or call from another origin — the guard is irrelevant.

---

## Core Pattern

```ts
// Enforce auth INSIDE the endpoint that serves the data.
export const deleteUser = createServerFn({ method: 'POST' })
  .middleware([authMiddleware]) // ← the real boundary
  .handler(async ({ context, data }) => {
    if (context.session.role !== 'admin') throw new Error('Forbidden')
    return db.users.delete(data.id)
  })
```

→ See [authed-middleware.md](templates/authed-middleware.md) for the full `authMiddleware` + `_authed` combo

---

## Best Practices

### DO
- Put `authMiddleware` on EVERY server fn that reads/writes private data
- Use `beforeLoad` in addition, purely to improve UX (avoid dead-end screens)
- Authorize inside the handler even when a role check already happened in `beforeLoad`

### DON'T
- Assume a protected route means its server fns are protected
- Ship a mutation server fn without in-handler authorization

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Only `beforeLoad` guards an admin action | Add `authMiddleware` + role check in the server-fn handler |
| Server fn trusts `context` set by the client | Derive identity from the session cookie server-side, not client input |

---

## Related References

- [route-protection.md](route-protection.md) — the UX layer done right
- [sessions-cookies.md](sessions-cookies.md) — how the handler identifies the user
