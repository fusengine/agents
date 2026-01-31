---
name: soft-delete
description: Soft delete pattern implementation using middleware and extensions
when-to-use: Preserving data history, recovery capability, compliance requirements
keywords: soft-delete, deleted-at, middleware, extension, logical-delete
priority: medium
requires: null
related: middleware.md, extensions.md, triggers.md
---

# Prisma 7 Soft Delete Pattern

## Schema Setup

```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  deletedAt DateTime?

  posts     Post[]
  comments  Comment[]

  @@index([deletedAt])
  @@map("users")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  userId    String
  deletedAt DateTime?

  user      User @relation(fields: [userId], references: [id])

  @@index([userId, deletedAt])
  @@map("posts")
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  postId    String
  userId    String
  deletedAt DateTime?

  post      Post @relation(fields: [postId], references: [id])
  user      User @relation(fields: [userId], references: [id])

  @@index([postId, deletedAt])
  @@map("comments")
}
```

---

## Middleware Implementation

```typescript
// modules/cores/db/src/extensions/softDeleteExtension.ts
import { Prisma } from '@prisma/client'

const SOFT_DELETE_MODELS = ['User', 'Post', 'Comment']

/**
 * Extension for soft delete pattern using extensions (modern approach)
 * Replaces deprecated middleware with type-safe extension API
 * @module modules/cores/db/src/extensions
 */
export const softDeleteExtension = Prisma.defineExtension({
  query: {
    $allModels: {
      /**
       * Auto-filter deleted records from findUnique
       */
      async findUnique({ model, args, query }) {
        if (SOFT_DELETE_MODELS.includes(model)) {
          args.where = {
            ...args.where,
            deletedAt: null,
          }
        }
        return query(args)
      },

      /**
       * Auto-filter deleted records from findMany
       */
      async findMany({ model, args, query }) {
        if (SOFT_DELETE_MODELS.includes(model)) {
          args.where = {
            ...args.where,
            deletedAt: null,
          }
        }
        return query(args)
      },

      /**
       * Replace hard delete with soft delete
       */
      async delete({ model, args, query }) {
        if (SOFT_DELETE_MODELS.includes(model)) {
          return this.update({
            where: args.where,
            data: { deletedAt: new Date() },
          })
        }
        return query(args)
      },

      /**
       * Replace deleteMany with soft delete
       */
      async deleteMany({ model, args, query }) {
        if (SOFT_DELETE_MODELS.includes(model)) {
          return this.updateMany({
            where: args.where,
            data: { deletedAt: new Date() },
          })
        }
        return query(args)
      },
    },
  },
})
```

```typescript
// modules/cores/db/src/prisma.ts
import { softDeleteExtension } from './extensions/softDeleteExtension'

/**
 * Prisma client with soft delete extension
 * @module modules/cores/db/src
 */
export const prisma = new PrismaClient({ adapter }).$extends(
  softDeleteExtension
)
```

---

## Extension Pattern (Modern)

```typescript
// modules/cores/db/src/extensions/softDeleteFullExtension.ts
import { Prisma } from '@prisma/client'

/**
 * Complete soft delete extension covering all query types
 * More comprehensive than basic extension pattern
 * @module modules/cores/db/src/extensions
 */
export const softDeleteFullExtension = Prisma.defineExtension({
  query: {
    $allModels: {
      /**
       * Filter deleted from findUnique
       */
      async findUnique({ args, query }) {
        args.where = { ...args.where, deletedAt: null }
        return query(args)
      },

      /**
       * Filter deleted from findUniqueOrThrow
       */
      async findUniqueOrThrow({ args, query }) {
        args.where = { ...args.where, deletedAt: null }
        return query(args)
      },

      /**
       * Filter deleted from findFirst
       */
      async findFirst({ args, query }) {
        args.where = { ...args.where, deletedAt: null }
        return query(args)
      },

      /**
       * Filter deleted from findMany
       */
      async findMany({ args, query }) {
        args.where = { ...args.where, deletedAt: null }
        return query(args)
      },

      /**
       * Filter deleted records before update
       */
      async update({ args, query }) {
        args.where = { ...args.where, deletedAt: null }
        return query(args)
      },

      /**
       * Filter deleted records before updateMany
       */
      async updateMany({ args, query }) {
        args.where = { ...args.where, deletedAt: null }
        return query(args)
      },

      /**
       * Soft delete single record
       */
      async delete({ args, query }) {
        return this.update({
          where: args.where,
          data: { deletedAt: new Date() },
        })
      },

      /**
       * Soft delete multiple records
       */
      async deleteMany({ args, query }) {
        return this.updateMany({
          where: args.where,
          data: { deletedAt: new Date() },
        })
      },
    },
  },
})

/**
 * Create Prisma client with soft delete
 * @module modules/cores/db/src
 */
export function createPrismaWithSoftDelete() {
  return new (require('@prisma/client').PrismaClient)({
    adapter: new (require('@prisma/adapter-pg').PrismaPg)({
      connectionString: process.env.DATABASE_URL!,
    }),
  }).$extends(softDeleteFullExtension)
}
```

---

## Usage Patterns

```typescript
// modules/users/src/queries/softDeleteQueries.ts
import { prisma } from '@/modules/cores/db/src/prisma'

/**
 * Fetch all active (non-deleted) users
 * Automatically filters deleted records via extension
 * @module modules/users/src/queries
 */
export async function getActiveUsers() {
  return prisma.user.findMany({
    orderBy: { name: 'asc' },
  })
}

/**
 * Soft delete user by setting deletedAt timestamp
 * Does not remove record from database
 * @module modules/users/src/queries
 */
export async function deleteUser(userId: string) {
  return prisma.user.delete({
    where: { id: userId },
  })
}

/**
 * Restore previously deleted user
 * Clears deletedAt timestamp
 * @module modules/users/src/queries
 */
export async function restoreUser(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { deletedAt: null },
  })
}

/**
 * View all users including deleted (raw query)
 * Bypasses soft delete filtering extension
 * @module modules/users/src/queries
 */
export async function getAllUsersIncludingDeleted() {
  return prisma.$queryRaw`
    SELECT * FROM users
  `
}

/**
 * Find users deleted within specific timeframe
 * Useful for compliance and cleanup operations
 * @module modules/users/src/queries
 */
export async function getRecentlyDeleted(days: number = 30) {
  return prisma.$queryRaw`
    SELECT *
    FROM users
    WHERE "deletedAt" > NOW() - INTERVAL '${days} days'
      AND "deletedAt" IS NOT NULL
    ORDER BY "deletedAt" DESC
  `
}
```

---

## Database Trigger Alternative

```sql
-- prisma/migrations/20240101000000_soft_delete_trigger/migration.sql

CREATE OR REPLACE FUNCTION soft_delete_user()
RETURNS TRIGGER AS $$
BEGIN
  NEW."deletedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- No actual DELETE allowed
CREATE TRIGGER prevent_user_delete
BEFORE DELETE ON "User"
FOR EACH ROW
EXECUTE FUNCTION soft_delete_user();
```

---

## Cascading Soft Deletes

```typescript
// modules/users/src/actions/cascadingDelete.ts
import { prisma } from '@/modules/cores/db/src/prisma'

/**
 * Soft delete user with all related records in transaction
 * Ensures cascading deletion atomicity
 * @module modules/users/src/actions
 * @param userId User ID to delete with all relations
 */
export async function softDeleteUserWithCascade(userId: string) {
  const now = new Date()

  return prisma.$transaction(async (tx) => {
    // Soft delete all related comments
    await tx.comment.updateMany({
      where: { user: { id: userId } },
      data: { deletedAt: now },
    })

    // Soft delete all user's posts
    await tx.post.updateMany({
      where: { userId },
      data: { deletedAt: now },
    })

    // Finally soft delete the user
    return tx.user.update({
      where: { id: userId },
      data: { deletedAt: now },
    })
  })
}
```

---

## Cleanup Archived Data

```typescript
// modules/cores/db/src/scripts/cleanupArchived.ts
import { prisma } from '../prisma'

/**
 * Permanently delete old soft-deleted records
 * Used for data retention policies and GDPR compliance
 * Executes raw queries to bypass soft delete extension
 * @module modules/cores/db/src/scripts
 * @param daysRetention Number of days to retain deleted records (default: 90)
 */
export async function permanentlyDeleteOldRecords(
  daysRetention: number = 90
) {
  const cutoffDate = new Date()
  cutoffDate.setDate(
    cutoffDate.getDate() - daysRetention
  )

  // Use transaction for atomicity
  // Raw queries bypass soft delete extension
  return prisma.$transaction(async (tx) => {
    // Delete old comments first (foreign key constraint)
    await tx.$executeRaw`
      DELETE FROM "Comment"
      WHERE "deletedAt" < ${cutoffDate}
    `

    // Delete old posts
    await tx.$executeRaw`
      DELETE FROM "Post"
      WHERE "deletedAt" < ${cutoffDate}
    `

    // Delete old users last
    await tx.$executeRaw`
      DELETE FROM "User"
      WHERE "deletedAt" < ${cutoffDate}
    `
  })
}

/**
 * Run cleanup job (typically scheduled task)
 */
if (require.main === module) {
  permanentlyDeleteOldRecords(90)
    .then(() => console.log('Cleanup completed'))
    .catch((err) => console.error('Cleanup failed:', err))
}
```
