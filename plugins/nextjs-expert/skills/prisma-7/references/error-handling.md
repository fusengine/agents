---
name: error-handling
description: Prisma 7 error handling with error codes and types
when-to-use: Handling database errors, validation errors, constraint violations
keywords: error, P2002, P2025, catch, PrismaClientKnownRequestError
priority: medium
requires: client.md
related: queries.md
---

# Error Handling

Error handling patterns for Prisma 7.

## Common Error Codes

| Code | Description | Cause |
|------|-------------|-------|
| P2002 | Unique constraint failed | Duplicate value |
| P2003 | Foreign key constraint failed | Invalid reference |
| P2025 | Record not found | findUniqueOrThrow, update, delete |
| P2034 | Transaction failed | Conflict in serializable |

---

## Catching Prisma Errors

```typescript
// modules/cores/db/operations.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Creates a new user with email and name
 * @param email - User email address
 * @param name - User full name
 * @returns Created user record
 * @throws Error if email already exists (P2002)
 */
async function createUser(email: string, name: string) {
  try {
    return await prisma.user.create({
      data: { email, name },
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Email already exists')
      }
    }
    throw error
  }
}
```

---

## Error Types

```typescript
// modules/cores/db/error-handler.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Identifies and handles specific Prisma error types
 */
function handlePrismaError(error: unknown): void {
  // Known request error (database constraint)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log('Error code:', error.code)
    console.log('Meta:', error.meta)
    return
  }

  // Validation error (invalid input)
  if (error instanceof Prisma.PrismaClientValidationError) {
    console.log('Validation failed:', error.message)
    return
  }

  // Initialization error (connection failed)
  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.log('Could not connect:', error.message)
    return
  }

  // Rust panic (internal error)
  if (error instanceof Prisma.PrismaClientRustPanicError) {
    console.log('Internal error:', error.message)
  }
}
```

---

## Unique Constraint (P2002)

```typescript
// modules/cores/db/operations.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Creates a user and handles duplicate unique constraints
 * @param data - User creation input
 * @returns Created user record
 * @throws ConflictError on duplicate unique field
 */
async function createUser(data: CreateUserInput) {
  try {
    return await prisma.user.create({ data })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const field = (error.meta?.target as string[])?.[0]
      throw new ConflictError(`${field} already exists`)
    }
    throw error
  }
}
```

---

## Record Not Found (P2025)

```typescript
// modules/cores/db/operations.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Updates user and throws on record not found
 * @param id - User identifier
 * @param data - Update payload
 * @returns Updated user record
 * @throws NotFoundError if user does not exist
 */
async function updateUser(id: string, data: UpdateUserInput) {
  try {
    return await prisma.user.update({
      where: { id },
      data,
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new NotFoundError('User not found')
    }
    throw error
  }
}

/**
 * Safer update pattern: verify existence first
 * @param id - User identifier
 * @param data - Update payload
 * @returns Updated user record or throws
 */
async function updateUserSafe(id: string, data: UpdateUserInput) {
  const user = await prisma.user.findUnique({ where: { id } })

  if (!user) {
    throw new NotFoundError('User not found')
  }

  return prisma.user.update({
    where: { id },
    data,
  })
}
```

---

## Transaction Conflict (P2034)

```typescript
// modules/cores/db/transactions.ts
import type { Prisma } from '../generated/prisma/client'

/** Maximum retry attempts for transaction conflicts */
const MAX_RETRIES = 3

/**
 * Transfers funds with automatic retry on serialization conflict
 * @param fromId - Source account ID
 * @param toId - Destination account ID
 * @param amount - Transfer amount
 * @returns Transaction result
 * @throws Error after max retries
 */
async function transferWithRetry(
  fromId: string,
  toId: string,
  amount: number
) {
  let retries = 0

  while (retries < MAX_RETRIES) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Transaction logic: debit source, credit destination
      }, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2034'
      ) {
        retries++
        if (retries >= MAX_RETRIES) throw error
        continue
      }
      throw error
    }
  }
}
```

---

## Error Utility

```typescript
// modules/cores/db/error-handler.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Centralized Prisma error handler
 * Converts database errors to application errors
 * @param error - Unknown error from database operation
 * @throws ApplicationError subclasses based on error type
 */
export function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictError('Resource already exists')
      case 'P2025':
        throw new NotFoundError('Resource not found')
      case 'P2003':
        throw new BadRequestError('Invalid reference')
      default:
        throw new DatabaseError(error.message)
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new BadRequestError('Invalid input')
  }

  throw error
}
```

---

## Best Practices

1. **Catch specific codes** - Handle known errors explicitly
2. **Use error.meta** - Get field names from constraints
3. **Retry P2034** - Transaction conflicts are retryable
4. **Wrap in utilities** - Centralize error handling
5. **Log unknown errors** - For debugging
