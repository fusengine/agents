---
name: loading-patterns
description: Loading states with loading.tsx, Suspense, and streaming
when-to-use: showing loading UI, streaming content, parallel loading
keywords: loading.tsx, Suspense, streaming, skeleton, useTransition
priority: medium
requires: app-router.md, streaming.md
related: streaming.md, error-handling.md
---

# Loading Patterns

## When to Use

- Route-level loading states
- Component-level streaming
- Parallel data loading
- Client-side transitions

## Why Suspense Streaming

| Feature | Benefit |
|---------|---------|
| Instant shell | loading.tsx shows first |
| Streaming | Progressive content |
| Parallel | Multiple suspense bounds |
| Graceful | No blocking |

## loading.tsx (Instant Loading UI)
```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
    </div>
  )
}
```

## Suspense Boundaries
```typescript
import { Suspense } from 'react'

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<p>Loading stats...</p>}>
        <Stats />
      </Suspense>
      <Suspense fallback={<p>Loading chart...</p>}>
        <Chart />
      </Suspense>
    </div>
  )
}

async function Stats() {
  const stats = await fetchStats()
  return <div>{stats.total}</div>
}
```

## Streaming
```typescript
export default function Page() {
  return (
    <div>
      <Header />  {/* Immediate */}
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />  {/* Streams when ready */}
      </Suspense>
      <Footer />  {/* Immediate */}
    </div>
  )
}
```

## Parallel Loading
```typescript
export default async function Page() {
  const statsPromise = fetchStats()
  const chartPromise = fetchChart()

  return (
    <div>
      <Suspense fallback={<Skeleton />}><Stats promise={statsPromise} /></Suspense>
      <Suspense fallback={<Skeleton />}><Chart promise={chartPromise} /></Suspense>
    </div>
  )
}
```

## useTransition (Client)
```typescript
'use client'
import { useTransition } from 'react'

export function Button({ action }) {
  const [isPending, startTransition] = useTransition()
  return (
    <button onClick={() => startTransition(action)} disabled={isPending}>
      {isPending ? 'Loading...' : 'Submit'}
    </button>
  )
}
```
