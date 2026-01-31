---
name: "Drizzle to Prisma Migration"
description: "Step-by-step guide to migrate from Drizzle ORM to Prisma"
when-to-use: "When migrating from Drizzle ORM to Prisma"
keywords: ["drizzle", "migration", "guide", "step-by-step"]
priority: 3
requires: ["prisma-7", "vs-drizzle"]
related: ["migrate-from-typeorm", "migrate-from-sequelize"]
---

# Migrate from Drizzle to Prisma

## Step 1: Install Prisma

```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

## Step 2: Database Introspection or Manual Schema

```bash
# Option A: Auto-introspect existing database
npx prisma db pull

# Option B: Convert Drizzle schema manually
```

## Step 3: Convert Drizzle Schema to Prisma

### Before (Drizzle)
```typescript
import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow()
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  userId: integer('user_id').notNull().references(() => users.id)
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts)
}));

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id]
  })
}));
```

### After (Prisma)
```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  createdAt DateTime @default(now())
  posts Post[]
}

model Post {
  id    Int     @id @default(autoincrement())
  title String
  userId Int
  user  User @relation(fields: [userId], references: [id])
}
```

## Step 4: Query Migration

```typescript
// Module: src/services/user.service.ts
// Purpose: Query patterns migration (SOLID: SRP - query abstraction)
import { eq, or } from "drizzle-orm";
import type { Prisma } from "@prisma/client";

/**
 * Find by ID
 * SOLID: DIP - depend on abstraction (not SQL)
 */
// Drizzle (SQL-like syntax)
const user = await db.query.users.findFirst({
  where: eq(users.id, 1),
});
// Prisma (ORM-level abstraction)
const user = await prisma.user.findUnique({
  where: { id: 1 },
});

/**
 * With relations
 */
// Drizzle (manual join setup)
const user = await db.query.users.findFirst({
  where: eq(users.id, 1),
  with: { posts: true },
});
// Prisma (automatic relation inclusion)
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true },
});

/**
 * Find many
 */
// Drizzle
const users = await db.select().from(users);
// Prisma
const users = await prisma.user.findMany();

/**
 * With filter
 */
// Drizzle (operator-based filtering)
const users = await db
  .select()
  .from(users)
  .where(eq(users.email, "user@example.com"));
// Prisma (object notation)
const users = await prisma.user.findMany({
  where: { email: "user@example.com" },
});

/**
 * Complex OR conditions
 */
// Drizzle (or() operator)
const users = await db
  .select()
  .from(users)
  .where(
    or(
      eq(users.email, "user@example.com"),
      eq(users.role, "admin")
    )
  );
// Prisma (explicit OR clause)
const users = await prisma.user.findMany({
  where: {
    OR: [
      { email: "user@example.com" },
      { role: "admin" },
    ],
  },
});

/**
 * Create
 */
// Drizzle (insert().values().returning())
const user = await db
  .insert(users)
  .values({ email: "new@example.com" })
  .returning();
// Prisma (create())
const user = await prisma.user.create({
  data: { email: "new@example.com" },
});

/**
 * Update
 */
// Drizzle (update().set().where())
await db
  .update(users)
  .set({ name: "New Name" })
  .where(eq(users.id, 1));
// Prisma (update())
await prisma.user.update({
  where: { id: 1 },
  data: { name: "New Name" },
});

/**
 * Delete
 */
// Drizzle
await db.delete(users).where(eq(users.id, 1));
// Prisma
await prisma.user.delete({ where: { id: 1 } });

/**
 * Raw SQL when needed
 */
// Drizzle (sql`` template)
const result = await db.execute(sql`SELECT * FROM users`);
// Prisma ($queryRaw)
const result = await prisma.$queryRaw`SELECT * FROM users`;
```

## Step 5: Migrations

```bash
# Initialize Prisma migrations
npx prisma migrate dev --name initial

# For existing database, mark migration as applied
npx prisma migrate resolve --rolled-back migration_name
```

## Step 6: Update Environment

```env
# Change from Drizzle config to Prisma
DATABASE_URL="postgresql://..."
```

## Step 7: Update Application Code

Replace imports:
```typescript
// Remove
import { db } from '@/db';
import { users, posts } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Add
import { prisma } from '@/lib/prisma';
```

## Step 8: Testing & Validation

```bash
# Run your test suite
npm test

# Check performance hasn't degraded
# Verify all queries work correctly
# Check type safety with TypeScript
npx tsc --noEmit
```

## Step 9: Cleanup

```bash
# Remove Drizzle dependencies
npm uninstall drizzle-orm drizzle-kit

# Remove Drizzle config files
rm drizzle.config.ts
rm -rf drizzle/
```

## Key Differences to Watch

| Aspect | Drizzle | Prisma |
|--------|---------|--------|
| **Relations** | Manual + relations() | Implicit in schema |
| **Filtering** | SQL builder (eq, or, etc.) | Object notation |
| **Transactions** | db.transaction() | prisma.$transaction() |
| **Raw SQL** | sql`` template | $queryRaw/Raw templates |
| **Validation** | External (zod, etc.) | Application layer |

## Checklist

- [ ] Prisma installed and initialized
- [ ] Schema.prisma created from Drizzle schema
- [ ] Database introspected or schema validated
- [ ] All queries converted to Prisma equivalents
- [ ] Relations verified to work correctly
- [ ] Migrations created and applied
- [ ] Tests passing with new queries
- [ ] Raw SQL queries converted to $queryRaw
- [ ] Drizzle dependencies removed
- [ ] Environment variables updated
