---
name: "Prisma vs Kysely"
description: "Comparison between Prisma and Kysely query builder"
when-to-use: "When choosing between Prisma ORM and Kysely query builder"
keywords: ["kysely", "query-builder", "comparison", "sql"]
priority: 2
requires: ["prisma-7", "databases"]
related: ["vs-drizzle", "vs-typeorm"]
---

# Prisma vs Kysely

## Feature Comparison Matrix

| Feature | Prisma | Kysely |
|---------|--------|--------|
| **Type** | ORM | Query Builder |
| **Type Safety** | ✅ Full | ✅ Full |
| **Abstraction** | High | Low (close to SQL) |
| **Database Support** | 4 | 10+ |
| **Learning Curve** | ⭐ Easy | ⭐⭐⭐ Steep |
| **SQL Control** | Limited | ✅ Full |
| **Bundle Size** | ~100KB | ~80KB |
| **Ecosystem** | Growing | Minimal |

## Core Difference

**Prisma** = ORM (high-level, models/relations)
**Kysely** = Query Builder (low-level, SQL-like)

**Prisma: High-level ORM (SOLID: DIP - abstract from SQL)**
```typescript
// Module: src/services/user.service.ts
// Purpose: User service with ORM abstraction (SOLID: SRP - business logic)
import type { Prisma } from "@prisma/client";

/**
 * Get user with posts
 * Type-safe, no SQL knowledge required
 * Module path: src/services/user.service.ts
 */
async function getUserWithPosts(
  prisma: Prisma.PrismaClient,
  id: number
) {
  return prisma.user.findUnique({
    where: { id },
    include: { posts: true },
  });
}
```

**Kysely: Type-safe query builder (SOLID: DIP - SQL-like but type-checked)**
```typescript
// Module: src/db/queries/user.ts
// Purpose: Query building with SQL control (SOLID: SRP - query building)
import type { Database } from "@/db/types";
import { Kysely } from "kysely";

/**
 * Get user with posts using query builder
 * More SQL control but more verbose
 * Module path: src/db/queries/user.ts
 */
async function getUserWithPosts(db: Kysely<Database>, id: number) {
  return db
    .selectFrom("users")
    .selectAll()
    .leftJoin("posts", "posts.userId", "=", "users.id")
    .where("users.id", "=", id)
    .executeTakeFirst();
}
```

## Key Differences

### Schema & Types

**Prisma: Auto-generated types from schema (SOLID: DRY - single source of truth)**
```prisma
// Module: prisma/schema.prisma
model User {
  id    Int     @id
  email String
  posts Post[]
}
```

```typescript
// Generated automatically by Prisma
// Module: node_modules/.prisma/client/index.d.ts
type User = {
  id: number;
  email: string;
};
// → prisma.user (full autocomplete & type safety)
```

**Kysely: Manual type definitions (SOLID: Requires explicit types)**
```typescript
// Module: src/db/types.ts
// Purpose: Database schema types (SOLID: SRP - type definitions only)

/**
 * Database schema interface for type-safe queries
 * @interface Database
 */
export interface Database {
  users: {
    id: number;
    email: string;
    createdAt: Date;
  };
  posts: {
    id: number;
    userId: number;
    title: string;
  };
}

// Usage: db<Database>.selectFrom('users')...
// Type-safe but requires manual updates when schema changes
```

### Query Complexity

**Prisma: Simple CRUD (SOLID: Abstraction, less control)**
```typescript
// Module: src/services/user.service.ts
// Purpose: Simple user lookup (SOLID: SRP - business logic only)
const user = await prisma.user.findUnique({ where: { id: 1 } });
```

**Kysely: Complex queries with aggregations (SOLID: DIP - SQL control)**
```typescript
// Module: src/db/queries/search.ts
// Purpose: Complex search queries (SOLID: SRP - query building)
import type { Database } from "@/db/types";
import { Kysely, sql } from "kysely";

/**
 * Search users by email/name with post count
 * Module path: src/db/queries/search.ts
 */
async function searchActiveUsers(
  db: Kysely<Database>,
  search: string
) {
  return db
    .selectFrom("users")
    .leftJoin("posts", "posts.userId", "=", "users.id")
    .where((eb) =>
      eb.or([
        eb("users.email", "like", `%${search}%`),
        eb("users.name", "like", `%${search}%`),
      ])
    )
    .groupBy("users.id")
    .having("count(posts.id)", ">", 0)
    .select([
      "users.id",
      "users.email",
      sql`count(posts.id)`.as("postCount"),
    ])
    .execute();
}
```

## Strengths & Weaknesses

### Prisma Advantages
- 🟢 ORM convenience
- 🟢 Automatic relations handling
- 🟢 Built-in migrations
- 🟢 Better for CRUD

### Prisma Limitations
- 🔴 Not suitable for complex queries
- 🔴 Less control
- 🔴 Fewer database options

### Kysely Advantages
- 🟢 SQL-like syntax
- 🟢 More database support
- 🟢 Better for complex queries
- 🟢 Lightweight

### Kysely Limitations
- 🔴 No ORM features
- 🔴 Manual relationship handling
- 🔴 Steeper learning curve
- 🔴 No built-in migrations

## When to Use Each

| Scenario | Best Choice | Why |
|----------|------------|-----|
| REST API with CRUD | Prisma | Faster development |
| Complex reporting | Kysely | SQL control |
| Small queries needed | Prisma | Simplicity |
| Advanced filtering | Kysely | Power |
| New project | Prisma | Better DX |
| Migration from raw SQL | Kysely | Closer to SQL |

## Can They Work Together?

Yes! You can use both:
```typescript
// Use Prisma for standard CRUD
const user = await prisma.user.findUnique({ where: { id: 1 } });

// Use Kysely for complex queries
const stats = await db
  .selectFrom('users')
  .where('createdAt', '>', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
  .groupBy('email')
  .select(eb => [
    'email',
    eb.fn.count('id').as('count')
  ])
  .execute();
```
