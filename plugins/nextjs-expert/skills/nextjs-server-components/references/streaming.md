---
name: streaming
description: Suspense boundaries, loading.tsx, streaming SSR, progressive rendering in Next.js 16
when-to-use: Implementing loading states, progressive rendering, streaming data-heavy pages
keywords: suspense, streaming, loading, progressive rendering, skeleton
priority: high
requires: null
related: rsc-patterns.md
---

# Streaming & Suspense

## How Streaming Works

Next.js sends HTML progressively as Server Components resolve. Suspense boundaries define where to show fallbacks while data loads.

## loading.tsx Convention

```tsx
// app/dashboard/loading.tsx
import { Skeleton } from '@/modules/cores/shadcn/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}
```

Next.js automatically wraps `page.tsx` in a Suspense boundary with `loading.tsx` as fallback.

## Manual Suspense Boundaries

```tsx
import { Suspense } from 'react'
import { UserProfile } from './UserProfile'
import { RecentActivity } from './RecentActivity'
import { Skeleton } from '@/modules/cores/shadcn/components/ui/skeleton'

export default function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Suspense fallback={<Skeleton className="h-48" />}>
        <UserProfile />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-48" />}>
        <RecentActivity />
      </Suspense>
    </div>
  )
}
```

Both components stream independently — whichever resolves first renders first.

## Nested Suspense

Nest Suspense boundaries for progressive reveal: outer shell renders first, then inner content streams in as each resolves. Pattern: `<Suspense> <Header /> <Suspense> <Content /> <Suspense> <Comments /> </Suspense> </Suspense> </Suspense>`.

## Streaming with `use cache`

```tsx
'use cache'

import { cacheLife } from 'next/cache'

export async function CachedStats() {
  cacheLife('hours')
  const stats = await fetchStats()
  return <StatsDisplay data={stats} />
}
```

Cached components resolve instantly on subsequent requests.

## Error Handling

Add `error.tsx` (Client Component) alongside `loading.tsx` to catch errors within streamed segments. It receives `error` and `reset` props.

## Best Practices

1. **Granular Suspense** — Wrap each slow component, not the entire page
2. **Meaningful fallbacks** — Use Skeleton components matching final layout
3. **Independent streams** — Separate data sources into separate components
4. **Error boundaries** — Add `error.tsx` alongside `loading.tsx`
5. **Avoid waterfalls** — Use parallel fetching with `Promise.all()`
6. **Cache hot paths** — Use `use cache` for frequently accessed data
