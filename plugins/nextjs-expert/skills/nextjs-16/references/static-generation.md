---
name: static-generation
description: Pre-rendering pages with generateStaticParams, ISR, and on-demand revalidation
when-to-use: dynamic routes, blog posts, product pages, build-time rendering
keywords: generateStaticParams, ISR, revalidate, dynamicParams, pre-rendering
priority: high
requires: app-router.md, rendering.md
related: caching.md, rendering.md
---

# Static Generation

## When to Use

- Pre-rendering dynamic pages
- Build-time data fetching
- ISR with revalidation
- Static export

## Why Static Generation

| Feature | Benefit |
|---------|---------|
| Build-time | Fast page loads |
| CDN | Global distribution |
| ISR | Background updates |
| On-demand | Lazy generation |

## generateStaticParams
```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await db.post.findMany({ select: { slug: true } })
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <article>{(await getPost(slug)).content}</article>
}
```

## Multiple Dynamic Segments
```typescript
// app/[lang]/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.flatMap((post) => ['en', 'fr'].map((lang) => ({ lang, slug: post.slug })))
}
```

## Dynamic Params Behavior
```typescript
export const dynamicParams = true   // Generate on-demand (default)
export const dynamicParams = false  // Return 404 for unlisted
```

## Revalidation (ISR)
```typescript
export const revalidate = 60  // Revalidate every 60 seconds

export default async function Page() {
  return <div>{await fetchData()}</div>
}
```

## Force Static/Dynamic
```typescript
export const dynamic = 'force-static'   // Always static
export const dynamic = 'force-dynamic'  // Always dynamic
export const dynamic = 'auto'           // Default
```

## On-Demand Revalidation
```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  const { path, tag } = await request.json()
  if (path) revalidatePath(path)
  if (tag) revalidateTag(tag)
  return Response.json({ revalidated: true })
}
```

## Static Export
```typescript
// next.config.ts
const nextConfig = { output: 'export' }  // Full static to /out
```
