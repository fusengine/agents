---
title: Query Optimization
description: Query analysis, EXPLAIN, and slow query detection in Prisma 7
keywords: [query, optimization, explain, performance, analysis]
---

# Query Optimization

Query analysis patterns with SOLID Next.js principles.

## Query Analysis

### EXPLAIN Plan for Debugging

```typescript
// lib/db/analysis.ts
import type { PrismaClient } from '@prisma/client'

/**
 * @description Analyzes query execution plan using EXPLAIN ANALYZE
 * @param sql Raw SQL query to analyze
 * @returns Promise<any> Query execution plan
 * @throws Error if query has syntax issues or index is missing
 * @example
 * const plan = await analyzeQueryPlan(
 *   `SELECT * FROM "User" WHERE email = $1`
 * )
 */
export async function analyzeQueryPlan(sql: string): Promise<any> {
  try {
    return await prisma.$queryRaw(
      `EXPLAIN ANALYZE ${sql}`
    )
  } catch (error) {
    console.error('Query analysis failed:', error)
    return null
  }
}

/**
 * @description Fetches active users with minimal field projection
 * @returns Promise<{id: string; email: string}[]> Active users
 */
export async function getActiveUsers() {
  // ✅ SOLID: Only select needed fields to reduce query size
  return prisma.user.findMany({
    where: { status: 'active' },
    select: { id: true, email: true },
  })
}
```

### Query Logging & Metrics

```typescript
// lib/db/metrics.ts
import type { PrismaClient } from '@prisma/client'

interface QueryMetrics {
  duration: number
  query: string
  timestamp: Date
}

/**
 * @description Configures Prisma query logging with performance metrics
 * @param prisma PrismaClient instance
 * @returns void
 * @example
 * configureQueryLogging(prisma)
 */
export function configureQueryLogging(prisma: PrismaClient): void {
  prisma.$on('query', (e) => {
    const metrics: QueryMetrics = {
      duration: e.duration,
      query: e.query,
      timestamp: new Date(),
    }

    // ✅ Log slow queries for performance analysis
    if (e.duration > 100) {
      console.warn('[SLOW_QUERY]', metrics)
    }

    if (process.env.DEBUG_QUERIES === 'true') {
      console.debug('[QUERY_LOG]', metrics)
    }
  })
}
```

---

## Identifying Slow Queries

### Common Bottlenecks & Solutions

```typescript
// lib/db/user-queries.ts
import type { Prisma, User, Post, Comment } from '@prisma/client'

/**
 * @description Efficient user fetch with selective nested fields
 * @param userId User identifier
 * @returns Promise User with posts and comments count
 * @example
 * const user = await getOptimizedUser('user_123')
 */
export async function getOptimizedUser(userId: string) {
  // ✅ GOOD: Selects only needed fields (SOLID: Single Responsibility)
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      posts: {
        select: { id: true, title: true },
        take: 5, // Limit nested results
      },
      _count: {
        select: { comments: true }, // Count instead of loading
      },
    },
  })
}

/**
 * @description Anti-pattern example (commented for documentation)
 * NEVER do this in production - fetches all posts and comments!
 */
// ❌ ANTI-PATTERN (for reference only):
// const user = await prisma.user.findUnique({
//   where: { id: userId },
//   include: { posts: true, comments: true }
// })
```

---

## Index Optimization Strategy

```prisma
// schema.prisma - Optimized indexing for SOLID query performance
model User {
  id        String   @id @default(cuid())
  email     String   @unique // ✅ Automatic index for uniqueness
  status    String   @index  // ✅ Index frequent filter column
  createdAt DateTime @default(now())

  posts     Post[]
  comments  Comment[]

  // ✅ Composite index for common WHERE combinations
  @@index([status, createdAt])
  @@index([email, status])
}

model Post {
  id        String @id @default(cuid())
  title     String
  authorId  String
  createdAt DateTime @default(now())

  author    User @relation(fields: [authorId], references: [id])

  // ✅ Foreign key index (always required for relationship queries)
  @@index([authorId])
  @@index([authorId, createdAt])
}

model Comment {
  id        String @id @default(cuid())
  userId    String
  postId    String
  createdAt DateTime @default(now())

  user      User @relation(fields: [userId], references: [id])
  post      Post @relation(fields: [postId], references: [id])

  // ✅ Index for common filter patterns
  @@index([userId])
  @@index([postId])
  @@index([userId, createdAt])
}
```

---

## Pagination Patterns

```typescript
// lib/db/pagination.ts
import type { Prisma } from '@prisma/client'

interface PaginationParams {
  page?: number
  pageSize?: number
}

/**
 * @description Offset-based pagination (use for small datasets only)
 * @param params Pagination parameters (page, pageSize)
 * @returns Promise Query result with pagination
 * @example
 * const page1 = await paginateUsers({ page: 1, pageSize: 10 })
 */
export async function paginateUsers(params: PaginationParams) {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 10

  // ✅ Offset pagination for UI with page numbers
  return prisma.user.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  })
}

/**
 * @description Cursor-based pagination (recommended for performance)
 * @param cursor Last item's ID or undefined for first page
 * @param limit Number of items per page
 * @returns Promise Users using cursor pagination
 */
export async function getCursorPaginatedUsers(
  cursor?: string,
  limit: number = 10
) {
  // ✅ Cursor pagination (efficient for large datasets)
  return prisma.user.findMany({
    take: limit,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
    },
  })
}
```
