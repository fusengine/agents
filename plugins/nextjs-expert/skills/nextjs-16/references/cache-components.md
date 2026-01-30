# Cache Components (use cache)

## Enable Cache Components
```typescript
// next.config.ts
const nextConfig = {
  cacheComponents: true,
}
```

## use cache Directive
```typescript
// File-level cache
'use cache'

async function getProducts() {
  return await db.product.findMany()
}
```

## Function-level Cache
```typescript
async function getUser(id: string) {
  'use cache'
  return await db.user.findUnique({ where: { id } })
}
```

## Cache with Tags
```typescript
import { cacheTag } from 'next/cache'

async function getProducts() {
  'use cache'
  cacheTag('products')
  return await db.product.findMany()
}
```

## Cache Lifetime Profiles
```typescript
import { cacheLife } from 'next/cache'

async function getData() {
  'use cache'
  cacheLife('hours')  // 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'max'
  return await fetch(url)
}
```

## Revalidation
```typescript
'use server'
import { revalidateTag, updateTag } from 'next/cache'

// Background refresh (stale-while-revalidate)
export async function refreshProducts() {
  revalidateTag('products')
}

// Immediate refresh (read-your-writes)
export async function updateProduct(id: string) {
  await db.product.update(...)
  updateTag(`product-${id}`)  // Immediate consistency
}
```

## Client Refresh
```typescript
'use client'
import { useRouter } from 'next/navigation'

export function RefreshButton() {
  const router = useRouter()
  return <button onClick={() => router.refresh()}>Refresh</button>
}
```

## Cache Variants
```typescript
'use cache: private'  // User-specific cache
'use cache: remote'   // CDN/Edge cache
```

## vs Old Caching Model
| Old (implicit) | New (explicit) |
|----------------|----------------|
| fetch cache | `use cache` directive |
| revalidate option | `cacheLife()` |
| unstable_cache | `use cache` function |
