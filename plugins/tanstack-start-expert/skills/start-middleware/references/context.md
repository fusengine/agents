---
name: context
description: Sharing context through the chain and between client and server
when-to-use: Passing data via next({context}), sendContext client↔server, setting headers or custom fetch
keywords: context, next, sendContext, headers, customFetch, security, validation
priority: high
requires: types.md
related: global.md
---

# Context & Data Transfer

## Overview

Middleware shares data by passing an object to `next()`. Context stays on one
side (server or client) unless you explicitly transfer it with `sendContext`.

---

## Passing Context Down the Chain

```tsx
const auth = createMiddleware().server(async ({ next, request }) => {
  const session = await getSession(request.headers)
  return next({ context: { session } })
})

const role = createMiddleware()
  .middleware([auth])
  .server(async ({ next, context }) => {
    console.log(context.session) // typed, merged from parent
    return next()
  })
```

Properties passed to `context` merge into the parent context for downstream
middleware and the handler.

---

## Client → Server (sendContext)

Client context is **not** transmitted by default (avoids large payloads). Opt in:

```tsx
const workspace = createMiddleware({ type: 'function' })
  .client(async ({ next, context }) =>
    next({ sendContext: { workspaceId: context.workspaceId } }),
  )
  .server(async ({ next, context }) => {
    // context.workspaceId is present — but it is UNTRUSTED input
    return next()
  })
```

---

## sendContext Security (CRITICAL)

`sendContext` arrives on the server as untrusted client input. Parsing its shape
is **not** authorization.

```tsx
.middleware([authMiddleware]) // session from cookie, NOT from sendContext
.server(async ({ next, context }) => {
  const workspaceId = z.string().uuid().parse(context.workspaceId) // shape
  const member = await db.memberships.find({          // access check
    userId: context.session.userId,
    workspaceId,
  })
  if (!member) throw new Error('Not a member of this workspace')
  return next({ context: { workspaceId } })
})
```

Always derive the session from a server-trusted source. Anything the client can
send, the client can lie about.

---

## Server → Client (sendContext in .server)

```tsx
const timer = createMiddleware({ type: 'function' })
  .server(async ({ next }) => next({ sendContext: { serverTime: new Date() } }))

const logger = createMiddleware({ type: 'function' })
  .middleware([timer])
  .client(async ({ next }) => {
    const result = await next()
    console.log(result.context.serverTime) // typed, from server
    return result
  })
```

---

## Client Request Modification

`.client()` runs in a different context than the server — modify the outgoing
request through `next()`:

| Action | How |
|--------|-----|
| Add headers | `next({ headers: { Authorization: `Bearer ${t}` } })` |
| Custom fetch | `next({ fetch: customFetch })` |

Header merge order (later wins): earlier middleware → later middleware →
call-site headers. Fetch precedence: call site → later middleware → earlier
middleware → `createStart` global → default fetch.

→ See [client-middleware.md](templates/client-middleware.md)

---

## Best Practices

### DO
- Validate shape AND access for every client-sent id
- Keep sessions server-derived (cookie + DB), never from `sendContext`
- Use `sendContext` sparingly — only transfer what the other side needs

### DON'T
- Treat a parsed UUID as authorized
- Send large or sensitive payloads through `sendContext`

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using client id as a query key unchecked | Add a membership/role check |
| Expecting client context server-side by default | Opt in with `sendContext` |

---

## Related References

- [types.md](types.md) — the two middleware types
- [global.md](global.md) — global registration

## Related Templates

- [client-middleware.md](templates/client-middleware.md) — headers + custom fetch
- [auth-authorization.md](templates/auth-authorization.md) — trusted session pattern
