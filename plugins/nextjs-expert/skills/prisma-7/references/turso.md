---
name: turso
description: Turso/libSQL edge database, embedded replicas, and distributed queries
when-to-use: Turso edge database setup, distributed SQLite, edge computing
keywords: Turso, libSQL, edge database, SQLite, embedded replicas, distributed
priority: medium
requires: schema.md, driver-adapters.md, schema.types.md
related: sqlite.md, deployment.md, connection-pooling.md
---

# Turso Edge Database

Type definitions in `/plugins/nextjs-expert/skills/prisma-7/references/interfaces/schema.types.md`.

Turso (libSQL) edge-distributed SQLite with Prisma 7.

## Connection Setup

```env
# .env - Turso connection URL
DATABASE_URL="libsql://[database]-[org].turso.io?authToken=[token]"
```

Get from Turso CLI:

```bash
turso db show [database] --json
```

---

## Prisma Configuration

Turso requires the libSQL driver adapter:

```bash
npm install @libsql/client
```

```prisma
datasource db {
  provider  = "sqlite"
  url       = "file:./dev.db"
  shadowDatabaseUrl = "file:./dev-shadow.db"
}

generator client {
  provider = "prisma-client"
  // Enable for Turso/libSQL
  previewFeatures = ["driverAdapters"]
}
```

```typescript
/**
 * Turso/libSQL Prisma client initialization with driver adapter.
 * @module modules/database/src/client
 */
import { PrismaClient } from '@prisma/client'
import { createClient } from '@libsql/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import type { Client as LibSQLClient } from '@libsql/client'

/**
 * Initialize Turso database client.
 * Creates libSQL client for edge-distributed SQLite.
 * @returns {LibSQLClient} LibSQL client instance
 * @module modules/database/src/client
 */
function initLibSQL(): LibSQLClient {
  return createClient({
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
}

/**
 * Prisma client configured with Turso adapter.
 * @returns {PrismaClient} Prisma client with libSQL adapter
 * @module modules/database/src/client
 */
const libsql = initLibSQL()
const adapter = new PrismaLibSQL(libsql)

export const prisma = new PrismaClient({ adapter })
```

---

## Schema Example

```typescript
/**
 * Turso schema with edge-replicated SQLite.
 * See `ModelDefinition` in /plugins/nextjs-expert/skills/prisma-7/references/interfaces/schema.types.md
 * @module modules/database/src/schema
 */

/**
 * User model for Turso edge database.
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
 * Post model with publication status.
 * @typedef {Object} Post
 * @property {string} id - Primary key
 * @property {string} title - Post title
 * @property {string} content - Post content
 * @property {boolean} published - Publication status
 * @property {string} authorId - Foreign key to User
 * @property {User} author - Related author
 * @property {Date} createdAt - Creation timestamp
 * @module modules/database/src/models/post
 */
type Post = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  author: User;
  createdAt: Date;
}
```

---

## Embedded Replicas

Turso creates local SQLite replicas on edge servers:

```typescript
/**
 * Turso automatic edge replication - no code changes needed.
 * Queries automatically route to nearest replica.
 * @param {string} userId - User identifier
 * @returns {Promise<User | null>} User from nearest edge replica
 * @module modules/database/src/services/users
 */
export async function getUserById(userId: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })
  // Automatic replication - query routed to nearest edge server
  return user
}
```

Benefits:
- Ultra-low latency (edge servers)
- Reads from local copies
- Writes to primary
- Automatic sync

---

## Deployment

### Vercel Integration

```typescript
/**
 * Vercel Edge Function with Turso database.
 * @module modules/api/users/route
 */
import { prisma } from '@/lib/db'
import type { NextRequest } from 'next/server'

/**
 * Get all users on Vercel Edge.
 * Turso embedded replicas serve data from nearest edge location.
 * @param {NextRequest} request - HTTP request
 * @returns {Promise<Response>} JSON response with users
 * @module modules/api/users/route
 */
export async function GET(request: NextRequest): Promise<Response> {
  const users = await prisma.user.findMany()
  return Response.json(users)
}

export const config = {
  runtime: 'edge', // Runs on Vercel edge servers
}
```

Embedded replicas serve queries from local edge servers.

---

## Limitations

SQLite limitations apply:

```typescript
// ❌ Limited to SQLite features
// No CASE insensitive text search
// No JSONB (use JSON)
// No arrays
// Limited string functions

// ✅ Use Turso for:
// Simple applications
// Edge-distributed reads
// Lightweight databases
```

---

## Performance Features

1. **Embedded replicas** - Data lives at the edge
2. **Write-through primary** - Consistency guaranteed
3. **Replication lag** - Sub-second to primary
4. **Global distribution** - Automatic

```typescript
/**
 * Turso read/write distribution pattern.
 * Reads serve from local edge replica, writes go through primary.
 * @module modules/database/src/services/posts
 */

/**
 * Get published posts (reads from local edge replica).
 * Fast read from nearest edge location.
 * @returns {Promise<Post[]>} Published posts
 * @module modules/database/src/services/posts
 */
export async function getPublishedPosts(): Promise<Post[]> {
  return await prisma.post.findMany({
    where: { published: true },
  })
  // Read from local replica - ultra-fast
}

/**
 * Publish post (writes through primary, syncs to replicas).
 * Write consistency guaranteed across all replicas.
 * @param {string} postId - Post identifier
 * @returns {Promise<Post>} Updated post
 * @module modules/database/src/services/posts
 */
export async function publishPost(postId: string): Promise<Post> {
  return await prisma.post.update({
    where: { id: postId },
    data: { published: true },
  })
  // Write through primary, syncs to all replicas
}
```

---

## Migrations

```bash
# Migrate locally
npx prisma migrate dev --name init

# Push to Turso (requires authentication)
turso db shell [database] < prisma/migrations/...migration.sql
```

---

## Cost Model

- **Free tier**: 1000 rows, rate limited
- **Pro**: Pay per request + storage
- **Enterprise**: Dedicated

Embedded replicas included in all plans.

---

## Best Practices

1. **Use embedded replicas** - Key advantage
2. **Understand SQLite limits** - Not PostgreSQL
3. **Optimize for edge** - Local queries faster
4. **Batch writes** - Reduce write frequency
5. **Monitor replication lag** - Usually negligible
