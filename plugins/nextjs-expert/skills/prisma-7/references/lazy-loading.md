---
title: Lazy vs Eager Loading
description: Lazy and eager loading patterns in Prisma 7
keywords: [lazy, eager, loading, relations, performance]
---

# Lazy vs Eager Loading Patterns

Loading strategies with SOLID Next.js principles.

## Eager Loading Strategy

### Include Pattern (Full Relations)

```typescript
// lib/db/eager-loading.ts
import type { User, Post, UserProfile } from '@prisma/client'

/**
 * @description Loads user with all related data eagerly
 * @param userId User identifier
 * @returns Promise User with posts and profile already loaded
 * @example
 * const user = await getUserWithRelations('user_123')
 * console.log(user.posts) // No additional queries needed
 */
export async function getUserWithRelations(userId: string): Promise<
  User & { posts: Post[]; profile: UserProfile | null }
> {
  // ✅ GOOD: Eager load all needed relations in one query
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: true,
      profile: true,
    },
  })
}

/**
 * @description Loads user with limited and filtered related data
 * @param userId User identifier
 * @param postLimit Maximum posts to load
 * @returns Promise User with filtered relations
 */
export async function getUserWithRecentRelations(
  userId: string,
  postLimit: number = 5
) {
  // ✅ GOOD: Eager load with filtering and ordering
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        take: postLimit,
        orderBy: { createdAt: 'desc' },
      },
      profile: true,
    },
  })
}
```

### Select Pattern (Selective Eager Loading)

```typescript
// lib/db/queries/selective-load.ts
import type { Prisma } from '@prisma/client'

/** @description User with post titles and counts only */
export const userWithPostsSummarySelect = {
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
 * @description Selectively loads user with specific nested fields
 * @param userId User identifier
 * @returns Promise User with selected fields
 * @example
 * const user = await getUserWithSelectiveFields('user_123')
 * // Only loaded: id, email, name, posts(id, title, publishedAt)
 */
export async function getUserWithSelectiveFields(userId: string) {
  // ✅ GOOD: Select pattern reduces data transfer
  return prisma.user.findUnique({
    where: { id: userId },
    select: userWithPostsSummarySelect,
  })
}

/**
 * @description Complex select with nested filtering
 * @param userId User identifier
 * @returns Promise User with filtered nested data
 */
export async function getUserWithPublishedPostsOnly(userId: string) {
  // ✅ GOOD: Select with nested filtering
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      posts: {
        select: {
          id: true,
          title: true,
          content: true,
        },
        where: { published: true },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { comments: true },
      },
    },
  })
}
```

---

## Lazy Loading Strategy

```typescript
// lib/db/lazy-loading.ts
import type { User, Post } from '@prisma/client'

/**
 * @description Loads user without relations
 * @param userId User identifier
 * @returns Promise<User> User data only
 * @example
 * const user = await getUserMinimal('user_123')
 */
export async function getUserMinimal(userId: string): Promise<User> {
  // ✅ GOOD: Minimal load for simple operations
  return prisma.user.findUnique({
    where: { id: userId },
  })
}

/**
 * @description Conditionally loads relations after fetching user
 * @param userId User identifier
 * @returns Promise User with conditionally loaded relations
 */
export async function getUserWithConditionalRelations(
  userId: string
): Promise<User & { posts?: Post[] }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) return user

  // ✅ GOOD: Load relations only if user is admin
  if (user.role === 'admin') {
    const posts = await prisma.post.findMany({
      where: { authorId: user.id },
    })
    return { ...user, posts }
  }

  return user
}

/**
 * @description Lazy loads user data and posts separately
 * @param userId User identifier
 * @returns Promise Object with user and posts
 */
export async function getUserWithLazyPosts(userId: string) {
  // ✅ GOOD: Separate queries (useful for parallel execution)
  const [user, posts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
    }),
    prisma.post.findMany({
      where: { authorId: userId },
    }),
  ])

  return { user, posts }
}
```

---

## Decision Matrix: When to Use Each

### Use Eager Loading When:

```typescript
// lib/api/user-endpoint.ts
import type { Request, NextResponse } from 'next'

/**
 * @description API endpoint that returns user with all data
 * Good for: REST/GraphQL responses, form population, admin dashboards
 */
export async function GET(req: Request): Promise<NextResponse> {
  const userId = req.url.split('/').pop()

  // ✅ BEST: Single query, send complete data to client
  const user = await prisma.user.findUnique({
    where: { id: userId! },
    include: { posts: true, profile: true, comments: true },
  })

  return Response.json(user)
}
```

### Use Lazy Loading When:

```typescript
// lib/db/user-details.ts

/**
 * @description Loads admin details only for admin users
 * Good for: Permission-based loading, expensive queries
 */
export async function getUserWithOptionalAdminData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  })

  if (!user) return null

  // ✅ GOOD: Load expensive admin panel data only if needed
  if (user.role === 'admin') {
    const auditLogs = await prisma.auditLog.findMany({
      where: { affectedUserId: userId },
      take: 100,
    })
    return { user, auditLogs }
  }

  return { user }
}
```

---

## Mixed Strategy (Hybrid)

```typescript
// lib/db/hybrid-loading.ts
import type { Prisma, User, Post, UserProfile } from '@prisma/client'

/**
 * @description Loads user with some eager and some lazy relations
 * @param userId User identifier
 * @returns Promise User with profile eager, posts lazy
 */
export async function getUserWithHybridLoading(userId: string) {
  // ✅ GOOD: Eager load profile (small, always needed)
  // Load posts separately (large, conditionally needed)
  return prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  })
}

/**
 * @description Gets user with expensive data deferred
 * @param userId User identifier
 * @returns Promise User with posts available as callback
 */
export async function getUserWithDeferredPosts(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  })

  if (!user) return null

  // ✅ GOOD: Provide lazy loader function
  return {
    ...user,
    async getPosts() {
      return prisma.post.findMany({
        where: { authorId: userId },
      })
    },
  }
}

/**
 * @description Loads user with count aggregations instead of full data
 * @param userId User identifier
 * @returns Promise User with relationship counts
 */
export async function getUserWithCounts(userId: string) {
  // ✅ BEST: Use _count for statistics without loading all data
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      _count: {
        select: {
          posts: true,
          comments: true,
          followers: true,
        },
      },
    },
  })
}
```

---

## Performance Comparison

| Strategy | Queries | Data Transfer | Latency | Use Case |
|----------|---------|----------------|---------|----------|
| **Eager Include** | 1 | Large | Low | Single response endpoint |
| **Eager Select** | 1 | Small-Medium | Low | Optimized list views |
| **Lazy Separate** | 2-3 | Small | Medium | Optional relations |
| **Lazy Conditional** | 1-2 | Variable | Medium-Low | Permission-based |
| **Counts Only** | 1 | Tiny | Low | Statistics/dashboards |

### SOLID Principles Application:
- **S**: Separate queries for different concerns
- **O**: Use projections (Select) to extend without modifying
- **L**: Different loading strategies return compatible shapes
- **I**: Small, focused Select objects vs monolithic includes
- **D**: Depend on abstractions (query functions, not raw Prisma)
