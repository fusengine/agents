---
name: relations
description: Prisma 7 relation queries with nested reads, writes, and filters
when-to-use: Querying related data, eager loading, nested mutations
keywords: include, select, nested, connect, create, some, every, none
priority: high
requires: queries.md
related: schema.md
---

# Relation Queries

Query patterns for related data in Prisma 7.

## Include Relations

```typescript
// modules/users/src/services/user-relations.service.ts
import type { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../../cores/db/prisma'

/**
 * Include one-to-many and one-to-one relations.
 *
 * @param userId - User ID to fetch with relations
 * @returns User with posts and profile included
 */
export async function getUserWithAllRelations(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: true,
      profile: true,
    },
  })
}

/**
 * Include nested relations with filtering and pagination.
 * Load only published posts with categories, limited to 5 most recent.
 *
 * @param userId - User ID
 * @returns User with filtered published posts
 */
export async function getUserWithPublishedPosts(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { categories: true },
      },
    },
  })
}
```

---

## Select with Relations

```typescript
// modules/users/src/services/user-select.service.ts
import type { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../../cores/db/prisma'

/**
 * Select specific fields from user and nested relations.
 * Optimizes query to fetch only required data.
 *
 * @param userId - User ID
 * @returns User ID, name with post titles (no content)
 */
export async function getUserSummary(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      posts: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  })
}
```

---

## Relation Count

```typescript
// modules/users/src/services/user-count.service.ts
import { prisma } from '../../../cores/db/prisma'

/**
 * Retrieve users with relation counts.
 * Uses _count virtual field for efficient counting without loading relations.
 *
 * @returns Array of users with post and comment counts
 */
export async function getUsersWithCounts() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          posts: true,
          comments: true,
        },
      },
    },
  })

  return users
}

/**
 * Type for user with counts.
 *
 * @see modules/users/src/services/user-count.service.ts
 */
export type UserWithCounts = Awaited<
  ReturnType<typeof getUsersWithCounts>
>[number]
```

---

## Nested Writes

```typescript
// modules/posts/src/services/post-relations.service.ts
import type { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../../cores/db/prisma'

/**
 * Create user with nested posts in single atomic operation.
 *
 * @param userData - User data with nested posts
 * @returns Created user with posts
 */
export async function createUserWithPosts(
  userData: Prisma.UserCreateInput & {
    posts?: { create: Prisma.PostCreateInput[] }
  }
) {
  return prisma.user.create({
    data: {
      email: userData.email as string,
      name: userData.name,
      posts: userData.posts,
    },
    include: { posts: true },
  })
}

/**
 * Connect existing author to post.
 *
 * @param postId - Post ID
 * @param authorId - User ID (existing author)
 * @returns Updated post with author
 */
export async function connectAuthorToPost(
  postId: string,
  authorId: string
) {
  return prisma.post.update({
    where: { id: postId },
    data: {
      author: { connect: { id: authorId } },
    },
  })
}

/**
 * Connect multiple categories to post.
 *
 * @param postId - Post ID
 * @param categoryIds - Array of category IDs
 * @returns Updated post with categories
 */
export async function connectCategoriesToPost(
  postId: string,
  categoryIds: string[]
) {
  return prisma.post.update({
    where: { id: postId },
    data: {
      categories: {
        connect: categoryIds.map((id) => ({ id })),
      },
    },
  })
}

/**
 * Connect or create author for post.
 * Finds existing user or creates new one.
 *
 * @param postId - Post ID
 * @param authorEmail - Author email (unique identifier)
 * @param authorName - Author name (for new users)
 * @returns Updated post with author
 */
export async function connectOrCreateAuthor(
  postId: string,
  authorEmail: string,
  authorName: string
) {
  return prisma.post.update({
    where: { id: postId },
    data: {
      author: {
        connectOrCreate: {
          where: { email: authorEmail },
          create: { email: authorEmail, name: authorName },
        },
      },
    },
    include: { author: true },
  })
}

/**
 * Disconnect post from user.
 * Removes the relation but keeps both records.
 *
 * @param userId - User ID
 * @param postId - Post ID to disconnect
 * @returns Updated user
 */
export async function disconnectPost(
  userId: string,
  postId: string
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      posts: { disconnect: [{ id: postId }] },
    },
  })
}
```

---

## Relation Filters

```typescript
// modules/users/src/services/user-relation-filter.service.ts
import { prisma } from '../../../cores/db/prisma'

/**
 * Find users with at least one published post.
 * Uses "some" for OR conditions on relations.
 *
 * @returns Array of users with published posts
 */
export async function getUsersWithPublishedPosts() {
  return prisma.user.findMany({
    where: {
      posts: { some: { published: true } },
    },
  })
}

/**
 * Find users where ALL posts are published.
 * Uses "every" for AND conditions on relations.
 *
 * @returns Array of users with all published posts
 */
export async function getUsersWithAllPublished() {
  return prisma.user.findMany({
    where: {
      posts: { every: { published: true } },
    },
  })
}

/**
 * Find users with NO unpublished posts.
 * Uses "none" for NOT conditions on relations.
 *
 * @returns Array of users with no drafts
 */
export async function getUsersWithNoDrafts() {
  return prisma.user.findMany({
    where: {
      posts: { none: { published: false } },
    },
  })
}

/**
 * Find posts by admin authors.
 * Filters on to-one relation using "is".
 *
 * @returns Array of posts from admin users
 */
export async function getPostsByAdmins() {
  return prisma.post.findMany({
    where: {
      author: {
        is: { role: 'ADMIN' },
      },
    },
  })
}
```

---

## Fluent API

```typescript
// modules/users/src/services/user-fluent.service.ts
import { prisma } from '../../../cores/db/prisma'

/**
 * Chain queries through relations using Fluent API.
 * More concise syntax for single-relation traversal.
 *
 * @param email - User email
 * @returns Array of posts from user
 */
export async function getUserPostsByEmail(email: string) {
  return prisma.user
    .findUnique({ where: { email } })
    .posts()
}

/**
 * Get categories for a post using Fluent API.
 *
 * @param postId - Post ID
 * @returns Array of categories
 */
export async function getPostCategories(postId: string) {
  return prisma.post
    .findUnique({ where: { id: postId } })
    .categories()
}
```

---

## Relation Load Strategy

```typescript
// modules/users/src/services/user-load-strategy.service.ts
import { prisma } from '../../../cores/db/prisma'

/**
 * Load users with posts using JOIN strategy.
 * More efficient for smaller result sets.
 * Single database round-trip.
 *
 * @returns Array of users with posts (JOINed)
 */
export async function getUsersWithPostsJoin() {
  return prisma.user.findMany({
    relationLoadStrategy: 'join',
    include: { posts: true },
  })
}

/**
 * Load users with posts using separate query strategy.
 * More efficient for large result sets with many relations.
 * Two database round-trips.
 *
 * @returns Array of users with posts (separate queries)
 */
export async function getUsersWithPostsQuery() {
  return prisma.user.findMany({
    relationLoadStrategy: 'query',
    include: { posts: true },
  })
}
```

---

## Best Practices

1. **Use select** - Limit returned fields for performance
2. **Filter relations** - Don't load unnecessary data
3. **Prefer join strategy** - More efficient for most cases
4. **Use _count** - Instead of loading all records to count
5. **Avoid deep nesting** - Keep queries readable
