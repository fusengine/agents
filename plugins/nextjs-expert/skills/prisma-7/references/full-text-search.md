---
name: full-text-search
description: Prisma 7 full-text search with PostgreSQL and MySQL
when-to-use: Implementing search functionality with ranking
keywords: search, fullTextSearch, tsvector, LIKE, contains
priority: medium
requires: queries.md
related: typedsql.md
---

# Full-Text Search

Search patterns in Prisma 7.

## Enable Preview Feature

```prisma
generator client {
  provider        = "prisma-client"
  output          = "../src/generated/prisma"
  previewFeatures = ["fullTextSearchPostgres"]
}
```

---

## Basic Search (PostgreSQL)

```typescript
// modules/cores/db/repositories/post-repository.ts
/**
 * Search posts by title
 * @param prisma - Prisma Client instance
 * @param searchQuery - Search terms
 * @returns Matching posts
 */
export async function searchPostsByTitle(
  prisma: PrismaClient,
  searchQuery: string
) {
  return await prisma.post.findMany({
    where: {
      title: {
        search: searchQuery,
      },
    },
  })
}

/**
 * Search posts in title or content
 * @param prisma - Prisma Client instance
 * @param searchQuery - Search terms
 * @returns Posts matching any field
 */
export async function searchPostsMultiField(
  prisma: PrismaClient,
  searchQuery: string
) {
  return await prisma.post.findMany({
    where: {
      OR: [
        { title: { search: searchQuery } },
        { content: { search: searchQuery } },
      ],
    },
  })
}
```

---

## Search Operators

```typescript
// modules/cores/db/repositories/post-repository.ts
/**
 * Search posts with AND operator
 * @param prisma - Prisma Client instance
 * @param terms - Terms to find (all required)
 * @returns Posts matching all terms
 */
export async function searchPostsAnd(
  prisma: PrismaClient,
  ...terms: string[]
) {
  return await prisma.post.findMany({
    where: {
      title: { search: terms.join(' & ') },
    },
  })
}

/**
 * Search posts with OR operator
 * @param prisma - Prisma Client instance
 * @param terms - Terms to find (any match)
 * @returns Posts matching any term
 */
export async function searchPostsOr(
  prisma: PrismaClient,
  ...terms: string[]
) {
  return await prisma.post.findMany({
    where: {
      title: { search: terms.join(' | ') },
    },
  })
}

/**
 * Search posts excluding term
 * @param prisma - Prisma Client instance
 * @param includeTerm - Required term
 * @param excludeTerm - Excluded term
 * @returns Posts with includeTerm but without excludeTerm
 */
export async function searchPostsNot(
  prisma: PrismaClient,
  includeTerm: string,
  excludeTerm: string
) {
  return await prisma.post.findMany({
    where: {
      title: { search: `${includeTerm} & !${excludeTerm}` },
    },
  })
}

/**
 * Prefix search (wildcard)
 * @param prisma - Prisma Client instance
 * @param prefix - Term prefix
 * @returns Posts with term prefix matches
 */
export async function searchPostsPrefix(
  prisma: PrismaClient,
  prefix: string
) {
  return await prisma.post.findMany({
    where: {
      title: { search: `${prefix}:*` },
    },
  })
}
```

---

## Case-Insensitive LIKE

```typescript
// modules/cores/db/repositories/user-repository.ts
/**
 * Find users by name (case-insensitive)
 * @param prisma - Prisma Client instance
 * @param namePart - Name substring
 * @returns Users with matching name
 */
export async function findUsersByNameInsensitive(
  prisma: PrismaClient,
  namePart: string
) {
  return await prisma.user.findMany({
    where: {
      name: {
        contains: namePart,
        mode: 'insensitive',
      },
    },
  })
}

/**
 * Find users by email prefix (case-insensitive)
 * @param prisma - Prisma Client instance
 * @param emailPrefix - Email start pattern
 * @returns Users with matching email prefix
 */
export async function findUsersByEmailPrefix(
  prisma: PrismaClient,
  emailPrefix: string
) {
  return await prisma.user.findMany({
    where: {
      email: {
        startsWith: emailPrefix,
        mode: 'insensitive',
      },
    },
  })
}
```

---

## Search with Ranking (TypedSQL)

```typescript
// modules/cores/db/interfaces/ranked-search.ts
/**
 * Search result with ranking score
 */
export interface RankedSearchResult {
  id: string
  title: string
  rank: number
}
```

```typescript
// modules/cores/db/repositories/search-repository.ts
import type { RankedSearchResult } from '../interfaces/ranked-search'

/**
 * Search posts with ranking by relevance
 * @param prisma - Prisma Client instance
 * @param query - Search query
 * @param limit - Maximum results
 * @returns Ranked search results
 */
export async function searchPostsRanked(
  prisma: PrismaClient,
  query: string,
  limit: number = 20
): Promise<RankedSearchResult[]> {
  return prisma.$queryRaw<RankedSearchResult[]>`
    SELECT
      id,
      title,
      ts_rank(
        to_tsvector('english', title || ' ' || content),
        plainto_tsquery('english', ${query})
      ) as rank
    FROM "Post"
    WHERE to_tsvector('english', title || ' ' || content)
      @@ plainto_tsquery('english', ${query})
    ORDER BY rank DESC
    LIMIT ${limit}
  `
}
```

---

## Index for Performance

```prisma
model Post {
  id      String @id @default(cuid())
  title   String
  content String

  // Add in migration manually:
  // CREATE INDEX post_search_idx ON "Post"
  // USING GIN (to_tsvector('english', title || ' ' || content));
}
```

```sql
-- prisma/migrations/xxx_add_search_index/migration.sql
CREATE INDEX post_search_idx ON "Post"
USING GIN (to_tsvector('english', title || ' ' || content));
```

---

## MySQL Full-Text

```prisma
generator client {
  provider        = "prisma-client"
  output          = "../src/generated/prisma"
  previewFeatures = ["fullTextSearchMysql", "fullTextIndexMysql"]
}

model Post {
  id      Int    @id @default(autoincrement())
  title   String @db.VarChar(255)
  content String @db.Text

  @@fulltext([title, content])
}
```

```typescript
const posts = await prisma.post.findMany({
  where: {
    title: { search: 'prisma database' },
  },
})
```

---

## Best Practices

1. **Add GIN index** - Essential for performance
2. **Use plainto_tsquery** - Handles user input safely
3. **Rank results** - Order by relevance
4. **Limit results** - Search returns many matches
5. **Consider alternatives** - Algolia/Meilisearch for complex
