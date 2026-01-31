---
name: typedsql
description: Prisma 7 TypedSQL for type-safe raw SQL queries
when-to-use: Complex queries that Prisma Client can't express
keywords: $queryRaw, $executeRaw, TypedSQL, raw SQL, type-safe
priority: medium
requires: client.md
related: queries.md, optimization.md
---

# TypedSQL

Type-safe raw SQL queries in Prisma 7.

## Basic Raw Query

```typescript
// modules/cores/db/interfaces/user-query-result.ts
/**
 * User query result from raw SQL
 */
export interface UserQueryResult {
  id: string
  name: string
  email: string
}
```

```typescript
// modules/cores/db/repositories/user-repository.ts
import type { UserQueryResult } from '../interfaces/user-query-result'

/**
 * Get admin users using TypedSQL
 * @param prisma - Prisma Client instance
 * @returns Array of admin users
 */
export async function getAdminUsers(
  prisma: PrismaClient
): Promise<UserQueryResult[]> {
  return await prisma.$queryRaw<UserQueryResult[]>`
    SELECT id, name, email
    FROM "User"
    WHERE role = 'ADMIN'
  `
}
```

---

## Parameterized Queries

```typescript
// modules/cores/db/repositories/user-repository.ts
/**
 * Get users by role with pagination
 * @param prisma - Prisma Client instance
 * @param role - User role to filter by
 * @param limit - Maximum number of results
 * @returns Array of users matching criteria
 */
export async function getUsersByRole(
  prisma: PrismaClient,
  role: string,
  limit: number
): Promise<UserQueryResult[]> {
  return await prisma.$queryRaw<UserQueryResult[]>`
    SELECT id, name, email
    FROM "User"
    WHERE role = ${role}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `
}
```

---

## Complex Aggregations

```typescript
// modules/cores/db/interfaces/user-stats-result.ts
/**
 * Aggregated user statistics by role
 */
export interface UserStatsResult {
  role: string
  count: bigint
  avgAge: number | null
}

/**
 * Formatted user statistics with proper types
 */
export interface FormattedUserStats {
  role: string
  count: number
  avgAge: number | null
}
```

```typescript
// modules/cores/db/repositories/stats-repository.ts
import type { UserStatsResult, FormattedUserStats } from '../interfaces/user-stats-result'

/**
 * Get aggregated user statistics by role
 * @param prisma - Prisma Client instance
 * @param minCount - Minimum group size filter
 * @returns Formatted user statistics
 */
export async function getUserStatsByRole(
  prisma: PrismaClient,
  minCount: number = 5
): Promise<FormattedUserStats[]> {
  const stats = await prisma.$queryRaw<UserStatsResult[]>`
    SELECT
      role,
      COUNT(*) as count,
      AVG(age) as "avgAge"
    FROM "User"
    GROUP BY role
    HAVING COUNT(*) > ${minCount}
    ORDER BY count DESC
  `

  return stats.map((s) => ({
    ...s,
    count: Number(s.count),
  }))
}
```
```

---

## Window Functions

```typescript
// modules/cores/db/interfaces/ranked-user.ts
/**
 * User ranking result with post count
 */
export interface RankedUser {
  id: string
  name: string
  totalPosts: bigint
  rank: bigint
}
```

```typescript
// modules/cores/db/repositories/ranking-repository.ts
import type { RankedUser } from '../interfaces/ranked-user'

/**
 * Get ranked users by post count
 * @param prisma - Prisma Client instance
 * @param limit - Maximum number of results
 * @returns Ranked users list
 */
export async function getRankedUsers(
  prisma: PrismaClient,
  limit: number = 10
): Promise<RankedUser[]> {
  return await prisma.$queryRaw<RankedUser[]>`
    SELECT
      u.id,
      u.name,
      COUNT(p.id) as "totalPosts",
      RANK() OVER (ORDER BY COUNT(p.id) DESC) as rank
    FROM "User" u
    LEFT JOIN "Post" p ON p.author_id = u.id
    GROUP BY u.id, u.name
    ORDER BY rank
    LIMIT ${limit}
  `
}
```

---

## Full-Text Search (PostgreSQL)

```typescript
// modules/cores/db/interfaces/search-result.ts
/**
 * Full-text search result with ranking
 */
export interface SearchResult {
  id: string
  title: string
  content: string
  rank: number
}
```

```typescript
// modules/cores/db/repositories/search-repository.ts
import type { SearchResult } from '../interfaces/search-result'

/**
 * Search posts using full-text search
 * @param prisma - Prisma Client instance
 * @param searchTerm - Search query
 * @param limit - Maximum results
 * @returns Ranked search results
 */
export async function searchPostsByFullText(
  prisma: PrismaClient,
  searchTerm: string,
  limit: number = 20
): Promise<SearchResult[]> {
  return await prisma.$queryRaw<SearchResult[]>`
    SELECT
      id,
      title,
      content,
      ts_rank(
        to_tsvector('english', title || ' ' || content),
        plainto_tsquery('english', ${searchTerm})
      ) as rank
    FROM "Post"
    WHERE to_tsvector('english', title || ' ' || content)
      @@ plainto_tsquery('english', ${searchTerm})
    ORDER BY rank DESC
    LIMIT ${limit}
  `
}
```

---

## Execute Raw (No Return)

```typescript
// modules/cores/db/repositories/user-repository.ts
/**
 * Update user's last login timestamp
 * @param prisma - Prisma Client instance
 * @param userId - User ID
 * @returns Number of affected rows
 */
export async function updateUserLastLogin(
  prisma: PrismaClient,
  userId: string
): Promise<number> {
  return await prisma.$executeRaw`
    UPDATE "User"
    SET last_login_at = NOW()
    WHERE id = ${userId}
  `
}
```

---

## Using Prisma.sql

```typescript
// modules/cores/db/repositories/user-repository.ts
import { Prisma } from '@prisma/client'
import type { UserQueryResult } from '../interfaces/user-query-result'

/**
 * Build dynamic sorted user query
 * @param prisma - Prisma Client instance
 * @param orderBy - Column to sort by
 * @param direction - Sort direction (ASC/DESC)
 * @param limit - Result limit
 * @returns Sorted users list
 */
export async function getUsersSorted(
  prisma: PrismaClient,
  orderBy: string = 'created_at',
  direction: string = 'DESC',
  limit: number = 10
): Promise<UserQueryResult[]> {
  return await prisma.$queryRaw<UserQueryResult[]>`
    SELECT id, name, email
    FROM "User"
    ORDER BY ${Prisma.raw(orderBy)} ${Prisma.raw(direction)}
    LIMIT ${limit}
  `
}

/**
 * Get users with multiple conditions
 * @param prisma - Prisma Client instance
 * @returns Admin verified users
 */
export async function getAdminVerifiedUsers(
  prisma: PrismaClient
): Promise<UserQueryResult[]> {
  const conditions = [
    Prisma.sql`role = 'ADMIN'`,
    Prisma.sql`verified = true`,
  ]

  const whereClause = Prisma.join(conditions, ' AND ')

  return await prisma.$queryRaw<UserQueryResult[]>`
    SELECT * FROM "User"
    WHERE ${whereClause}
  `
}
```

---

## Best Practices

1. **Always type results** - Define interface for return type
2. **Use template literals** - Automatic parameter binding
3. **Avoid Prisma.raw** - Only for column/table names
4. **Handle bigint** - PostgreSQL COUNT returns bigint
5. **Prefer Prisma Client** - Use TypedSQL only when needed
