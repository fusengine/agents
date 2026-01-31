---
name: sqlite
description: SQLite for development and embedded applications with Prisma 7
when-to-use: Local development, SQLite databases, embedded applications, testing
keywords: SQLite, development, embedded, file-based, testing
priority: medium
requires: schema.md, schema.types.md
related: driver-adapters.md, testing.md, turso.md
---

# SQLite with Prisma 7

Type definitions in `/plugins/nextjs-expert/skills/prisma-7/references/interfaces/schema.types.md`.

SQLite for local development and embedded applications.

## Setup

```bash
npm install sqlite3
```

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client"
}
```

---

## Schema Example

```typescript
/**
 * SQLite schema for local development.
 * See `ModelDefinition` in /plugins/nextjs-expert/skills/prisma-7/references/interfaces/schema.types.md
 * @module modules/database/src/schema
 */

/**
 * User model with posts relation.
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
 * Post model with author relation.
 * @typedef {Object} Post
 * @property {string} id - Primary key
 * @property {string} title - Post title
 * @property {string} content - Post content
 * @property {string} authorId - Foreign key to User
 * @property {User} author - Related author
 * @property {Date} createdAt - Creation timestamp
 * @module modules/database/src/models/post
 */
type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: User;
  createdAt: Date;
}
```

---

## Create and Migrate

```bash
# Create database and apply migrations
npx prisma migrate dev --name init

# This creates dev.db in your project root
```

---

## Development Workflow

```typescript
/**
 * SQLite Prisma client singleton for development.
 * @module modules/database/src/client
 */
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Get or create Prisma client (singleton pattern).
 * @returns {PrismaClient} Prisma client instance
 * @module modules/database/src/client
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma

/**
 * Get all users from SQLite.
 * @returns {Promise<User[]>} List of users
 * @module modules/api/users/route
 */
export async function GET(): Promise<Response> {
  const users = await prisma.user.findMany()
  return Response.json(users)
}

/**
 * Create new user in SQLite.
 * @param {Request} request - HTTP request with email and name
 * @returns {Promise<Response>} Created user with 201 status
 * @module modules/api/users/route
 */
export async function POST(request: Request): Promise<Response> {
  const { email, name } = await request.json()

  const user = await prisma.user.create({
    data: { email, name },
  })

  return Response.json(user, { status: 201 })
}
```

---

## Testing

```typescript
/**
 * SQLite user tests with Prisma.
 * @module modules/database/__tests__/users.test
 */
import { prisma } from '@/lib/db'

describe('Users', () => {
  /**
   * Clear database before each test for isolation.
   * @returns {Promise<void>}
   * @module modules/database/__tests__/users.test
   */
  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  /**
   * Disconnect Prisma after all tests complete.
   * @returns {Promise<void>}
   * @module modules/database/__tests__/users.test
   */
  afterAll(async () => {
    await prisma.$disconnect()
  })

  /**
   * Test user creation in SQLite.
   * @returns {Promise<void>}
   * @module modules/database/__tests__/users.test
   */
  test('creates user', async () => {
    const user = await prisma.user.create({
      data: { email: 'test@example.com', name: 'Test' },
    })

    expect(user.email).toBe('test@example.com')
  })
})
```

---

## Seeding

```typescript
/**
 * SQLite database seeding with Prisma.
 * @module prisma/seed
 */
import { prisma } from '@/lib/db'

/**
 * Seed database with initial data.
 * Creates test user with associated posts.
 * @returns {Promise<void>}
 * @module prisma/seed
 */
async function main(): Promise<void> {
  // Clear existing data
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  // Create seed data
  const user = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      posts: {
        create: [
          { title: 'Getting Started', content: 'Learn Prisma' },
          { title: 'Advanced Queries', content: 'Complex queries' },
        ],
      },
    },
    include: { posts: true },
  })

  console.log('Created user:', user)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

```bash
# Run seed to populate SQLite with test data
npx prisma db seed
```

---

## Embedded Applications

```typescript
/**
 * SQLite configuration for embedded applications (Electron/Tauri).
 * @module modules/database/src/embedded-client
 */
import { PrismaClient } from '@prisma/client'
import { app } from 'electron'
import path from 'path'

/**
 * Initialize Prisma for Electron/Tauri with SQLite.
 * Uses app user data directory for database file.
 * @returns {PrismaClient} Prisma client with embedded database
 * @module modules/database/src/embedded-client
 */
function initEmbeddedDatabase(): PrismaClient {
  const dbPath = app.getPath('userData')

  return new PrismaClient({
    datasources: {
      db: {
        url: `file:${path.join(dbPath, 'app.db')}`,
      },
    },
  })
}

export const prisma = initEmbeddedDatabase()
```

---

## Limitations

| Feature | SQLite | Status |
|---------|--------|--------|
| **Foreign Keys** | ✅ | Supported (enable explicit) |
| **Transactions** | ✅ | Basic support |
| **UUID** | ❌ | Use cuid() instead |
| **Arrays** | ❌ | Use JSON field |
| **JSONB** | ❌ | Use JSON |
| **Full-text search** | ✅ | Via FTS5 |
| **Concurrent writes** | ⚠️ | Single writer |

---

## Enable Foreign Keys

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
  // Add this to enable FK constraints
}
```

```sql
-- Enable in migrations
PRAGMA foreign_keys = ON;
```

---

## Production Considerations

SQLite is file-based and single-writer. Use only for:

- ✅ Desktop applications
- ✅ Mobile apps (with Turso for sync)
- ✅ Development/testing
- ✅ Low-traffic embedded systems

For server applications with concurrent writes, use PostgreSQL/MySQL.

---

## Best Practices

1. **Dev only** - Excellent for local development
2. **Migrations** - Use prisma migrate
3. **Seeding** - Automate with seed script
4. **Testing** - Fast in-memory testing
5. **Backups** - Simple file backup strategy
