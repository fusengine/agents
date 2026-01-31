---
name: stored-procedures
description: Stored procedures integration and calling database functions from Prisma
when-to-use: Complex business logic in database, batch operations, cross-platform code
keywords: stored-procedure, function, plpgsql, performance, batch-operations
priority: low
requires: null
related: raw-queries.md, extensions.md
---

# Prisma 7 Stored Procedures

## Creating Stored Procedures

```sql
-- prisma/migrations/20240101000000_create_procedures/migration.sql

-- Simple function
CREATE OR REPLACE FUNCTION get_user_posts_count(user_id TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) FROM "Post"
    WHERE "userId" = user_id
  );
END;
$$ LANGUAGE plpgsql;

-- Function with multiple parameters
CREATE OR REPLACE FUNCTION transfer_posts(
  from_user_id TEXT,
  to_user_id TEXT
)
RETURNS INTEGER AS $$
DECLARE
  moved_count INTEGER;
BEGIN
  UPDATE "Post"
  SET "userId" = to_user_id
  WHERE "userId" = from_user_id;

  GET DIAGNOSTICS moved_count = ROW_COUNT;
  RETURN moved_count;
END;
$$ LANGUAGE plpgsql;

-- Function returning table
CREATE OR REPLACE FUNCTION get_user_stats(user_id TEXT)
RETURNS TABLE (
  post_count INTEGER,
  comment_count INTEGER,
  last_activity TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(p.id)::INTEGER,
    COUNT(c.id)::INTEGER,
    MAX(GREATEST(p."createdAt", c."createdAt"))
  FROM "User" u
  LEFT JOIN "Post" p ON u.id = p."userId"
  LEFT JOIN "Comment" c ON u.id = c."userId"
  WHERE u.id = user_id
  GROUP BY u.id;
END;
$$ LANGUAGE plpgsql;
```

---

## Calling Stored Procedures

```typescript
// modules/cores/db/interfaces/user-procedure-result.ts
/**
 * User stats from stored procedure
 */
export interface UserProcedureStats {
  postCount: number
  commentCount: number
  lastActivity: Date
}
```

```typescript
// modules/cores/db/repositories/procedure-repository.ts
import type { UserProcedureStats } from '../interfaces/user-procedure-result'

/**
 * Get user post count from stored procedure
 * @param prisma - Prisma Client instance
 * @param userId - User ID
 * @returns Number of posts
 */
export async function getUserPostsCount(
  prisma: PrismaClient,
  userId: string
): Promise<number> {
  const result = await prisma.$queryRaw<
    Array<{ get_user_posts_count: number }>
  >`SELECT get_user_posts_count(${userId})`

  return result[0]?.get_user_posts_count || 0
}

/**
 * Transfer posts between users
 * @param prisma - Prisma Client instance
 * @param fromUserId - Source user ID
 * @param toUserId - Destination user ID
 * @returns Number of transferred posts
 */
export async function transferPosts(
  prisma: PrismaClient,
  fromUserId: string,
  toUserId: string
): Promise<number> {
  const result = await prisma.$executeRaw`
    SELECT transfer_posts(${fromUserId}, ${toUserId})
  `
  return result
}

/**
 * Get comprehensive user statistics from procedure
 * @param prisma - Prisma Client instance
 * @param userId - User ID
 * @returns User statistics or null
 */
export async function getUserStats(
  prisma: PrismaClient,
  userId: string
): Promise<UserProcedureStats | null> {
  const stats = await prisma.$queryRaw<UserProcedureStats[]>`
    SELECT * FROM get_user_stats(${userId})
  `

  return stats[0] || null
}
```

---

## Procedures with Transactions

```sql
-- Atomic batch operation
CREATE OR REPLACE FUNCTION batch_update_user_status(
  user_ids TEXT[],
  new_status TEXT
)
RETURNS TABLE (
  updated_count INTEGER,
  success BOOLEAN
) AS $$
BEGIN
  BEGIN
    UPDATE "User"
    SET status = new_status
    WHERE id = ANY(user_ids);

    RETURN QUERY
    SELECT CAST(COUNT(*)::INTEGER AS INTEGER), true
    FROM "User"
    WHERE id = ANY(user_ids) AND status = new_status;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 0::INTEGER, false;
  END;
END;
$$ LANGUAGE plpgsql;
```

---

## Performance-Critical Operations

```sql
-- Recursive function for hierarchical data
CREATE OR REPLACE FUNCTION get_org_hierarchy(org_id TEXT)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  level INTEGER
) AS $$
WITH RECURSIVE org_tree AS (
  SELECT id, name, 1 as level
  FROM organizations
  WHERE id = org_id

  UNION ALL

  SELECT o.id, o.name, ot.level + 1
  FROM organizations o
  JOIN org_tree ot ON o.parent_id = ot.id
)
SELECT * FROM org_tree;
$$ LANGUAGE plpgsql;

-- Window functions in procedure
CREATE OR REPLACE FUNCTION get_top_posts(limit_count INTEGER)
RETURNS TABLE (
  id TEXT,
  title TEXT,
  likes INTEGER,
  rank INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.likes,
    ROW_NUMBER() OVER (ORDER BY p.likes DESC)::INTEGER
  FROM "Post" p
  ORDER BY likes DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

---

## Calling Complex Procedures

```typescript
// modules/cores/db/interfaces/hierarchy.ts
/**
 * Organization hierarchy node
 */
export interface OrgHierarchyNode {
  id: string
  name: string
  level: number
}

/**
 * Top post result
 */
export interface TopPost {
  id: string
  title: string
  likes: number
  rank: number
}

/**
 * Batch update result
 */
export interface BatchUpdateResult {
  updatedCount: number
  success: boolean
}
```

```typescript
// modules/cores/db/repositories/complex-procedure-repository.ts
import { Prisma } from '@prisma/client'
import type { OrgHierarchyNode, TopPost, BatchUpdateResult } from '../interfaces/hierarchy'

/**
 * Get organization hierarchy tree
 * @param prisma - Prisma Client instance
 * @param orgId - Organization ID
 * @returns Hierarchical organization structure
 */
export async function getOrgHierarchy(
  prisma: PrismaClient,
  orgId: string
): Promise<OrgHierarchyNode[]> {
  return prisma.$queryRaw<OrgHierarchyNode[]>`
    SELECT * FROM get_org_hierarchy(${orgId})
  `
}

/**
 * Get top posts by likes
 * @param prisma - Prisma Client instance
 * @param limit - Maximum results
 * @returns Top posts list
 */
export async function getTopPosts(
  prisma: PrismaClient,
  limit: number
): Promise<TopPost[]> {
  return prisma.$queryRaw<TopPost[]>`
    SELECT * FROM get_top_posts(${limit})
  `
}

/**
 * Batch update user status
 * @param prisma - Prisma Client instance
 * @param userIds - User IDs to update
 * @param newStatus - New status value
 * @returns Update result
 */
export async function batchUpdateUserStatus(
  prisma: PrismaClient,
  userIds: string[],
  newStatus: string
): Promise<BatchUpdateResult> {
  const result = await prisma.$queryRaw<BatchUpdateResult[]>`
    SELECT * FROM batch_update_user_status(
      ${Prisma.join(userIds)},
      ${newStatus}
    )
  `

  return result[0] || { updatedCount: 0, success: false }
}
```

---

## Monitoring Procedures

```typescript
// modules/cores/db/interfaces/procedure-info.ts
/**
 * Stored procedure information
 */
export interface ProcedureInfo {
  schema: string
  name: string
  type: string
  language: string
}
```

```typescript
// modules/cores/db/repositories/procedure-monitoring.ts
import type { ProcedureInfo } from '../interfaces/procedure-info'

/**
 * Get all stored procedures metadata
 * @param prisma - Prisma Client instance
 * @returns List of procedures
 */
export async function getAllProcedures(
  prisma: PrismaClient
): Promise<ProcedureInfo[]> {
  return prisma.$queryRaw<ProcedureInfo[]>`
    SELECT
      n.nspname as schema,
      p.proname as name,
      pg_get_functionresulttype(p.oid) as type,
      l.lanname as language
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    JOIN pg_language l ON l.oid = p.prolang
    WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
    ORDER BY n.nspname, p.proname
  `
}
```

---

## Error Handling in Procedures

```typescript
// modules/cores/db/repositories/procedure-error-handler.ts
/**
 * Safely call stored procedure with error handling
 * @template T - Result type
 * @param prisma - Prisma Client instance
 * @param procedureName - Procedure name
 * @param params - Procedure parameters
 * @returns Result or null on error
 */
export async function safeProcedureCall<T>(
  prisma: PrismaClient,
  procedureName: string,
  ...params: any[]
): Promise<T | null> {
  try {
    return await prisma.$queryRaw<T>(
      `SELECT ${procedureName}(${params.map(() => '?').join(',')})`,
      ...params
    )
  } catch (error) {
    console.error(`Procedure ${procedureName} failed:`, error)
    return null
  }
}
```
