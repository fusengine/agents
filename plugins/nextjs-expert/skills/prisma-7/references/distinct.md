---
title: "Distinct Queries"
description: "Remove duplicates, find unique values, distinct on single/multiple fields"
category: "Querying"
---

# Distinct Queries

Retrieve unique values and remove duplicates using distinct queries.

## Basic Distinct

```typescript
// lib/types/distinct.ts
import type { Prisma } from "@prisma/client";

/**
 * Distinct query result
 */
export interface DistinctResult<T> {
  items: T[];
  count: number;
}

/**
 * Email distinct result
 */
export interface EmailDistinct {
  email: string;
}

/**
 * Location distinct result
 */
export interface LocationDistinct {
  country: string;
  city: string;
}

// lib/queries/distinctQueries.ts
import type { DistinctResult, EmailDistinct, LocationDistinct } from "@/lib/types/distinct";

/**
 * Get unique email addresses for active users
 * @returns Array of unique emails
 */
async function getUniqueEmails(): Promise<EmailDistinct[]> {
  return prisma.user.findMany({
    where: { active: true },
    distinct: ["email"],
    select: { email: true }
  });
}

/**
 * Get unique country-city combinations
 * @returns Array of unique locations
 */
async function getUniqueLocations(): Promise<LocationDistinct[]> {
  return prisma.user.findMany({
    distinct: ["country", "city"],
    select: {
      country: true,
      city: true
    }
  });
}

/**
 * Get unique authors
 * @returns Array of unique author IDs
 */
async function getUniqueAuthors() {
  return prisma.post.findMany({
    distinct: ["authorId"],
    select: { authorId: true }
  });
}
```

## Distinct with Filters

### Filter Then Get Distinct
```typescript
// Get unique categories for published posts
const categories = await prisma.post.findMany({
  where: { published: true },
  distinct: ["category"],
  select: { category: true }
});
```

### Complex Filters
```typescript
// Unique countries of users who purchased in last 30 days
const activeCountries = await prisma.user.findMany({
  where: {
    orders: {
      some: {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    }
  },
  distinct: ["country"],
  select: { country: true }
});
```

## Distinct with Sorting

### Sort Distinct Results
```typescript
// Get unique tags ordered by most recent
const tags = await prisma.tag.findMany({
  distinct: ["name"],
  orderBy: { updatedAt: "desc" },
  select: { name: true, updatedAt: true }
});
```

### Distinct on Multiple with Sort
```typescript
// Get unique category/author combinations, newest first
const combinations = await prisma.post.findMany({
  distinct: ["category", "authorId"],
  orderBy: { createdAt: "desc" },
  select: {
    category: true,
    authorId: true,
    createdAt: true
  },
  take: 10
});
```

## Pagination with Distinct

### Distinct with Skip/Take
```typescript
async function getUniqueEmailsPaginated(page: number, pageSize: number = 20) {
  const skip = (page - 1) * pageSize;

  const emails = await prisma.user.findMany({
    distinct: ["email"],
    select: { email: true },
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" }
  });

  return emails;
}
```

### Count Distinct for Total
```typescript
async function countUniqueEmails() {
  const result = await prisma.$queryRaw`
    SELECT COUNT(DISTINCT email) as count FROM User
  `;

  return result[0].count;
}

// Alternative with Prisma
const users = await prisma.user.findMany({
  distinct: ["email"]
});

const uniqueCount = users.length;
```

## Real-World Examples

```typescript
// lib/types/distinctExamples.ts
import type { Prisma } from "@prisma/client";

/**
 * User location with distinct
 */
export interface UserLocation {
  country: string;
  city: string;
}

/**
 * Product category
 */
export interface ProductCategory {
  category: string;
}

/**
 * Author with details
 */
export interface AuthorWithDetails {
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

// lib/queries/distinctExampleQueries.ts
import type { UserLocation, ProductCategory, AuthorWithDetails } from "@/lib/types/distinctExamples";

/**
 * Get unique locations of active users
 * @returns Sorted array of unique locations
 */
async function getActiveUserLocations(): Promise<UserLocation[]> {
  return prisma.user.findMany({
    where: { status: "active" },
    distinct: ["country", "city"],
    select: {
      country: true,
      city: true
    },
    orderBy: [
      { country: "asc" },
      { city: "asc" }
    ]
  });
}

/**
 * Get unique product categories
 * @returns Array of category names
 */
async function getProductCategories(): Promise<string[]> {
  const categories = await prisma.product.findMany({
    where: { active: true },
    distinct: ["category"],
    select: { category: true }
  });

  return categories.map(c => c.category);
}

/**
 * Get unique authors with details
 * @param limit - Maximum number of authors
 * @returns Array of authors with metadata
 */
async function getUniqueAuthorsWithDetails(
  limit: number = 10
): Promise<AuthorWithDetails[]> {
  return prisma.post.findMany({
    distinct: ["authorId"],
    select: {
      authorId: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    take: limit,
    orderBy: { createdAt: "desc" }
  });
}
```

### Find Duplicate Emails
```typescript
async function findDuplicateEmails() {
  const users = await prisma.user.findMany({
    select: { email: true, id: true }
  });

  const emailMap = new Map<string, string[]>();

  users.forEach(user => {
    const ids = emailMap.get(user.email) || [];
    ids.push(user.id);
    emailMap.set(user.email, ids);
  });

  const duplicates = Array.from(emailMap.entries())
    .filter(([, ids]) => ids.length > 1);

  return duplicates;
}
```

### Distinct with Raw SQL
```typescript
async function getDistinctTags() {
  const tags = await prisma.$queryRaw`
    SELECT DISTINCT category
    FROM Post
    WHERE published = true
    ORDER BY category ASC
  `;

  return tags;
}
```

## Performance Considerations

### Efficient Distinct Queries
```typescript
// Good: Just select what you need
const tags = await prisma.tag.findMany({
  distinct: ["name"],
  select: { name: true }
});

// Avoid: Selecting unnecessary fields
// const tags = await prisma.tag.findMany({
//   distinct: ["name"],
//   select: {
//     name: true,
//     description: true,
//     posts: { take: 10 }  // unnecessary overhead
//   }
// });
```

### Index Distinct Columns
```typescript
// In schema.prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  country String

  @@index([country])  // Index for distinct queries
}
```

## Limitations and Workarounds

### Distinct + Relations
```typescript
// Distinct doesn't work well with many relations
// Workaround: Fetch then deduplicate in code

const userIds = new Set<string>();
const posts = await prisma.post.findMany({
  take: 100,
  select: { authorId: true }
});

posts.forEach(p => userIds.add(p.authorId));

const authors = await prisma.user.findMany({
  where: { id: { in: Array.from(userIds) } }
});
```

## Best Practices

1. **Use distinct for unique values** - Remove duplicates efficiently
2. **Combine with filters** - Reduce dataset before distinct
3. **Index distinct columns** - Improve query performance
4. **Limit results** - Use take with distinct
5. **Sort for consistency** - Order distinct results predictably
6. **Select only needed fields** - Minimize payload
