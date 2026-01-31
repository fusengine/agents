---
title: "Cursor-Based Pagination"
description: "Cursor pagination patterns, infinite scroll, and bidirectional navigation"
category: "Querying"
---

# Cursor-Based Pagination

Implement efficient cursor-based pagination for large datasets and infinite scroll.

## Basic Cursor Pagination

```typescript
// lib/types/cursor.ts
import type { Prisma } from "@prisma/client";

/**
 * Post data for pagination response
 */
export interface Post {
  id: string;
  title: string;
}

/**
 * Cursor-based pagination response
 */
export interface CursorPaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * Cursor pagination options
 */
export interface CursorPaginationOptions {
  cursor?: string;
  take?: number;
}

// lib/queries/cursorQueries.ts
import type { Post, CursorPaginatedResponse, CursorPaginationOptions } from "@/lib/types/cursor";

/**
 * Fetch first page of posts
 * @returns Posts with pagination metadata
 */
async function getFirstPostsPage() {
  return prisma.post.findMany({
    orderBy: { id: "desc" },
    take: 11
  });
}

/**
 * Get next page of posts with cursor
 * @param cursor - Last post ID from previous page
 * @returns Posts with pagination metadata
 */
async function getNextPostsPage(cursor: string) {
  return prisma.post.findMany({
    orderBy: { id: "desc" },
    skip: 1,
    take: 10,
    cursor: { id: cursor }
  });
}

/**
 * Get paginated posts with cursor
 * @param cursor - Optional cursor for pagination
 * @returns Paginated response with next cursor
 */
async function getPosts(cursor?: string): Promise<CursorPaginatedResponse<Post>> {
  const pageSize = 10;
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: pageSize + 1,
    ...(cursor && { skip: 1, cursor: { id: cursor } })
  });

  const hasMore = posts.length > pageSize;
  const data = posts.slice(0, pageSize);

  return {
    data,
    nextCursor: hasMore ? data[data.length - 1].id : null,
    hasMore
  };
}
```

## Multi-Column Cursors

```typescript
// lib/types/multiColumnCursor.ts
import type { Prisma } from "@prisma/client";

/**
 * Multi-column cursor for tie-breaking
 */
export interface MultiColumnCursor {
  status: string;
  createdAt: Date;
}

/**
 * Multi-column pagination response
 */
export interface MultiColumnPaginatedResponse {
  data: any[];
  nextCursor: MultiColumnCursor | null;
  hasMore: boolean;
}

// lib/queries/multiColumnCursorQueries.ts
import type { MultiColumnCursor, MultiColumnPaginatedResponse } from "@/lib/types/multiColumnCursor";

/**
 * Get posts with multi-column cursor
 * @returns Posts sorted by status and date
 */
async function getPostsWithMultiColumnCursor() {
  return prisma.post.findMany({
    orderBy: [
      { status: "desc" },
      { createdAt: "desc" }
    ],
    take: 10,
    cursor: {
      status_createdAt: {
        status: "published",
        createdAt: new Date("2024-01-15")
      }
    }
  });
}

/**
 * Get paginated results using multi-column cursor
 * @param cursor - Multi-column cursor from previous page
 * @returns Paginated response with next cursor
 */
async function getPaginatedResults(
  cursor?: MultiColumnCursor
): Promise<MultiColumnPaginatedResponse> {
  const pageSize = 10;
  const results = await prisma.post.findMany({
    orderBy: [
      { status: "desc" },
      { createdAt: "desc" }
    ],
    take: pageSize + 1,
    ...(cursor && {
      skip: 1,
      cursor: {
        status_createdAt: cursor
      }
    })
  });

  const hasMore = results.length > pageSize;
  const data = results.slice(0, pageSize);
  const nextCursor = hasMore ? {
    status: data[data.length - 1].status,
    createdAt: data[data.length - 1].createdAt
  } : null;

  return { data, nextCursor, hasMore };
}
```

## Bidirectional Pagination

```typescript
// lib/types/bidirectionalCursor.ts
import type { Prisma } from "@prisma/client";

/**
 * Pagination direction
 */
export type PaginationDirection = "next" | "prev";

/**
 * Bidirectional cursor pagination response
 */
export interface BidirectionalCursorResponse<T> {
  data: T[];
  nextCursor: string | null;
  prevCursor: string | null;
  hasMore: boolean;
  hasPrev: boolean;
}

// lib/queries/bidirectionalCursorQueries.ts
import type { PaginationDirection, BidirectionalCursorResponse } from "@/lib/types/bidirectionalCursor";

/**
 * Get previous page of posts
 * @param cursor - Cursor position
 * @param pageSize - Number of items per page
 * @returns Previous page posts in correct order
 */
async function getPreviousPage(cursor: string, pageSize: number = 10) {
  const posts = await prisma.post.findMany({
    orderBy: { id: "asc" },
    take: -(pageSize + 1),
    cursor: { id: cursor },
    skip: 1
  });

  return posts.reverse();
}

/**
 * Get bidirectional paginated posts
 * @param cursor - Optional cursor position
 * @param direction - Direction of pagination
 * @returns Bidirectional pagination response
 */
async function getBidirectionalPage(
  cursor?: string,
  direction: PaginationDirection = "next"
): Promise<BidirectionalCursorResponse<Post>> {
  const pageSize = 10;

  if (direction === "next") {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } })
    });

    const hasMore = posts.length > pageSize;
    const data = posts.slice(0, pageSize);

    return {
      data,
      nextCursor: hasMore ? data[data.length - 1].id : null,
      prevCursor: cursor || null,
      hasMore,
      hasPrev: !!cursor
    };
  }

  // Previous direction
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "asc" },
    take: pageSize + 1,
    cursor: { id: cursor },
    skip: 1
  });

  const hasPrev = posts.length > pageSize;
  const data = posts.reverse().slice(0, pageSize);

  return {
    data,
    nextCursor: cursor,
    prevCursor: hasPrev ? data[0].id : null,
    hasMore: true,
    hasPrev
  };
}
```

## Infinite Scroll Implementation

### React Hook Pattern
```typescript
function useInfiniteScroll() {
  const [data, setData] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const response = await fetch(
      `/api/posts?${cursor ? `cursor=${cursor}` : ""}`
    );
    const { data: newPosts, nextCursor, hasMore: more } =
      await response.json();

    setData(prev => [...prev, ...newPosts]);
    setCursor(nextCursor);
    setHasMore(more);
    setLoading(false);
  }, [cursor, hasMore, loading]);

  return { data, hasMore, loading, loadMore };
}
```

### API Route with Cursor
```typescript
// pages/api/posts.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { cursor } = req.query;

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 11,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor as string }
    })
  });

  const hasMore = posts.length > 10;
  const data = posts.slice(0, 10);

  res.json({
    data,
    nextCursor: hasMore ? data[data.length - 1].id : null,
    hasMore
  });
}
```

## Cursor Encoding

```typescript
// lib/utils/cursorEncoder.ts

/**
 * Encode cursor to base64 string
 * @param id - Cursor ID to encode
 * @returns Base64 encoded cursor
 */
export function encodeCursor(id: string): string {
  return Buffer.from(id).toString("base64");
}

/**
 * Decode base64 cursor to string
 * @param cursor - Encoded cursor
 * @returns Decoded cursor ID
 */
export function decodeCursor(cursor: string): string {
  return Buffer.from(cursor, "base64").toString("utf-8");
}

/**
 * Validate and decode cursor safely
 * @param cursor - Cursor to validate
 * @returns Decoded cursor or null if invalid
 */
export function validateAndDecodeCursor(cursor?: string): string | null {
  if (!cursor) return null;

  try {
    return decodeCursor(cursor);
  } catch {
    return null;
  }
}
```

## Best Practices

1. **Use ID-based cursors** - Simple and efficient
2. **Fetch +1 record** - To detect if more data exists
3. **Include created/updated timestamp** - For consistency
4. **Validate cursor input** - Prevent injection
5. **Handle deleted records** - Gracefully skip missing cursors
