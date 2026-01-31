---
title: Caching Strategies
description: Application-level caching patterns in Prisma 7
keywords: [cache, caching, redis, memory, performance]
---

# Caching Strategies

Application-level caching with SOLID Next.js principles.

## In-Memory Cache Pattern

```typescript
// lib/cache/memory-cache.ts
import type { User } from '@prisma/client'

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

/**
 * @description Simple in-memory cache with TTL support
 */
class MemoryCache<T = any> {
  private store = new Map<string, CacheEntry<T>>()

  /**
   * @description Gets value from cache if not expired
   * @param key Cache key
   * @returns Cached value or undefined
   */
  get(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }

    return entry.data
  }

  /**
   * @description Sets value in cache with TTL
   * @param key Cache key
   * @param value Data to cache
   * @param ttlSeconds Time to live in seconds
   */
  set(key: string, value: T, ttlSeconds: number = 300): void {
    this.store.set(key, {
      data: value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    })
  }

  /**
   * @description Removes value from cache
   * @param key Cache key
   */
  delete(key: string): void {
    this.store.delete(key)
  }

  /**
   * @description Clears entire cache
   */
  clear(): void {
    this.store.clear()
  }
}

const userCache = new MemoryCache<User>()

/**
 * @description Gets user from cache or database
 * @param id User identifier
 * @returns Promise<User | null> Cached or fresh user
 * @example
 * const user = await getCachedUser('user_123')
 */
export async function getCachedUser(id: string): Promise<User | null> {
  const cacheKey = `user:${id}`

  // ✅ GOOD: Check cache first
  const cached = userCache.get(cacheKey)
  if (cached) return cached

  // Query database if cache miss
  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (user) {
    // ✅ GOOD: Cache for 5 minutes
    userCache.set(cacheKey, user, 300)
  }

  return user
}
```

---

## Cache with Invalidation Strategy

```typescript
// lib/cache/cache-invalidation.ts
import type { User } from '@prisma/client'

const userCache = new MemoryCache<User>()
const listCache = new MemoryCache<User[]>()

/**
 * @description Updates user and invalidates related caches
 * @param id User identifier
 * @param data Update data
 * @returns Promise<User> Updated user
 * @example
 * const user = await updateUserWithInvalidation('user_123', { name: 'John' })
 */
export async function updateUserWithInvalidation(
  id: string,
  data: Partial<User>
): Promise<User> {
  // ✅ GOOD: Perform database update
  const user = await prisma.user.update({
    where: { id },
    data,
  })

  // ✅ GOOD: Invalidate all related caches
  userCache.delete(`user:${id}`)
  listCache.clear() // Clear list cache (could be smarter)

  return user
}

/**
 * @description Gets all users with list-level caching
 * @returns Promise<User[]> All users
 */
export async function getCachedUserList(): Promise<User[]> {
  const cacheKey = 'users:all'

  const cached = listCache.get(cacheKey)
  if (cached) return cached

  const users = await prisma.user.findMany()

  listCache.set(cacheKey, users, 600) // 10 minute TTL for lists
  return users
}

/**
 * @description Invalidates all user-related caches
 */
export function invalidateUserCaches(): void {
  userCache.clear()
  listCache.clear()
}
```

---

## Redis Pattern (Distributed Cache)

```typescript
// lib/cache/redis-cache.ts
import { Redis } from '@upstash/redis'
import type { User } from '@prisma/client'

// ✅ GOOD: Single Redis instance (singleton pattern)
const redis = new Redis({
  url: process.env.REDIS_URL || '',
  token: process.env.REDIS_TOKEN || '',
})

/**
 * @description Gets user from Redis cache or database
 * @param id User identifier
 * @returns Promise<User | null> User from cache or DB
 * @example
 * const user = await getCachedUserRedis('user_123')
 */
export async function getCachedUserRedis(id: string): Promise<User | null> {
  const cacheKey = `user:${id}`

  try {
    // ✅ GOOD: Check Redis first
    const cached = await redis.get<User>(cacheKey)
    if (cached) return cached
  } catch (error) {
    console.warn('Redis get failed, falling back to DB:', error)
  }

  // Query database if cache miss
  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (user) {
    try {
      // ✅ GOOD: Cache for 5 minutes (300 seconds)
      await redis.setex(cacheKey, 300, JSON.stringify(user))
    } catch (error) {
      console.warn('Redis set failed:', error)
    }
  }

  return user
}

/**
 * @description Invalidates user cache in Redis
 * @param id User identifier
 */
export async function invalidateUserCacheRedis(id: string): Promise<void> {
  try {
    await redis.del(`user:${id}`)
  } catch (error) {
    console.warn('Redis delete failed:', error)
  }
}
```

---

## Query Result Caching with Filters

```typescript
// lib/cache/query-cache.ts
import type { Prisma, User } from '@prisma/client'

/**
 * @description Gets users matching filters from cache or database
 * @param filters Prisma where conditions
 * @returns Promise<User[]> Filtered users
 * @example
 * const activeUsers = await getCachedFilteredUsers({ status: 'active' })
 */
export async function getCachedFilteredUsers(
  filters: Prisma.UserWhereInput
): Promise<User[]> {
  // ✅ GOOD: Generate deterministic cache key from filters
  const cacheKey = `users:${JSON.stringify(filters).slice(0, 100)}`

  try {
    const cached = await redis.get<User[]>(cacheKey)
    if (cached) return cached
  } catch (error) {
    console.warn('Cache read failed:', error)
  }

  // Query database
  const users = await prisma.user.findMany({
    where: filters,
    take: 50, // Limit to prevent huge responses
  })

  try {
    // ✅ GOOD: Cache for 10 minutes
    await redis.setex(cacheKey, 600, JSON.stringify(users))
  } catch (error) {
    console.warn('Cache write failed:', error)
  }

  return users
}

/**
 * @description Gets paginated users with caching
 * @param page Page number
 * @param pageSize Items per page
 * @returns Promise Paginated users
 */
export async function getCachedPaginatedUsers(
  page: number = 1,
  pageSize: number = 10
) {
  const cacheKey = `users:page:${page}:${pageSize}`

  try {
    const cached = await redis.get<User[]>(cacheKey)
    if (cached) return cached
  } catch (error) {
    console.warn('Cache read failed:', error)
  }

  const users = await prisma.user.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
  })

  try {
    // ✅ GOOD: Cache pagination results
    await redis.setex(cacheKey, 300, JSON.stringify(users))
  } catch (error) {
    console.warn('Cache write failed:', error)
  }

  return users
}
```

---

## Decorator Pattern for Caching

```typescript
// lib/cache/cacheable-decorator.ts
import type { User } from '@prisma/client'

/**
 * @description Decorator for adding caching to methods
 * @param ttl Time to live in seconds
 * @returns Decorator function
 * @example
 * class UserService {
 *   @Cacheable(300)
 *   async getUser(id: string): Promise<User> { ... }
 * }
 */
function Cacheable(ttl: number = 300) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      // ✅ GOOD: Generate deterministic cache key from method name and args
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`

      try {
        const cached = await redis.get(cacheKey)
        if (cached) return JSON.parse(cached)
      } catch (error) {
        console.warn('Cache get failed:', error)
      }

      // Execute original method
      const result = await originalMethod.apply(this, args)

      try {
        // ✅ GOOD: Cache the result
        await redis.setex(cacheKey, ttl, JSON.stringify(result))
      } catch (error) {
        console.warn('Cache set failed:', error)
      }

      return result
    }

    return descriptor
  }
}

/**
 * @description User data access service with caching
 */
export class UserService {
  /**
   * @description Gets user by ID (cached)
   * @param id User identifier
   * @returns Promise<User>
   */
  @Cacheable(300)
  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  }

  /**
   * @description Gets all users (cached)
   * @returns Promise<User[]>
   */
  @Cacheable(600)
  async getAllUsers(): Promise<User[]> {
    return prisma.user.findMany()
  }
}
```

---

## Caching Best Practices

### Strategy Selection

| Data | TTL | Strategy | Use Case |
|------|-----|----------|----------|
| **User profiles** | 5-10 min | Redis | Frequently accessed |
| **Lists/feeds** | 1-2 min | Redis | High traffic, dynamic |
| **References** | 1 hour | Memory | Static, small data |
| **Counts** | 10 min | Redis | Statistics |

### SOLID Principles
- **S**: Separate cache layers (memory, Redis)
- **O**: Use decorators for non-intrusive caching
- **L**: Cache operations are interchangeable
- **I**: Small cache objects (projections)
- **D**: Depend on cache abstraction, not implementation
