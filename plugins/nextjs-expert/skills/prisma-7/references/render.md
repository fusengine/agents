---
name: Render Deployment
description: Deploy Prisma on Render with managed PostgreSQL databases
when-to-use: Production deployments, managed databases, automatic SSL
keywords: [render, managed-postgres, static-sites, background-workers, auto-deploy]
priority: high
requires: [basic-usage, database]
related: [railway, heroku, aws-lambda]
---

# Render Deployment with Prisma

## Initial Setup

1. Render Dashboard → New Web Service
2. Connect GitHub repository
3. Select build settings

## render.yaml Configuration

```yaml
services:
  - type: web
    name: app
    env: node
    plan: starter
    buildCommand: npm install && npm run build && npm run migrate
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: postgres
          property: connectionString

databases:
  - name: postgres
    plan: starter
    postgresVersion: "15"
```

## Migrations

Update `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "migrate": "prisma migrate deploy",
    "start": "next start"
  }
}
```

## Prisma Schema

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

## Deploy Script

```bash
#!/bin/bash
set -e

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Build app
npm run build

# Start server
npm start
```

## Environment Variables

Render Dashboard → Environment → Add:

```
DATABASE_URL=postgresql://user:pass@host:5432/db
```

## Example Route Handler

```typescript
// app/api/users/route.ts
/**
 * API route handlers for User operations on Render.
 * @see /src/lib/prisma.ts
 */
import type { NextRequest } from 'next/server'
import type { User } from '@prisma/client'
import { prisma } from '@/lib/prisma'

/**
 * GET handler for retrieving all users.
 *
 * @returns {Promise<Response>} JSON array of users
 * @see /src/repositories/user-repository.ts
 */
export async function GET(): Promise<Response> {
  try {
    const users = await prisma.user.findMany()
    return Response.json(users)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

/**
 * POST handler for creating a new user.
 *
 * @param {NextRequest} request - Incoming request with user data
 * @returns {Promise<Response>} Created user with 201 status
 * @see /src/repositories/user-repository.ts
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { email, name } = await request.json() as Partial<User>
    const user = await prisma.user.create({
      data: { email, name }
    })
    return Response.json(user, { status: 201 })
  } catch (error) {
    return Response.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
```

## Background Worker

Create separate Render service for long-running tasks:

```typescript
// src/workers/job-processor.ts
/**
 * Background job processor for long-running tasks.
 * @see /src/lib/prisma.ts
 */
import type { Job } from '@prisma/client'
import { prisma } from '@/lib/prisma'

/**
 * Process pending jobs from queue.
 * Runs on interval in background worker service.
 *
 * @returns {Promise<void>}
 * @see /src/services/job-service.ts
 */
async function processQueue(): Promise<void> {
  const jobs = await prisma.job.findMany({
    where: { status: 'pending' }
  })

  for (const job of jobs) {
    try {
      // Update job status
      await prisma.job.update({
        where: { id: job.id },
        data: { status: 'processing' }
      })

      // Process job logic
      console.log(`Processing job ${job.id}`)

      // Mark as complete
      await prisma.job.update({
        where: { id: job.id },
        data: { status: 'completed' }
      })
    } catch (error) {
      await prisma.job.update({
        where: { id: job.id },
        data: { status: 'failed', error: String(error) }
      })
    }
  }
}

// Run processor every 60 seconds
setInterval(processQueue, 60000)

// Initial run
processQueue().catch(console.error)
```

## Deployment

1. Push to GitHub
2. Render auto-deploys
3. Migrations run in buildCommand
4. Service starts

## Monitoring

Render Dashboard → Logs → Real-time output

## Cost

- Web Service: $7/month (starter)
- PostgreSQL: $15/month (starter)
- Free tier available with limitations
