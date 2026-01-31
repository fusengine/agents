---
name: views
description: Database views and materialized views for optimized queries and data aggregation
when-to-use: Pre-computed query results, complex joins, analytical reports
keywords: view, materialized-view, query-optimization, aggregation, refresh
priority: low
requires: null
related: raw-queries.md, indexes-advanced.md
---

# Prisma 7 Database Views

## Creating Views in Migrations

```sql
-- prisma/migrations/20240101000000_create_views/migration.sql

-- Regular view
CREATE VIEW user_stats AS
SELECT
  u.id,
  u.name,
  COUNT(p.id) as post_count,
  COUNT(c.id) as comment_count,
  MAX(p.created_at) as last_post_date
FROM "User" u
LEFT JOIN "Post" p ON u.id = p.user_id
LEFT JOIN "Comment" c ON u.id = c.user_id
GROUP BY u.id, u.name;

-- Materialized view (requires refresh)
CREATE MATERIALIZED VIEW user_analytics AS
SELECT
  u.id,
  u.name,
  COUNT(DISTINCT p.id) as total_posts,
  COALESCE(SUM(p.likes), 0) as total_likes,
  COALESCE(AVG(p.likes), 0) as avg_likes
FROM "User" u
LEFT JOIN "Post" p ON u.id = p.user_id
GROUP BY u.id, u.name;

-- Index on materialized view
CREATE INDEX idx_user_analytics_total_posts
ON user_analytics(total_posts DESC);
```

---

## View Models in Schema

```prisma
// prisma/schema.prisma

// Map view as model (read-only)
model UserStats {
  id           String
  name         String
  post_count   Int
  comment_count Int
  last_post_date DateTime?

  @@map("user_stats")
  @@ignore // Prevents migration issues
}

model UserAnalytics {
  id          String
  name        String
  total_posts Int
  total_likes Int
  avg_likes   Float

  @@map("user_analytics")
  @@ignore
}
```

---

## Querying Views

```typescript
// modules/cores/db/interfaces/user-stats-view.ts
/**
 * User statistics from database view
 */
export interface UserStatsView {
  id: string
  name: string
  postCount: number
  commentCount: number
}

/**
 * User analytics from materialized view
 */
export interface UserAnalyticsView {
  id: string
  name: string
  totalPosts: number
  totalLikes: number
}
```

```typescript
// modules/cores/db/repositories/view-repository.ts
import type { UserStatsView, UserAnalyticsView } from '../interfaces/user-stats-view'

/**
 * Get user statistics from view
 * @param prisma - Prisma Client instance
 * @param userId - User ID
 * @returns User stats or null
 */
export async function getUserStats(
  prisma: PrismaClient,
  userId: string
): Promise<UserStatsView | null> {
  const stats = await prisma.$queryRaw<UserStatsView[]>`
    SELECT * FROM user_stats WHERE id = ${userId}
  `
  return stats[0] || null
}

/**
 * Get top users by post count
 * @param prisma - Prisma Client instance
 * @param limit - Result limit
 * @returns Top users analytics
 */
export async function getTopUsers(
  prisma: PrismaClient,
  limit: number = 10
): Promise<UserAnalyticsView[]> {
  return prisma.$queryRaw<UserAnalyticsView[]>`
    SELECT * FROM user_analytics
    ORDER BY total_posts DESC
    LIMIT ${limit}
  `
}
```

---

## Materialized View Refresh Strategy

```typescript
// modules/cores/db/repositories/view-refresh.ts
/**
 * Refresh materialized view
 * @param prisma - Prisma Client instance
 * @returns Success status
 */
export async function refreshUserAnalyticsView(
  prisma: PrismaClient
): Promise<void> {
  try {
    await prisma.$executeRaw`
      REFRESH MATERIALIZED VIEW CONCURRENTLY user_analytics
    `
    console.log('User analytics view refreshed')
  } catch (error) {
    console.error('Failed to refresh view:', error)
    throw error
  }
}

/**
 * Schedule view refresh at intervals
 * @param prisma - Prisma Client instance
 * @param intervalMs - Refresh interval in milliseconds
 * @returns Interval ID for cleanup
 */
export function scheduleViewRefresh(
  prisma: PrismaClient,
  intervalMs: number = 6 * 60 * 60 * 1000
): NodeJS.Timeout {
  return setInterval(() => {
    refreshUserAnalyticsView(prisma)
  }, intervalMs)
}

// app/api/cron/refresh-views/route.ts
/**
 * API route for Vercel Cron refresh
 * @param req - Request object
 * @returns JSON response
 */
export async function POST(req: Request) {
  const secret = req.headers.get('x-vercel-cron')
  if (secret !== process.env.CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  await refreshUserAnalyticsView(prisma)
  return Response.json({ refreshed: true })
}
```

---

## Incremental View Updates

```typescript
// modules/cores/db/repositories/view-update.ts
/**
 * Incrementally update view aggregates
 * @param prisma - Prisma Client instance
 * @param lastRefresh - Last refresh timestamp
 * @returns Update count
 */
export async function updateViewIncremental(
  prisma: PrismaClient,
  lastRefresh: Date
): Promise<{ updated: number }> {
  // Only process changed records
  const newActivity = await prisma.post.findMany({
    where: {
      createdAt: { gt: lastRefresh },
    },
    select: {
      userId: true,
      likes: true,
    },
  })

  // Update aggregates
  for (const item of newActivity) {
    await prisma.$executeRaw`
      UPDATE user_analytics
      SET
        total_posts = total_posts + 1,
        total_likes = total_likes + ${item.likes}
      WHERE id = ${item.userId}
    `
  }

  return { updated: newActivity.length }
}
```

---

## View Performance Monitoring

```typescript
// modules/cores/db/interfaces/view-stats.ts
/**
 * View performance metrics
 */
export interface ViewPerformance {
  viewname: string
  size: string
}

/**
 * Query execution plan
 */
export interface QueryPlan {
  'QUERY PLAN': string
}
```

```typescript
// modules/cores/db/repositories/view-monitoring.ts
import { Prisma } from '@prisma/client'
import type { ViewPerformance, QueryPlan } from '../interfaces/view-stats'

/**
 * Get performance metrics for materialized views
 * @param prisma - Prisma Client instance
 * @returns View performance data
 */
export async function getViewPerformance(
  prisma: PrismaClient
): Promise<ViewPerformance[]> {
  return prisma.$queryRaw<ViewPerformance[]>`
    SELECT
      matviewname as viewname,
      pg_size_pretty(pg_total_relation_size(schemaname||'.'||matviewname)) as size
    FROM pg_matviews
    WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
  `
}

/**
 * Get query execution plan
 * @param prisma - Prisma Client instance
 * @param query - Query to explain
 * @returns Query plan details
 */
export async function getViewQueryPlan(
  prisma: PrismaClient,
  query: string
): Promise<QueryPlan[]> {
  return prisma.$queryRaw<QueryPlan[]>`
    EXPLAIN (FORMAT JSON) ${Prisma.raw(query)}
  `
}
```
