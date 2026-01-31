---
name: queries
description: Prisma 7 query patterns with CRUD, filtering, and relations
when-to-use: Querying and manipulating data with Prisma Client
keywords: findMany, findUnique, create, update, delete, include, where
priority: high
requires: client.md
related: typedsql.md, optimization.md
---

# Prisma Queries

## Find Operations

```typescript
// modules/users/src/services/user.service.ts
import type { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../../cores/db/prisma'

/**
 * Retrieve a user by ID.
 *
 * @param id - User ID
 * @returns User record or null if not found
 */
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  })
}

/**
 * Retrieve a user by email, throw if not found.
 *
 * @param email - User email address
 * @returns User record
 * @throws Throws if user not found
 */
export async function getUserByEmailOrThrow(email: string) {
  return prisma.user.findUniqueOrThrow({
    where: { email },
  })
}

/**
 * Find first admin user.
 *
 * @returns Admin user or null if none found
 */
export async function getFirstAdmin() {
  return prisma.user.findFirst({
    where: { role: 'ADMIN' },
  })
}

/**
 * Retrieve paginated list of users with filtering.
 *
 * @param options - Query options (role, date range, pagination)
 * @returns Array of user records
 */
export async function getUsersPaginated(
  options: Prisma.UserFindManyArgs = {}
) {
  return prisma.user.findMany({
    where: {
      role: 'USER',
      createdAt: { gte: new Date('2024-01-01') },
      ...options.where,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
    skip: 0,
    ...options,
  })
}
```

---

## Include Relations

```typescript
// modules/users/src/services/user-relations.service.ts
import type { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../../cores/db/prisma'

/**
 * Retrieve user with all related data (posts and profile).
 *
 * @param userId - User ID
 * @returns User with posts and profile included
 */
export async function getUserWithRelations(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: true,
      profile: true,
    },
  })
}

/**
 * Retrieve user with nested relations and filtering.
 *
 * @param userId - User ID
 * @returns User with recent posts (max 5) including categories
 */
export async function getUserWithRecentPosts(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        include: {
          categories: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })
}

/**
 * Retrieve user with post count.
 *
 * @param userId - User ID
 * @returns User with _count object containing post count
 */
export async function getUserWithPostCount(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  })
}
```

---

## Select Specific Fields

```typescript
// modules/users/src/services/user-select.service.ts
import type { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../../cores/db/prisma'

/**
 * Select only essential user fields for performance.
 * Reduces database load by excluding large fields.
 *
 * @returns Array of users with only id, name, email
 */
export async function getUsersSummary() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  })
}

/**
 * Select users with partial post data.
 * Optimizes query to load only required fields from relations.
 *
 * @returns Users with nested post titles (no content)
 */
export async function getUsersWithPostTitles() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      posts: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  })
}
```

---

## Filtering

```typescript
// modules/users/src/services/user-filter.service.ts
import type { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../../cores/db/prisma'

/**
 * Find users by role and company email domain.
 * Demonstrates AND conditions (all must match).
 *
 * @returns Array of company user records
 */
export async function getCompanyUsers() {
  return prisma.user.findMany({
    where: {
      role: 'USER',
      email: { contains: '@company.com' },
    },
  })
}

/**
 * Find admin users by role or admin email domain.
 * Demonstrates OR conditions (at least one must match).
 *
 * @returns Array of admin user records
 */
export async function getAdminUsers() {
  return prisma.user.findMany({
    where: {
      OR: [{ role: 'ADMIN' }, { email: { endsWith: '@admin.com' } }],
    },
  })
}

/**
 * Find non-banned users.
 * Demonstrates NOT condition (must NOT match).
 *
 * @returns Array of active user records
 */
export async function getActiveUsers() {
  return prisma.user.findMany({
    where: {
      NOT: { role: 'BANNED' },
    },
  })
}

/**
 * Search users by name and age range.
 * Demonstrates multiple filter operators.
 *
 * @param name - User name to search (case-insensitive)
 * @param minAge - Minimum age
 * @param maxAge - Maximum age
 * @returns Array of matching user records
 */
export async function searchUsers(
  name: string,
  minAge: number = 18,
  maxAge: number = 65
) {
  return prisma.user.findMany({
    where: {
      name: { contains: name, mode: 'insensitive' },
      age: { gte: minAge, lte: maxAge },
      email: { startsWith: 'admin' },
      tags: { has: 'developer' },
    },
  })
}
```

---

## Create Operations

```typescript
// modules/users/src/services/user-create.service.ts
import type { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../../cores/db/prisma'

/**
 * Create a new user record.
 *
 * @param data - User creation data
 * @returns Created user record
 */
export async function createUser(data: Prisma.UserCreateInput) {
  return prisma.user.create({
    data,
  })
}

/**
 * Create user with associated posts in single transaction.
 *
 * @param data - User data with nested posts to create
 * @returns Created user with posts included
 */
export async function createUserWithPosts(
  data: Prisma.UserCreateInput & {
    posts?: { create: Prisma.PostCreateInput[] }
  }
) {
  return prisma.user.create({
    data: {
      email: data.email as string,
      name: data.name,
      posts: {
        create: data.posts?.create ?? [],
      },
    },
    include: { posts: true },
  })
}

/**
 * Batch create multiple users, skipping duplicates.
 *
 * @param data - Array of user creation data
 * @returns Count of created users
 */
export async function createManyUsers(
  data: Prisma.UserCreateInput[]
): Promise<number> {
  const result = await prisma.user.createMany({
    data,
    skipDuplicates: true,
  })
  return result.count
}
```

---

## Update Operations

```typescript
// modules/users/src/services/user-update.service.ts
import type { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../../cores/db/prisma'

/**
 * Update a user by ID.
 *
 * @param id - User ID
 * @param data - Partial user data to update
 * @returns Updated user record
 */
export async function updateUser(
  id: string,
  data: Prisma.UserUpdateInput
) {
  return prisma.user.update({
    where: { id },
    data,
  })
}

/**
 * Mark all users with given role as verified.
 *
 * @param role - User role to filter
 * @returns Count of updated records
 */
export async function verifyUsersByRole(role: string): Promise<number> {
  const result = await prisma.user.updateMany({
    where: { role },
    data: { verified: true },
  })
  return result.count
}

/**
 * Create or update user by email (upsert).
 *
 * @param email - User email (unique identifier)
 * @param data - User data for create/update
 * @returns Created or updated user record
 */
export async function upsertUser(
  email: string,
  data: Prisma.UserCreateInput & Prisma.UserUpdateInput
) {
  return prisma.user.upsert({
    where: { email },
    create: { ...data, email },
    update: data,
  })
}

/**
 * Increment user credits and login count.
 *
 * @param userId - User ID
 * @param creditAmount - Amount to increment (or decrement if negative)
 * @returns Updated user record
 */
export async function incrementUserMetrics(
  userId: string,
  creditAmount: number = 10
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      credits: { increment: creditAmount },
      loginCount: { increment: 1 },
    },
  })
}
```

---

## Delete Operations

```typescript
// modules/users/src/services/user-delete.service.ts
import type { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../../cores/db/prisma'

/**
 * Delete a user by ID.
 *
 * @param userId - User ID to delete
 * @returns Deleted user record
 * @throws Error if user not found
 */
export async function deleteUser(userId: string) {
  return prisma.user.delete({
    where: { id: userId },
  })
}

/**
 * Delete inactive guest accounts created before cutoff date.
 * Used for cleaning up unused accounts.
 *
 * @param beforeDate - Delete accounts created before this date
 * @returns Count of deleted users
 */
export async function deleteInactiveGuests(beforeDate: Date): Promise<number> {
  const result = await prisma.user.deleteMany({
    where: {
      role: 'GUEST',
      createdAt: { lt: beforeDate },
    },
  })
  return result.count
}
```

---

## Pagination

```typescript
// modules/users/src/services/user-pagination.service.ts
import type { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../../cores/db/prisma'

/**
 * Pagination options interface.
 * Use for consistent pagination across services.
 *
 * @see modules/users/src/services/user-pagination.service.ts
 */
export interface PaginationOptions {
  page: number
  pageSize: number
}

/**
 * Offset-based pagination for users (simple, works well for small datasets).
 *
 * @param page - Page number (1-indexed)
 * @param pageSize - Records per page
 * @returns Array of user records for specified page
 */
export async function getUsersOffset(
  page: number = 1,
  pageSize: number = 10
) {
  const skip = (page - 1) * pageSize
  return prisma.user.findMany({
    skip,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Cursor-based pagination for users (efficient for large datasets).
 * Use cursor ID from previous page for next request.
 *
 * @param pageSize - Records per page
 * @param cursor - ID of last record from previous page (optional)
 * @returns Array of user records starting from cursor
 */
export async function getUsersCursor(
  pageSize: number = 10,
  cursor?: string
) {
  return prisma.user.findMany({
    take: pageSize,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: { id: 'asc' },
  })
}
```
