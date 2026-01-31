---
name: transactions
description: Prisma 7 transaction patterns with $transaction API and nested writes
when-to-use: Atomic operations, batch writes, financial transactions
keywords: $transaction, interactive, sequential, nested writes, isolation level
priority: high
requires: client.md
related: queries.md
---

# Transactions

Transaction patterns in Prisma 7.

## Sequential Operations

```typescript
// modules/posts/src/services/post-transaction.service.ts
import type { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../../cores/db/prisma'

/**
 * Retrieve published posts and total post count in single transaction.
 * Ensures both operations see same snapshot of data.
 *
 * @returns Tuple of [posts array, total count]
 */
export async function getPublishedPostsWithCount(): Promise<
  [Prisma.PostGetPayload<object>[], number]
> {
  return prisma.$transaction([
    prisma.post.findMany({ where: { published: true } }),
    prisma.post.count(),
  ]) as Promise<[Prisma.PostGetPayload<object>[], number]>
}

/**
 * Delete guest users and create new batch in atomic operation.
 * Prevents partial state with Serializable isolation level.
 *
 * @param newUsers - User data to create after cleanup
 * @returns Transaction result
 */
export async function replaceGuestUsers(
  newUsers: Prisma.UserCreateInput[]
) {
  return prisma.$transaction(
    [
      prisma.user.deleteMany({ where: { role: 'GUEST' } }),
      prisma.user.createMany({ data: newUsers }),
    ],
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    }
  )
}
```

---

## Interactive Transactions

```typescript
// modules/payments/src/services/transfer.service.ts
import type { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../../cores/db/prisma'

/**
 * Transfer funds between accounts with validation.
 * Automatically rolls back if validation fails.
 *
 * @param fromId - Sender account ID
 * @param toId - Recipient account ID
 * @param amount - Amount to transfer
 * @returns Updated recipient account
 * @throws Error if insufficient funds
 */
export async function transferFunds(
  fromId: string,
  toId: string,
  amount: number
) {
  return prisma.$transaction(async (tx) => {
    // Decrement sender balance
    const sender = await tx.account.update({
      where: { id: fromId },
      data: { balance: { decrement: amount } },
    })

    // Validate sufficient funds
    if (sender.balance < 0) {
      throw new Error('Insufficient funds')
    }

    // Increment recipient balance (only if sender validation passed)
    return tx.account.update({
      where: { id: toId },
      data: { balance: { increment: amount } },
    })
  })
}
```

---

## Transaction Options

```typescript
// modules/cores/db/interfaces/transaction-options.interface.ts
/**
 * Configuration for Prisma transactions.
 * Controls timeout and isolation behavior.
 *
 * @see modules/cores/db/services/transaction.service.ts
 */
export interface TransactionConfig {
  maxWait: number
  timeout: number
  isolationLevel:
    | 'ReadUncommitted'
    | 'ReadCommitted'
    | 'RepeatableRead'
    | 'Serializable'
}

export const DEFAULT_TRANSACTION_CONFIG: TransactionConfig = {
  maxWait: 5000, // Max wait for transaction (default: 2000)
  timeout: 10000, // Max execution time (default: 5000)
  isolationLevel: 'ReadCommitted',
}
```

```typescript
// modules/cores/db/services/transaction.service.ts
import type { Prisma } from '../../../generated/prisma/client'
import type { TransactionConfig } from '../interfaces/transaction-options.interface'
import {
  DEFAULT_TRANSACTION_CONFIG,
} from '../interfaces/transaction-options.interface'
import { prisma } from '../prisma'

/**
 * Execute transaction with custom configuration.
 *
 * @param fn - Transaction callback
 * @param config - Transaction options (maxWait, timeout, isolationLevel)
 * @returns Transaction result
 *
 * @see modules/cores/db/interfaces/transaction-options.interface.ts
 */
export async function executeTransaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
  config: Partial<TransactionConfig> = {}
) {
  const finalConfig = { ...DEFAULT_TRANSACTION_CONFIG, ...config }

  return prisma.$transaction(fn, {
    maxWait: finalConfig.maxWait,
    timeout: finalConfig.timeout,
    isolationLevel: Prisma.TransactionIsolationLevel[
      finalConfig.isolationLevel as keyof typeof Prisma.TransactionIsolationLevel
    ],
  })
}
```

---

## Nested Writes

```typescript
// modules/users/src/services/user-nested.service.ts
import type { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../../cores/db/prisma'

/**
 * Create user with associated posts and profile in single atomic operation.
 * All nested operations succeed or fail together.
 *
 * @param userData - User data with nested posts and profile
 * @returns Created user with all nested relations
 */
export async function createUserWithNestedData(
  userData: Prisma.UserCreateInput & {
    posts?: { create: Prisma.PostCreateInput[] }
    profile?: { create: Prisma.ProfileCreateInput }
  }
) {
  return prisma.user.create({
    data: {
      email: userData.email as string,
      name: userData.name,
      posts: userData.posts,
      profile: userData.profile,
    },
    include: {
      posts: true,
      profile: true,
    },
  })
}

/**
 * Interface for nested user creation with validated structure.
 *
 * @see modules/users/src/services/user-nested.service.ts
 */
export interface UserWithNestedInput {
  email: string
  name: string
  posts: {
    title: string
    content?: string
  }[]
  profile: {
    bio: string
  }
}
```

---

## Isolation Levels

| Level | PostgreSQL | MySQL | SQLite |
|-------|------------|-------|--------|
| ReadUncommitted | ✓ | ✓ | ✗ |
| ReadCommitted | ✓ (default) | ✓ | ✗ |
| RepeatableRead | ✓ | ✓ (default) | ✗ |
| Serializable | ✓ | ✓ | ✓ (default) |

---

## Retry Pattern

```typescript
// modules/cores/db/interfaces/transaction-error.interface.ts
/**
 * Prisma transaction error codes.
 *
 * @see https://www.prisma.io/docs/orm/reference/error-reference
 */
export interface PrismaTransactionError {
  code: string
  message: string
  isRetryable: boolean
}

// P2034: Serialization failure (retryable)
export const RETRYABLE_ERROR_CODES = ['P2034']
```

```typescript
// modules/cores/db/services/transaction-retry.service.ts
import type { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../prisma'

/**
 * Retry configuration for transactional operations.
 */
const MAX_RETRIES = 5
const RETRY_DELAY_MS = 100

/**
 * Execute transaction with automatic retry on serialization failures.
 * Retries up to MAX_RETRIES times with exponential backoff.
 *
 * @param fn - Transaction callback function
 * @returns Transaction result
 * @throws Error after MAX_RETRIES attempts
 *
 * @see modules/cores/db/interfaces/transaction-error.interface.ts
 */
export async function transactionWithRetry<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  let retries = 0

  while (retries < MAX_RETRIES) {
    try {
      return await prisma.$transaction(fn, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      })
    } catch (error: unknown) {
      const err = error as any
      const isRetryable = err.code === 'P2034'

      if (isRetryable && retries < MAX_RETRIES - 1) {
        retries++
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY_MS * Math.pow(2, retries))
        )
        continue
      }
      throw error
    }
  }
  throw new Error('Max retries reached')
}
```

---

## Best Practices

1. **Keep short** - Exit transactions quickly
2. **No network calls** - Avoid external APIs in transactions
3. **Use nested writes** - For dependent operations
4. **Retry on P2034** - Handle serialization failures
5. **Set timeouts** - Prevent long-running transactions
