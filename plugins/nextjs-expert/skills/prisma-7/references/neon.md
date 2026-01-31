---
name: neon
description: Neon serverless PostgreSQL, branching strategy, cold starts, and scaling
when-to-use: Neon PostgreSQL setup, branching development, serverless scaling
keywords: Neon, serverless PostgreSQL, branching, cold starts, autoscaling
priority: high
requires: schema.md, postgresql.md, connection-pooling.md, schema.types.md
related: supabase.md, deployment.md, driver-adapters.md
---

# Neon Serverless PostgreSQL

Type definitions in `/plugins/nextjs-expert/skills/prisma-7/references/interfaces/schema.types.md`.

Neon serverless PostgreSQL integration with Prisma 7.

## Connection Setup

```env
# .env - Neon connection string
DATABASE_URL="postgresql://neon_user:[password]@[project].neon.tech/neon_db?sslmode=require"

# With pooling (recommended for serverless)
DATABASE_URL="postgresql://neon_user:[password]@[project]-pooler.neon.tech/neon_db?sslmode=require"
```

Get from Neon dashboard: Projects → Connection string

---

## Connection Pooling

Neon includes built-in pooling via Session and Transaction modes:

```env
# Default (HTTP/pooling)
DATABASE_URL="postgresql://...@[project]-pooler.neon.tech/db?sslmode=require"

# Direct TCP connection (for migrations/DDL)
DATABASE_URL="postgresql://...@[project].neon.tech/db?sslmode=require"
```

Prisma configuration with Neon pooling:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}
```

Set separate env vars:

```env
DATABASE_URL="postgresql://...@[project]-pooler.neon.tech/db"
DIRECT_DATABASE_URL="postgresql://...@[project].neon.tech/db"
```

---

## Branching Strategy

Neon allows dev branches per feature:

```bash
# Create branch via API
curl https://console.neon.tech/api/v2/projects/[project-id]/branches \
  -X POST \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"name":"feature/auth"}'

# Get branch endpoint
curl https://console.neon.tech/api/v2/projects/[project-id]/branches
```

Schema branch workflow:

```bash
# Feature branch DB
DATABASE_URL="postgresql://...@[project]/feature-auth-db"

# Test migrations safely
npx prisma migrate dev --name add_2fa

# When ready, merge to main branch
```

---

## Cold Starts

Neon scales to zero. Cold starts occur after 5 minutes of inactivity:

```typescript
/**
 * Handle Neon cold starts with retry logic.
 * After 5 minutes of inactivity, Neon scales to zero.
 * @module modules/database/src/utils/cold-start
 */
import { prisma } from '@/lib/db'

/**
 * Ensure database connection is active.
 * Retries on cold start with exponential backoff.
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<void>}
 * @throws {Error} After max retries exhausted
 * @module modules/database/src/utils/cold-start
 */
export async function ensureConnection(maxRetries: number = 3): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await prisma.$queryRaw`SELECT 1`
      return
    } catch (error) {
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)))
      } else {
        throw error
      }
    }
  }
}

/**
 * API route handler with cold start protection.
 * @returns {Promise<Response>} JSON response with users
 * @module modules/api/users/route
 */
export async function GET(): Promise<Response> {
  await ensureConnection()
  const users = await prisma.user.findMany()
  return Response.json(users)
}
```

---

## Autoscaling

Neon automatically scales compute units based on demand:

```env
# Configure autoscaling in dashboard or API
# Minimum compute: 0.25 (half unit)
# Maximum compute: 10 (depends on plan)
```

No Prisma configuration needed - Neon handles autoscaling transparently.

---

## Schema Example

```typescript
/**
 * Neon PostgreSQL schema with roles and posts.
 * See `ModelDefinition` and `EnumDefinition` in /plugins/nextjs-expert/skills/prisma-7/references/interfaces/schema.types.md
 * @module modules/database/src/schema
 */

/**
 * User roles enum for authorization.
 * @enum {string}
 * @module modules/database/src/models/role
 */
enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

/**
 * User model with role and posts.
 * @typedef {Object} User
 * @property {string} id - Primary key using CUID
 * @property {string} email - Unique email address
 * @property {string} name - User name
 * @property {Post[]} posts - One-to-many posts relation
 * @property {Role} role - User authorization role
 * @module modules/database/src/models/user
 */
type User = {
  id: string;
  email: string;
  name: string;
  posts: Post[];
  role: Role;
}

/**
 * Post model with author relation.
 * @typedef {Object} Post
 * @property {string} id - Primary key
 * @property {string} title - Post title
 * @property {string} content - Post content
 * @property {string} authorId - Foreign key to User
 * @property {User} author - Related author
 * @module modules/database/src/models/post
 */
type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: User;
}
```

---

## Migrations with Neon

```bash
# Push schema changes to main branch
npx prisma migrate deploy

# Or use feature branch for testing
DIRECT_DATABASE_URL="postgresql://...@[project]/feature-branch" \
  npx prisma migrate deploy
```

---

## Production Setup

```typescript
/**
 * Neon Prisma client singleton pattern for serverless.
 * Handles connection reuse across Lambda/Function invocations.
 * @module modules/database/src/client
 */
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Get or create Prisma client (singleton pattern).
 * Prevents connection pool exhaustion in serverless environments.
 * @returns {PrismaClient} Prisma client instance
 * @module modules/database/src/client
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma
```

---

## Cost Optimization

1. **Use pooling** - Reduces connection overhead
2. **Autoscaling** - Pay only for compute used
3. **Branching** - Dev/test branches cost less
4. **Scale to zero** - Free tier auto-scales to 0

---

## Best Practices

1. **Handle cold starts** - Add retry logic
2. **Use pooling** - Essential for serverless
3. **Set directUrl** - For schema migrations
4. **Monitor autoscaling** - Dashboard shows metrics
5. **Use branches** - Safe testing before production
