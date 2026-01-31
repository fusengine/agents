---
name: Heroku Deployment
description: Deploy Prisma on Heroku with Postgres addon and automated deployments
when-to-use: Legacy deployments, Heroku ecosystem, simple scaling, review apps
keywords: [heroku, postgres-addon, procfile, review-apps, dyno-types]
priority: medium
requires: [basic-usage, database]
related: [railway, render, flyio]
---

# Heroku Deployment with Prisma

## Prerequisites

```bash
npm install -g heroku
heroku login
```

## Heroku App Creation

```bash
heroku create myapp
```

## Procfile

```
release: npm run migrate
web: npm start
```

## package.json Scripts

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "start": "next start",
    "migrate": "prisma migrate deploy",
    "dev": "next dev"
  }
}
```

## Postgres Add-on

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

Auto-populates `DATABASE_URL` environment variable.

## Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your-secret
```

View all:

```bash
heroku config
```

## Deploy

```bash
git push heroku main
```

Or connect GitHub:

1. Heroku Dashboard → Deploy → GitHub
2. Connect repository
3. Enable auto-deploy on push

## Example API Route

```typescript
// pages/api/users.ts
/**
 * API route handler for Heroku deployment.
 * Supports GET and POST methods for user operations.
 * @see /src/lib/prisma.ts
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import type { User } from '@prisma/client'
import { prisma } from '@/lib/prisma'

/**
 * API handler for user endpoints.
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
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany()
      return res.json(users)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch users' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { email, name } = req.body as Partial<User>
      const user = await prisma.user.create({
        data: { email, name }
      })
      return res.status(201).json(user)
    } catch (error) {
      return res.status(400).json({ error: 'Failed to create user' })
    }
  }

  res.status(405).end()
}
```

## Monitor Logs

```bash
heroku logs --tail
```

## Dyno Types

```bash
heroku ps:type standard-1x
heroku ps:scale web=2
```

## Migrations

Manual run (if needed):

```bash
heroku run npm run migrate
```

## Prisma Client in Production

```typescript
// src/lib/prisma.ts
/**
 * Prisma Client singleton for Heroku deployment.
 * Manages connection reuse in production environment.
 * @see /src/interfaces/prisma-config.ts
 */
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

/**
 * Get or create Prisma Client instance.
 * In production, creates single instance per dyno.
 * In development, reuses instance across hot reloads.
 *
 * @returns {PrismaClient} Reusable Prisma instance
 * @see /src/repositories/user-repository.ts
 */
const prisma =
  process.env.NODE_ENV === 'production'
    ? new PrismaClient()
    : ((globalThis.prisma as PrismaClient) ||
        (globalThis.prisma = new PrismaClient()))

export { prisma }
```

## Review Apps

Enable automatic preview deployments:

1. Heroku Dashboard → Apps → Settings
2. Enable Review Apps for Pull Requests
3. Create copy of Postgres for each PR

```bash
heroku apps:create myapp-pr-123 --remote pr-123
```

## Scaling

```bash
# Vertical (CPU/RAM)
heroku ps:type performance-m

# Horizontal (processes)
heroku ps:scale web=3
```

## Rollback

```bash
heroku releases
heroku releases:rollback
```

## Connection Pooling

Use Connection Pooler add-on:

```bash
heroku addons:create heroku-postgresql-connection-pooler:50
```

Update connection string to use pooler endpoint.

## Cost Estimation

- Dyno: $7-50/month (free tier available)
- PostgreSQL: $9-400/month
- Free tier: Limited resources, suitable for testing

Heroku is beginner-friendly but costs more than alternatives.
