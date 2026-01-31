---
name: Cloudflare Workers Deployment
description: Deploy Prisma on Cloudflare Workers with D1 database
when-to-use: Edge computing, serverless worldwide, low latency, Cloudflare ecosystem
keywords: [cloudflare-workers, d1-database, edge-compute, wrangler, kv-storage]
priority: medium
requires: [basic-usage, database]
related: [vercel, netlify, aws-lambda]
---

# Cloudflare Workers with Prisma and D1

## Setup

```bash
npm install -g wrangler
wrangler init
npm install @prisma/client
```

## Wrangler Configuration

`wrangler.toml`:

```toml
name = "prisma-app"
type = "javascript"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "app-db"
database_id = "12345678-1234-1234-1234-123456789012"

[env.production]
d1_databases = [
  { binding = "DB", database_name = "app-db-prod", database_id = "prod-id" }
]
```

## Create D1 Database

```bash
wrangler d1 create app-db
wrangler d1 execute app-db --file schema.sql
```

## Prisma Adapter

Use `@prisma/adapter-d1`:

```bash
npm install @prisma/adapter-d1
```

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

## Worker Handler

```typescript
// src/index.ts
/**
 * Cloudflare Workers fetch handler with D1 database.
 * @see /src/interfaces/worker-env.ts
 */
import type { D1Database } from '@cloudflare/workers-types'
import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

/**
 * Environment variables for Worker.
 * @see /src/interfaces/worker-env.ts
 */
interface Env {
  /** D1 SQLite database binding */
  DB: D1Database
}

/**
 * Fetch handler for incoming HTTP requests.
 *
 * @param {Request} request - Incoming request
 * @param {Env} env - Worker environment
 * @returns {Promise<Response>} HTTP response
 * @see /src/handlers/user-handler.ts
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const adapter = new PrismaD1(env.DB)
    const prisma = new PrismaClient({ adapter })

    const users = await prisma.user.findMany()
    return Response.json(users)
  }
}
```

## Post Request Handler

```typescript
// src/index.ts (POST example)
/**
 * Extended fetch handler with POST support.
 * @see /src/interfaces/worker-env.ts
 */
import type { D1Database } from '@cloudflare/workers-types'
import type { User } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

interface Env {
  DB: D1Database
}

/**
 * Fetch handler supporting GET and POST methods.
 *
 * @param {Request} request - Incoming request
 * @param {Env} env - Worker environment
 * @returns {Promise<Response>} HTTP response
 * @see /src/handlers/user-handler.ts
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const adapter = new PrismaD1(env.DB)
    const prisma = new PrismaClient({ adapter })

    if (request.method === 'POST') {
      try {
        const { email, name } = await request.json() as Partial<User>
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

    const users = await prisma.user.findMany()
    return Response.json(users)
  }
}
```

## Schema Migration

```bash
wrangler d1 migrations create app-db users
# Edit migration file
wrangler d1 execute app-db --file migrations/0001_users.sql
```

## KV Storage Integration

```typescript
// src/handlers/users-cached.ts
/**
 * User handler with Cloudflare KV caching.
 * @see /src/interfaces/worker-env.ts
 */
import type { D1Database, KVNamespace } from '@cloudflare/workers-types'
import type { User } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

/**
 * Extended environment with cache binding.
 * @see /src/interfaces/worker-env.ts
 */
interface CachedEnv {
  DB: D1Database
  CACHE: KVNamespace
}

/**
 * Fetch handler with KV caching layer.
 *
 * @param {Request} request - Incoming request
 * @param {CachedEnv} env - Worker environment with cache
 * @returns {Promise<Response>} Cached or fresh user data
 * @see /src/services/cache-service.ts
 */
export async function fetchUsersWithCache(
  request: Request,
  env: CachedEnv
): Promise<Response> {
  const cacheKey = 'users:list'
  const cached = await env.CACHE.get(cacheKey)

  if (cached) {
    return Response.json(JSON.parse(cached) as User[])
  }

  const adapter = new PrismaD1(env.DB)
  const prisma = new PrismaClient({ adapter })
  const users = await prisma.user.findMany()

  await env.CACHE.put(cacheKey, JSON.stringify(users), {
    expirationTtl: 3600
  })

  return Response.json(users)
}
```

## Deployment

```bash
wrangler deploy
```

## Production Environment

```bash
wrangler deploy --env production
```

## Local Testing

```bash
wrangler dev
```

Starts local server at `localhost:8787`.

## Monitor

```bash
wrangler tail
```

Real-time logs from Workers.

## Cost

- Worker requests: Free up to 100k/day
- D1: $0.50/month + $0.30/1M read ops
- KV: $0.50/million requests

Cloudflare Workers is cost-effective for global applications.
