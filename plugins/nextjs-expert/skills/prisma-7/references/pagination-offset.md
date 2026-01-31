---
title: "Offset-Based Pagination"
description: "Page-based pagination with skip/take, total count, and page controls"
category: "Querying"
---

# Offset-Based Pagination

Implement traditional page-based pagination with skip and take parameters.

## Basic Offset Pagination

```typescript
// lib/types/offsetPagination.ts
import type { Prisma } from "@prisma/client";

/**
 * Offset pagination parameters
 */
export interface OffsetPaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Post data type
 */
export interface PostData {
  id: string;
  title: string;
  createdAt: Date;
}

// lib/queries/offsetPaginationQueries.ts
import type { OffsetPaginationParams, PostData } from "@/lib/types/offsetPagination";

/**
 * Get posts by page number with pagination
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Array of posts for the page
 */
async function getPostsByPage(
  page: number,
  pageSize: number = 10
): Promise<PostData[]> {
  const skip = (page - 1) * pageSize;

  return prisma.post.findMany({
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" }
  });
}

/**
 * Get first page of posts
 * @returns First 20 posts
 */
async function getFirstPage(): Promise<PostData[]> {
  return getPostsByPage(1, 20);
}

/**
 * Get second page of posts
 * @returns Posts 20-39
 */
async function getSecondPage(): Promise<PostData[]> {
  return getPostsByPage(2, 20);
}
```

## Pagination with Total Count

```typescript
// lib/types/paginationMeta.ts
import type { Prisma } from "@prisma/client";

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Generic paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// lib/queries/paginationQueries.ts
import type { PaginationMeta, PaginatedResponse } from "@/lib/types/paginationMeta";

/**
 * Calculate pagination metadata
 * @param page - Current page number
 * @param pageSize - Items per page
 * @param total - Total item count
 * @returns Pagination metadata
 */
function calculatePaginationMeta(
  page: number,
  pageSize: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / pageSize);
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
}

/**
 * Get paginated posts with total count
 * @param page - Page number
 * @param pageSize - Items per page
 * @returns Paginated response with metadata
 */
async function getPaginatedPosts(
  page: number,
  pageSize: number = 10
): Promise<PaginatedResponse<PostData>> {
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" }
    }),
    prisma.post.count()
  ]);

  return {
    data: posts,
    pagination: calculatePaginationMeta(page, pageSize, total)
  };
}
```

## Advanced Pagination Response

```typescript
// lib/types/advancedPagination.ts
import type { Prisma } from "@prisma/client";

/**
 * Advanced paginated response with metadata
 */
export interface AdvancedPaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Raw SQL pagination result
 */
export interface RawPaginationResult {
  count: number;
}

// lib/queries/advancedPaginationQueries.ts
import type { AdvancedPaginatedResponse, RawPaginationResult } from "@/lib/types/advancedPagination";

/**
 * Generic pagination function with raw SQL
 * @param page - Page number
 * @param pageSize - Items per page
 * @returns Advanced paginated response
 */
async function paginate<T>(
  page: number,
  pageSize: number = 10
): Promise<AdvancedPaginatedResponse<T>> {
  const skip = (page - 1) * pageSize;

  const [data, totalResult] = await Promise.all([
    prisma.$queryRaw<T[]>(
      Prisma.sql`SELECT * FROM "Post" OFFSET ${skip} LIMIT ${pageSize}`
    ),
    prisma.$queryRaw<RawPaginationResult[]>(
      Prisma.sql`SELECT COUNT(*) as count FROM "Post"`
    )
  ]);

  const total = totalResult[0].count;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data,
    meta: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
}
```

## Filtered Pagination

```typescript
// lib/types/searchPagination.ts
import type { Prisma } from "@prisma/client";

/**
 * Search and filter options
 */
export interface SearchPaginationFilter {
  searchTerm?: string;
  status?: string;
}

/**
 * Search pagination response
 */
export interface SearchPaginationResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// lib/queries/searchPaginationQueries.ts
import type { SearchPaginationFilter, SearchPaginationResponse } from "@/lib/types/searchPagination";

/**
 * Build where clause from search filter
 * @param filter - Search filter
 * @returns Prisma where input
 */
function buildSearchWhereClause(
  filter: SearchPaginationFilter
): Prisma.PostWhereInput {
  return {
    ...(filter.searchTerm && {
      OR: [
        { title: { contains: filter.searchTerm, mode: "insensitive" } },
        { content: { contains: filter.searchTerm, mode: "insensitive" } }
      ]
    }),
    ...(filter.status && { status: filter.status })
  };
}

/**
 * Search and paginate posts
 * @param filter - Search filter object
 * @param page - Page number
 * @param pageSize - Items per page
 * @returns Paginated search results
 */
async function searchAndPaginate(
  filter: SearchPaginationFilter,
  page: number = 1,
  pageSize: number = 10
): Promise<SearchPaginationResponse<PostData>> {
  const skip = (page - 1) * pageSize;
  const where = buildSearchWhereClause(filter);

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" }
    }),
    prisma.post.count({ where })
  ]);

  return {
    data: posts,
    pagination: calculatePaginationMeta(page, pageSize, total)
  };
}
```

## API Route Implementation

### Next.js Page Route
```typescript
// pages/api/posts.ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { page = "1", pageSize = "10", status } = req.query;

  const pageNum = Math.max(1, parseInt(page as string, 10));
  const size = Math.min(100, Math.max(1, parseInt(pageSize as string, 10)));
  const skip = (pageNum - 1) * size;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: status ? { status: status as string } : undefined,
      skip,
      take: size,
      orderBy: { createdAt: "desc" }
    }),
    prisma.post.count({
      where: status ? { status: status as string } : undefined
    })
  ]);

  res.json({
    data: posts,
    pagination: {
      page: pageNum,
      pageSize: size,
      total,
      totalPages: Math.ceil(total / size)
    }
  });
}
```

### App Router Server Action
```typescript
// app/actions/posts.ts
"use server"

export async function getPaginatedPosts(
  page: number,
  pageSize: number = 10,
  filters?: { status?: string }
) {
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: filters?.status ? { status: filters.status } : undefined,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" }
    }),
    prisma.post.count({
      where: filters?.status ? { status: filters.status } : undefined
    })
  ]);

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

## React Components

### Pagination Controls
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>{currentPage} / {totalPages}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}
```

### Paginated List Component
```typescript
"use client"

export default function PostList() {
  const [page, setPage] = useState(1);
  const { data, pagination, isLoading } = usePagedPosts(page);

  return (
    <div>
      {data?.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
```

## Performance Considerations

### Limit Maximum Page Size
```typescript
const MAX_PAGE_SIZE = 100;

const pageSize = Math.min(
  parseInt(req.query.pageSize as string) || 10,
  MAX_PAGE_SIZE
);
```

### Optimize Large Offsets
```typescript
// For very large offsets, consider cursor pagination instead
// Skip large numbers can be slow on large tables

async function getPageOptimized(page: number, pageSize: number) {
  if (page > 1000) {
    // Use cursor pagination for deep pages
    return getCursorPage(cursor, pageSize);
  }

  return getPaginationPage(page, pageSize);
}
```

## Best Practices

1. **Limit max page size** - Prevent large queries (e.g., max 100)
2. **Combine skip/take** - Always use both together
3. **Count separately** - Parallel queries with Promise.all()
4. **Validate input** - Ensure page > 0, pageSize > 0
5. **Use cursor for deep pagination** - Better performance than large offsets
