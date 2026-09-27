---
name: Netlify Deployment
description: Deploy Prisma with Netlify Functions and Edge Functions
when-to-use: Netlify hosting, serverless functions, edge computing
keywords: [netlify, serverless-functions, edge-functions, context-variables, split-testing]
priority: high
requires: [basic-usage, database]
related: [vercel, render, cloudflare-workers]
---

# Netlify Deployment with Prisma

## Setup

```bash
npm install -D netlify-cli
netlify init
```

## Database URL in UI

1. Netlify Dashboard → Environment
2. Add `DATABASE_URL`
3. Optional: `SHADOW_DATABASE_URL` for staging

## Build Configuration

`netlify.toml`:

```toml
[build]
  command = "prisma migrate deploy && npm run build"
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"
  external_node_modules = ["@prisma/client"]

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

## Serverless Function

```typescript
// netlify/functions/users.ts
/**
 * Netlify serverless function handler for retrieving users.
 * @see /src/lib/prisma.ts
 */
import type { Handler } from '@netlify/functions'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../src/generated/prisma/client'  // v7: generated path

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

/**
 * Handler for users endpoint.
 * Retrieves all users from database.
 *
 * @param {object} _event - Lambda event
 * @param {object} _context - Lambda context
 * @returns {Promise<{statusCode: number; body: string}>}
 * @see /src/repositories/user-repository.ts
 */
export const handler: Handler = async (_event, _context) => {
  try {
    const users = await prisma.user.findMany()
    return {
      statusCode: 200,
      body: JSON.stringify(users)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch users' })
    }
  } finally {
    await prisma.$disconnect()
  }
}
```

## Edge Functions

```typescript
// netlify/edge-functions/auth.ts
import type { Context } from '@netlify/edge-functions'

export default async (request: Request, context: Context) => {
  const { auth } = context
  if (!auth) return new Response('Unauthorized', { status: 401 })
  return context.next()
}
```

## Migration on Deploy

Add to build logs:

```bash
npm run prisma:migrate
npm run build
```

## Environment Variables

```bash
netlify env:set DATABASE_URL "postgresql://..."
```

## Local Development

```bash
netlify dev
```

Runs with local database emulation.

## Pagination Example

```typescript
// netlify/functions/users-paginated.ts
/**
 * Paginated users handler for Netlify serverless.
 * @see /src/lib/prisma.ts
 */
import type { Handler } from '@netlify/functions'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, type User } from '../../src/generated/prisma/client'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

/**
 * Pagination response interface.
 * @see /src/interfaces/pagination.ts
 */
interface PaginatedResponse {
  data: User[]
  page: number
  total: number
  pageSize: number
}

/**
 * Handler for paginated users endpoint.
 *
 * @param {object} event - Lambda event with queryStringParameters
 * @returns {Promise<{statusCode: number; body: string}>}
 * @see /src/repositories/user-repository.ts
 */
export const handler: Handler = async (event) => {
  const page = parseInt(event.queryStringParameters?.page || '1')
  const take = 10

  const users = await prisma.user.findMany({
    skip: (page - 1) * take,
    take
  })

  const total = await prisma.user.count()

  const response: PaginatedResponse = {
    data: users,
    page,
    total,
    pageSize: take
  }

  return { statusCode: 200, body: JSON.stringify(response) }
}
```

## Monitor Deployments

```bash
netlify status
netlify logs
```
