---
name: types
description: Request vs server function middleware, chaining, and attachment
when-to-use: Choosing a middleware type, composing chains, attaching to functions or routes
keywords: createMiddleware, request, function, type, chain, middleware, validator, attach
priority: high
related: context.md, global.md
---

# Middleware Types & Chaining

## Overview

There are two middleware types. Request middleware runs on every server request;
server function middleware runs only for `createServerFn` calls and adds a
client phase and input validation.

---

## Choosing a Type

| Need | Type |
|------|------|
| Logic on ALL requests (SSR, routes, functions) | `createMiddleware()` (request) |
| Logic for server functions only | `createMiddleware({ type: 'function' })` |
| Validate function input in middleware | Server function middleware (`.validator()`) |
| Run code on the client before/after the RPC | Server function middleware (`.client()`) |

Request middleware cannot depend on server function middleware. Server function
middleware can depend on both.

---

## Method Order (enforced by TypeScript)

```
.middleware([...])  →  .validator(schema)  →  .client(fn)  →  .server(fn)
```

Any other order is a compile error. Request middleware only exposes
`.middleware()` and `.server()`.

---

## Server Function Middleware Phases

```tsx
const auth = createMiddleware({ type: 'function' })
  .client(async ({ next }) => {
    // runs on client BEFORE the RPC
    const result = await next()
    // runs on client AFTER the response
    return result
  })
  .server(async ({ next, context }) => {
    // runs on server BEFORE the handler
    const result = await next()
    // runs on server AFTER the handler
    return result
  })
```

You **must** call `next()` to progress the chain. Returning without it
short-circuits.

---

## Composing (Dependencies)

```tsx
const logging = createMiddleware().server(({ next }) => next())

const auth = createMiddleware()
  .middleware([logging]) // logging runs first
  .server(({ next }) => next())
```

---

## Attaching Middleware

| Target | How |
|--------|-----|
| Server function | `createServerFn().middleware([auth]).handler(...)` |
| All route handlers | `server: { middleware: [auth], handlers: {...} }` |
| Specific route handler | `createHandlers({ POST: { middleware: [auth], handler } })` |

→ Route attachment details live in the start-server-routes skill.

---

## Best Practices

### DO
- Default to request middleware for logging/observability across all requests
- Use function middleware when you need `.client()` or `.validator()`
- Keep the chain order `middleware → validator → client → server`

### DON'T
- Depend on a function middleware from a request middleware
- Forget to call `next()` (silently short-circuits the chain)

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `.server().client()` order | Reorder to `.client().server()` |
| Missing `next()` | Return `next()` to continue the chain |
| Function middleware on SSR-wide logic | Use a request middleware instead |

---

## Related References

- [context.md](context.md) — passing data through the chain
- [global.md](global.md) — global registration and order

## Related Templates

- [auth-authorization.md](templates/auth-authorization.md) — composed auth chain
