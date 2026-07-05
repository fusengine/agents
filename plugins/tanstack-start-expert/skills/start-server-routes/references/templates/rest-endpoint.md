---
name: rest-endpoint
description: Complete REST resource with params, body parsing, and middleware
keywords: rest, crud, createHandlers, params, middleware, response, webhook
---

# Complete REST Resource

A `/api/users` collection endpoint and a `/api/users/$id` item endpoint, plus a
webhook receiver. Demonstrates params, body parsing, per-handler middleware, and
`Response` helpers.

## Usage

Copy into `src/routes/api/`. Adapt `db` and `authMiddleware` imports.

---

## Collection: /api/users

```tsx
// src/routes/api/users/index.ts
import { createFileRoute } from '@tanstack/react-router'
import { authMiddleware } from '~/middleware/auth' // see start-middleware skill

export const Route = createFileRoute('/api/users')({
  server: {
    handlers: ({ createHandlers }) =>
      createHandlers({
        // Public list
        GET: async () => {
          const users = await db.users.findMany()
          return Response.json(users)
        },
        // Authenticated create
        POST: {
          middleware: [authMiddleware],
          handler: async ({ request }) => {
            const body = await request.json() // MUST await
            if (!body.name) {
              return new Response('name is required', { status: 400 })
            }
            const user = await db.users.create({ data: { name: body.name } })
            return Response.json(user, { status: 201 })
          },
        },
      }),
  },
})
```

---

## Item: /api/users/$id

```tsx
// src/routes/api/users/$id.ts
import { createFileRoute } from '@tanstack/react-router'
import { authMiddleware } from '~/middleware/auth'

export const Route = createFileRoute('/api/users/$id')({
  server: {
    middleware: [authMiddleware], // applies to all methods below
    handlers: {
      GET: async ({ params }) => {
        const user = await db.users.findUnique({ where: { id: params.id } })
        if (!user) return new Response('Not found', { status: 404 })
        return Response.json(user)
      },
      PUT: async ({ params, request }) => {
        const body = await request.json()
        const user = await db.users.update({
          where: { id: params.id },
          data: body,
        })
        return Response.json(user)
      },
      DELETE: async ({ params }) => {
        await db.users.delete({ where: { id: params.id } })
        return new Response(null, { status: 204 })
      },
    },
  },
})
```

---

## Webhook Receiver (external POST)

```tsx
// src/routes/webhooks/stripe.ts
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/webhooks/stripe')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const signature = request.headers.get('stripe-signature')
        const payload = await request.text() // raw body for signature check
        if (!verifySignature(payload, signature)) {
          return new Response('Invalid signature', { status: 400 })
        }
        await handleStripeEvent(JSON.parse(payload))
        return new Response(null, { status: 200 })
      },
    },
  },
})
```

---

## Splat: /api/file/$

```tsx
// src/routes/api/file/$.ts
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/file/$')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const contents = await readFile(params._splat) // e.g. "docs/readme.txt"
        return new Response(contents, {
          headers: { 'Content-Type': 'text/plain' },
        })
      },
    },
  },
})
```
