---
name: multi-database
description: Multiple database connections for sharding, analytics, and service separation
when-to-use: Connecting to multiple databases simultaneously or database routing
keywords: multi-database, sharding, analytics-db, connection-management, routing
priority: medium
requires: null
related: read-replicas.md, connection-pooling.md
---

# Prisma 7 Multiple Database Connections

## Dual Database Setup

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

// Primary transactional database
datasource primary {
  provider = "postgresql"
  url      = env("DATABASE_PRIMARY_URL")
}

// Separate analytics database
datasource analytics {
  provider = "postgresql"
  url      = env("DATABASE_ANALYTICS_URL")
}
```

---

## Multi-Database Client Manager

```typescript
// modules/cores/db/src/interfaces/databaseManager.ts
import type { PrismaClient } from '@prisma/client'

/**
 * Database manager interface for multiple database connections
 * @module modules/cores/db/src/interfaces
 */
export interface IDatabaseManager {
  getPrimary(): PrismaClient
  getAnalytics(): PrismaClient
  disconnect(): Promise<void>
}
```

```typescript
// modules/cores/db/src/manager.ts
import { PrismaClient } from '@prisma/client'
import type { IDatabaseManager } from './src/interfaces/databaseManager'

/**
 * Manages multiple Prisma client connections
 * Separates transactional and analytics databases
 * @module modules/cores/db/src
 */
class DatabaseManager implements IDatabaseManager {
  private primaryDb: PrismaClient
  private analyticsDb: PrismaClient

  constructor() {
    /**
     * Primary transactional database
     */
    this.primaryDb = new PrismaClient({
      datasources: { db: { url: process.env.DATABASE_PRIMARY_URL } },
    })

    /**
     * Separate analytics database for reporting
     */
    this.analyticsDb = new PrismaClient({
      datasources: { db: { url: process.env.DATABASE_ANALYTICS_URL } },
    })
  }

  /**
   * Get primary database client
   */
  getPrimary(): PrismaClient {
    return this.primaryDb
  }

  /**
   * Get analytics database client
   */
  getAnalytics(): PrismaClient {
    return this.analyticsDb
  }

  /**
   * Disconnect all database connections
   */
  async disconnect(): Promise<void> {
    await this.primaryDb.$disconnect()
    await this.analyticsDb.$disconnect()
  }
}

export const dbManager = new DatabaseManager()
```

---

## Sharding Pattern

```typescript
// modules/cores/db/src/interfaces/shardConfig.ts
/**
 * Shard configuration interface
 * Defines database range for consistent hashing
 * @module modules/cores/db/src/interfaces
 */
export interface ShardConfig {
  database: string
  range: [number, number]
}
```

```typescript
// modules/cores/db/src/utils/sharding.ts
import type { ShardConfig } from '../src/interfaces/shardConfig'

const SHARDS: ShardConfig[] = [
  { database: 'shard_1', range: [0, 333] },
  { database: 'shard_2', range: [334, 666] },
  { database: 'shard_3', range: [667, 1000] },
]

/**
 * Determine shard for user based on consistent hashing
 * @module modules/cores/db/src/utils
 */
export function getShardForUserId(userId: string): string {
  const hash = parseInt(userId.substring(0, 8), 16)
  const normalized = hash % 1000

  const shard = SHARDS.find(
    (s) => normalized >= s.range[0] && normalized <= s.range[1]
  )

  return shard?.database || 'shard_1'
}

/**
 * Fetch user from appropriate shard database
 * Routing handled automatically via consistent hash
 * @module modules/cores/db/src/utils
 */
export async function getUserFromShard(userId: string) {
  const shardDb = getShardForUserId(userId)
  const prisma = getShardPrisma(shardDb)

  return prisma.user.findUnique({
    where: { id: userId },
  })
}
```

---

## Read/Write Database Separation

```typescript
// modules/users/src/queries/databaseRouting.ts
import { dbManager } from '@/modules/cores/db/src/manager'

/**
 * Read data with fallback mechanism
 * Tries primary first, falls back to analytics
 * @module modules/users/src/queries
 */
export async function readDataWithFallback() {
  try {
    // Primary: read-write database
    return await dbManager.getPrimary().user.findMany()
  } catch (error) {
    console.warn('Primary read failed, using analytics database')

    // Fallback to analytics if primary fails
    return await dbManager.getAnalytics().user.findMany()
  }
}

/**
 * Write data exclusively to primary database
 * @module modules/users/src/queries
 */
export async function writeData(data: Record<string, unknown>) {
  return dbManager.getPrimary().user.create({ data: data as any })
}

/**
 * Sync user data from primary to analytics database
 * Enables analytics reporting without impacting transactional DB
 * @module modules/users/src/queries
 */
export async function syncToAnalytics(userId: string) {
  const user = await dbManager.getPrimary().user.findUnique({
    where: { id: userId },
  })

  if (!user) return null

  // Sync to analytics database
  return dbManager.getAnalytics().userAnalytics.upsert({
    where: { userId },
    update: { ...user },
    create: { userId, ...user },
  })
}
```

---

## Database Selection Middleware

```typescript
// modules/cores/middleware/src/databaseRouting.ts
import { dbManager } from '@/modules/cores/db/src/manager'
import type { PrismaClient } from '@prisma/client'

/**
 * Route incoming request to appropriate database
 * Separates analytics queries from transactional operations
 * @module modules/cores/middleware/src
 */
export async function getRequestDatabase(
  req: Request
): Promise<PrismaClient> {
  const isDev = req.headers.get('x-environment') === 'dev'
  const isAnalyticsPath = req.url.includes('/api/analytics')

  // Route analytics requests to dedicated database
  if (isAnalyticsPath) {
    return dbManager.getAnalytics()
  }

  // Always use primary for transactional operations
  return dbManager.getPrimary()
}
```

---

## Connection Pool Management

```bash
# .env
DATABASE_PRIMARY_URL="postgresql://user:pass@primary:5432/app?schema=public"
DATABASE_ANALYTICS_URL="postgresql://user:pass@analytics:5432/analytics?schema=public"

# Connection pool settings
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=5
```

---

## Cleanup Pattern

```typescript
// app/layout.tsx
import { dbManager } from '@/modules/cores/db/src/manager'
import type { ReactNode } from 'react'

/**
 * Root layout with database cleanup on shutdown
 * @module app
 */
export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

```typescript
// modules/cores/db/src/shutdown.ts
import { dbManager } from './manager'

/**
 * Graceful shutdown handler
 * Disconnects all database connections on server termination
 * @module modules/cores/db/src
 */
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing database connections...')

  try {
    await dbManager.disconnect()
    console.log('Database connections closed successfully')
    process.exit(0)
  } catch (err) {
    console.error('Error during database shutdown:', err)
    process.exit(1)
  }
})

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', async (err) => {
  console.error('Uncaught exception:', err)

  try {
    await dbManager.disconnect()
  } catch (disconnectErr) {
    console.error('Error disconnecting:', disconnectErr)
  }

  process.exit(1)
})
```
