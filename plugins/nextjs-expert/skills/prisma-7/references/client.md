---
name: client
description: PrismaClient setup with singleton pattern for Next.js 16
when-to-use: Creating and configuring PrismaClient
keywords: PrismaClient, singleton, globalThis, adapter, connection
priority: critical
requires: installation.md
related: driver-adapters.md, nextjs-integration.md
---

# PrismaClient Setup

## Singleton Pattern (Next.js Required)

Prevent multiple PrismaClient instances during hot-reload.

```typescript
// modules/cores/db/interfaces/global.interface.ts
import type { PrismaClient } from '../../generated/prisma/client'

/**
 * Global type for PrismaClient singleton pattern.
 * Used to prevent multiple instances during Next.js hot reload.
 *
 * @see modules/cores/db/prisma.ts
 */
export interface GlobalPrismaType {
  prisma: PrismaClient | undefined
}
```

```typescript
// modules/cores/db/prisma.ts
import 'dotenv/config'
import type { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import type { GlobalPrismaType } from './interfaces/global.interface'

/**
 * Create or retrieve the singleton PrismaClient instance.
 * Prevents multiple instances during Next.js hot reload in development.
 *
 * @see modules/cores/db/interfaces/global.interface.ts
 */
const globalForPrisma = globalThis as unknown as GlobalPrismaType

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

/**
 * Singleton PrismaClient instance.
 * Retrieved from global cache in development, created fresh in production.
 */
export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

---

## Import Path (v7 Change)

```typescript
// ❌ v6 (deprecated) - Do not use
import { PrismaClient } from '@prisma/client'

// ✅ v7 (required) - Use relative path
import type { PrismaClient } from '../../generated/prisma/client'

// ✅ v7 (with path alias) - Use import alias
import type { PrismaClient } from '@/generated/prisma/client'

// 📝 Always use 'type' keyword for type-only imports
import type { Prisma } from '../../generated/prisma/client'
```

---

## Client with Global Omit

```typescript
// modules/cores/db/interfaces/prisma-config.interface.ts
import type { Prisma } from '../../generated/prisma/client'

/**
 * Global field omit configuration for PrismaClient.
 * Prevents sensitive fields from being selected by default.
 *
 * @see modules/cores/db/prisma.ts
 */
export const PRISMA_GLOBAL_OMIT: NonNullable<
  ConstructorParameters<typeof Prisma.PrismaClientKnownRequestError>[3]
> = {
  user: {
    password: true, // Always exclude password hash
    token: true,    // Always exclude sensitive tokens
  },
}
```

```typescript
// modules/cores/db/prisma.ts
import type { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { PRISMA_GLOBAL_OMIT } from './interfaces/prisma-config.interface'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

/**
 * PrismaClient with global field omit configuration.
 * Sensitive fields are automatically excluded from all queries.
 *
 * @see modules/cores/db/interfaces/prisma-config.interface.ts
 */
export const prisma = new PrismaClient({
  adapter,
  omit: PRISMA_GLOBAL_OMIT,
})
```

---

## Logging Configuration

```typescript
// modules/cores/db/interfaces/prisma-logging.interface.ts
/**
 * Logging configuration for PrismaClient.
 * Defines which event types are logged and where.
 *
 * @see modules/cores/db/prisma.ts
 */
export interface PrismaLogConfig {
  level: 'query' | 'info' | 'warn' | 'error'
  emit: 'stdout' | 'event'
}

export const PRISMA_LOG_CONFIG: PrismaLogConfig[] = [
  { level: 'query', emit: 'event' },
  { level: 'error', emit: 'stdout' },
  { level: 'warn', emit: 'stdout' },
]
```

```typescript
// modules/cores/db/prisma.ts
import type { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { PRISMA_LOG_CONFIG } from './interfaces/prisma-logging.interface'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

/**
 * PrismaClient with logging configuration.
 * Events are logged based on NODE_ENV.
 *
 * @see modules/cores/db/interfaces/prisma-logging.interface.ts
 */
export const prisma = new PrismaClient({
  adapter,
  log: PRISMA_LOG_CONFIG,
})

/**
 * Log database queries in development for debugging.
 * Only active when NODE_ENV is 'development'.
 */
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    console.log(`Query: ${e.query}`)
    console.log(`Duration: ${e.duration}ms`)
  })
}
```

---

## Connection Management

```typescript
// modules/cores/db/utils/connection.ts
import { prisma } from '../prisma'

/**
 * Establish connection to database.
 * Auto-connects on first query, but can be called explicitly.
 *
 * @throws Error if connection fails
 * @see modules/cores/db/prisma.ts
 */
export async function connectDatabase(): Promise<void> {
  await prisma.$connect()
}

/**
 * Close database connection gracefully.
 * Should be called during application shutdown.
 *
 * @throws Error if disconnection fails
 * @see modules/cores/db/prisma.ts
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect()
}

/**
 * Register graceful shutdown handler.
 * Ensures database connection is closed before process exit.
 *
 * @see modules/cores/db/prisma.ts
 */
export function setupGracefulShutdown(): void {
  process.on('beforeExit', async () => {
    await disconnectDatabase()
  })
}
```

```typescript
// Usage in application entry point
import { setupGracefulShutdown } from './modules/cores/db/utils/connection'

setupGracefulShutdown()
```

---

## Transaction Example

```typescript
// modules/users/src/services/user-post.service.ts
import type { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../../cores/db/prisma'

/**
 * Create user with associated post in a single transaction.
 * Both operations succeed or fail together.
 *
 * @param userData - User data to create
 * @param postData - Post data to create
 * @returns Created user and post records
 * @see modules/cores/db/prisma.ts
 */
export async function createUserWithPost(
  userData: Prisma.UserCreateInput,
  postData: Prisma.PostCreateInput
) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: userData,
    })

    const post = await tx.post.create({
      data: {
        ...postData,
        authorId: user.id,
      },
    })

    return { user, post }
  })
}

/**
 * Batch update operations in a single transaction.
 * Updates user and creates payment in atomic operation.
 *
 * @param userId - User ID to update
 * @param amount - Payment amount
 * @returns Updated user and created payment
 * @see modules/cores/db/prisma.ts
 */
export async function processPaymentTransaction(
  userId: string,
  amount: number
) {
  return prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: amount } },
    }),
    prisma.payment.create({
      data: { userId, amount },
    }),
  ])
}
```

---

## Best Practices

1. **Single instance** - One PrismaClient per application
2. **Global cache** - Use globalThis in development
3. **Import from generated** - Never from @prisma/client
4. **Configure adapter** - Required in Prisma 7
5. **Global omit** - Exclude sensitive fields by default
