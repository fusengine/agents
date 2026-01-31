---
name: raw-queries
description: Raw SQL queries using $queryRaw and $executeRaw for advanced operations
when-to-use: Complex queries, window functions, CTEs, or database-specific features
keywords: queryRaw, executeRaw, raw-sql, prepared-statements, unsafe-raw
priority: medium
requires: null
related: error-handling.md, client-api.md
---

# Prisma 7 Raw SQL Queries

## Basic Raw Queries

```typescript
// modules/cores/db/interfaces/user-with-age.ts
/**
 * User information including age
 */
export interface UserWithAge {
  id: string
  name: string
  age: number
}
```

```typescript
// modules/cores/db/repositories/user-repository.ts
import type { UserWithAge } from '../interfaces/user-with-age'

/**
 * Get users filtered by minimum age
 * @param prisma - Prisma Client instance
 * @param minAge - Minimum age filter
 * @returns Array of users above age threshold
 */
export async function getUsersWithRawQuery(
  prisma: PrismaClient,
  minAge: number
): Promise<UserWithAge[]> {
  return await prisma.$queryRaw<UserWithAge[]>`
    SELECT id, name, age
    FROM "User"
    WHERE age > ${minAge}
    ORDER BY age DESC
  `
}

/**
 * Execute unsafe query with table validation
 * @param prisma - Prisma Client instance
 * @param tableName - Table name from allowlist
 * @returns Query results
 * @throws Error if table not in allowlist
 */
export async function unsafeQuery(
  prisma: PrismaClient,
  tableName: string
): Promise<unknown[]> {
  const whitelist = ['users', 'posts', 'comments']
  if (!whitelist.includes(tableName)) {
    throw new Error(`Invalid table: ${tableName}`)
  }

  return prisma.$queryRawUnsafe(
    `SELECT * FROM ${tableName} LIMIT 10`
  )
}
```

---

## Write Operations

```typescript
// modules/cores/db/repositories/user-repository.ts
import { Prisma } from '@prisma/client'

/**
 * Insert multiple users in bulk
 * @param prisma - Prisma Client instance
 * @param data - Array of user data
 * @returns Number of inserted rows
 */
export async function bulkInsertUsers(
  prisma: PrismaClient,
  data: Array<{ email: string; name: string }>
): Promise<number> {
  return await prisma.$executeRaw`
    INSERT INTO "User" (email, name, "createdAt")
    VALUES ${Prisma.join(
      data.map((d) => Prisma.sql`(${d.email}, ${d.name}, NOW())`),
      ','
    )}
    ON CONFLICT (email) DO NOTHING
  `
}

/**
 * Update status for multiple users
 * @param prisma - Prisma Client instance
 * @param ids - User IDs to update
 * @param status - New status value
 * @returns Number of affected rows
 */
export async function updateMultiple(
  prisma: PrismaClient,
  ids: string[],
  status: string
): Promise<number> {
  return await prisma.$executeRaw`
    UPDATE "User"
    SET status = ${status}, "updatedAt" = NOW()
    WHERE id IN (${Prisma.join(ids)})
  `
}

/**
 * Delete old user records
 * @param prisma - Prisma Client instance
 * @param days - Delete records older than N days
 * @returns Number of deleted rows
 */
export async function deleteOldRecords(
  prisma: PrismaClient,
  days: number
): Promise<number> {
  return await prisma.$executeRaw`
    DELETE FROM "User"
    WHERE "createdAt" < NOW() - INTERVAL '${days} days'
  `
}
```

---

## Window Functions & CTEs

```typescript
// modules/cores/db/interfaces/user-ranking.ts
/**
 * User ranking statistics
 */
export interface UserRanking {
  id: string
  name: string
  totalPosts: bigint
  rank: number
}

/**
 * Time series data point
 */
export interface TimeSeriesDataPoint {
  date: string
  count: bigint
  avgValue: number
}
```

```typescript
// modules/cores/db/repositories/analytics-repository.ts
import type { UserRanking, TimeSeriesDataPoint } from '../interfaces/user-ranking'

/**
 * Get users ranked by post count
 * @param prisma - Prisma Client instance
 * @returns User rankings with post statistics
 */
export async function getUserRanking(
  prisma: PrismaClient
): Promise<UserRanking[]> {
  return await prisma.$queryRaw<UserRanking[]>`
    WITH user_stats AS (
      SELECT
        u.id,
        u.name,
        COUNT(p.id) as "totalPosts"
      FROM "User" u
      LEFT JOIN "Post" p ON u.id = p."userId"
      GROUP BY u.id, u.name
    )
    SELECT
      id,
      name,
      "totalPosts",
      ROW_NUMBER() OVER (ORDER BY "totalPosts" DESC) as rank
    FROM user_stats
  `
}

/**
 * Get time series event data
 * @param prisma - Prisma Client instance
 * @param days - Number of days to look back
 * @returns Time series data points
 */
export async function getTimeSeriesData(
  prisma: PrismaClient,
  days: number
): Promise<TimeSeriesDataPoint[]> {
  return await prisma.$queryRaw<TimeSeriesDataPoint[]>`
    SELECT
      DATE(created_at)::text as date,
      COUNT(*) as count,
      AVG(value) as "avgValue"
    FROM events
    WHERE created_at > NOW() - INTERVAL '${days} days'
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `
}
```

---

## Aggregations & Full-Text Search

```typescript
// modules/cores/db/interfaces/search-rank.ts
/**
 * Search result with ranking
 */
export interface SearchRank {
  id: string
  title: string
  rank: number
}

/**
 * User post aggregate statistics
 */
export interface UserPostStats {
  totalPosts: bigint
  avgLikes: number | null
  maxComments: bigint
}
```

```typescript
// modules/cores/db/repositories/search-repository.ts
import type { SearchRank, UserPostStats } from '../interfaces/search-rank'

/**
 * Search posts with full-text search ranking
 * @param prisma - Prisma Client instance
 * @param query - Search query
 * @param limit - Maximum results
 * @returns Ranked search results
 */
export async function searchPosts(
  prisma: PrismaClient,
  query: string,
  limit: number = 20
): Promise<SearchRank[]> {
  return await prisma.$queryRaw<SearchRank[]>`
    SELECT
      id,
      title,
      ts_rank(search_vector, query) as rank
    FROM "Post"
    WHERE search_vector @@ plainto_tsquery(${query})
    ORDER BY rank DESC
    LIMIT ${limit}
  `
}

/**
 * Get aggregate statistics for user's posts
 * @param prisma - Prisma Client instance
 * @param userId - User ID
 * @returns Post statistics or null if no posts
 */
export async function getAggregateStats(
  prisma: PrismaClient,
  userId: string
): Promise<UserPostStats | null> {
  const stats = await prisma.$queryRaw<UserPostStats[]>`
    SELECT
      COUNT(p.id) as "totalPosts",
      AVG(p.likes) as "avgLikes",
      MAX(p.comments) as "maxComments"
    FROM "Post" p
    WHERE p."userId" = ${userId}
  `
  return stats[0] || null
}
```

---

## Transactions with Raw Queries

```typescript
// modules/cores/db/repositories/transaction-repository.ts
/**
 * Transfer funds between accounts atomically
 * @param prisma - Prisma Client instance
 * @param fromId - Source account user ID
 * @param toId - Destination account user ID
 * @param amount - Transfer amount
 * @returns Transaction record ID
 */
export async function transferFunds(
  prisma: PrismaClient,
  fromId: string,
  toId: string,
  amount: number
): Promise<number> {
  return await prisma.$transaction(async (tx) => {
    // Deduct from source
    await tx.$executeRaw`
      UPDATE accounts
      SET balance = balance - ${amount}
      WHERE user_id = ${fromId}
    `

    // Add to destination
    await tx.$executeRaw`
      UPDATE accounts
      SET balance = balance + ${amount}
      WHERE user_id = ${toId}
    `

    // Record transaction
    return tx.$executeRaw`
      INSERT INTO transactions (from_id, to_id, amount)
      VALUES (${fromId}, ${toId}, ${amount})
    `
  })
}
```

---

## Error Handling

```typescript
// modules/cores/db/repositories/query-wrapper.ts
import { Prisma } from '@prisma/client'

/**
 * Execute raw query with error handling
 * @template T - Result type
 * @param prisma - Prisma Client instance
 * @param query - Query template string
 * @param values - Query parameter values
 * @returns Query results or null on error
 */
export async function executeRawSafe<T>(
  prisma: PrismaClient,
  query: TemplateStringsArray,
  ...values: any[]
): Promise<T[] | null> {
  try {
    return await prisma.$queryRaw<T[]>(query, ...values)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      console.error('Invalid query parameters', error.message)
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
      console.error('Database panic', error.message)
    }
    return null
  }
}
```
