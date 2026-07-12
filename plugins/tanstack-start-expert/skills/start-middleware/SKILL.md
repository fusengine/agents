---
name: start-middleware
description: >-
  Use when composing cross-cutting server logic in TanStack Start with
  createMiddleware — request vs server function middleware, chaining via
  .middleware([...]), shared context with next({ context }), client↔server
  sendContext, client middleware (.client), global middleware via createStart
  in src/start.ts, middleware factories for authorization, and
  staticFunctionMiddleware. Do NOT use for: defining the RPC itself (use
  start-server-functions), raw HTTP endpoints (use start-server-routes), or
  route-level UX guards (use router beforeLoad).
version: 1.0.0
user-invocable: true
references: references/types.md, references/context.md, references/global.md, references/templates/auth-authorization.md, references/templates/client-middleware.md
---

# TanStack Start Middleware

Middleware customizes the behavior of server functions and server routes. It is
composable — one middleware can depend on others to form an ordered chain.
Import `createMiddleware` from `@tanstack/react-start`. This skill targets
`@tanstack/react-start` **v1.166.2**.

## Agent Workflow (MANDATORY)

Before implementing, verify current APIs against Context7
(`/websites/tanstack_start_framework_react`) + Exa, then explore the target
codebase. After changes, run `fuse-ai-pilot:sniper`.

## Critical Rules (read first)

1. **TypeScript enforces method order:** `.middleware()` → `.validator()` →
   `.client()` → `.server()`. Any other order is a type error.
2. **Shape validation is NOT authorization.** A parsed UUID from `sendContext`
   is a well-formed identifier, not an authorized one. Always re-check access
   against the session principal before using a client-sent value as a query
   key, filter, or path param.
3. **Client context is not sent to the server by default.** You must opt in with
   `next({ sendContext })`. Anything the client sends, the client can lie about
   — derive the session from a server-trusted source (cookie + DB), never from
   `sendContext`.
4. **`.client()` runs on the server during SSR.** Guard browser-only APIs
   (`localStorage`, `window`) with `typeof window !== 'undefined'`.
5. **`staticFunctionMiddleware` must be LAST** in the chain (from
   `@tanstack/start-static-server-functions`, experimental).

## Overview

| Feature | Request Middleware | Server Function Middleware |
|---------|--------------------|-----------------------------|
| Created with | `createMiddleware()` | `createMiddleware({ type: 'function' })` |
| Scope | All server requests (SSR, routes, functions) | Server functions only |
| Methods | `.server()` | `.client()`, `.server()` |
| Input validation | No | Yes (`.validator()`) |
| Client-side logic | No | Yes |

Request middleware cannot depend on server function middleware; server function
middleware can depend on both.

## Architecture

```
src/
├── start.ts              # createStart → global request/function middleware
├── middleware/
│   ├── auth.ts           # authMiddleware (request) + authorization factory
│   └── logging.ts        # request logging
```

→ See [auth-authorization.md](references/templates/auth-authorization.md)

## Reference Guide

### Concepts

| Topic | Reference | Load when |
|-------|-----------|-----------|
| Types & chaining | [types.md](references/types.md) | Choosing request vs function middleware, attaching to fns/routes |
| Context passing | [context.md](references/context.md) | Sharing data via next(), sendContext client↔server, headers/fetch |
| Global & static | [global.md](references/global.md) | Global middleware, execution order, staticFunctionMiddleware |

### Templates

| Template | When to Use |
|----------|-------------|
| [auth-authorization.md](references/templates/auth-authorization.md) | Auth + permission-based authorization factory |
| [client-middleware.md](references/templates/client-middleware.md) | Client-side headers, custom fetch, telemetry |

## Quick Reference

### Request middleware

```tsx
import { createMiddleware } from '@tanstack/react-start'

const logging = createMiddleware().server(async ({ next, request }) => {
  console.log(request.url)
  return next()
})
```

### Server function middleware with context

```tsx
const auth = createMiddleware().server(async ({ next, request }) => {
  const session = await getSession(request.headers)
  if (!session) throw new Error('Unauthorized')
  return next({ context: { session } }) // typed downstream
})

const fn = createServerFn().middleware([auth]).handler(async ({ context }) =>
  db.orders.findMany({ where: { userId: context.session.userId } }),
)
```

→ See [context.md](references/context.md) for sendContext and header merging

## Best Practices

### DO
- Load the session in a request middleware from a server-trusted cookie
- Re-check access (membership/role) before trusting any client-sent id
- Use a factory for parameterized authorization (permissions per function)
- Keep method chains in the enforced order

### DON'T
- Trust `sendContext` shape as authorization
- Call `localStorage`/`window` in `.client()` without an SSR guard
- Place `staticFunctionMiddleware` anywhere but last
