---
name: planetscale
description: PlanetScale serverless MySQL hosting, connection management, and deployment
when-to-use: PlanetScale database setup, serverless MySQL, branch-based development
keywords: PlanetScale, serverless, MySQL, connection pooling, branches
priority: high
requires: schema.md, connection-pooling.md, mysql.md, schema.types.md
related: deployment.md, driver-adapters.md, mysql.md
---

# PlanetScale Integration

Type definitions in `/plugins/nextjs-expert/skills/prisma-7/references/interfaces/schema.types.md`.

PlanetScale serverless MySQL hosting and Prisma 7 integration.

## Connection Setup

```env
# .env - PlanetScale connection URL
DATABASE_URL="mysql://[username]:[password]@[host]/[database]?sslaccept=strict"
```

Get connection string from PlanetScale dashboard:

```bash
pscale connection create [database] [branch] --output-format json
```

---

## Schema Configuration

```typescript
/**
 * PlanetScale Prisma schema configuration.
 * relationMode = "prisma" is REQUIRED for PlanetScale.
 * See `GeneratorConfig` and `ModelDefinition` in /plugins/nextjs-expert/skills/prisma-7/references/interfaces/schema.types.md
 * @module modules/database/src/schema
 */

/**
 * User model for PlanetScale MySQL.
 * @typedef {Object} User
 * @property {string} id - Primary key using CUID
 * @property {string} email - Unique email address
 * @property {string} name - User name
 * @property {Post[]} posts - One-to-many posts relation
 * @module modules/database/src/models/user
 */
type User = {
  id: string;
  email: string;
  name: string;
  posts: Post[];
}

/**
 * Post model with relation to User.
 * @typedef {Object} Post
 * @property {string} id - Primary key
 * @property {string} title - Post title
 * @property {string} authorId - Foreign key to User
 * @property {User} author - Related author
 * @module modules/database/src/models/post
 */
type Post = {
  id: string;
  title: string;
  authorId: string;
  author: User;
}
```

**CRITICAL**: Always include `relationMode = "prisma"` in datasource for PlanetScale.

---

## Foreign Keys Limitation

PlanetScale doesn't support foreign keys without explicit handling:

```typescript
/**
 * Foreign key constraint handling in PlanetScale.
 * PlanetScale requires relationMode = "prisma" to enforce relations in application.
 * See `ForeignKeyConstraint` in /plugins/nextjs-expert/skills/prisma-7/references/interfaces/relations.types.md
 * @module modules/database/src/models/relations
 */

/**
 * Post model with application-enforced foreign key.
 * Database does not enforce FK, Prisma handles validation.
 * @typedef {Object} PostWithFK
 * @property {string} id - Primary key
 * @property {string} authorId - Foreign key to User (app-enforced)
 * @property {User} author - Related author
 * @module modules/database/src/models/post
 */
type PostWithFK = {
  id: string;
  authorId: string; // FK handled by Prisma, not database
  author: User;
}
```

Always set `relationMode = "prisma"` in datasource for PlanetScale.

---

## Branching Strategy

```bash
# Create development branch
pscale branch create [database] develop

# Deploy schema changes to main via PR
pscale branch create [database] schema-update
npx prisma migrate deploy
pscale branch open-prs [database] schema-update
```

Environment variables per branch:

```env
# .env.local - Development branch
DATABASE_URL="mysql://user:pass@ps.us-east-2.psdb.cloud/[database:develop]?sslaccept=strict"

# .env.production - Main branch
DATABASE_URL="mysql://user:pass@ps.us-east-2.psdb.cloud/[database]?sslaccept=strict"
```

---

## Connection Pooling

PlanetScale includes built-in connection pooling:

```env
# Proxy port for pooling (port 3306)
DATABASE_URL="mysql://user:pass@host:3306/db?sslaccept=strict"

# Direct connection (port 3307) - use for migrations
DATABASE_URL="mysql://user:pass@host:3307/db?sslaccept=strict"
```

Use proxy port (3306) for application, direct (3307) for schema changes.

---

## Migrations

```bash
# Use direct connection for migrations
DATABASE_URL="mysql://...@host:3307/db" npx prisma migrate deploy

# Or use Prisma Migrate Push
npx prisma migrate dev
```

---

## Limitations

1. **No foreign keys** - Use `relationMode = "prisma"`
2. **Limited connection time** - Pooling required
3. **No raw foreign key constraints** - Prisma enforces
4. **Connection limits** - Depending on plan

---

## Production Deployment

```typescript
/**
 * PlanetScale Prisma client singleton pattern for production deployment.
 * @module modules/database/src/client
 */
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Get or create Prisma client (singleton).
 * Prevents multiple client instances in development.
 * @returns {PrismaClient} Prisma client instance
 * @module modules/database/src/client
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma

/**
 * Get all users from PlanetScale.
 * @returns {Promise<User[]>} List of users
 * @module modules/api/users/route
 */
export async function GET() {
  const users = await prisma.user.findMany()
  return Response.json(users)
}
```

---

## Best Practices

1. **Use proxy port** - For all application queries
2. **Connection pooling** - Built-in, no extra config
3. **Relationmode = "prisma"** - Always set this
4. **Branch per feature** - Safe schema changes
5. **Monitor connections** - Dashboard shows limits
