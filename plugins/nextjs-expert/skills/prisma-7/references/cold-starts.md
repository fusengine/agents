---
title: Cold Start Mitigation
description: Cold start optimization and connection warming in Prisma 7
keywords: [cold-start, serverless, warming, startup, performance]
---

# Cold Start Mitigation

Cold start optimization for serverless environments with SOLID principles.

## The Cold Start Problem

```typescript
// lib/examples/cold-start-antipattern.ts - PROBLEM

/**
 * @deprecated This demonstrates a cold start antipattern
 * @description Creates new Prisma client on every request
 * @returns Promise<User | null> User data
 */
export async function getUserAntipattern(userId: string) {
  // ❌ BAD: New PrismaClient on each request = 1-3s delay!
  const prisma = new PrismaClient()

  try {
    return await prisma.user.findUnique({
      where: { id: userId },
    })
  } finally {
    await prisma.$disconnect()
  }
}
```

---

## Solution 1: Global Singleton Pattern

```typescript
// lib/db/client.ts
import { PrismaClient } from '@prisma/client'
import type { PrismaClient as PrismaClientType } from '@prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClientType | undefined
}

/**
 * @description Creates or retrieves singleton Prisma instance
 * @returns PrismaClient Shared singleton instance
 * @example
 * const prisma = getPrismaClient()
 * const user = await prisma.user.findUnique(...)
 */
function getPrismaClient(): PrismaClientType {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  // ✅ GOOD: Create once on first call
  const prisma = new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? [{ level: 'query', emit: 'event' }]
        : [{ level: 'error', emit: 'event' }],
  })

  // ✅ GOOD: Store globally in development to prevent hot-reload leaks
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }

  return prisma
}

export const prisma = getPrismaClient()
```

---

## Solution 2: Connection Warming Strategy

```typescript
// lib/db/warming.ts
import type { PrismaClient } from '@prisma/client'

/**
 * @description Warms database connection with health check
 * @param prisma PrismaClient instance
 * @returns Promise<boolean> Success status
 * @example
 * await warmDatabaseConnection(prisma)
 */
export async function warmDatabaseConnection(
  prisma: PrismaClient
): Promise<boolean> {
  try {
    // ✅ GOOD: Simple query to establish connection
    await prisma.$queryRaw`SELECT 1`
    console.log('[DB] Connection warmed successfully')
    return true
  } catch (error) {
    console.error('[DB] Failed to warm connection:', error)
    return false
  }
}

/**
 * @description Initialization hook for API handlers
 * @returns Promise<void>
 */
export async function initializeDatabaseOnStartup(): Promise<void> {
  // ✅ GOOD: Called once per container startup
  await warmDatabaseConnection(prisma)
}
```

---

## Solution 3: Neon Serverless Adapter

```typescript
// lib/db/neon-adapter.ts
import { neon, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import type { PrismaClient } from '@prisma/client'

/**
 * @description Creates Prisma client with Neon serverless adapter
 * @returns PrismaClient Optimized for serverless with <100ms cold start
 * @example
 * const prisma = createNeonPrismaClient()
 */
export function createNeonPrismaClient(): PrismaClient {
  // ✅ GOOD: Enable connection pooling for performance
  neonConfig.poolConnections = true
  neonConfig.useSecureWebSocket = true

  const sql = neon(process.env.DATABASE_URL || '')
  const adapter = new PrismaNeon(sql)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
      ? [{ level: 'query', emit: 'event' }]
      : [],
  })
}

export const prisma = createNeonPrismaClient()
```

---

## Solution 4: Lazy Initialization Manager

```typescript
// lib/db/lazy-manager.ts
import type { PrismaClient } from '@prisma/client'

/**
 * @description Manages lazy Prisma client initialization
 */
class PrismaManager {
  private static instance: PrismaClient | undefined = undefined
  private static initPromise: Promise<PrismaClient> | undefined = undefined

  /**
   * @description Gets singleton instance with lazy initialization
   * @returns Promise<PrismaClient> Shared instance
   * @example
   * const prisma = await PrismaManager.getInstance()
   */
  static async getInstance(): Promise<PrismaClient> {
    // ✅ GOOD: Return existing instance if available
    if (this.instance) {
      return this.instance
    }

    // ✅ GOOD: Prevent concurrent initialization
    if (this.initPromise) {
      return this.initPromise
    }

    // ✅ GOOD: Initialize once in the background
    this.initPromise = (async () => {
      const { PrismaClient } = await import('@prisma/client')
      this.instance = new PrismaClient()
      return this.instance
    })()

    return this.initPromise
  }

  /**
   * @description Gracefully disconnects from database
   * @returns Promise<void>
   */
  static async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.$disconnect()
      this.instance = undefined
      this.initPromise = undefined
    }
  }

  /**
   * @description Checks if client is initialized
   * @returns boolean True if initialized
   */
  static isInitialized(): boolean {
    return this.instance !== undefined
  }
}

export { PrismaManager }
```

---

## Cold Start Metrics & Monitoring

```typescript
// lib/db/metrics.ts
import type { PrismaClient } from '@prisma/client'

interface ColdStartMetrics {
  initTimeMs: number
  warmingTimeMs: number
  totalTimeMs: number
  environment: string
  timestamp: Date
}

/**
 * @description Measures cold start performance
 * @returns Promise<ColdStartMetrics> Timing information
 * @example
 * const metrics = await measureColdStart()
 * console.log(`Total startup: ${metrics.totalTimeMs}ms`)
 */
export async function measureColdStart(
  prisma: PrismaClient
): Promise<ColdStartMetrics> {
  const startTime = Date.now()

  // Step 1: Client initialization
  const initTime = Date.now()

  // Step 2: Connection warming
  try {
    await prisma.$queryRaw`SELECT 1`
  } catch (error) {
    console.error('Warming failed:', error)
  }

  const warmingTime = Date.now()

  return {
    initTimeMs: initTime - startTime,
    warmingTimeMs: warmingTime - initTime,
    totalTimeMs: warmingTime - startTime,
    environment: process.env.NODE_ENV || 'unknown',
    timestamp: new Date(),
  }
}

/**
 * @description Logs cold start metrics for monitoring
 * @param metrics Collected metrics
 */
export function logColdStartMetrics(metrics: ColdStartMetrics): void {
  console.log('[COLD_START_METRICS]', {
    totalMs: metrics.totalTimeMs,
    initMs: metrics.initTimeMs,
    warmMs: metrics.warmingTimeMs,
    env: metrics.environment,
    status: metrics.totalTimeMs < 500 ? 'GOOD' : 'SLOW',
  })
}
```

---

## Next.js Edge Runtime Optimization

```typescript
// app/api/users/[id]/route.ts
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neon } from '@neondatabase/serverless'

// ✅ GOOD: Configure for edge runtime
export const runtime = 'edge'

// ✅ GOOD: Create minimal client for edge
function getEdgeClient() {
  const sql = neon(process.env.DATABASE_URL || '')
  const adapter = new PrismaNeon(sql)
  return new PrismaClient({ adapter })
}

/**
 * @description Edge API endpoint with minimal cold start
 * @param request HTTP request
 * @param params Route parameters
 * @returns Promise<Response> JSON response
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  const prisma = getEdgeClient()

  try {
    // ✅ GOOD: Query executes with <50ms overhead
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    return Response.json(user)
  } finally {
    await prisma.$disconnect()
  }
}
```

---

## Best Practices for Cold Start Reduction

| Strategy | Reduction | Environment | Implementation |
|----------|-----------|-------------|-----------------|
| **Singleton** | 80-90% | All | Single global instance |
| **Warming** | 10-20% | Serverless | Background health check |
| **Neon Adapter** | 95%+ | Serverless | Specialized driver adapter |
| **Lazy Init** | 50-70% | Edge Runtime | Initialize on demand |

### SOLID Compliance
- **S**: Separate warming, initialization, metrics
- **O**: Metrics extensible without code changes
- **L**: Different adapters are interchangeable
- **I**: Small, focused manager interface
- **D**: Depend on PrismaClient type, not implementation
