---
name: caching
description: Caching strategies with use cache directive, tags, and revalidation
when-to-use: performance optimization, cache invalidation, stale-while-revalidate patterns
keywords: cache, revalidate, cacheTag, cacheLife, ISR
priority: medium
requires: data-fetching.md, cache-components.md
related: rendering.md, static-generation.md
---

# Caching with Cache Components

## When to Use

- Optimizing data fetching performance
- Implementing stale-while-revalidate patterns
- Caching expensive computations
- Managing cache invalidation

## Why Cache Components

| Feature | Benefit |
|---------|---------|
| `use cache` | Explicit, predictable caching |
| cacheTag | Granular invalidation |
| cacheLife | Automatic TTL management |
| updateTag | Immediate cache refresh |

## Enable Cache Components
```typescript
// next.config.ts
const nextConfig = { cacheComponents: true }
export default nextConfig
```

## use cache Directive
```typescript
// modules/public/products/src/services/queries.ts
async function getProducts() {
  'use cache'
  return await db.product.findMany()
}
```

## Cache with Tags & Lifetime
```typescript
import { cacheTag, cacheLife } from 'next/cache'

async function getProducts() {
  'use cache'
  cacheTag('products')
  cacheLife('hours')  // 'minutes', 'days', 'weeks', 'max'
  return await db.product.findMany()
}
```

## Revalidation
```typescript
// modules/auth/products/src/services/actions.ts
'use server'
import { revalidateTag, updateTag, revalidatePath } from 'next/cache'

export async function updateProduct(id: string) {
  await db.product.update(...)
  revalidateTag('products')  // Background refresh
}

export async function updateProfile(userId: string) {
  await db.user.update(...)
  updateTag(`user-${userId}`)  // Immediate refresh
}

export async function createPost() {
  await db.post.create(...)
  revalidatePath('/blog')  // Revalidate page
}
```

## Fetch Caching
```typescript
const cached = await fetch(url)                              // Cached
const dynamic = await fetch(url, { cache: 'no-store' })      // No cache
const timed = await fetch(url, { next: { revalidate: 60 } }) // Revalidate 60s
const tagged = await fetch(url, { next: { tags: ['posts'] }})// Tagged
```

## Dynamic Rendering
```typescript
import { unstable_noStore as noStore } from 'next/cache'

export default async function Page() {
  noStore()  // Opt out of caching
  return <div>{await fetchDynamicData()}</div>
}
```
