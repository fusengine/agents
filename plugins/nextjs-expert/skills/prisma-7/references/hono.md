---
name: hono
description: Prisma 7 integration with Hono framework for edge runtime
when-to-use: Building Hono APIs with edge runtime compatibility and type safety
keywords: Hono, edge runtime, Cloudflare, middleware, type-safe APIs
priority: high
requires: client.md
related: express.md, remix.md, deployment.md
---

# Hono Integration

Prisma 7 with Hono for lightweight, type-safe APIs running on edge runtimes.

## Setup with Edge Runtime

```typescript
// src/interfaces/env.ts
/**
 * Environment context available to Hono handlers
 * @see /src/db.ts
 */
export interface HonoEnv {
  DATABASE_URL: string
  [key: string]: string
}

/**
 * Hono context with environment
 */
export interface HonoContext {
  env: HonoEnv
  [key: string]: unknown
}

// src/db.ts
// schema.prisma: generator client { provider = "prisma-client", output = "../src/generated/prisma",
//   runtime = "workerd" }  // runtime: nodejs (default) | workerd | vercel-edge | bun | deno
// v7: import the generated client (not `@prisma/client/edge`), no `datasources` option — pass an
// edge-compatible driver adapter (pg over Cloudflare `connect()` needs `nodejs_compat` in wrangler.jsonc;
// use @prisma/adapter-neon / adapter-planetscale / adapter-d1 for HTTP-based drivers)
import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

/**
 * Create a per-request Prisma client (Workers: env is only available inside the handler)
 * @param {string} databaseUrl - Direct database connection string (c.env.DATABASE_URL)
 * @returns {PrismaClient} - Configured Prisma instance
 */
export function getPrisma(databaseUrl: string) {
  const adapter = new PrismaPg({ connectionString: databaseUrl })
  return new PrismaClient({ adapter })
}
```

---

## Basic Routes

```typescript
// src/index.ts
import { Hono } from 'hono'
import { getPrisma } from './db'

const app = new Hono()

app.get('/users', async (c) => {
  const prisma = getPrisma(
    c.env.DATABASE_URL
  )

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  })

  return c.json(users)
})

app.post('/users', async (c) => {
  const prisma = getPrisma(
    c.env.DATABASE_URL
  )

  const data = await c.req.json()

  const user = await prisma.user.create({
    data,
  })

  return c.json(user, { status: 201 })
})

export default app
```

---

## Parameterized Routes

```typescript
app.get('/users/:id', async (c) => {
  const id = c.req.param('id')
  const prisma = getPrisma(c.env.DATABASE_URL)

  const user = await prisma.user.findUnique({
    where: { id },
    include: { posts: true },
  })

  if (!user) {
    return c.json(
      { error: 'Not found' },
      { status: 404 }
    )
  }

  return c.json(user)
})

app.patch('/users/:id', async (c) => {
  const id = c.req.param('id')
  const data = await c.req.json()
  const prisma = getPrisma(c.env.DATABASE_URL)

  const user = await prisma.user.update({
    where: { id },
    data,
  })

  return c.json(user)
})

app.delete('/users/:id', async (c) => {
  const id = c.req.param('id')
  const prisma = getPrisma(c.env.DATABASE_URL)

  await prisma.user.delete({
    where: { id },
  })

  return c.json(null, { status: 204 })
})
```

---

## Middleware

```typescript
// src/interfaces/auth.ts
/**
 * Authenticated user from token validation
 * @see /src/middleware/auth.ts
 */
export interface AuthenticatedUser {
  id: string
  email: string
  token: string
  name?: string
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  error: string
}

// src/middleware/auth.ts
import type { Context, Next } from 'hono'
import type { AuthenticatedUser, ApiErrorResponse } from '../interfaces/auth'
import { getPrisma } from '../db'

/**
 * Authentication middleware
 * Validates Bearer token and loads user context
 * @param {Context} c - Hono context
 * @param {Next} next - Next middleware function
 * @returns {Promise<Response>} - Authenticated response or 401
 */
export async function authMiddleware(
  c: Context,
  next: Next
) {
  const token = c.req.header('authorization')
    ?.replace('Bearer ', '')

  if (!token) {
    return c.json<ApiErrorResponse>(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const prisma = getPrisma(
    c.env.DATABASE_URL
  )

  const user = await prisma.user.findFirst({
    where: { token },
  })

  if (!user) {
    return c.json<ApiErrorResponse>(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }

  c.set('user', user as AuthenticatedUser)
  await next()
}

// Usage
app.use('/api/protected/*', authMiddleware)
```

---

## Accelerate Caching (legacy — retired December 1, 2026)

> Standalone Accelerate is being retired on 2026-12-01. In v7 an Accelerate client takes
> `accelerateUrl` and **no** driver adapter (never pass a `prisma://` URL to `PrismaPg`).
> Prefer the adapter-based `getPrisma()` above for new code.

```typescript
// src/index.ts
import { Hono } from 'hono'
import { PrismaClient } from './generated/prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const app = new Hono()

/** Accelerate client: `accelerateUrl` (prisma:// URL), no adapter */
const getAcceleratePrisma = (accelerateUrl: string) =>
  new PrismaClient({ accelerateUrl }).$extends(withAccelerate())

app.get('/posts', async (c) => {
  const prisma = getAcceleratePrisma(c.env.DATABASE_URL)

  const posts = await prisma.post.findMany({
    cacheStrategy: { ttl: 60 },
  })

  return c.json(posts)
})

app.post('/posts', async (c) => {
  const prisma = getAcceleratePrisma(c.env.DATABASE_URL)

  const data = await c.req.json()

  const post = await prisma.post.create({
    data,
  })

  return c.json(post, { status: 201 })
})
```

---

## Transaction Support

```typescript
app.post('/orders/checkout', async (c) => {
  const prisma = getPrisma(
    c.env.DATABASE_URL
  )

  const data = await c.req.json()

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const order = await tx.order.create({
          data: {
            userId: data.userId,
            total: data.total,
          },
        })

        await tx.inventory.update({
          where: { id: data.itemId },
          data: { stock: { decrement: 1 } },
        })

        return order
      }
    )

    return c.json(result, { status: 201 })
  } catch (e) {
    return c.json(
      { error: 'Checkout failed' },
      { status: 500 }
    )
  }
})
```

---

## Error Handling

```typescript
app.onError(
  (
    err: Error,
    c: Context
  ) => {
    console.error(err)

    if (err.message.includes('Unique constraint')) {
      return c.json(
        { error: 'Resource already exists' },
        { status: 409 }
      )
    }

    return c.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
)
```

---

## Best Practices

1. **Driver adapter required** - v7: generated client + edge-compatible adapter, not `@prisma/client/edge`
2. **Edge-compatible** - Test on Cloudflare Workers
3. **Middleware pattern** - Separate concerns with middleware
4. **Type-safe** - Leverage Hono's type system
5. **Transactions** - Ensure data consistency
