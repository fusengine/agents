---
name: hydration
description: dehydrate/hydrate, HydrationBoundary, server-side prefetching with TanStack Query v5
when-to-use: Prefetching data in Server Components, transferring cache to client
keywords: dehydrate, hydrate, HydrationBoundary, prefetchQuery, QueryClient, SSR
priority: high
requires: null
related: query-patterns.md
---

# Hydration & Server Prefetching

## Provider Setup

```tsx
// modules/cores/providers/query-provider.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react'

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
```

## Root Layout Integration

```tsx
// app/layout.tsx
import { QueryProvider } from '@/modules/cores/providers/query-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
```

## Server-Side Prefetching

```tsx
// app/users/page.tsx — Server Component
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { UserList } from './UserList'

export default async function UsersPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: () => fetch('https://api.example.com/users').then((r) => r.json()),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserList />
    </HydrationBoundary>
  )
}
```

## Multiple Prefetches

Use `Promise.all()` with multiple `prefetchQuery` calls on the same `queryClient`, then wrap in a single `HydrationBoundary`.

## Key Principles

1. **New QueryClient per request** — Never share across requests on the server
2. **`staleTime > 0`** — Prevents immediate refetch after hydration
3. **Same query keys** — Server prefetch keys must match client `useQuery` keys
4. **`dehydrate` serializes** — Converts cache to transferable JSON state
5. **`HydrationBoundary`** — Injects dehydrated state into client QueryClient
6. **Parallel prefetching** — Use `Promise.all()` for independent queries
