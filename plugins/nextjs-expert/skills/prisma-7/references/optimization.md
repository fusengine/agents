---
name: optimization
description: Prisma 7 query optimization and performance patterns
when-to-use: Improving query performance, N+1 prevention, indexing
keywords: N+1, pagination, cursor, index, select, performance
priority: high
requires: queries.md
related: typedsql.md
---

# Query Optimization

Performance patterns for Prisma 7 following SOLID principles.

## N+1 Prevention

```typescript
// lib/db/users.service.ts
import type { User, Post } from '@prisma/client'

/**
 * @description Fetches users with all related posts in a single query
 * @param includeRelations Whether to include related posts
 * @returns Promise<User[]> Users with posts loaded via include strategy
 * @example
 * const users = await getUsersWithPosts()
 */
export async function getUsersWithPosts(): Promise<(User & { posts: Post[] })[]> {
  // ✅ Single query with include (best for SOLID)
  return prisma.user.findMany({
    include: { posts: true },
  })
}

/**
 * @description Batch load posts for multiple users (alternative strategy)
 * @param userIds Array of user IDs
 * @returns Promise<Record<string, Post[]>> Posts grouped by user ID
 */
export async function getUserPostsMap(userIds: string[]): Promise<Record<string, Post[]>> {
  const posts = await prisma.post.findMany({
    where: { authorId: { in: userIds } },
  })

  return posts.reduce((acc, post) => {
    if (!acc[post.authorId]) acc[post.authorId] = []
    acc[post.authorId].push(post)
    return acc
  }, {} as Record<string, Post[]>)
}
```

---

## Select Only Needed Fields

```typescript
// lib/db/queries/user-queries.ts
import type { Prisma } from '@prisma/client'

/** @description Minimal user projection for list views */
export const userListSelect = {
  id: true,
  name: true,
  email: true,
} satisfies Prisma.UserSelect

/**
 * @description Fetches users with only necessary fields
 * @returns Promise<Array> Users with minimal field set
 * @example
 * const users = await getUsersList()
 */
export async function getUsersList() {
  // ✅ Returns only needed fields (SOLID: Single Responsibility)
  return prisma.user.findMany({
    select: userListSelect,
  })
}

/**
 * @description Fetches user with full profile data
 * @param userId User identifier
 * @returns Promise<User | null> User with profile fields
 */
export async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })
}
```

---

## Cursor Pagination

```typescript
// lib/db/pagination.ts
import type { Post } from '@prisma/client'

interface PaginationOptions {
  cursor?: string
  take?: number
}

/**
 * @description Implements cursor-based pagination for posts
 * @param options Pagination cursor and limit
 * @returns Promise<Post[]> Posts in descending creation order
 * @example
 * const page1 = await paginatePosts({ take: 20 })
 * const page2 = await paginatePosts({ cursor: page1[0].id, take: 20 })
 */
export async function paginatePosts(
  options: PaginationOptions
): Promise<Post[]> {
  // ✅ Cursor pagination (more efficient than offset)
  return prisma.post.findMany({
    take: options.take ?? 20,
    ...(options.cursor && {
      skip: 1,
      cursor: { id: options.cursor },
    }),
    orderBy: { createdAt: 'desc' },
  })
}
```

---

## Batch Operations

```typescript
// lib/db/batch-operations.ts
import type { User } from '@prisma/client'

/**
 * @description Batch verifies multiple users efficiently
 * @param userIds Array of user IDs to verify
 * @returns Promise<{count: number}> Update result with affected count
 * @example
 * const result = await verifyUsers(['id1', 'id2', 'id3'])
 * console.log(`Verified ${result.count} users`)
 */
export async function verifyUsers(userIds: string[]) {
  // ✅ Single query for batch update (SOLID: avoid N+1)
  return prisma.user.updateMany({
    where: { id: { in: userIds } },
    data: { verified: true, verifiedAt: new Date() },
  })
}

/**
 * @description Batch creates multiple users in transaction
 * @param userData Array of user creation data
 * @returns Promise<User[]> Created users
 */
export async function createUsersInBatch(
  userData: { email: string; name: string }[]
) {
  // ✅ Batch insert with skipDuplicates for idempotency
  return prisma.user.createMany({
    data: userData,
    skipDuplicates: true,
  })
}
```

---

## Relation Load Strategy

```typescript
// lib/db/relation-strategies.ts
import type { User, Post } from '@prisma/client'

/**
 * @description Uses JOIN strategy (single query, suitable for small result sets)
 * @returns Promise<(User & {posts: Post[]})[]> Users with posts
 */
export async function getUsersWithPostsJoin(): Promise<(User & { posts: Post[] })[]> {
  // ✅ JOIN strategy (default) - single query
  return prisma.user.findMany({
    relationLoadStrategy: 'join',
    include: { posts: true },
  })
}

/**
 * @description Uses QUERY strategy (parallel queries, better for heavy server-side processing)
 * @returns Promise<(User & {posts: Post[]})[]> Users with posts
 */
export async function getUsersWithPostsParallel(): Promise<(User & { posts: Post[] })[]> {
  // ✅ Query strategy - parallel queries (better for complex computations)
  return prisma.user.findMany({
    relationLoadStrategy: 'query',
    include: { posts: true },
  })
}
```

---

## Index Recommendations

Schema indexing patterns for optimal query performance:

```prisma
// schema.prisma - SOLID: DRY indexing strategy
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  role      Role     @default(USER)
  createdAt DateTime @default(now())

  // ✅ Composite indexes for common filter combinations
  @@index([role])
  @@index([createdAt])
  @@index([role, createdAt])
}

model Post {
  id       String @id @default(cuid())
  authorId String
  author   User   @relation(fields: [authorId], references: [id])

  // ✅ Always index foreign keys (critical for performance)
  @@index([authorId])
}
```

---

## Query Logging & Monitoring

```typescript
// lib/db/logging.ts
import type { PrismaClient } from '@prisma/client'

/**
 * @description Enables slow query monitoring for performance debugging
 * @param prisma PrismaClient instance
 * @param thresholdMs Query duration threshold in milliseconds
 * @returns void
 */
export function enableSlowQueryLogging(
  prisma: PrismaClient,
  thresholdMs: number = 100
): void {
  prisma.$on('query', (e) => {
    if (e.duration > thresholdMs) {
      console.warn(
        `[SLOW_QUERY] ${e.duration}ms: ${e.query}`,
        { params: e.params }
      )
    }
  })
}

// Usage in lib/db/client.ts
const prisma = new PrismaClient({
  log: [{ level: 'query', emit: 'event' }],
})

if (process.env.NODE_ENV === 'development') {
  enableSlowQueryLogging(prisma, 100)
}
```

---

## Best Practices (SOLID Compliance)

### S - Single Responsibility
- Create separate service functions for each query pattern
- Separate data access logic from business logic

### O - Open/Closed
- Use query builders and projections (userListSelect) for reusability
- Extend behavior via logging and monitoring without modifying core

### L - Liskov Substitution
- Query functions are interchangeable based on return type

### I - Interface Segregation
- Small, focused projection objects (userListSelect)
- Specific query options (PaginationOptions)

### D - Dependency Inversion
- Query functions depend on abstractions (PrismaClient type)
- Never export raw Prisma client
