# Rendering (SSR, SSG, ISR, PPR)

## Dynamic Rendering (SSR)
```typescript
// Force SSR on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const data = await fetch(url, { cache: 'no-store' })
  return <div>{data}</div>
}
```

## Static Rendering (SSG)
```typescript
export const dynamic = 'force-static'

export default async function AboutPage() {
  return <div>Static content</div>
}
```

## Incremental Static Regeneration (ISR)
```typescript
export const revalidate = 60  // Revalidate every 60s

export default async function BlogPage() {
  const posts = await fetch(url)
  return <div>{posts}</div>
}
```

## Partial Pre-rendering (PPR)
```typescript
// next.config.ts
const nextConfig = {
  experimental: { ppr: 'incremental' }
}
```

```typescript
// app/page.tsx
import { Suspense } from 'react'

export const experimental_ppr = true

export default function Page() {
  return (
    <>
      <Header />  {/* Static - pre-rendered */}
      <Suspense fallback={<Skeleton />}>
        <DynamicContent />  {/* Dynamic - streamed */}
      </Suspense>
    </>
  )
}
```

## Rendering Options Summary
| Option | Value | Behavior |
|--------|-------|----------|
| `dynamic` | `'force-dynamic'` | SSR every request |
| `dynamic` | `'force-static'` | SSG at build |
| `dynamic` | `'auto'` | Auto-detect (default) |
| `revalidate` | `0` | No cache (SSR) |
| `revalidate` | `60` | ISR every 60s |
| `revalidate` | `false` | Never revalidate |
