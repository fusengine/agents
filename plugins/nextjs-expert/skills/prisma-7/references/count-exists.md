---
title: "Count, Exists, and Aggregates"
description: "Count records, check existence, aggregate functions"
category: "Querying"
---

# Count, Exists, and Aggregates

Query record counts, check existence, and calculate aggregates efficiently.

## Basic Count

```typescript
// lib/types/count.ts
import type { Prisma } from "@prisma/client";

/**
 * Count result wrapper
 */
export interface CountResult {
  count: number;
}

/**
 * Filtered count result
 */
export interface FilteredCountResult {
  total: number;
  filtered: number;
}

// lib/queries/countQueries.ts

/**
 * Count all users in database
 * @returns Total user count
 */
async function countAllUsers(): Promise<number> {
  return prisma.user.count();
}

/**
 * Count active users
 * @returns Count of active users
 */
async function countActiveUsers(): Promise<number> {
  return prisma.user.count({
    where: { status: "active" }
  });
}

/**
 * Count published posts
 * @returns Count of published posts
 */
async function countPublishedPosts(): Promise<number> {
  return prisma.post.count({
    where: { published: true }
  });
}

/**
 * Count unique verified emails
 * @returns Count of distinct verified email domains
 */
async function countUniqueVerifiedEmails(): Promise<number> {
  return prisma.user.count({
    distinct: ["email"],
    where: { verified: true }
  });
}
```

## Existence Checks

```typescript
// lib/types/exists.ts
import type { Prisma } from "@prisma/client";

/**
 * Existence check result
 */
export interface ExistsResult {
  exists: boolean;
}

/**
 * Conditional existence check
 */
export interface ConditionalExists {
  exists: boolean;
  reason?: string;
}

// lib/queries/existsQueries.ts
import type { ExistsResult } from "@/lib/types/exists";

/**
 * Check if user exists by email
 * @param email - Email to check
 * @returns Whether user exists
 */
async function userExistsByEmail(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  return user !== null;
}

/**
 * Check if user exists using count
 * @param email - Email to check
 * @returns Whether user exists
 */
async function userExistsByEmailCount(email: string): Promise<boolean> {
  const count = await prisma.user.count({
    where: { email }
  });
  return count > 0;
}

/**
 * Check if active admin exists
 * @returns Whether at least one active admin exists
 */
async function hasActiveAdmin(): Promise<boolean> {
  const admin = await prisma.user.findFirst({
    where: {
      role: "admin",
      status: "active"
    }
  });
  return admin !== null;
}

/**
 * Generic exists check function
 * @param where - Filter condition
 * @returns Whether record exists
 */
async function userExists(where: Prisma.UserWhereInput): Promise<boolean> {
  const result = await prisma.user.findFirst({ where });
  return result !== null;
}
```

## Count in Response

```typescript
// lib/types/countResponse.ts
import type { Prisma } from "@prisma/client";

/**
 * Count metadata for relations
 */
export interface CountMetadata {
  posts: number;
  comments: number;
  followers: number;
}

/**
 * User with count metadata
 */
export interface UserWithCounts {
  id: string;
  name: string;
  email: string;
  _count: CountMetadata;
}

/**
 * User summary with counts
 */
export interface UserSummaryWithCounts {
  id: string;
  name: string;
  _count: {
    posts: number;
    followers: number;
  };
}

// lib/queries/countResponseQueries.ts
import type { UserWithCounts, UserSummaryWithCounts } from "@/lib/types/countResponse";

/**
 * Get user with relation counts included
 * @param userId - User ID
 * @returns User with count metadata
 */
async function getUserWithCounts(userId: string): Promise<UserWithCounts | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: true,
      _count: {
        select: {
          posts: true,
          comments: true,
          followers: true
        }
      }
    }
  });
}

/**
 * Get users list with count metadata
 * @returns Array of users with counts
 */
async function getUsersWithCounts(): Promise<UserSummaryWithCounts[]> {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          posts: true,
          followers: true
        }
      }
    }
  });
}
```

## Aggregate Functions

```typescript
// lib/types/aggregates.ts
import type { Prisma } from "@prisma/client";

/**
 * Post aggregation statistics
 */
export interface PostAggregateStats {
  _count: number;
  _sum: { views: number | null };
  _avg: { views: number | null };
  _min: { views: number | null };
  _max: { views: number | null };
}

/**
 * Published post statistics
 */
export interface PublishedPostStats {
  _count: number;
  _avg: { views: number | null };
  _max: { views: number | null };
}

/**
 * Author post statistics
 */
export interface AuthorPostStats {
  authorId: string;
  _count: number;
  _sum: { views: number | null };
  _avg: { views: number | null };
}

// lib/queries/aggregateQueries.ts
import type { PostAggregateStats, PublishedPostStats, AuthorPostStats } from "@/lib/types/aggregates";

/**
 * Get all post statistics
 * @returns Post aggregate with count, sum, avg, min, max
 */
async function getPostStatistics(): Promise<PostAggregateStats> {
  return prisma.post.aggregate({
    _count: true,
    _sum: { views: true },
    _avg: { views: true },
    _min: { views: true },
    _max: { views: true }
  });
}

/**
 * Get published post statistics
 * @returns Statistics for published posts only
 */
async function getPublishedPostStats(): Promise<PublishedPostStats> {
  return prisma.post.aggregate({
    where: { published: true },
    _count: true,
    _avg: { views: true },
    _max: { views: true }
  });
}

/**
 * Get post statistics grouped by author
 * @returns Array of author post statistics
 */
async function getPostsByAuthor(): Promise<AuthorPostStats[]> {
  return prisma.post.groupBy({
    by: ["authorId"],
    _count: true,
    _sum: { views: true },
    _avg: { views: true }
  });
}
```

## Real-World Examples

### User Statistics
```typescript
async function getUserStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      _count: {
        select: {
          posts: {
            where: { published: true }
          },
          comments: true,
          followers: true,
          following: true
        }
      }
    }
  });

  return {
    ...user,
    stats: user._count
  };
}
```

### Dashboard Metrics
```typescript
async function getDashboardMetrics() {
  const [
    totalUsers,
    activeUsers,
    totalPosts,
    publishedPosts,
    postStats
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "active" } }),
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.aggregate({
      _avg: { views: true },
      _max: { views: true }
    })
  ]);

  return {
    users: { total: totalUsers, active: activeUsers },
    posts: { total: totalPosts, published: publishedPosts },
    avgViews: postStats._avg.views,
    maxViews: postStats._max.views
  };
}
```

### Activity Report
```typescript
async function getActivityReport() {
  const postsByStatus = await prisma.post.groupBy({
    by: ["status"],
    _count: true,
    orderBy: { _count: { status: "desc" } }
  });

  const usersByCountry = await prisma.user.groupBy({
    by: ["country"],
    _count: true,
    orderBy: { _count: { country: "desc" } },
    take: 10
  });

  return {
    postsByStatus,
    topCountries: usersByCountry
  };
}
```

### List with Counts
```typescript
async function getPostsWithStats(page: number = 1) {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const posts = await prisma.post.findMany({
    skip,
    take: pageSize,
    select: {
      id: true,
      title: true,
      content: true,
      published: true,
      createdAt: true,
      _count: {
        select: {
          comments: true,
          likes: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const total = await prisma.post.count();

  return {
    data: posts,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  };
}
```

## Performance Tips

### Efficient Counting
```typescript
// Good: Count what you need
const active = await prisma.user.count({
  where: { status: "active" }
});

// Avoid: Fetch all and count in code
// const users = await prisma.user.findMany();
// const active = users.filter(u => u.status === "active").length;
```

### Group By for Analytics
```typescript
// Efficient: Group by in database
const stats = await prisma.order.groupBy({
  by: ["userId"],
  _count: true,
  _sum: { total: true }
});

// Avoid: Fetch all and aggregate in code
// const orders = await prisma.order.findMany();
// const grouped = ...aggregate in code
```

### Limit Aggregate Calculations
```typescript
// With filter to reduce dataset
const topAuthors = await prisma.post.groupBy({
  by: ["authorId"],
  where: { published: true },  // Filter first
  _count: true,
  orderBy: { _count: { authorId: "desc" } },
  take: 10  // Limit results
});
```

## Best Practices

1. **Use count() for totals** - Simple and efficient
2. **Check exists with findFirst** - Lighter than fetchable
3. **Include _count in selects** - Avoid separate queries
4. **Aggregate on server** - Don't fetch all data to aggregate
5. **Filter before counting** - Reduce dataset
6. **Combine queries** - Use Promise.all() for multiple counts
