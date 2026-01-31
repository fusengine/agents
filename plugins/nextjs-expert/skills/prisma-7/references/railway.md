---
name: Railway Deployment
description: Deploy Prisma on Railway with managed PostgreSQL addon
when-to-use: Simple deployments, managed databases, Railway ecosystem
keywords: [railway, managed-postgres, zero-config, plugin-system, preview-environments]
priority: high
requires: [basic-usage, database]
related: [render, vercel, heroku]
---

# Railway Deployment with Prisma

## Quick Start

```bash
npm install -g @railway/cli
railway login
railway init
```

## Database Setup

Railway Dashboard → New → Database → PostgreSQL

Automatic `DATABASE_URL` environment variable.

## Deploy Configuration

`railway.toml`:

```toml
[build]
builder = "heroku.buildpacks"

[deploy]
startCommand = "npm start"
healthcheckPath = "/"
healthcheckTimeout = 300
```

## Build Script

`package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "start": "next start",
    "migrate": "prisma migrate deploy"
  }
}
```

## Migrations on Deploy

Add Procfile:

```
release: npm run migrate
web: npm start
```

Or use Railway plugin:

```bash
railway add
```

Select PostgreSQL addon → auto-linked.

## Environment Variables

Railway Dashboard → Variables → Add:

- `NODE_ENV=production`
- `DATABASE_URL` (auto-filled)

## Example API Route

```typescript
// app/api/tasks/route.ts
/**
 * API route handlers for Task operations on Railway.
 * Uses Prisma Client for database operations.
 * @see /src/lib/prisma.ts
 */
import type { NextRequest } from 'next/server'
import type { Task } from '@prisma/client'
import { prisma } from '@/lib/prisma'

/**
 * GET handler for retrieving all tasks.
 *
 * @returns {Promise<Response>} JSON array of tasks
 * @see /src/repositories/task-repository.ts
 */
export async function GET(): Promise<Response> {
  const tasks = await prisma.task.findMany()
  return Response.json(tasks)
}

/**
 * POST handler for creating a new task.
 *
 * @param {NextRequest} req - Incoming request with task data
 * @returns {Promise<Response>} Created task with 201 status
 * @see /src/repositories/task-repository.ts
 */
export async function POST(req: NextRequest): Promise<Response> {
  const data = await req.json() as Partial<Task>
  const task = await prisma.task.create({ data: data as any })
  return Response.json(task, { status: 201 })
}
```

## Local Development

```bash
railway start
# or
railway run npm run dev
```

## Deployment

```bash
railway deploy
```

Automatic builds and migrations.

## Monitor Logs

```bash
railway logs
```

## Database Connection Pool

Railway PostgreSQL default pooling: 20 connections.

Update `datasource` if needed:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Cost Optimization

- PostgreSQL: $12/month (5GB)
- Free tier: $5 month credit
- Pausing reduces costs to $0
