---
name: defining
description: Handlers, params, body parsing, responses, and middleware
when-to-use: Writing server route handlers, reading params/body, attaching middleware
keywords: handlers, createHandlers, params, splat, request, response, middleware, body
priority: high
related: vs-server-functions.md
---

# Defining Server Routes

## Overview

A server route adds a `server` property to `createFileRoute`. `handlers` maps
HTTP methods to functions, or is a function receiving `createHandlers` for
per-handler middleware. Route-level `middleware` applies to all handlers.

---

## Handler Context

Each handler receives:

| Property | Description |
|----------|-------------|
| `request` | The incoming `Request` object |
| `params` | Dynamic path params (`{ id }` for `/users/$id`) |
| `context` | Data provided by middleware |
| `pathname` | The matched pathname |
| `next` | Falls through to SSR (returns a `Response`) |

---

## File Route Conventions

| File | Route |
|------|-------|
| `routes/users.ts` | `/users` |
| `routes/users/$id.ts` | `/users/$id` |
| `routes/users/$id/posts.ts` | `/users/$id/posts` |
| `routes/api/file/$.ts` | `/api/file/$` (splat → `params._splat`) |
| `routes/my-script[.]js.ts` | `/my-script.js` (escaped dot) |

Each path may only have **one** handler file. `routes/users.ts` and
`routes/users/index.ts` conflict.

---

## Params

```ts
// Dynamic: /users/$id → params.id
GET: async ({ params }) => new Response(`User: ${params.id}`)

// Splat: /file/$ → params._splat
GET: async ({ params }) => new Response(`File: ${params._splat}`)
```

---

## Request Body

```ts
POST: async ({ request }) => {
  const body = await request.json() // MUST await
  return Response.json({ created: body.name })
}
```

Other methods: `request.text()`, `request.formData()`.

---

## Responses

| Goal | Code |
|------|------|
| JSON | `Response.json({ message: 'Hi' })` |
| Status | `new Response('Not found', { status: 404 })` |
| Headers | `new Response('Hi', { headers: { 'Content-Type': 'text/plain' } })` |

---

## Middleware

### All handlers

```tsx
server: {
  middleware: [authMiddleware, loggerMiddleware],
  handlers: { GET: async ({ context }) => Response.json(context.user) },
}
```

### Per handler (createHandlers)

```tsx
server: {
  handlers: ({ createHandlers }) =>
    createHandlers({
      GET: async () => Response.json({ public: true }),
      POST: {
        middleware: [authMiddleware],
        handler: async ({ context }) => Response.json(context.session.user),
      },
    }),
}
```

Route-level middleware runs **first**, then handler-specific middleware.

→ See [rest-endpoint.md](templates/rest-endpoint.md)

---

## Best Practices

### DO
- Use `createHandlers` when only some methods need middleware
- Return `Response.json()` for JSON payloads
- Read splat routes via `params._splat`

### DON'T
- Duplicate route paths across files
- Forget to `await` body methods

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `const body = request.json()` | `await request.json()` |
| Two files for `/users` | Keep a single handler file |
| Returning a plain object | Wrap in `Response.json(...)` |

---

## Related References

- [vs-server-functions.md](vs-server-functions.md) — when to pick a route

## Related Templates

- [rest-endpoint.md](templates/rest-endpoint.md) — full REST resource
