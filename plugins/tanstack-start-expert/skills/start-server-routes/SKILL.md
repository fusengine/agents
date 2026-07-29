---
name: start-server-routes
description: Use when building raw HTTP endpoints in TanStack Start with the server property — handlers, params, middleware. Do NOT use for internal RPC (start-server-functions).
version: 1.0.0
user-invocable: true
references: references/defining.md, references/vs-server-functions.md, references/templates/rest-endpoint.md
---

<objective>
Covers server routes — raw HTTP endpoints defined alongside app routes in src/routes/ using the server property on createFileRoute (from @tanstack/react-router), returning standard Response objects. Targets @tanstack/react-start v1.166.2.

Documents the handler context ({ request, params, context, pathname, next }), dynamic ($id) and splat ($) params from the file name, per-handler middleware via createHandlers versus route-wide server.middleware, and how the same file can serve as both a UI route (component) and an API route (server) at once.

Critical rules: choose a server route over a server function when the endpoint must be callable from outside the app (webhooks, public REST, cross-origin) — see references/vs-server-functions.md for the decision; exactly one handler file may resolve to a given route path (routes/users.ts, routes/users/index.ts, and routes/users.index.ts all collide on /users); always await request.json()/.text()/.formData(); and handlers must return a Response (or Promise<Response>).

Includes a full REST-resource template with params and middleware.

Do NOT use this skill for internal type-safe RPC callable only from your own app (use start-server-functions), for reusable middleware chains (use start-middleware), or for UI route rendering.
</objective>

# TanStack Start Server Routes

Server routes are raw HTTP endpoints defined alongside app routes in
`src/routes/`. They use the `server` property on `createFileRoute` (imported
from `@tanstack/react-router`) and return standard `Response` objects. This skill
targets `@tanstack/react-start` **v1.166.2**.

## Agent Workflow (MANDATORY)

Before implementing, verify current APIs against Context7
(`/websites/tanstack_start_framework_react`) + Exa, then explore the target
codebase. After changes, run `fuse-ai-pilot:sniper`.

## Critical Rules (read first)

1. **Server route vs server function:** an endpoint callable from **outside**
   your app (webhooks, public REST, cross-origin) → server route. Internal
   type-safe RPC → server function. See [vs-server-functions.md](references/vs-server-functions.md).
2. **One handler file per route path.** `routes/users.ts`, `routes/users/index.ts`,
   and `routes/users.index.ts` all resolve to `/users` and error if duplicated.
3. **Always `await` body methods.** `request.json()`, `.text()`, `.formData()`
   return Promises — un-awaited, you get a Promise, not the data.
4. **Handlers must return `Response`** (or `Promise<Response>`). Use
   `Response.json(...)` for JSON, or `new Response(body, { status, headers })`.
5. **The same file can be both a UI route and an API route** — add `component`
   alongside `server`.

## Overview

| Feature | Description |
|---------|-------------|
| **Definition** | `server: { handlers: { GET, POST, ... } }` on `createFileRoute` |
| **Handler context** | `{ request, params, context, pathname, next }` |
| **Middleware** | `server.middleware` (all handlers) or `createHandlers` (per handler) |
| **Params** | Dynamic (`$id`) and splat (`$`) from the file name |

## Architecture

```
src/routes/
├── api/
│   ├── hello.ts              # /api/hello
│   ├── users/$id.ts          # /api/users/$id (dynamic param)
│   └── file/$.ts             # /api/file/$ (splat param)
└── webhooks/stripe.ts        # /webhooks/stripe (external POST)
```

→ See [rest-endpoint.md](references/templates/rest-endpoint.md)

## Reference Guide

### Concepts

| Topic | Reference | Load when |
|-------|-----------|-----------|
| Defining routes | [defining.md](references/defining.md) | Handlers, params, body, responses, middleware |
| Routes vs functions | [vs-server-functions.md](references/vs-server-functions.md) | Deciding between the two mechanisms |

### Templates

| Template | When to Use |
|----------|-------------|
| [rest-endpoint.md](references/templates/rest-endpoint.md) | Full REST resource with params + middleware |

## Quick Reference

### Basic GET

```ts
// src/routes/api/hello.ts
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: async ({ request }) => new Response('Hello, World!'),
    },
  },
})
```

### JSON with dynamic param and status

```ts
// src/routes/api/users/$id.ts
export const Route = createFileRoute('/api/users/$id')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const user = await findUser(params.id)
        if (!user) return new Response('Not found', { status: 404 })
        return Response.json(user)
      },
    },
  },
})
```

→ See [defining.md](references/defining.md) for middleware and body parsing

## Best Practices

### DO
- Use server routes for webhooks, public REST, and cross-origin endpoints
- Return `Response.json()` for JSON (sets `Content-Type` automatically)
- `await` every request body method
- Add `authMiddleware` on routes handling private data

### DON'T
- Duplicate a route path across multiple files
- Reach for a server route when you want internal type-safe RPC
- Forget to return a `Response`
