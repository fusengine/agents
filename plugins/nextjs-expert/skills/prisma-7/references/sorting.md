---
title: "Sorting in Prisma"
description: "OrderBy, multiple columns, nulls handling, and sorting patterns"
category: "Querying"
---

# Sorting

Sort query results by single or multiple fields with flexible null handling.

## Basic Sorting

```typescript
// lib/types/sorting.ts
import type { Prisma } from "@prisma/client";

/**
 * Sort direction type
 */
export type SortDirection = "asc" | "desc";

/**
 * Single column sort configuration
 */
export interface SingleColumnSort {
  field: string;
  direction: SortDirection;
}

// lib/queries/sortQueries.ts
import type { SortDirection, SingleColumnSort } from "@/lib/types/sorting";

/**
 * Find users sorted by creation date ascending
 * @returns Sorted array of users
 */
async function findUsersSorted() {
  return prisma.user.findMany({
    orderBy: { createdAt: "asc" }
  });
}

/**
 * Find posts sorted by view count descending
 * @returns Most viewed posts first
 */
async function findMostViewedPosts() {
  return prisma.post.findMany({
    orderBy: { views: "desc" }
  });
}

/**
 * Find posts in reverse chronological order
 * @returns Newest posts first
 */
async function findPostsNewest() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" }
  });
}

/**
 * Find users sorted alphabetically
 * @returns Users by name ascending
 */
async function findUsersSortedByName() {
  return prisma.user.findMany({
    orderBy: { name: "asc" }
  });
}

/**
 * Find most liked comments
 * @returns Comments by likes descending
 */
async function findMostLikedComments() {
  return prisma.comment.findMany({
    orderBy: { likes: "desc" }
  });
}
```

## Multiple Column Sorting

```typescript
// lib/types/multiSort.ts
import type { Prisma } from "@prisma/client";

/**
 * Multi-column sort configuration
 */
export interface MultiColumnSort {
  sorts: Array<{
    field: string;
    direction: "asc" | "desc";
  }>;
}

/**
 * Task sort criteria
 */
export interface TaskSortCriteria {
  byPriority?: boolean;
  byDueDate?: boolean;
  alphabetical?: boolean;
}

// lib/queries/multiSortQueries.ts
import type { MultiColumnSort, TaskSortCriteria } from "@/lib/types/multiSort";

/**
 * Find posts sorted by status then date
 * @returns Published posts first, newest first
 */
async function findPostsSortedByStatusAndDate() {
  return prisma.post.findMany({
    orderBy: [
      { status: "desc" },
      { createdAt: "desc" }
    ]
  });
}

/**
 * Find tasks with priority sorting
 * @returns Tasks by priority, due date, then name
 */
async function findTasksSortedByPriority() {
  return prisma.task.findMany({
    orderBy: [
      { priority: "desc" },
      { dueDate: "asc" },
      { title: "asc" }
    ]
  });
}

/**
 * Find results with category and score ranking
 * @returns Results by category, score, then timestamp
 */
async function findResultsSortedByCategory() {
  return prisma.result.findMany({
    orderBy: [
      { category: "asc" },
      { score: "desc" },
      { timestamp: "desc" }
    ]
  });
}

/**
 * Generic multi-column sort function
 * @param sort - Multi-column sort configuration
 * @returns Sorted results
 */
async function findPostsWithMultiSort(sort: MultiColumnSort) {
  const orderBy = sort.sorts.reduce((acc, s) => {
    return [...acc, { [s.field]: s.direction }];
  }, [] as Prisma.PostOrderByWithRelationInput[]);

  return prisma.post.findMany({ orderBy });
}
```

## Null Handling

```typescript
// lib/types/nullHandling.ts
import type { Prisma } from "@prisma/client";

/**
 * Null position in sort order
 */
export type NullPosition = "first" | "last";

/**
 * Sort configuration with null handling
 */
export interface SortWithNullHandling {
  field: string;
  direction: "asc" | "desc";
  nulls: NullPosition;
}

// lib/queries/nullSortQueries.ts
import type { SortWithNullHandling, NullPosition } from "@/lib/types/nullHandling";

/**
 * Find users with null values first in sort
 * @returns Users sorted by deletion status (nulls first)
 */
async function findUsersSoftDeleteNullsFirst() {
  return prisma.user.findMany({
    orderBy: {
      deletedAt: {
        sort: "asc",
        nulls: "first"
      }
    }
  });
}

/**
 * Find users with null values last in sort
 * @returns Users sorted by last login (nulls last)
 */
async function findUsersSortedByLastLogin() {
  return prisma.user.findMany({
    orderBy: {
      lastLogin: {
        sort: "desc",
        nulls: "last"
      }
    }
  });
}

/**
 * Find posts with mixed null handling
 * @returns Posts sorted by publication (nulls last), then by views
 */
async function findPostsSortedByPublication() {
  return prisma.post.findMany({
    orderBy: [
      {
        publishedAt: {
          sort: "desc",
          nulls: "last"
        }
      },
      { views: "desc" }
    ]
  });
}

/**
 * Generic sort with null position control
 * @param config - Sort configuration with null handling
 * @returns Sorted results
 */
async function findUsersWithNullHandling(config: SortWithNullHandling) {
  return prisma.user.findMany({
    orderBy: {
      [config.field]: {
        sort: config.direction,
        nulls: config.nulls
      }
    }
  });
}
```

## Advanced Sorting

```typescript
// lib/types/advancedSorting.ts
import type { Prisma } from "@prisma/client";

/**
 * Relation sorting configuration
 */
export interface RelationSort {
  relation: string;
  field: string;
  direction: "asc" | "desc";
}

/**
 * Count-based sorting
 */
export interface CountSort {
  relation: string;
  direction: "asc" | "desc";
}

// lib/queries/advancedSortQueries.ts
import type { RelationSort, CountSort } from "@/lib/types/advancedSorting";

/**
 * Find posts sorted by author name
 * @returns Posts ordered alphabetically by author
 */
async function findPostsSortedByAuthor() {
  return prisma.post.findMany({
    orderBy: {
      author: { name: "asc" }
    }
  });
}

/**
 * Find authors by post count (most prolific first)
 * @returns Authors sorted by number of posts
 */
async function findAuthorsByPostCount() {
  return prisma.author.findMany({
    orderBy: {
      posts: { _count: "desc" }
    }
  });
}

/**
 * Find users sorted case-insensitively
 * @returns Users by name with null handling
 */
async function findUsersSortedByNameInsensitive() {
  return prisma.user.findMany({
    orderBy: {
      name: {
        sort: "asc",
        nulls: "last"
      }
    }
  });
}

/**
 * Generic relation sorting function
 * @param sort - Relation sort configuration
 * @returns Sorted results
 */
async function findPostsWithRelationSort(sort: RelationSort) {
  return prisma.post.findMany({
    orderBy: {
      [sort.relation]: {
        [sort.field]: sort.direction
      }
    }
  });
}
```

## Pagination with Sorting

### Skip + Take
```typescript
const page = 1;
const pageSize = 10;

const posts = await prisma.post.findMany({
  orderBy: { createdAt: "desc" },
  skip: (page - 1) * pageSize,
  take: pageSize
});
```

### With Multiple Sorts
```typescript
const results = await prisma.result.findMany({
  where: { active: true },
  orderBy: [
    { priority: "desc" },
    { createdAt: "desc" }
  ],
  skip: 0,
  take: 20
});
```

## Best Practices

1. **Index sorted fields** - Add database indexes for performance
2. **Combine with filters** - Sort filtered data for relevance
3. **Handle nulls explicitly** - Use `nulls: "first"` or `"last"`
4. **Limit results** - Always pair with `take` for large tables
5. **Consistent ordering** - Use timestamp + ID for deterministic results

## Performance Tips

```typescript
// Good: Indexed field, limited results
const posts = await prisma.post.findMany({
  orderBy: { createdAt: "desc" },
  take: 25
});

// Avoid: Sorting non-indexed field with large dataset
// const users = await prisma.user.findMany({
//   orderBy: { customRating: "desc" },  // unindexed
//   take: 1000  // too many results
// });
```
