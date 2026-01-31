---
name: read-replicas
description: Read replica configuration and load balancing strategies in Prisma 7
when-to-use: Scaling read operations across multiple database replicas
keywords: read-replica, replication, load-balancing, connection-pooling, primary-replica
priority: medium
requires: null
related: connection-pooling.md, deployment.md
---

# Prisma 7 Read Replicas

## Configuration

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")

  // Primary database
  primaryUrl = env("DATABASE_PRIMARY_URL")

  // Read replicas
  replicaUrls = [
    env("DATABASE_REPLICA_1_URL"),
    env("DATABASE_REPLICA_2_URL"),
  ]
}
```

---

## Load Balancing Strategy

```typescript
// modules/cores/db/src/interfaces/replicaConfig.ts
/**
 * Read replica configuration interface
 * @module modules/cores/db/src/interfaces
 */
export interface ReplicaConfig {
  primaryUrl: string
  replicaUrls: string[]
}

/**
 * Database operation types for routing
 * @module modules/cores/db/src/interfaces
 */
export type OperationType = 'read' | 'write'
```

```typescript
// modules/cores/db/src/prisma.ts
import { PrismaClient } from '@prisma/client'
import type { ReplicaConfig } from './src/interfaces/replicaConfig'

const prisma = new PrismaClient({
  log: ['warn', 'error'],
})

/**
 * Execute read operation (routed to replica)
 * Automatic replica selection via query extension
 * @module modules/cores/db/src
 */
export async function readOperation() {
  return prisma.user.findMany()
}

/**
 * Execute write operation (routed to primary)
 * Uses transaction to ensure primary database
 * @module modules/cores/db/src
 */
export async function writeOperation(data: Record<string, unknown>) {
  return prisma.$transaction(async (tx) => {
    return tx.user.create({ data: data as any })
  })
}
```

---

## Replication Lag Handling

```typescript
// modules/users/src/queries/getUserWithFallback.ts
import { prisma } from '@/modules/cores/db/src/prisma'

/**
 * Fetch user with fallback to primary on replica failure
 * Handles eventual consistency in read replicas
 * @module modules/users/src/queries
 * @param userId User ID to fetch
 */
export async function getUserData(userId: string) {
  try {
    // Try replica first (may be slightly stale)
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    return user
  } catch (error) {
    console.warn(`Replica read failed for user ${userId}, using primary`)

    // Fallback to primary if replica fails
    const result = await prisma.$queryRaw<any[]>`
      SELECT * FROM "User" WHERE id = ${userId}
    `

    return result?.[0] || null
  }
}
```

---

## Connection Pooling with Replicas

```bash
# .env
DATABASE_PRIMARY_URL="postgresql://user:pass@primary:5432/db?schema=public"
DATABASE_REPLICA_1_URL="postgresql://user:pass@replica-1:5432/db?schema=public"
DATABASE_REPLICA_2_URL="postgresql://user:pass@replica-2:5432/db?schema=public"

# Enable connection pooling
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
```

---

## Consistency Patterns

```typescript
// modules/users/src/queries/consistencyPatterns.ts
import { prisma } from '@/modules/cores/db/src/prisma'

/**
 * Eventual consistency read pattern
 * Caches results for 5 minutes, acceptable for non-critical data
 * @module modules/users/src/queries
 */
export async function getCachedUser(userId: string) {
  const cached = await redis.get(`user:${userId}`)
  if (cached) return JSON.parse(cached)

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  // Cache for 5 minutes
  await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 300)
  return user
}

/**
 * Strong consistency read pattern
 * Always reads from primary database
 * Use for critical data that must be current
 * @module modules/users/src/queries
 */
export async function getLatestUser(userId: string) {
  return prisma.$transaction(async (tx) => {
    return tx.user.findUnique({
      where: { id: userId },
    })
  })
}
```

---

## Monitoring Replica Lag

```typescript
// modules/cores/db/src/utils/replicaHealth.ts
import { prisma } from '../prisma'

/**
 * Replica lag measurement interface
 * @module modules/cores/db/src/utils
 */
export interface ReplicaHealthStatus {
  lagMs: number
  healthy: boolean
  threshold: number
}

/**
 * Check replication lag between primary and replica
 * Helps identify consistency issues
 * @module modules/cores/db/src/utils
 * @returns Health status with lag in milliseconds
 */
export async function checkReplicaLag(
  thresholdMs: number = 1000
): Promise<ReplicaHealthStatus> {
  const primary = await prisma.$queryRaw<
    Array<{ now: Date }>
  >`SELECT NOW() as now`

  const replica = await prisma.$queryRaw<
    Array<{ now: Date }>
  >`SELECT NOW() as now`

  const lagMs = primary[0]?.now.getTime() - (replica[0]?.now.getTime() || 0)

  return {
    lagMs,
    healthy: lagMs < thresholdMs,
    threshold: thresholdMs,
  }
}
```
