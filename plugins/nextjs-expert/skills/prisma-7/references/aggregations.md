---
name: aggregations
description: Prisma 7 aggregation, groupBy, and count operations
when-to-use: Statistics, reports, counting, grouping data
keywords: count, aggregate, groupBy, sum, avg, min, max
priority: medium
requires: queries.md
related: typedsql.md
---

# Aggregations

Aggregation and grouping patterns in Prisma 7.

```typescript
// lib/types/aggregations.ts
import type { Prisma } from "@prisma/client";

/**
 * User count result
 */
export interface UserCountResult {
  count: number;
}

/**
 * Selective count result
 */
export interface SelectiveCountResult {
  _all: number;
  email: number;
}

/**
 * Active user count result
 */
export interface ActiveUserCountResult {
  count: number;
}
```

## Count

```typescript
// lib/queries/countAggregationQueries.ts
import type { UserCountResult, SelectiveCountResult, ActiveUserCountResult } from "@/lib/types/aggregations";

/**
 * Count all users
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
    where: { status: 'ACTIVE' }
  });
}

/**
 * Get selective counts
 * @returns Count of all records and non-null emails
 */
async function getSelectiveCounts(): Promise<SelectiveCountResult> {
  return prisma.user.count({
    select: {
      _all: true,
      email: true
    }
  });
}
```

---

## Aggregate

```typescript
// lib/types/productAggregations.ts
import type { Prisma } from "@prisma/client";

/**
 * Product aggregation statistics
 */
export interface ProductAggregateStats {
  _count: { _all: number };
  _sum: { price: number | null; quantity: number | null };
  _avg: { price: number | null };
  _min: { price: number | null };
  _max: { price: number | null };
}

/**
 * Expensive product statistics
 */
export interface ExpensiveProductStats {
  _avg: { price: number | null };
  _count: { _all: number };
}

// lib/queries/productAggregationQueries.ts
import type { ProductAggregateStats, ExpensiveProductStats } from "@/lib/types/productAggregations";

/**
 * Get product statistics (count, sum, avg, min, max)
 * @returns Product aggregate statistics
 */
async function getProductStats(): Promise<ProductAggregateStats> {
  return prisma.product.aggregate({
    _count: { _all: true },
    _sum: { price: true, quantity: true },
    _avg: { price: true },
    _min: { price: true },
    _max: { price: true }
  });
}

/**
 * Get statistics for expensive products
 * @returns Statistics for products over 100 price
 */
async function getExpensiveProductStats(): Promise<ExpensiveProductStats> {
  return prisma.product.aggregate({
    where: { price: { gt: 100 } },
    _avg: { price: true },
    _count: { _all: true }
  });
}
```

---

## GroupBy

```typescript
// lib/types/groupByAggregations.ts
import type { Prisma } from "@prisma/client";

/**
 * User count by role
 */
export interface UserCountByRole {
  role: string;
  _count: { _all: number };
}

/**
 * User statistics by role and status
 */
export interface UserStatsByRoleAndStatus {
  role: string;
  status: string;
  _count: { _all: number };
  _avg: { age: number | null };
}

/**
 * Active users by role
 */
export interface ActiveUsersByRole {
  role: string;
  _count: { _all: number };
}

/**
 * Popular role statistics
 */
export interface PopularRoleStats {
  role: string;
  _count: { _all: number };
}

// lib/queries/groupByQueries.ts
import type { UserCountByRole, UserStatsByRoleAndStatus, ActiveUsersByRole, PopularRoleStats } from "@/lib/types/groupByAggregations";

/**
 * Count users grouped by role
 * @returns Array of role counts
 */
async function countUsersByRole(): Promise<UserCountByRole[]> {
  return prisma.user.groupBy({
    by: ['role'],
    _count: { _all: true }
  });
}

/**
 * Get user statistics by role and status
 * @returns Array of role/status statistics
 */
async function getUserStatsByRoleAndStatus(): Promise<UserStatsByRoleAndStatus[]> {
  return prisma.user.groupBy({
    by: ['role', 'status'],
    _count: { _all: true },
    _avg: { age: true }
  });
}

/**
 * Get active users grouped by role
 * @returns Array of active user counts per role
 */
async function getActiveUsersByRole(): Promise<ActiveUsersByRole[]> {
  return prisma.user.groupBy({
    by: ['role'],
    where: { status: 'ACTIVE' },
    _count: { _all: true }
  });
}

/**
 * Get popular roles (with having clause)
 * @returns Roles with 10+ users
 */
async function getPopularRoles(): Promise<PopularRoleStats[]> {
  return prisma.user.groupBy({
    by: ['role'],
    _count: { _all: true },
    having: {
      _all: { _count: { gt: 10 } }
    }
  });
}
```

---

## Relation Count

```typescript
// lib/types/relationCounts.ts
import type { Prisma } from "@prisma/client";

/**
 * User count metadata
 */
export interface UserCountMetadata {
  posts: number;
  comments: number;
}

/**
 * User with relation counts
 */
export interface UserWithRelationCounts {
  id: string;
  name: string;
  email: string;
  _count: UserCountMetadata;
}

/**
 * Prolific author with post count
 */
export interface ProlificAuthor {
  id: string;
  name: string;
  _count: { posts: number };
}

// lib/queries/relationCountQueries.ts
import type { UserWithRelationCounts, ProlificAuthor } from "@/lib/types/relationCounts";

/**
 * Get users with relation counts
 * @returns Array of users with post and comment counts
 */
async function getUsersWithCounts(): Promise<UserWithRelationCounts[]> {
  return prisma.user.findMany({
    include: {
      _count: {
        select: {
          posts: true,
          comments: true
        }
      }
    }
  });
}

/**
 * Get prolific authors (those with posts)
 * @returns Authors sorted by post count
 */
async function getProlificAuthors(): Promise<ProlificAuthor[]> {
  return prisma.user.findMany({
    where: {
      posts: {
        some: {}
      }
    },
    include: {
      _count: { select: { posts: true } }
    },
    orderBy: {
      posts: { _count: 'desc' }
    },
    take: 10
  });
}
```

---

## Date Grouping (with TypedSQL)

```typescript
// lib/types/dateGrouping.ts
import type { Prisma } from "@prisma/client";

/**
 * Monthly statistics
 */
export interface MonthlyStats {
  month: string;
  count: bigint;
}

// lib/queries/dateGroupingQueries.ts
import type { MonthlyStats } from "@/lib/types/dateGrouping";

/**
 * Get user creation statistics grouped by month
 * @returns Array of monthly user counts
 */
async function getMonthlyUserStats(): Promise<MonthlyStats[]> {
  return prisma.$queryRaw<MonthlyStats[]>`
    SELECT
      TO_CHAR(created_at, 'YYYY-MM') as month,
      COUNT(*) as count
    FROM "User"
    GROUP BY TO_CHAR(created_at, 'YYYY-MM')
    ORDER BY month DESC
  `;
}
```

---

## Distinct

```typescript
// lib/types/distinctAggregations.ts
import type { Prisma } from "@prisma/client";

/**
 * Country result
 */
export interface CountryResult {
  country: string;
}

/**
 * Recent country result
 */
export interface RecentCountryResult {
  country: string;
  createdAt: Date;
}

// lib/queries/distinctAggregationQueries.ts
import type { CountryResult, RecentCountryResult } from "@/lib/types/distinctAggregations";

/**
 * Get distinct user countries
 * @returns Array of unique countries
 */
async function getDistinctCountries(): Promise<CountryResult[]> {
  return prisma.user.findMany({
    distinct: ['country'],
    select: { country: true }
  });
}

/**
 * Get recent distinct countries
 * @returns Array of unique countries sorted by creation date
 */
async function getRecentDistinctCountries(): Promise<RecentCountryResult[]> {
  return prisma.user.findMany({
    distinct: ['country'],
    orderBy: { createdAt: 'desc' },
    select: { country: true, createdAt: true }
  });
}
```

---

## Best Practices

1. **Use count for totals** - Simple and fast
2. **Aggregate for stats** - sum, avg, min, max
3. **GroupBy for reports** - Category breakdowns
4. **Relation count** - Efficient counting
5. **TypedSQL for complex** - Date grouping, pivots
