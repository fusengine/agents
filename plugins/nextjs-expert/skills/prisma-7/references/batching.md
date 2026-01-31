---
title: Batch Operations
description: Batch insert, update, and delete operations in Prisma 7
keywords: [batch, bulk, insert, update, delete, performance]
---

# Batch Operations

Efficient batch operations with SOLID Next.js principles.

## Bulk Insert Operations

```typescript
// lib/db/batch-inserts.ts
import type { Prisma, User } from '@prisma/client'

interface CreateUserData {
  email: string
  name: string
}

/**
 * @description Creates a single user
 * @param data User creation data
 * @returns Promise<User> Created user
 */
export async function createUser(data: CreateUserData): Promise<User> {
  return prisma.user.create({
    data,
    select: { id: true, email: true, name: true, createdAt: true },
  })
}

/**
 * @description Batch creates multiple users with duplicate skipping
 * @param users Array of user data to create
 * @returns Promise<{count: number}> Number of created users
 * @example
 * const result = await createUsersBatch([
 *   { email: 'user1@example.com', name: 'User 1' },
 *   { email: 'user2@example.com', name: 'User 2' }
 * ])
 */
export async function createUsersBatch(
  users: CreateUserData[]
): Promise<Prisma.BatchPayload> {
  // ✅ GOOD: Batch insert with skipDuplicates for idempotency
  return prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  })
}

/**
 * @description Batch creates users with transaction safety
 * @param users Array of user data
 * @returns Promise<User[]> Created users
 * @throws Error if transaction fails
 */
export async function createUsersBatchWithTransaction(
  users: CreateUserData[]
): Promise<User[]> {
  // ✅ GOOD: Wrapped in transaction for ACID compliance
  return prisma.$transaction(async (tx) => {
    const result = await tx.user.createMany({
      data: users,
      skipDuplicates: false,
    })

    // Verify creation
    return tx.user.findMany({
      where: { email: { in: users.map(u => u.email) } },
      take: result.count,
    })
  })
}
```

---

## Bulk Update Operations

```typescript
// lib/db/batch-updates.ts
import type { User } from '@prisma/client'

interface BatchUpdateOptions {
  userIds?: string[]
  createdBefore?: Date
}

/**
 * @description Bulk publishes draft posts
 * @returns Promise<{count: number}> Number of updated posts
 * @example
 * const result = await publishDraftPosts()
 */
export async function publishDraftPosts() {
  // ✅ GOOD: Single query for bulk update
  return prisma.post.updateMany({
    where: { status: 'draft' },
    data: {
      status: 'published',
      updatedAt: new Date(),
    },
  })
}

/**
 * @description Bulk deactivates old users
 * @param options Filter options
 * @returns Promise<{count: number}> Number of deactivated users
 * @example
 * const result = await deactivateOldUsers({
 *   createdBefore: new Date('2024-01-01')
 * })
 */
export async function deactivateOldUsers(
  options: BatchUpdateOptions
): Promise<{ count: number }> {
  // ✅ GOOD: Conditional update with time-based filtering
  return prisma.user.updateMany({
    where: {
      ...(options.createdBefore && {
        createdAt: { lt: options.createdBefore },
      }),
    },
    data: {
      status: 'inactive',
      updatedAt: new Date(),
    },
  })
}

/**
 * @description Batch verifies users by ID
 * @param userIds Array of user IDs
 * @returns Promise<{count: number}> Number of verified users
 */
export async function verifyUsersByIds(userIds: string[]) {
  // ✅ GOOD: Update specific users by IDs
  return prisma.user.updateMany({
    where: { id: { in: userIds } },
    data: {
      verified: true,
      verifiedAt: new Date(),
    },
  })
}
```

---

## Bulk Delete Operations

```typescript
// lib/db/batch-deletes.ts
import type { Prisma } from '@prisma/client'

/**
 * @description Batch deletes archived posts by author
 * @param authorId Author's user ID
 * @returns Promise<{count: number}> Number of deleted posts
 * @example
 * const result = await deleteAuthorArchivedPosts('user_123')
 */
export async function deleteAuthorArchivedPosts(
  authorId: string
): Promise<Prisma.BatchPayload> {
  // ✅ GOOD: Multiple conditions for safe deletion
  return prisma.post.deleteMany({
    where: {
      authorId,
      status: 'archived',
    },
  })
}

/**
 * @description Batch deletes spam comments
 * @returns Promise<{count: number}> Number of deleted comments
 */
export async function deleteSpamComments() {
  // ✅ GOOD: Target specific deleted content
  return prisma.comment.deleteMany({
    where: { flaggedAsSpam: true },
  })
}

/**
 * @description Deletes inactive users and their content
 * @param inactiveSinceDays Number of days since last activity
 * @returns Promise Object with deletion counts
 */
export async function deleteInactiveUsers(inactiveSinceDays: number) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - inactiveSinceDays)

  // ✅ GOOD: Transactional cleanup of related data
  return prisma.$transaction(async (tx) => {
    const users = await tx.user.findMany({
      where: { lastActiveAt: { lt: cutoffDate } },
      select: { id: true },
    })

    const userIds = users.map(u => u.id)

    const commentCount = await tx.comment.deleteMany({
      where: { userId: { in: userIds } },
    })

    const postCount = await tx.post.deleteMany({
      where: { authorId: { in: userIds } },
    })

    const userCount = await tx.user.deleteMany({
      where: { id: { in: userIds } },
    })

    return { userCount, postCount, commentCount }
  })
}
```

---

## Transactional Batch Operations

```typescript
// lib/db/transactions.ts
import type { Prisma, User, Post } from '@prisma/client'

interface UserCreationBatch {
  email: string
  name: string
}

/**
 * @description Atomic operation: creates users and assigns to default role
 * @param users Array of user data
 * @returns Promise Success status
 * @example
 * await atomicUserCreation([
 *   { email: 'user1@example.com', name: 'User 1' }
 * ])
 */
export async function atomicUserCreation(
  users: UserCreationBatch[]
): Promise<{ success: boolean; createdCount: number }> {
  try {
    // ✅ GOOD: All operations succeed or all fail (ACID)
    const result = await prisma.$transaction(async (tx) => {
      const created = await tx.user.createMany({
        data: users,
        skipDuplicates: false,
      })

      return created
    })

    return { success: true, createdCount: result.count }
  } catch (error) {
    console.error('Batch creation failed:', error)
    return { success: false, createdCount: 0 }
  }
}

/**
 * @description Complex transaction: create user, post, and update counts
 * @returns Promise Transactional result
 */
export async function createUserWithInitialPost() {
  // ✅ GOOD: Multiple operations in single transaction
  return prisma.$transaction(async (tx) => {
    // Step 1: Create user
    const user = await tx.user.create({
      data: {
        email: 'user@example.com',
        name: 'New User',
      },
    })

    // Step 2: Create initial post
    const post = await tx.post.create({
      data: {
        title: 'Welcome Post',
        content: 'Welcome to the platform!',
        authorId: user.id,
      },
    })

    // Step 3: Update user statistics
    await tx.user.update({
      where: { id: user.id },
      data: { postCount: 1 },
    })

    return { user, post }
  })
}

/**
 * @description Performance batch insert with chunking
 * @param users Array of users (can be large)
 * @param chunkSize Number of records per transaction
 * @returns Promise Total count of inserted users
 * @example
 * const count = await bulkInsertUsersWithChunking(largeUserArray, 1000)
 */
export async function bulkInsertUsersWithChunking(
  users: UserCreationBatch[],
  chunkSize: number = 1000
): Promise<number> {
  let totalCount = 0

  // ✅ GOOD: Process large datasets in chunks to avoid memory issues
  for (let i = 0; i < users.length; i += chunkSize) {
    const chunk = users.slice(i, i + chunkSize)

    const result = await prisma.user.createMany({
      data: chunk,
      skipDuplicates: true,
    })

    totalCount += result.count
  }

  return totalCount
}
```

---

## Best Practices (SOLID Compliance)

### Performance Guidelines
- ✅ Use `createMany`, `updateMany`, `deleteMany` for batch ops
- ✅ Implement chunking for datasets > 10,000 records
- ✅ Wrap dangerous operations in transactions
- ✅ Use `skipDuplicates` for idempotent imports
- ❌ Avoid N+1 loops: never iterate with single create/update/delete
