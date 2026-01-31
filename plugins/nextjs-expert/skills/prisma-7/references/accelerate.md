---
name: accelerate
description: Prisma Accelerate for global caching and connection pooling
when-to-use: Serverless apps, global caching, connection pool management
keywords: accelerate, cache, cacheStrategy, ttl, swr, connection pool
priority: high
requires: client.md
related: deployment.md, optimization.md
---

# Prisma Accelerate

Global database cache and connection pooling with SOLID principles.

## Setup

```bash
# Install Accelerate extension
bun add @prisma/extension-accelerate
# or
npm install @prisma/extension-accelerate
```

```typescript
// lib/db/accelerate.ts
import type { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

/**
 * @description Creates Prisma client with Accelerate extension
 * @returns PrismaClient Extended with global caching and pooling
 * @example
 * const prisma = createAcceleratedClient()
 */
export function createAcceleratedClient(): PrismaClient {
  // ✅ GOOD: Enable Accelerate for production deployments
  const prisma = new PrismaClient()
  return prisma.$extends(withAccelerate())
}

export const prisma = createAcceleratedClient()
```

---

## Cache Strategies

```typescript
// lib/db/cache-strategies.ts
import type { Prisma } from '@prisma/client'

interface CacheConfig {
  ttl: number // Time to live in seconds
  swr?: number // Stale while revalidate in seconds
  tags?: string[] // Cache invalidation tags
}

/**
 * @description Time-to-live caching strategy
 * @returns Config Cache for 60 seconds
 */
export const ttlCacheStrategy: CacheConfig = {
  ttl: 60,
}

/**
 * @description Stale-while-revalidate strategy
 * @returns Config Serve stale for 60s, refresh in background
 */
export const swrCacheStrategy: CacheConfig = {
  ttl: 60,
  swr: 300, // Serve stale up to 5 minutes
}

/**
 * @description No cache (bypass) strategy
 * @returns Config Disable caching
 */
export const noCacheStrategy: CacheConfig = {
  ttl: 0,
}

/**
 * @description Fetches users with TTL caching
 * @returns Promise<User[]> Cached for 60 seconds
 * @example
 * const users = await getCachedUserList()
 */
export async function getCachedUserList() {
  // ✅ GOOD: Cache frequently accessed lists
  return prisma.user.findMany({
    cacheStrategy: ttlCacheStrategy,
    select: {
      id: true,
      email: true,
      name: true,
    },
  })
}

/**
 * @description Fetches data with SWR strategy
 * @returns Promise<User[]> Serves stale data while revalidating
 */
export async function getCachedUserListWithSWR() {
  // ✅ GOOD: SWR for high-traffic endpoints
  return prisma.user.findMany({
    cacheStrategy: swrCacheStrategy,
  })
}

/**
 * @description Bypasses cache for real-time data
 * @returns Promise<User[]> Fresh data every request
 */
export async function getRealTimeUsers() {
  // ✅ GOOD: Disable cache for real-time requirements
  return prisma.user.findMany({
    cacheStrategy: noCacheStrategy,
  })
}
```

---

## Cache Invalidation with Tags

```typescript
// lib/db/cache-invalidation.ts
import type { User } from '@prisma/client'

/**
 * @description Fetches user with cache tags for invalidation
 * @param userId User identifier
 * @returns Promise<User | null> User with cache tags
 * @example
 * const user = await getCachedUserWithTags('user_123')
 * // Later: await invalidateUserCache('user_123')
 */
export async function getCachedUserWithTags(userId: string) {
  // ✅ GOOD: Add tags for granular cache invalidation
  return prisma.user.findUnique({
    where: { id: userId },
    cacheStrategy: {
      ttl: 3600, // 1 hour
      tags: ['user', `user_${userId}`], // Tag for invalidation
    },
  })
}

/**
 * @description Invalidates user cache by ID
 * @param userId User identifier to invalidate
 * @returns Promise<void>
 * @example
 * await invalidateUserCache('user_123')
 */
export async function invalidateUserCache(userId: string): Promise<void> {
  // ✅ GOOD: Invalidate specific user cache
  await prisma.$accelerate.invalidate({
    tags: [`user_${userId}`],
  })
}

/**
 * @description Invalidates all user-related caches
 * @returns Promise<void>
 */
export async function invalidateAllUsersCache(): Promise<void> {
  // ✅ GOOD: Bulk invalidation for migrations or bulk updates
  await prisma.$accelerate.invalidate({
    tags: ['user'],
  })
}

/**
 * @description Updates user and invalidates cache
 * @param userId User identifier
 * @param data Update data
 * @returns Promise<User> Updated user
 */
export async function updateUserAndInvalidate(
  userId: string,
  data: Partial<User>
): Promise<User> {
  // ✅ GOOD: Atomic update with cache invalidation
  const updated = await prisma.user.update({
    where: { id: userId },
    data,
  })

  await invalidateUserCache(userId)
  return updated
}
```

---

## Connection Pooling Configuration

```env
# .env.local
# Accelerate connection URL (replaces direct database connection)
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_ACCELERATE_KEY"

# Direct URL for migrations (bypasses Accelerate)
DIRECT_URL="postgresql://user:pass@host:5432/database"
```

```prisma
// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // For migrations
}

model User {
  id    String   @id @default(cuid())
  email String   @unique
  name  String?
  // ...
}
```

---

## Cache Hit/Miss Monitoring

```typescript
// lib/db/cache-monitoring.ts
import type { Prisma } from '@prisma/client'

interface CacheInfo {
  status: 'hit' | 'miss' | 'stale'
  lastModified?: Date
}

/**
 * @description Queries with cache status information
 * @param userId User identifier
 * @returns Promise Object with data and cache info
 * @example
 * const { data, cacheInfo } = await getUserWithCacheStatus('user_123')
 * console.log(cacheInfo.status) // 'hit' | 'miss' | 'stale'
 */
export async function getUserWithCacheStatus(userId: string) {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    cacheStrategy: { ttl: 300 },
  }).$withAccelerateInfo()

  // ✅ GOOD: Access cache metadata for monitoring
  return {
    data: result.data,
    cacheInfo: {
      status: result.info?.cacheStatus as CacheInfo['status'] | undefined,
      lastModified: result.info?.lastModified,
    },
  }
}

/**
 * @description Logs cache statistics
 * @param operation Operation name
 * @param cacheInfo Cache status
 */
export function logCacheMetrics(
  operation: string,
  cacheInfo: CacheInfo | undefined
): void {
  if (cacheInfo?.status === 'hit') {
    console.log(`[CACHE_HIT] ${operation}`)
  } else if (cacheInfo?.status === 'miss') {
    console.log(`[CACHE_MISS] ${operation}`)
  } else if (cacheInfo?.status === 'stale') {
    console.log(`[CACHE_STALE] ${operation}`)
  }
}
```

---

## Edge Runtime Integration

```typescript
// app/api/users/route.ts
import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaClient } from '@prisma/client'

export const runtime = 'edge'

/**
 * @description Edge API endpoint with global caching
 * @returns Promise<Response> JSON response with cached data
 */
export async function GET(): Promise<Response> {
  // ✅ GOOD: Create instance per request on edge
  const prisma = new PrismaClient().$extends(withAccelerate())

  try {
    // ✅ GOOD: Edge uses global Accelerate cache
    const users = await prisma.user.findMany({
      cacheStrategy: { ttl: 300 },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    return Response.json(users)
  } finally {
    await prisma.$disconnect()
  }
}
```

---

## Cache Strategy Selection Guide

| Data Type | TTL | SWR | Tags | Use Case |
|-----------|-----|-----|------|----------|
| **User profiles** | 600s | 1800s | `['user', 'user_ID']` | Profile pages, dashboards |
| **Reference data** | 3600s | None | `['refs']` | Dropdown lists, static content |
| **Feed/lists** | 60s | 300s | `['feeds']` | Infinite scroll, pagination |
| **Counts/stats** | 300s | None | `['stats']` | Real-time counters |
| **Real-time data** | 0s | None | None | Live notifications, active users |

### TTL Recommendations
1. **Static reference data** (countries, roles, categories) - 3600+ seconds
2. **User profiles** (name, email, settings) - 600-1800 seconds
3. **Lists and feeds** (posts, comments) - 60-300 seconds
4. **Counts and analytics** (view counts, likes) - 300 seconds
5. **Real-time data** (live notifications, WebSocket) - 0 seconds (no cache)

### SOLID Compliance
- **S**: Separate cache strategies, monitoring, invalidation
- **O**: Add cache without modifying query logic
- **L**: Cache strategies are interchangeable
- **I**: Small, focused cache configuration objects
- **D**: Query functions depend on cache abstraction
