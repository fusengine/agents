---
name: client-api
description: Prisma 7 Client API methods reference
when-to-use: Understanding available Prisma Client methods
keywords: findMany, findUnique, create, update, delete, API, methods
priority: high
requires: client.md
related: queries.md, relations.md
---

# Client API Reference

Prisma Client methods for Prisma 7.

## Query Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `findUnique` | `T \| null` | Find by unique field |
| `findUniqueOrThrow` | `T` | Find or throw P2025 |
| `findFirst` | `T \| null` | Find first match |
| `findFirstOrThrow` | `T` | Find first or throw |
| `findMany` | `T[]` | Find all matches |

---

## Write Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `create` | `T` | Create record |
| `createMany` | `{ count }` | Create multiple |
| `createManyAndReturn` | `T[]` | Create and return |
| `update` | `T` | Update record |
| `updateMany` | `{ count }` | Update multiple |
| `updateManyAndReturn` | `T[]` | Update and return |
| `upsert` | `T` | Update or create |
| `delete` | `T` | Delete record |
| `deleteMany` | `{ count }` | Delete multiple |

---

## Aggregation Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `count` | `number` | Count records |
| `aggregate` | `object` | Aggregate values |
| `groupBy` | `array` | Group and aggregate |

---

## Common Options

### where

```typescript
// modules/cores/db/queries.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Find users with various filter conditions
 */
const findUsers = () => prisma.user.findMany({
  where: {
    // Exact match
    email: 'alice@example.com',

    // Operators: gt (greater), lte (less than equal), contains, startsWith, endsWith
    age: { gt: 18, lte: 65 },
    name: { contains: 'john', mode: 'insensitive' },
    email: { startsWith: 'admin', endsWith: '.com' },

    // Logical: OR, AND, NOT
    OR: [{ role: 'ADMIN' }, { role: 'MOD' }],
    AND: [{ active: true }, { verified: true }],
    NOT: { status: 'BANNED' },

    // Relations: some, none, is, isNot
    posts: { some: { published: true } },
    profile: { is: { bio: { not: null } } },
  },
})
```

---

### select

```typescript
// modules/cores/db/queries.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Find users with selective fields only
 * Improves query performance by excluding unused fields
 */
const findUsersSelective = () => prisma.user.findMany({
  select: {
    id: true,
    name: true,
    posts: {
      select: { title: true },  // Nested select
    },
  },
})
```

---

### include

```typescript
// modules/cores/db/queries.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Find user with all relations included
 * Includes all fields plus specified relations
 */
const findUserWithRelations = (userId: string) =>
  prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: true,  // Include all posts
      profile: true,  // Include profile
      _count: { select: { posts: true } },  // Include count of posts
    },
  })
```

---

## orderBy

```typescript
// modules/cores/db/queries.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Find users sorted by creation date, then name
 * Multiple orderBy fields applied in order
 */
const findUsersSorted = () => prisma.user.findMany({
  orderBy: [
    { createdAt: 'desc' },  // Most recent first
    { name: 'asc' },  // Then alphabetical
  ],
})

/**
 * Order by related model field (author name)
 */
const findPostsByAuthor = () => prisma.post.findMany({
  orderBy: { author: { name: 'asc' } },
})

/**
 * Order by aggregated count (most posts first)
 */
const findTopUsersByPosts = () => prisma.user.findMany({
  orderBy: { posts: { _count: 'desc' } },
})
```

---

### Pagination

```typescript
// modules/cores/db/queries.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Offset-based pagination (skip page 2)
 * Good for small datasets
 */
const findUsersPage = (page: number = 1) =>
  prisma.user.findMany({
    skip: (page - 1) * 10,  // Skip 20 items for page 3
    take: 10,  // Return 10 items
  })

/**
 * Cursor-based pagination (more efficient for large datasets)
 * Use last item's id as cursor for next page
 */
const findUsersCursor = (lastId?: string) =>
  prisma.user.findMany({
    take: 10,
    skip: lastId ? 1 : 0,  // Skip the cursor
    cursor: lastId ? { id: lastId } : undefined,
  })
```

---

### distinct

```typescript
// modules/cores/db/queries.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Find distinct countries from users
 * Returns only unique values
 */
const findUniqueCountries = () =>
  prisma.user.findMany({
    distinct: ['country'],  // Only unique countries
    select: { country: true },
  })
```

---

### omit

```typescript
// modules/cores/db/queries.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Find users excluding sensitive fields
 * Opposite of select: return all except specified
 */
const findUsersWithoutPassword = () =>
  prisma.user.findMany({
    omit: { password: true },  // Exclude password field
  })
```

---

## Raw Methods

| Method | Description |
|--------|-------------|
| `$queryRaw` | Execute SELECT |
| `$executeRaw` | Execute INSERT/UPDATE/DELETE |
| `$queryRawUnsafe` | Unsafe raw query |
| `$executeRawUnsafe` | Unsafe raw execute |

---

## Lifecycle Methods

| Method | Description |
|--------|-------------|
| `$connect()` | Open connection |
| `$disconnect()` | Close connection |
| `$on()` | Event listener |
| `$use()` | Middleware (deprecated) |
| `$extends()` | Add extensions |
| `$transaction()` | Run transaction |
