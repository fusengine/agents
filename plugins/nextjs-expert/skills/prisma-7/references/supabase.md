---
name: supabase
description: Supabase PostgreSQL integration, pooling, realtime, and authentication
when-to-use: Supabase PostgreSQL setup, connection pooling, realtime features
keywords: Supabase, PostgreSQL, pooling, realtime, authentication, vector
priority: high
requires: schema.md, postgresql.md, connection-pooling.md, schema.types.md
related: deployment.md, driver-adapters.md, postgresql.md
---

# Supabase with Prisma 7

Type definitions in `/plugins/nextjs-expert/skills/prisma-7/references/interfaces/schema.types.md`.

Supabase PostgreSQL integration and Prisma 7 setup.

## Connection Setup

```env
# .env - Supabase connection strings
# Use Transaction Pooler for serverless/Vercel
DATABASE_URL="postgresql://postgres:[password]@[project].supabase.co:6543/postgres?schema=public"

# Use Session Pooler for direct connections
DATABASE_URL="postgresql://postgres:[password]@[project].pooler.supabase.com:5432/postgres?schema=public"
```

Find credentials in Supabase dashboard: Database → Connection pooling

---

## Schema Configuration

```typescript
/**
 * Supabase PostgreSQL schema with Prisma 7.
 * See `GeneratorConfig` and `ModelDefinition` in /plugins/nextjs-expert/skills/prisma-7/references/interfaces/schema.types.md
 * @module modules/database/src/schema
 */

/**
 * User model with Supabase Auth integration.
 * @typedef {Object} User
 * @property {string} id - Primary key using CUID
 * @property {string} email - Unique email address
 * @property {string} name - User name
 * @property {Post[]} posts - One-to-many posts relation
 * @property {string | null} authId - Supabase Auth user ID
 * @module modules/database/src/models/user
 */
type User = {
  id: string;
  email: string;
  name: string;
  posts: Post[];
  authId?: string;
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

## Connection Pooling

Supabase provides built-in connection pooling via PgBouncer:

```env
# Transaction Pooler (for serverless) - Default
DATABASE_URL="postgresql://postgres:pass@[project].supabase.co:6543/postgres"

# Session Pooler (persistent connections)
DATABASE_URL="postgresql://postgres:pass@[project].pooler.supabase.com:5432/postgres"

# Direct connection (for migrations)
DIRECT_URL="postgresql://postgres:pass@[project].db.supabase.co:5432/postgres"
```

Use Transaction Pooler for Vercel/serverless.

---

## PostgreSQL Features

Supabase supports all PostgreSQL features:

```prisma
model Product {
  id          String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name        String
  description String @db.Text
  price       Decimal @db.Decimal(10, 2)
  metadata    Json   @db.JsonB
  tags        String[]
  search      Unsupported("tsvector")?
}
```

---

## Vector Search (pgvector)

```prisma
model Document {
  id        String   @id @default(cuid())
  title     String
  content   String
  embedding Unsupported("vector")?
}
```

Enable pgvector extension:

```sql
-- In Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS vector;
```

```typescript
// Query with embeddings
const similar = await prisma.$queryRaw`
  SELECT id, title, content
  FROM "Document"
  ORDER BY embedding <-> $1::vector
  LIMIT 10
`
```

---

## Realtime with Supabase

Combine Prisma with Supabase Realtime:

```typescript
/**
 * Supabase realtime listener integration with Prisma.
 * @module modules/realtime/src/listeners/posts
 */
import { createClient } from '@supabase/supabase-js'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { prisma } from '@/lib/db'

/**
 * Initialize Supabase client for realtime.
 * @returns {ReturnType<typeof createClient>} Supabase client instance
 * @module modules/realtime/src/client
 */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Listen for new posts via Supabase realtime.
 * @param {Function} callback - Handler for new posts
 * @returns {void}
 * @module modules/realtime/src/listeners/posts
 */
export function subscribeToPostChanges(callback: (post: Post) => void): void {
  supabase
    .channel('posts')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'Post' },
      (payload: RealtimePostgresChangesPayload<Post>) => {
        console.log('New post:', payload.new)
        callback(payload.new as Post)
      }
    )
    .subscribe()
}
```

---

## Authentication Integration

```typescript
/**
 * Supabase authentication with Prisma user sync.
 * @module modules/auth/src/services/user-sync
 */
import { createClient } from '@supabase/supabase-js'
import type { Session } from '@supabase/supabase-js'
import { prisma } from '@/lib/db'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Get or create user from Supabase Auth session.
 * Syncs Supabase auth user to Prisma database.
 * @param {Session} session - Supabase auth session
 * @returns {Promise<User>} User from database
 * @module modules/auth/src/services/user-sync
 */
export async function getOrCreateUser(session: Session): Promise<User> {
  let user = await prisma.user.findUnique({
    where: { authId: session.user.id },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        authId: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.name || 'Unknown',
      },
    })
  }

  return user
}
```

---

## Migrations

```bash
# Set both DATABASE_URL and DIRECT_URL
export DATABASE_URL="postgresql://...@supabase.co:6543/postgres"
export DIRECT_URL="postgresql://...@db.supabase.co:5432/postgres"

# Run migrations
npx prisma migrate deploy
```

---

## Best Practices

1. **Use Transaction Pooler** - For serverless
2. **Set directUrl** - For migrations via DIRECT_URL
3. **Enable vector** - If using embeddings
4. **RLS policies** - Implement Row-Level Security
5. **Monitor connections** - Dashboard shows pooling stats
