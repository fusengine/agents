---
name: security
description: Auth enforcement, CSRF, and caching for server functions
when-to-use: Protecting a server function, configuring CSRF, setting Cache-Control on responses
keywords: auth, csrf, createCsrfMiddleware, cache-control, same-origin, beforeLoad, security
priority: high
requires: creating.md
related: calling.md
---

# Server Function Security

## Overview

Server functions are same-origin RPC endpoints reachable independently of the
route that renders the calling UI. Security lives on the endpoint, not the
route.

---

## The Endpoint Is the Boundary (CRITICAL)

A `beforeLoad` redirect guards the route's UI. It does **not** run when the RPC
is called directly, so it never protects the data.

```tsx
// WRONG — route guard does not reach the handler
const getMyOrders = createServerFn({ method: 'GET' })
  .handler(async () => db.orders.findMany()) // anyone can call the RPC

// CORRECT — auth enforced on the handler via middleware
const getMyOrders = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) =>
    db.orders.findMany({ where: { userId: context.session.userId } }),
  )
```

Attach `authMiddleware` (or an in-handler session check) to **every** function
that reads or writes private data. See the start-middleware skill for the
`authMiddleware` factory.

---

## CSRF Protection

Start provides `createCsrfMiddleware()` and installs it **automatically** for
server functions **unless** you define a custom `src/start.ts`. If you do, add
it explicitly:

```tsx
// src/start.ts
import { createStart, createCsrfMiddleware } from '@tanstack/react-start'

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
})

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware],
}))
```

It verifies same-origin browser metadata (`Sec-Fetch-Site`, `Origin`,
`Referer`). For a different public origin, pass
`createCsrfMiddleware({ origin: 'https://app.example.com' })`.

---

## Cache-Control for Authenticated Responses (CRITICAL)

`Cache-Control: public` lets any shared CDN/proxy serve one user's response to
the next — a cross-tenant leak for identity-dependent data.

| Response depends on… | Header |
|----------------------|--------|
| Nothing (byte-identical for all) | `public, max-age=N` |
| Session/user/tenant | `private, max-age=N` + `Vary: Cookie, Authorization` |
| Sensitive data | `no-store` |

```tsx
import { setResponseHeaders } from '@tanstack/react-start/server'

setResponseHeaders(new Headers({
  'Cache-Control': 'private, max-age=60',
  Vary: 'Cookie, Authorization',
}))
```

---

## Server Context Utilities

Available from `@tanstack/react-start/server` inside a handler:

| Utility | Purpose |
|---------|---------|
| `getRequest()` | Full `Request` object |
| `getRequestHeader(name)` | Read one request header |
| `setResponseHeader(name, value)` | Set one response header |
| `setResponseHeaders(headers)` | Set multiple via a `Headers` object |
| `setResponseStatus(code)` | Set the HTTP status code |

---

## Best Practices

### DO
- Enforce auth in the handler/middleware of every private-data function
- Add CSRF middleware explicitly when you own `src/start.ts`
- Default cache headers to `private`/`no-store` for identity-dependent data

### DON'T
- Treat `beforeLoad` as the data boundary
- Use `Cache-Control: public` on anything reading a session or cookie
- Read `process.env` at module scope (leaks to client, undefined on edge)

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Only the route is guarded | Add `authMiddleware` to the function |
| Custom `src/start.ts`, no CSRF | Add `createCsrfMiddleware()` explicitly |
| Auth'd data cached `public` | Switch to `private` + `Vary`, or `no-store` |

---

## Related References

- [creating.md](creating.md) — building the function
- [calling.md](calling.md) — invoking safely

## Related Templates

- [crud-server-functions.md](templates/crud-server-functions.md) — auth in a handler
