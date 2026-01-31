---
name: Fly.io Deployment
description: Deploy Prisma on Fly.io with edge regions and managed replicas
when-to-use: Global edge deployment, PostgreSQL clusters, automatic replicas
keywords: [flyio, edge-regions, managed-postgres, replicas, health-checks]
priority: high
requires: [basic-usage, database]
related: [vercel, render, cloudflare-workers]
---

# Fly.io Deployment with Prisma

## Setup

```bash
npm install -g flyctl
fly auth login
fly launch
```

## fly.toml Configuration

```toml
app = "myapp"
primary_region = "ord"

[env]
  NODE_ENV = "production"

[build]
  builder = "heroku"

[http_service]
  internal_port = 3000
  force_https = true

[[services]]
  protocol = "tcp"
  internal_port = 3000
  ports = [{ port = 80 }, { port = 443 }]

[[services.tcp_checks]]
  grace_period = "10s"
  interval = "15s"
  timeout = "5s"
```

## Health Check

```typescript
// app/api/health/route.ts
/**
 * Health check endpoint for Fly.io deployment.
 * Verifies database connectivity.
 * @see /src/lib/prisma.ts
 */
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET handler for health check.
 * Performs database connectivity test.
 *
 * @param {NextRequest} _request - Incoming request
 * @returns {Promise<Response>} Health status
 * @see /src/health/health-service.ts
 */
export async function GET(_request: NextRequest): Promise<Response> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return Response.json({ status: 'ok', timestamp: new Date() })
  } catch (error) {
    return Response.json(
      { status: 'error', error: String(error) },
      { status: 500 }
    )
  }
}
```

## Database

```bash
fly postgres create
# Follow prompts to create cluster
```

Auto-populate `DATABASE_URL`.

## Migrations

Add to `Procfile`:

```
release: npm run migrate
web: npm start
```

## Multi-Region Deployment

```bash
fly regions set ord sfo ewr
fly scale count 3
```

Creates 3 replicas across regions.

## Environment Variables

```bash
fly secrets set DATABASE_URL=postgresql://...
fly secrets set NODE_ENV=production
```

## Scaling

```bash
# Vertical (VM size)
fly scale vm performance-1

# Horizontal (replicas)
fly scale count 3
```

## Deployment

```bash
fly deploy
```

## Monitor Logs

```bash
fly logs
```

## Prisma Schema for Fly

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  createdAt DateTime @default(now())
}
```

## Connection Pooling

Use connection string with pool params:

```env
DATABASE_URL="postgresql://user:pass@host/db?schema=public&pool_size=5"
```

## Rollback

```bash
fly releases
fly releases rollback
```

## Cost Optimization

- Free tier: $5/month credit
- Shared CPU: $0.0017/hour
- Dedicated CPU: $0.021/hour
- PostgreSQL: $15/month (starter)

Fly.io is cost-effective for always-on services.
