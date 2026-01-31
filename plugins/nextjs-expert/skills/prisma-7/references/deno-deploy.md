---
name: Deno Deploy Integration
description: Deploy Prisma applications on Deno Deploy with edge functions
when-to-use: Deno ecosystem, edge computing, fresh runtime, low latency
keywords: [deno-deploy, edge-compute, deno-fresh, typescript-native, no-bundling]
priority: low
requires: [basic-usage, database]
related: [vercel, netlify, cloudflare-workers]
---

# Deno Deploy with Prisma

## Setup

```bash
deno init --name prisma-app
```

## Import Prisma

```typescript
// src/main.ts
/**
 * Deno Deploy fetch handler with Prisma.
 * @see /src/lib/prisma-deno.ts
 */
import type { User } from "npm:@prisma/client@5"
import { PrismaClient } from "npm:@prisma/client@5"

/**
 * Initialize Prisma Client for Deno Deploy.
 * Uses environment variable for database URL.
 *
 * @returns {PrismaClient} Configured Prisma instance
 * @see /src/lib/prisma-deno.ts
 */
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: Deno.env.get("DATABASE_URL")
    }
  }
})

/**
 * Fetch handler for HTTP requests.
 *
 * @param {Request} request - Incoming request
 * @returns {Promise<Response>} JSON response with users
 * @see /src/handlers/user-handler.ts
 */
export default {
  async fetch(request: Request): Promise<Response> {
    const users = await prisma.user.findMany()
    return Response.json(users)
  }
}
```

## Deno Fresh Integration

```typescript
// routes/api/users.ts
/**
 * Fresh API route for users endpoint.
 * @see /src/lib/prisma-deno.ts
 */
import type { FreshContext } from "$fresh/server.ts"
import type { User } from "npm:@prisma/client@5"
import { PrismaClient } from "npm:@prisma/client@5"

const prisma = new PrismaClient()

/**
 * GET handler for users endpoint.
 *
 * @param {Request} _req - Incoming request
 * @param {FreshContext} _ctx - Fresh context
 * @returns {Promise<Response>} JSON array of users
 * @see /src/repositories/user-repository.ts
 */
export const handler = async (
  _req: Request,
  _ctx: FreshContext
): Promise<Response> => {
  const users = await prisma.user.findMany()
  return Response.json(users)
}
```

## Deno.json Configuration

```json
{
  "imports": {
    "@prisma/client": "npm:@prisma/client@5",
    "$fresh/": "https://deno.land/x/fresh@1.4.0/"
  },
  "tasks": {
    "start": "deno run -A --watch=static/,routes/ dev.ts",
    "build": "deno run -A dev.ts build"
  }
}
```

## Environment Variables

Create `.env`:

```env
DATABASE_URL=postgresql://user:password@host:5432/db
```

Load in app:

```typescript
import { config } from "https://deno.land/x/dotenv@3.2.0/mod.ts"

const env = await config()
const databaseUrl = env["DATABASE_URL"]
```

## Deployment

1. Connect GitHub repo to Deno Deploy
2. Push to main branch
3. Auto-deploys

Or deploy CLI:

```bash
deno deploy deploy
```

## POST Handler

```typescript
// routes/api/users.ts
/**
 * Fresh API route with GET and POST handlers.
 * @see /src/lib/prisma-deno.ts
 */
import type { FreshContext } from "$fresh/server.ts"
import type { User } from "npm:@prisma/client@5"
import { PrismaClient } from "npm:@prisma/client@5"

const prisma = new PrismaClient()

/**
 * Handlers object for different HTTP methods.
 * @see /src/repositories/user-repository.ts
 */
export const handler = {
  /**
   * GET handler for retrieving users.
   *
   * @returns {Promise<Response>} JSON array of users
   */
  GET: async (): Promise<Response> => {
    const users = await prisma.user.findMany()
    return Response.json(users)
  },

  /**
   * POST handler for creating new user.
   *
   * @param {Request} req - Incoming request with user data
   * @returns {Promise<Response>} Created user with 201 status
   */
  POST: async (req: Request): Promise<Response> => {
    try {
      const { email, name } = await req.json() as Partial<User>
      const user = await prisma.user.create({
        data: { email, name }
      })
      return Response.json(user, { status: 201 })
    } catch (error) {
      return Response.json(
        { error: 'Failed to create user' },
        { status: 400 }
      )
    }
  }
}
```

## Middleware Example

```typescript
// routes/middleware.ts
import { FreshContext } from "$fresh/server.ts"

export async function handler(
  req: Request,
  ctx: FreshContext
) {
  const response = await ctx.next()
  response.headers.set("X-Custom-Header", "value")
  return response
}
```

## Database Connection Pooling

Deno Deploy has no persistent connections. Use PgBouncer or managed pooling:

```typescript
const prisma = new PrismaClient({
  errorFormat: "pretty"
})
```

## Local Testing

```bash
deno run -A dev.ts
```

Opens at `http://localhost:8000`.

## Type Safety

Deno has TypeScript built-in:

```typescript
// src/types/user.ts
/**
 * User type definition for type safety.
 * @see /src/interfaces/user-repository.ts
 */
import type { User } from "npm:@prisma/client@5"

/**
 * Get user by ID with type safety.
 *
 * @param {number} id - User ID
 * @returns {Promise<User | null>} User or null
 * @see /src/repositories/user-repository.ts
 */
export async function getUserById(
  prisma: PrismaClient,
  id: number
): Promise<User | null> {
  const user: User | null = await prisma.user.findUnique({
    where: { id }
  })
  return user
}
```

## KV Storage

Deno Deploy includes built-in KV:

```typescript
// src/services/cache-service.ts
/**
 * Cache service using Deno KV storage.
 * @see /src/lib/prisma-deno.ts
 */
import type { User } from "npm:@prisma/client@5"

/**
 * Get users with KV caching layer.
 * Caches result for 1 hour.
 *
 * @param {PrismaClient} prisma - Prisma instance
 * @returns {Promise<User[]>} User array
 * @see /src/repositories/user-repository.ts
 */
export async function getUsersWithCache(
  prisma: PrismaClient
): Promise<User[]> {
  const kv = await Deno.openKv()

  // Try to get from cache
  const cached = await kv.get(["users:list"])
  if (cached.value) {
    return cached.value as User[]
  }

  // Fetch from database
  const users = await prisma.user.findMany()

  // Cache for 1 hour
  await kv.set(["users:list"], users, { expireIn: 3600 })

  return users
}
```

## Monitoring

Deno Deploy Dashboard → Logs

View real-time execution logs.

## Cost

- Invocations: Free up to 1M/month
- Requests: $2 per million after free tier
- KV storage: Included

Deno Deploy is competitive for edge deployments.
