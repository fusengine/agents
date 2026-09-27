---
name: "Prisma vs Drizzle"
description: "Comprehensive comparison between Prisma and Drizzle ORM"
when-to-use: "When deciding between Prisma and Drizzle ORM"
keywords: ["drizzle", "comparison", "orm", "query-builder"]
priority: 2
requires: ["prisma-7", "databases"]
related: ["vs-typeorm", "vs-sequelize", "migrate-from-drizzle"]
---

# Prisma vs Drizzle ORM

## Feature Comparison Matrix

| Feature | Prisma | Drizzle |
|---------|--------|---------|
| **Type Safety** | ✅ Full | ✅ Full (type-safe queries) |
| **Query Builder** | DSL | SQL-like (better for complex) |
| **Schema Definition** | `.prisma` | TypeScript |
| **Migrations** | Built-in | Built-in |
| **Database Support** | 4 | 10+ |
| **Learning Curve** | ⭐ Easy | ⭐⭐ Moderate |
| **Bundle Size** | ~100KB | ~50KB |
| **SQL Control** | ⚠️ Limited | ✅ Full |

## Key Differences

### Schema Definition

**Prisma: High-level declarative DSL (SOLID: SRP - schema abstraction)**
```prisma
// Module: prisma/schema.prisma
// Purpose: Database schema definition (SOLID: SRP - schema only, not queries)
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  posts Post[]  // Implicit relation
}

model Post {
  id     Int    @id @default(autoincrement())
  userId Int
  user   User   @relation(fields: [userId], references: [id])
}
```

**Drizzle: TypeScript-based schema (SOLID: SRP - but requires manual relations)**
```typescript
// Module: src/db/schema.ts
// Purpose: Database schema with explicit SQL control (SOLID: SRP - schema definition)
import {
  pgTable,
  serial,
  varchar,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

/**
 * Users table definition
 * Module path: src/db/schema.ts - Tables schema
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});

/**
 * Posts table definition with foreign key
 * Module path: src/db/schema.ts - Tables schema
 */
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
});

// Relations (SOLID: Separate concern - must be defined manually)
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));

// Type inference
export type User = InferSelectModel<typeof users>;
export type Post = InferSelectModel<typeof posts>;
```

### Query Syntax

**Prisma: Object-based declarative API (SOLID: High-level abstraction)**
```typescript
// Module: src/services/user.service.ts
// Purpose: User queries (SOLID: SRP - query logic only)
import type { PrismaClient } from "@/generated/prisma/client"; // v7: generated path

/**
 * Fetch user with all posts
 * Type-safe: Return type guaranteed by Prisma
 */
async function getUserWithPosts(
  prisma: PrismaClient,
  email: string
) {
  return prisma.user.findUnique({
    where: { email },
    include: { posts: true }, // Type-checked at compile time
  });
}
```

**Drizzle: SQL-like query builder (SOLID: Low-level SQL control)**
```typescript
// Module: src/db/queries/user.ts
// Purpose: User queries with SQL-like control (SOLID: SRP - query building)
import { db } from "@/db";
import { users, posts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof users>;
type Post = InferSelectModel<typeof posts>;

interface UserWithPosts extends User {
  posts: Post[];
}

/**
 * Fetch user with posts using SQL-like syntax
 * More control but requires manual join building
 * Module path: src/db/queries/user.ts - Query building
 */
async function getUserWithPosts(
  email: string
): Promise<UserWithPosts[]> {
  return db
    .select()
    .from(users)
    .leftJoin(posts, eq(users.id, posts.userId)) // Manual join
    .where(eq(users.email, email));
}
```

## Comparison Breakdown

### Prisma Benefits
- 🟢 Simpler for basic CRUD
- 🟢 Auto-generated client
- 🟢 Easier onboarding
- 🟢 Better documentation

### Prisma Trade-offs
- 🔴 Less control over complex queries
- 🔴 Fewer database options
- 🔴 Vendor lock-in potential

### Drizzle Benefits
- 🟢 SQL-like syntax for power users
- 🟢 Smaller bundle size
- 🟢 More database support
- 🟢 Better control & flexibility

### Drizzle Trade-offs
- 🔴 Steeper learning curve
- 🔴 More verbose for simple queries
- 🔴 Fewer ecosystem tools

## Use Case Guide

| Scenario | Best Choice | Why |
|----------|------------|-----|
| Rapid prototyping | Prisma | Faster to start |
| Complex SQL queries | Drizzle | Better control |
| Multi-database project | Drizzle | More DB support |
| Team learning ORM | Prisma | Easier to learn |
| Performance-critical | Drizzle | Lighter, more control |

## Migration Path

See [migrate-from-drizzle.md](./migrate-from-drizzle.md) if switching from Drizzle to Prisma.
