---
title: N+1 Problem
description: Detecting and solving N+1 query problems in Prisma 7
keywords: [n-plus-one, query, performance, relations, include]
---

# N+1 Problem Detection & Solutions

## Problem Definition

### Classic N+1 Anti-Pattern

```typescript
// lib/examples/n-plus-one-antipattern.ts - NEVER DO THIS!

/**
 * @deprecated This demonstrates an N+1 problem antipattern
 * @description Fetches 1 user + N posts queries = O(N) complexity
 * @returns Promise<User[]> Users with posts (INEFFICIENT)
 */
export async function getNPlusOneAntipattern(): Promise<any[]> {
  // ❌ BAD: Fetches user once, then post per user
  // Database hits: 1 (users) + 100 (posts) = 101 total queries!
  const users = await prisma.user.findMany()

  for (const user of users) {
    const posts = await prisma.post.findMany({
      where: { authorId: user.id },
    })
    // Process posts...
  }

  return users
}
```

---

## Solution 1: Include Relations (Eager Loading)

```typescript
// lib/db/user-relations.service.ts
import type { User, Post } from '@prisma/client'

/**
 * @description Fetches all users with their posts in single query
 * @returns Promise<(User & {posts: Post[]})[]> Users with eager-loaded posts
 * @example
 * const users = await getUsersWithPosts()
 * // Single database query, all data ready
 */
export async function getUsersWithPosts(): Promise<
  (User & { posts: Post[] })[]
> {
  // ✅ GOOD: Single query with include
  // Uses JOIN internally - efficient for most cases
  return prisma.user.findMany({
    include: { posts: true },
  })
}

/**
 * @description Fetches users with posts limit for better performance
 * @param postsLimit Maximum posts per user
 * @returns Promise Users with limited posts
 */
export async function getUsersWithRecentPosts(postsLimit: number = 5) {
  // ✅ GOOD: Include with filtering and limiting
  return prisma.user.findMany({
    include: {
      posts: {
        take: postsLimit,
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}
```

---

## Solution 2: Select with Relations (Selective Loading)

```typescript
// lib/db/queries/user-with-posts.ts
import type { Prisma } from '@prisma/client'

/** @description Projection for user list with post titles */
export const userWithPostTitlesSelect = {
  id: true,
  email: true,
  name: true,
  posts: {
    select: {
      id: true,
      title: true,
      publishedAt: true,
    },
  },
} satisfies Prisma.UserSelect

/**
 * @description Fetches users with selective post fields
 * @returns Promise Users with selected fields only
 * @example
 * const users = await getUsersWithSelectiveFields()
 */
export async function getUsersWithSelectiveFields() {
  // ✅ GOOD: Selective loading reduces data transfer
  // SOLID: Only include fields actually needed
  return prisma.user.findMany({
    select: userWithPostTitlesSelect,
  })
}

/**
 * @description Advanced projection with nested counts
 * @returns Promise Users with field counts
 */
export async function getUsersWithPostCount() {
  // ✅ GOOD: Use _count for aggregations instead of loading all data
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      _count: {
        select: {
          posts: true,
          comments: true,
        },
      },
    },
  })
}
```

---

## Solution 3: Batch Loading (Dataloader Pattern)

```typescript
// lib/db/batch-loader.ts
import type { User, Post } from '@prisma/client'

/**
 * @description Batch loads posts for multiple users
 * @param userIds Array of user identifiers
 * @returns Promise<Record<string, Post[]>> Posts grouped by user ID
 * @example
 * const userIds = ['user1', 'user2', 'user3']
 * const postsByUser = await batchLoadUserPosts(userIds)
 * // Single query: SELECT * FROM posts WHERE authorId IN (...)
 */
export async function batchLoadUserPosts(
  userIds: string[]
): Promise<Record<string, Post[]>> {
  if (userIds.length === 0) return {}

  // ✅ GOOD: Single query for all user IDs
  const posts = await prisma.post.findMany({
    where: { authorId: { in: userIds } },
  })

  // ✅ SOLID: Map posts to user in application layer
  return posts.reduce((acc, post) => {
    if (!acc[post.authorId]) {
      acc[post.authorId] = []
    }
    acc[post.authorId].push(post)
    return acc
  }, {} as Record<string, Post[]>)
}

/**
 * @description Combines user fetch with batch post loading
 * @returns Promise Users with posts loaded in parallel
 */
export async function getUsersWithBatchLoadedPosts(): Promise<(User & { posts: Post[] })[]> {
  // ✅ GOOD: Parallel pattern - could use Promise.all for multiple queries
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
  })

  const postsByUser = await batchLoadUserPosts(users.map(u => u.id))

  return users.map(user => ({
    ...user,
    posts: postsByUser[user.id] ?? [],
  }))
}
```

---

## Detection & Monitoring

```typescript
// lib/db/monitoring.ts
import type { PrismaClient } from '@prisma/client'

interface QueryLog {
  query: string
  duration: number
  count: number
  timestamp: Date
}

const queryLog = new Map<string, QueryLog>()

/**
 * @description Enables N+1 detection logging
 * @param prisma PrismaClient instance
 * @returns void
 * @example
 * enableNPlusOneDetection(prisma)
 */
export function enableNPlusOneDetection(prisma: PrismaClient): void {
  prisma.$on('query', (e) => {
    const normalized = e.query
      .replace(/\$\d+/g, '$X') // Normalize parameter numbers
      .toLowerCase()

    if (queryLog.has(normalized)) {
      const log = queryLog.get(normalized)!
      log.count++
      log.duration += e.duration

      // ✅ Warn if same query executed multiple times
      if (log.count > 1 && log.count % 10 === 0) {
        console.warn(`[N+1 DETECTED] Query repeated ${log.count} times`)
        console.warn(`Sample: ${e.query}`)
      }
    } else {
      queryLog.set(normalized, {
        query: e.query,
        duration: e.duration,
        count: 1,
        timestamp: new Date(),
      })
    }
  })
}

/**
 * @description Prints N+1 detection report
 * @returns void
 */
export function printNPlusOneReport(): void {
  const repeatedQueries = Array.from(queryLog.values())
    .filter(log => log.count > 1)
    .sort((a, b) => b.count - a.count)

  if (repeatedQueries.length > 0) {
    console.table(repeatedQueries.map(log => ({
      count: log.count,
      duration: `${log.duration}ms`,
      query: log.query.substring(0, 60) + '...',
    })))
  }
}
```

---

## Comparison: Choose the Right Pattern

| Pattern | Query Count | Use Case | SOLID Rating |
|---------|-------------|----------|--------------|
| **Include** | 1 (JOIN) | Simple 1:N relations | ✅ Excellent |
| **Select** | 1 (JOIN) | Specific field subsets | ✅ Excellent |
| **Batch** | 1 + 1 | Complex aggregations | ✅ Good |
| **Lazy** | N+1 | Optional relations | ❌ Poor |
