---
name: indexes-advanced
description: Advanced indexing strategies including partial, composite, and expression indexes
when-to-use: Query performance optimization, complex filtering, and selective indexing
keywords: index, partial-index, composite-index, expression-index, performance
priority: medium
requires: null
related: views.md, deployment.md
---

# Prisma 7 Advanced Indexing

## Partial Indexes

```sql
-- prisma/migrations/20240101000000_partial_indexes/migration.sql

-- Only index active users
CREATE INDEX idx_active_users
ON "User"(email)
WHERE status = 'active';

-- Index soft-deleted records separately
CREATE INDEX idx_deleted_users
ON "User"(deleted_at)
WHERE deleted_at IS NOT NULL;

-- Boolean column selective index
CREATE INDEX idx_premium_users
ON "User"(id)
WHERE is_premium = true;
```

---

## Composite Indexes

```prisma
// prisma/schema.prisma
model Post {
  id        String   @id @default(cuid())
  userId    String
  status    String   // 'draft', 'published'
  createdAt DateTime @default(now())
  title     String
  content   String

  user      User @relation(fields: [userId], references: [id])

  // Composite index for common query patterns
  @@index([userId, status, createdAt(sort: Desc)])
  @@index([status, createdAt])
}

model Comment {
  id        String   @id @default(cuid())
  postId    String
  userId    String
  createdAt DateTime @default(now())
  content   String

  post      Post @relation(fields: [postId], references: [id])
  user      User @relation(fields: [userId], references: [id])

  @@index([postId, createdAt(sort: Desc)])
  @@index([userId, postId])
}
```

---

## Expression & Functional Indexes

```sql
-- Index on computed/transformed columns
CREATE INDEX idx_user_email_lower
ON "User"(LOWER(email));

-- JSON field index
CREATE INDEX idx_user_metadata_org
ON "User" USING GIN(metadata -> 'organization');

-- Full-text search index
CREATE INDEX idx_post_search
ON "Post" USING GIN(to_tsvector('english', title || ' ' || content));

-- Range queries on dates
CREATE INDEX idx_post_date_range
ON "Post"(created_at DESC)
WHERE status = 'published';
```

---

## Query Optimization Patterns

```typescript
// modules/cores/db/interfaces/indexed-query-results.ts
/**
 * User post result
 */
export interface UserPost {
  id: string
  title: string
  content: string
  userId: string
  status: string
  createdAt: Date
}

/**
 * Comment result with user
 */
export interface CommentWithUser {
  id: string
  content: string
  postId: string
  createdAt: Date
  user: { id: string; name: string }
}

/**
 * Full-text search result
 */
export interface FullTextSearchResult {
  id: string
  title: string
  content: string
}

/**
 * User search result
 */
export interface UserSearchResult {
  id: string
  email: string
}
```

```typescript
// modules/cores/db/repositories/indexed-queries.ts
import type {
  UserPost,
  CommentWithUser,
  FullTextSearchResult,
  UserSearchResult
} from '../interfaces/indexed-query-results'

/**
 * Get active user posts (uses composite index)
 * @param prisma - Prisma Client instance
 * @param userId - User ID
 * @returns Published posts by user
 */
export async function getActiveUserPosts(
  prisma: PrismaClient,
  userId: string
): Promise<UserPost[]> {
  // Uses: @@index([userId, status, createdAt(sort: Desc)])
  return prisma.post.findMany({
    where: {
      userId,
      status: 'published',
    },
    orderBy: { createdAt: 'desc' },
  }) as Promise<UserPost[]>
}

/**
 * Get post comments with user data (uses index)
 * @param prisma - Prisma Client instance
 * @param postId - Post ID
 * @returns Comments with author info
 */
export async function getPostComments(
  prisma: PrismaClient,
  postId: string
): Promise<CommentWithUser[]> {
  // Uses: @@index([postId, createdAt(sort: Desc)])
  return prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  }) as Promise<CommentWithUser[]>
}

/**
 * Search posts using full-text index
 * @param prisma - Prisma Client instance
 * @param query - Search query
 * @returns Search results
 */
export async function searchPostsByFullText(
  prisma: PrismaClient,
  query: string
): Promise<FullTextSearchResult[]> {
  // Uses: idx_post_search (GIN full-text index)
  return prisma.$queryRaw<FullTextSearchResult[]>`
    SELECT id, title, content
    FROM "Post"
    WHERE to_tsvector('english', title || ' ' || content)
      @@ plainto_tsquery('english', ${query})
    ORDER BY ts_rank(
      to_tsvector('english', title || ' ' || content),
      plainto_tsquery('english', ${query})
    ) DESC
  `
}

/**
 * Find user by email case-insensitive (uses expression index)
 * @param prisma - Prisma Client instance
 * @param email - Email to search
 * @returns User search results
 */
export async function findUserByEmailCaseInsensitive(
  prisma: PrismaClient,
  email: string
): Promise<UserSearchResult[]> {
  // Uses: idx_user_email_lower
  return prisma.$queryRaw<UserSearchResult[]>`
    SELECT id, email
    FROM "User"
    WHERE LOWER(email) = LOWER(${email})
  `
}
```

---

## Index Monitoring

```typescript
// modules/cores/db/interfaces/index-stats.ts
/**
 * Index statistics and performance
 */
export interface IndexStats {
  indexname: string
  tablename: string
  size: string
  scans: bigint
  tuplesRead: bigint
  tuplesFetched: bigint
}

/**
 * Unused index information
 */
export interface UnusedIndexInfo {
  schemaname: string
  tablename: string
  indexname: string
  size: string
}
```

```typescript
// modules/cores/db/repositories/index-monitoring.ts
import type { IndexStats, UnusedIndexInfo } from '../interfaces/index-stats'

/**
 * Get index usage statistics
 * @param prisma - Prisma Client instance
 * @returns Index stats sorted by usage
 */
export async function getIndexStats(
  prisma: PrismaClient
): Promise<IndexStats[]> {
  return prisma.$queryRaw<IndexStats[]>`
    SELECT
      i.indexname,
      i.tablename,
      pg_size_pretty(pg_relation_size(i.indexrelid)) as size,
      COALESCE(s.idx_scan, 0) as scans,
      COALESCE(s.idx_tup_read, 0) as "tuplesRead",
      COALESCE(s.idx_tup_fetch, 0) as "tuplesFetched"
    FROM pg_indexes i
    LEFT JOIN pg_stat_user_indexes s ON i.indexname = s.indexrelname
    WHERE i.schemaname NOT IN ('pg_catalog', 'information_schema')
    ORDER BY COALESCE(s.idx_scan, 0) DESC
  `
}

/**
 * Find unused indexes that can be removed
 * @param prisma - Prisma Client instance
 * @returns Unused indexes with size info
 */
export async function findUnusedIndexes(
  prisma: PrismaClient
): Promise<UnusedIndexInfo[]> {
  return prisma.$queryRaw<UnusedIndexInfo[]>`
    SELECT
      i.schemaname,
      i.tablename,
      i.indexname,
      pg_size_pretty(pg_relation_size(i.indexrelid)) as size
    FROM pg_indexes i
    LEFT JOIN pg_stat_user_indexes s ON i.indexname = s.indexrelname
    WHERE i.schemaname NOT IN ('pg_catalog', 'information_schema')
      AND (s.idx_scan = 0 OR s.idx_scan IS NULL)
      AND i.indexname NOT LIKE 'pg_toast%'
  `
}
```

---

## Index Creation Safely

```typescript
// modules/cores/db/interfaces/index-definition.ts
/**
 * Index definition for creation
 */
export interface IndexDefinition {
  name: string
  sql: string
}

/**
 * Index creation result
 */
export interface IndexCreationResult {
  name: string
  status: 'created' | 'exists' | 'error'
  message: string
}
```

```typescript
// modules/cores/db/repositories/index-creation.ts
import { Prisma } from '@prisma/client'
import type { IndexDefinition, IndexCreationResult } from '../interfaces/index-definition'

/**
 * Create indexes safely with error handling
 * @param prisma - Prisma Client instance
 * @param indexes - Index definitions to create
 * @returns Creation results for each index
 */
export async function createIndexesSafely(
  prisma: PrismaClient,
  indexes?: IndexDefinition[]
): Promise<IndexCreationResult[]> {
  const defaultIndexes: IndexDefinition[] = indexes || [
    {
      name: 'idx_active_users',
      sql: 'CREATE INDEX CONCURRENTLY idx_active_users ON "User"(email) WHERE status = \'active\'',
    },
    {
      name: 'idx_user_email_lower',
      sql: 'CREATE INDEX CONCURRENTLY idx_user_email_lower ON "User"(LOWER(email))',
    },
  ]

  const results: IndexCreationResult[] = []

  for (const idx of defaultIndexes) {
    try {
      await prisma.$executeRaw`
        ${Prisma.raw(idx.sql)}
      `
      console.log(`Created index: ${idx.name}`)
      results.push({
        name: idx.name,
        status: 'created',
        message: 'Index created successfully',
      })
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        console.log(`Index already exists: ${idx.name}`)
        results.push({
          name: idx.name,
          status: 'exists',
          message: 'Index already exists',
        })
      } else {
        console.error(`Failed to create index ${idx.name}:`, error)
        results.push({
          name: idx.name,
          status: 'error',
          message: error.message,
        })
      }
    }
  }

  return results
}
```
