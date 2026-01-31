---
name: deployment
description: Prisma 7 deployment to Vercel, Edge, serverless platforms
when-to-use: Deploying Prisma apps to production
keywords: Vercel, Edge, serverless, Cloudflare, deploy, production
priority: high
requires: driver-adapters.md
related: nextjs-integration.md
---

# Deployment

Prisma 7 deployment patterns for production environments.

## Vercel (Node.js)

```typescript
// src/lib/prisma.ts
/**
 * Prisma Client singleton for Node.js environment.
 * @see /modules/database/src/interfaces/prisma-config.ts
 */
import type { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient as PC } from '@prisma/client'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

declare global {
  var prisma: PC | undefined
}

/**
 * Get or create Prisma Client instance for reuse across requests.
 * Prevents connection exhaustion in serverless environments.
 *
 * @returns {PrismaClient} Reusable Prisma Client instance
 * @see /src/lib/prisma.ts
 */
export const prisma =
  globalThis.prisma ?? new PC({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}
```

```json
{
  "scripts": {
    "postinstall": "bunx prisma generate",
    "build": "bunx prisma generate && next build"
  }
}
```

---

## Vercel Edge Functions

```typescript
// app/api/users/route.ts
/**
 * Edge runtime API route handler for serverless edge computing.
 * Uses Neon driver adapter for connection pooling.
 * @see /src/lib/prisma-edge.ts
 */
import type { NextRequest } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

export const runtime = 'edge'

/**
 * GET handler for retrieving all users from edge region.
 *
 * @param {NextRequest} _request - Incoming request
 * @returns {Response} JSON array of users
 * @see /src/repositories/user-repository.ts
 */
export async function GET(_request: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!)
  const adapter = new PrismaNeon(sql)
  const prisma = new PrismaClient({ adapter })

  const users = await prisma.user.findMany()
  return Response.json(users)
}
```

---

## Cloudflare Workers

```typescript
// src/index.ts
/**
 * Cloudflare Workers fetch handler using D1 SQLite database.
 * @see /src/interfaces/worker-env.ts
 */
import type { D1Database } from '@cloudflare/workers-types'
import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'

/**
 * Environment variables available in Cloudflare Workers.
 * @see /src/interfaces/worker-env.ts
 */
interface Env {
  /** D1 database binding */
  DB: D1Database
}

/**
 * Fetch handler for incoming HTTP requests.
 *
 * @param {Request} request - Incoming HTTP request
 * @param {Env} env - Environment variables and bindings
 * @returns {Promise<Response>} HTTP response with user data
 * @see /src/handlers/user-handler.ts
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const adapter = new PrismaD1(env.DB)
    const prisma = new PrismaClient({ adapter })

    const users = await prisma.user.findMany()
    return Response.json(users)
  },
}
```

---

## Docker

```dockerfile
# Dockerfile
# Multi-stage build for minimal production image size
# Stage 1: Build dependencies and generate Prisma Client
FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lockb ./
COPY prisma ./prisma

RUN bun install
RUN bunx prisma generate

COPY . .
RUN bun run build

# Stage 2: Production runtime with only necessary files
FROM oven/bun:1 AS runner
WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "server.js"]
```

---

## CI/CD Migrations

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v1

      - run: bun install

      - name: Run migrations
        run: bunx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Deploy to Vercel
        run: vercel deploy --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## Connection Pooling

```typescript
// src/lib/prisma-config.ts
/**
 * Connection pool configuration for different deployment environments.
 * @see /src/interfaces/pool-config.ts
 */
import { PrismaPg } from '@prisma/adapter-pg'

/**
 * Configuration for serverless environments (Lambda, Vercel, Netlify).
 * Uses minimal pool size to prevent connection exhaustion.
 *
 * @returns {PrismaPg} Configured adapter for serverless
 * @see /src/lib/prisma.ts
 */
export function getServerlessAdapter() {
  return new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    pool: {
      max: 1, // Minimize for serverless
    },
  })
}

/**
 * Configuration for traditional servers (Docker, VPS, Render).
 * Uses larger pool for persistent connections.
 *
 * @returns {PrismaPg} Configured adapter for traditional servers
 * @see /src/lib/prisma.ts
 */
export function getServerAdapter() {
  return new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    pool: {
      max: 20,
      idleTimeoutMillis: 30000,
    },
  })
}
```

---

## Environment Variables

```bash
# .env.production
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# For connection pooling (Supabase, Neon)
DATABASE_URL="postgresql://user:pass@pooler.host:6543/db?pgbouncer=true"
DIRECT_URL="postgresql://user:pass@direct.host:5432/db"
```

---

## Best Practices

1. **Generate in build** - Run `prisma generate` before build (see `/src/lib/prisma.ts`)
2. **Migrate in CI** - Run `prisma migrate deploy` in pipeline (see `.github/workflows/deploy.yml`)
3. **Pool connections** - Use connection pooler for serverless (see `/src/lib/prisma-config.ts`)
4. **Edge adapters** - Use Neon/PlanetScale for edge functions (see `/src/lib/prisma-edge.ts`)
5. **Cache generate** - Prisma generate is deterministic, cache safely in CI/CD
