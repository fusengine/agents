# Caching with Cache Components

## Enable Cache Components

```typescript
// next.config.ts
const nextConfig = {
  cacheComponents: true
}

export default nextConfig
```

## use cache Directive

```typescript
// Cache entire component
async function ProductList() {
  'use cache'
  const products = await db.product.findMany()
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>
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

## Cache Lifetime

```typescript
import { cacheLife } from 'next/cache'

async function getArticles() {
  'use cache'
  cacheLife('hours')  // or 'minutes', 'days', 'weeks', 'max'
  return await db.article.findMany()
}
```

## Revalidation

### revalidateTag (Background)
```typescript
'use server'
import { revalidateTag } from 'next/cache'

export async function updateProduct(id: string) {
  await db.product.update(...)
  revalidateTag('products')  // Background refresh
}
```

### updateTag (Immediate)
```typescript
'use server'
import { updateTag } from 'next/cache'

export async function updateProfile(userId: string) {
  await db.user.update(...)
  updateTag(`user-${userId}`)  // Immediate refresh
}
```

### revalidatePath
```typescript
'use server'
import { revalidatePath } from 'next/cache'

export async function createPost() {
  await db.post.create(...)
  revalidatePath('/blog')  // Revalidate page
}
```

## Fetch Caching

```typescript
// Cached by default
const data = await fetch(url)

// No cache
const data = await fetch(url, { cache: 'no-store' })

// Revalidate every 60s
const data = await fetch(url, { next: { revalidate: 60 } })

// Tagged cache
const data = await fetch(url, { next: { tags: ['posts'] } })
```

## Dynamic Rendering

```typescript
import { unstable_noStore as noStore } from 'next/cache'

export default async function Page() {
  noStore()  // Opt out of caching
  const data = await fetchDynamicData()
  return <div>{data}</div>
}
```
