---
title: "Filtering in Prisma"
description: "Filter operators, conditions, and advanced filtering techniques"
category: "Querying"
---

# Filtering

Filter queries to find specific records with various operators and conditions.

## Basic Filters

### Equality
```typescript
// lib/types/user.ts
import type { Prisma } from "@prisma/client";

/**
 * User filter by email or status
 */
export interface UserFilter {
  email?: string;
  status?: string;
}

// lib/queries/userQueries.ts
import type { UserFilter } from "@/lib/types/user";

/**
 * Find a user by email
 * @param email - User email address
 * @returns User object or null
 */
async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  });
}

/**
 * Find users by status
 * @param status - User status to filter
 * @returns Array of users matching status
 */
async function findUsersByStatus(status: string) {
  return prisma.user.findMany({
    where: { status }
  });
}
```

### Comparison Operators

```typescript
// lib/types/filters.ts
import type { Prisma } from "@prisma/client";

/**
 * Numeric range filter operators
 */
export interface NumericFilter {
  gt?: number;  // greater than
  gte?: number; // greater than or equal
  lt?: number;  // less than
  lte?: number; // less than or equal
}

/**
 * Date range filter operators
 */
export interface DateFilter {
  lt?: Date;
  gte?: Date;
}

// lib/queries/filterQueries.ts
import type { NumericFilter, DateFilter } from "@/lib/types/filters";

/**
 * Find users older than specified age
 * @param minAge - Minimum age threshold
 * @returns Array of users above age threshold
 */
async function findUsersOlderThan(minAge: number) {
  return prisma.user.findMany({
    where: { age: { gt: minAge } }
  });
}

/**
 * Find posts with minimum view count
 * @param minViews - Minimum view threshold
 * @returns Array of posts with sufficient views
 */
async function findPopularPosts(minViews: number) {
  return prisma.post.findMany({
    where: { views: { gte: minViews } }
  });
}

/**
 * Find users created before date
 * @param beforeDate - Cutoff date
 * @returns Array of earlier users
 */
async function findUsersBeforeDate(beforeDate: Date) {
  return prisma.user.findMany({
    where: { createdAt: { lt: beforeDate } }
  });
}
```

## String Filters

### Contains (Case-Sensitive)
```typescript
// lib/types/stringFilters.ts
import type { Prisma } from "@prisma/client";

/**
 * String search filter with case sensitivity option
 */
export interface StringSearchFilter {
  search: string;
  caseSensitive?: boolean;
}

// lib/queries/searchQueries.ts
import type { StringSearchFilter } from "@/lib/types/stringFilters";

/**
 * Find posts containing search term (case-sensitive)
 * @param searchTerm - Text to search for
 * @returns Array of matching posts
 */
async function findPostsByTitle(searchTerm: string) {
  return prisma.post.findMany({
    where: { title: { contains: searchTerm } }
  });
}

/**
 * Find posts starting with prefix (case-insensitive)
 * @param prefix - Text prefix to match
 * @returns Array of posts starting with prefix
 */
async function findPostsByPrefix(prefix: string) {
  return prisma.post.findMany({
    where: {
      title: { startsWith: prefix, mode: "insensitive" }
    }
  });
}

/**
 * Find users by email domain
 * @param domain - Email domain suffix
 * @returns Array of users with matching domain
 */
async function findUsersByDomain(domain: string) {
  return prisma.user.findMany({
    where: {
      email: { endsWith: domain, mode: "insensitive" }
    }
  });
}

/**
 * Search multiple string fields
 * @param filter - Search filter object
 * @returns Array of users matching search criteria
 */
async function searchUsers(filter: StringSearchFilter) {
  const mode = filter.caseSensitive ? "default" : "insensitive";

  return prisma.user.findMany({
    where: {
      email: { contains: filter.search, mode }
    }
  });
}
```

## Advanced Filters

### In / Not In
```typescript
// lib/types/advancedFilters.ts
import type { Prisma } from "@prisma/client";

/**
 * Array-based filter for inclusion/exclusion
 */
export interface ArrayFilter<T = string> {
  include?: T[];
  exclude?: T[];
}

/**
 * Boolean filter options
 */
export interface BooleanFilter {
  value?: boolean;
  inverted?: boolean;
}

/**
 * Null check filter options
 */
export interface NullFilter {
  isNull?: boolean;
}

// lib/queries/advancedQueries.ts
import type { ArrayFilter, BooleanFilter, NullFilter } from "@/lib/types/advancedFilters";

/**
 * Find posts by status array
 * @param statuses - Array of post statuses to include
 * @returns Array of posts with matching statuses
 */
async function findPostsByStatuses(statuses: string[]) {
  return prisma.post.findMany({
    where: { status: { in: statuses } }
  });
}

/**
 * Find users excluding certain roles
 * @param excludedRoles - Array of roles to exclude
 * @returns Array of users without excluded roles
 */
async function findUsersExcludingRoles(excludedRoles: string[]) {
  return prisma.user.findMany({
    where: { role: { notIn: excludedRoles } }
  });
}

/**
 * Find verified users
 * @returns Array of verified users
 */
async function findVerifiedUsers() {
  return prisma.user.findMany({
    where: { isVerified: true }
  });
}

/**
 * Find unpublished posts
 * @returns Array of draft posts
 */
async function findUnpublishedPosts() {
  return prisma.post.findMany({
    where: { published: { not: true } }
  });
}

/**
 * Find users with deletion mark
 * @returns Array of soft-deleted users
 */
async function findSoftDeletedUsers() {
  return prisma.user.findMany({
    where: { deletedAt: { not: null } }
  });
}

/**
 * Find active users without phone
 * @returns Array of users without phone numbers
 */
async function findUsersWithoutPhone() {
  return prisma.user.findMany({
    where: { phoneNumber: null }
  });
}
```

## Composite Filters

### AND (implicit)
```typescript
// lib/types/compositeFilters.ts
import type { Prisma } from "@prisma/client";

/**
 * Composite filter combining multiple conditions
 */
export interface CompositeFilter {
  AND?: Prisma.UserWhereInput[];
  OR?: Prisma.UserWhereInput[];
  NOT?: Prisma.UserWhereInput;
}

/**
 * Complex post search filter
 */
export interface PostSearchFilter {
  keywords?: string[];
  published?: boolean;
  authorVerified?: boolean;
}

// lib/queries/compositeQueries.ts
import type { CompositeFilter, PostSearchFilter } from "@/lib/types/compositeFilters";

/**
 * Find adult active users
 * @param minAge - Minimum age
 * @returns Array of active users above age
 */
async function findAdultActiveUsers(minAge: number = 18) {
  return prisma.user.findMany({
    where: {
      age: { gt: minAge },
      status: "active"
    }
  });
}

/**
 * Find users by email or role (OR condition)
 * @param email - Email address
 * @param role - User role
 * @returns Array of matching users
 */
async function findUserByEmailOrRole(email: string, role: string) {
  return prisma.user.findMany({
    where: {
      OR: [
        { email },
        { role }
      ]
    }
  });
}

/**
 * Exclude guest users
 * @returns Array of non-guest users
 */
async function findNonGuestUsers() {
  return prisma.user.findMany({
    where: {
      NOT: { role: "guest" }
    }
  });
}

/**
 * Search posts by keywords and publication status
 * @param filter - Post search filter
 * @returns Array of matching posts
 */
async function searchPosts(filter: PostSearchFilter) {
  return prisma.post.findMany({
    where: {
      AND: [
        {
          OR: (filter.keywords || []).map(keyword => ({
            title: { contains: keyword, mode: "insensitive" }
          }))
        },
        filter.published !== undefined ? { published: filter.published } : {},
        filter.authorVerified ? { author: { isVerified: true } } : {}
      ]
    }
  });
}
```

## Relation Filters

### Some (at least one)
```typescript
// lib/types/relationFilters.ts
import type { Prisma } from "@prisma/client";

/**
 * Relation existence filter
 */
export interface RelationFilter {
  hasSome?: boolean;
  hasAll?: boolean;
  hasNone?: boolean;
}

// lib/queries/relationQueries.ts
import type { RelationFilter } from "@/lib/types/relationFilters";

/**
 * Find authors with at least one published post
 * @returns Array of authors with published content
 */
async function findAuthorsWithPublishedPosts() {
  return prisma.user.findMany({
    where: {
      posts: { some: { published: true } }
    }
  });
}

/**
 * Find authors where all posts are published
 * @returns Array of authors with all published posts
 */
async function findAuthorsWithAllPublished() {
  return prisma.user.findMany({
    where: {
      posts: { every: { published: true } }
    }
  });
}

/**
 * Find authors without unpublished posts
 * @returns Array of authors with no draft posts
 */
async function findAuthorsWithoutDrafts() {
  return prisma.user.findMany({
    where: {
      posts: { none: { published: false } }
    }
  });
}
```

## Best Practices

1. **Use mode: "insensitive"** for user-facing searches
2. **Combine filters** for precise queries
3. **Validate input** before filtering
4. **Index frequently filtered fields** for performance
