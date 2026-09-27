---
name: Vercel Deployment
description: Deploy Prisma applications on Vercel with serverless functions and edge caching
when-to-use: Production deployments on Vercel, serverless functions, automatic scaling
keywords: [vercel, serverless, edge-middleware, zero-config, preview-deployments]
priority: critical
requires: [basic-usage, database]
related: [railway, render, aws-lambda]
---

# Vercel Deployment with Prisma

## Automatic Deployment

```bash
npm install -g vercel
vercel login
vercel
```

Vercel auto-detects Next.js + Prisma projects.

## Environment Variables

Create `.env.local`:

```env
DATABASE_URL="postgresql://user:password@host:5432/db"
SHADOW_DATABASE_URL="postgresql://user:password@host:5432/shadow"
```

## Database Migrations

```json
{
  "buildCommand": "prisma migrate deploy && next build"
}
```

Or in `vercel.json`:

```json
{
  "buildCommand": "npx prisma migrate deploy && npm run build",
  "installCommand": "npm install"
}
```

## API Routes with Prisma

```typescript
// pages/api/users.ts
/**
 * API route handler for retrieving users.
 * Uses Prisma Client for database operations.
 * @see /src/lib/prisma.ts
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

/**
 * GET handler for users endpoint.
 * Returns all users from database.
 *
 * @param {NextApiRequest} req - Incoming request
 * @param {NextApiResponse} res - Response object
 * @returns {Promise<void>}
 * @see /src/repositories/user-repository.ts
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const users = await prisma.user.findMany()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  } finally {
    await prisma.$disconnect()
  }
}
```

## Edge Middleware

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)']
}
```

## Connection Pooling

Prisma 7 has no `url`/`directUrl` in the schema: the CLI (migrations) reads the **direct** URL from `prisma.config.ts`, the app passes the **pooled** `DATABASE_URL` to the driver adapter (see `src/lib/prisma.ts` below).

```typescript
// prisma.config.ts
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DIRECT_URL'), // direct (non-pooled) URL for prisma migrate
  },
})
```

Use Vercel Postgres with built-in pooling.

## Cold Start Optimization

1. Prisma Client generation: Pre-compile in build
2. Connection reuse across invocations
3. Lazy load Prisma only when needed

```typescript
// src/lib/prisma.ts
/**
 * Prisma Client singleton for cold start optimization.
 * Reuses connection across serverless invocations.
 * @see /src/interfaces/prisma-config.ts
 */
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'  // v7: generated path

declare global {
  var prisma: PrismaClient | undefined
}

/** v7: driver adapter required — pooled URL at runtime */
const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  })

/**
 * Get or create Prisma Client instance.
 * In production, creates new instance on each invocation.
 * In development, reuses instance across hot reloads.
 *
 * @returns {PrismaClient} Prisma Client instance
 * @see /src/repositories/user-repository.ts
 */
const prisma =
  process.env.NODE_ENV === 'production'
    ? createPrismaClient()
    : (globalThis.prisma ??= createPrismaClient())

export { prisma }
```

## Deploy Command

```bash
vercel deploy --prod
```

## Monitoring

- Real-time logs: `vercel logs`
- Database metrics: Vercel Dashboard
- Prisma Studio: `npx prisma studio`
