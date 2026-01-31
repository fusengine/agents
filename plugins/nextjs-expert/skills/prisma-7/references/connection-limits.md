---
title: Connection Limits
description: Database connection pool sizing and limits in Prisma 7
keywords: [connection, pool, limit, database, performance]
---

# Connection Limits & Pool Sizing

Connection pool management with SOLID Next.js principles.

## Connection Pool Configuration

### Environment Setup

```bash
# .env or .env.local
# Default Prisma pool size: 2 per CPU core
# Adjust based on environment

# Monolithic server (10+ connections)
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public&connection_limit=20"

# Serverless/Edge (1-5 connections)
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?connection_limit=3"

# With timeout configuration
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?connect_timeout=10&statement_timeout=30000"
```

### Schema Configuration

```prisma
// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  // directUrl for migrations (bypass pooler)
  directUrl = env("DIRECT_URL")
}

model User {
  id String @id @default(cuid())
  // ... fields
}
```

---

## Serverless Connection Pool Setup

```typescript
// lib/db/serverless-adapter.ts
import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import type { PrismaClient } from '@prisma/client'

/**
 * @description Creates optimized Prisma client for serverless environments
 * @returns PrismaClient Configured for serverless with minimal connections
 * @example
 * const prisma = createServerlessClient()
 */
export function createServerlessClient(): PrismaClient {
  // ✅ GOOD: Serverless adapter with minimal connections
  const neon = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1, // Single connection per function instance
    idleTimeoutMillis: 10000, // Close idle connections quickly
  })

  const adapter = new PrismaNeon(neon)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
      ? [{ level: 'query', emit: 'event' }]
      : [{ level: 'error', emit: 'event' }],
  })
}

export const prisma = createServerlessClient()
```

---

## Connection Monitoring & Health Checks

```typescript
// lib/db/health.ts
import type { PrismaClient } from '@prisma/client'

interface ConnectionHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  activeConnections: number
  idleConnections: number
  timestamp: Date
}

/**
 * @description Checks database connection health
 * @returns Promise<ConnectionHealth> Connection health status
 * @example
 * const health = await checkConnectionHealth()
 */
export async function checkConnectionHealth(): Promise<ConnectionHealth> {
  try {
    // ✅ GOOD: Query connection pool status
    const result = await prisma.$queryRaw<any[]>`
      SELECT
        count(*) as total,
        count(*) FILTER (WHERE state = 'active') as active,
        count(*) FILTER (WHERE state = 'idle') as idle
      FROM pg_stat_activity
      WHERE datname = current_database()
    `

    const conn = result[0]
    const total = Number(conn.total)
    const active = Number(conn.active)

    return {
      status: total < 20 ? 'healthy' : 'degraded',
      activeConnections: active,
      idleConnections: total - active,
      timestamp: new Date(),
    }
  } catch (error) {
    console.error('Health check failed:', error)
    return {
      status: 'unhealthy',
      activeConnections: 0,
      idleConnections: 0,
      timestamp: new Date(),
    }
  }
}

/**
 * @description Handles graceful Prisma disconnection
 * @returns Promise<void>
 */
export async function closeConnections(): Promise<void> {
  try {
    await prisma.$disconnect()
    console.log('Database connections closed')
  } catch (error) {
    console.error('Failed to close connections:', error)
  }
}
```

---

## Connection Error Handling

```typescript
// lib/db/error-handler.ts
import type { Prisma } from '@prisma/client'

/**
 * @description Prisma error codes and recovery strategies
 */
enum PrismaErrorCode {
  PoolExhausted = 'P1011',
  ConnectionTimeout = 'P1010',
  ServerClosed = 'P1013',
}

/**
 * @description Handles connection pool exhaustion errors
 * @param error Database error
 * @returns void
 */
export function handleConnectionError(error: any): void {
  if (error.code === PrismaErrorCode.PoolExhausted) {
    // ✅ GOOD: Log exhaustion for monitoring
    console.error('Connection pool exhausted', {
      timestamp: new Date(),
      code: error.code,
    })
    // Trigger alert or increase pool size
  } else if (error.code === PrismaErrorCode.ConnectionTimeout) {
    console.error('Connection timeout', error.message)
  }
}

/**
 * @description Executes query with connection error recovery
 * @param operation Database operation
 * @returns Promise Query result or null
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      if (attempt === maxRetries) {
        handleConnectionError(error)
        return null
      }

      // ✅ GOOD: Exponential backoff for retries
      const delayMs = Math.pow(2, attempt - 1) * 100
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }
  return null
}
```

---

## Batch Processing with Connection Limits

```typescript
// lib/db/batch-processor.ts
import type { User } from '@prisma/client'

interface BatchProcessOptions {
  batchSize?: number
  delayMs?: number
}

/**
 * @description Processes large dataset in batches to avoid connection saturation
 * @param onBatch Callback for each batch
 * @param options Processing options
 * @example
 * await processLargeDatasetInBatches(
 *   async (users) => { await processUsers(users) },
 *   { batchSize: 100 }
 * )
 */
export async function processLargeDatasetInBatches(
  onBatch: (items: User[]) => Promise<void>,
  options: BatchProcessOptions = {}
): Promise<void> {
  const batchSize = options.batchSize ?? 100
  const delayMs = options.delayMs ?? 0

  let skip = 0

  while (true) {
    // ✅ GOOD: Process in chunks to minimize connection hold time
    const users = await prisma.user.findMany({
      skip,
      take: batchSize,
    })

    if (users.length === 0) break

    // Process batch
    await onBatch(users)

    skip += batchSize

    // ✅ GOOD: Add delay to avoid connection exhaustion
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }
}
```

---

## Singleton Pattern Best Practice

```typescript
// lib/db/client.ts
import { PrismaClient } from '@prisma/client'

// ✅ GOOD: Global singleton prevents connection leaks
const globalForPrisma = global as unknown as { prisma: PrismaClient }

/**
 * @description Gets singleton Prisma instance
 * @returns PrismaClient Shared instance
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? [
            { level: 'query', emit: 'event' },
            { level: 'error', emit: 'event' },
          ]
        : [{ level: 'error', emit: 'event' }],
  })

// ✅ GOOD: Reuse instance in development to prevent hot-reload connection leak
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

/**
 * @description Cleanup on graceful shutdown
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect()
}
```

---

## Connection Pool Configuration Guide

| Environment | Pool Size | Idle Timeout | Use Case |
|-------------|-----------|--------------|----------|
| **Serverless** | 1-3 | 5-10s | Lambda, Edge Functions |
| **Edge Runtime** | 1 | 5s | Vercel Edge, Cloudflare |
| **Traditional Server** | 10-20 | 30s | Node.js, Express |
| **High Traffic** | 20-50 | 60s | Monolith with heavy load |

### SOLID Compliance
- **S**: Separate health checks, error handling, batch processing
- **O**: Extensible via configuration (BatchProcessOptions)
- **L**: Error handlers are interchangeable
- **I**: Focused error codes and batch options
- **D**: Depend on abstraction (error handler interface)
