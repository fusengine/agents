---
name: query-loader-route
description: Complete Start route that prefetches with TanStack Query in the loader and reads it in the component
keywords: queryOptions, ensureQueryData, useQuery, router-context, queryClient, invalidate
source: https://tanstack.com/start/latest/docs/framework/react/comparison
---

# Query-Integrated Loader Route

## Overview

A production-ready wiring of TanStack Query into TanStack Start: the `QueryClient` lives in router context, the loader prefetches with `ensureQueryData`, and the component reads the warm cache with `useQuery`. Mutations invalidate the cache.

---

## Prerequisites

- `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/react-query` installed
- A TanStack Start app scaffolded (`src/router.tsx`, `src/routes/`)

---

## File: src/queries/posts.ts

```ts
/**
 * Shared queryOptions factories — the single source of truth for query keys.
 * Imported by BOTH the route loader (ensureQueryData) and the component (useQuery)
 * so the SSR-primed cache is reused on hydration instead of refetched.
 */
import { queryOptions } from '@tanstack/react-query'
import { getPost, listPosts } from '~/queries/posts.functions'

export const postsQueryOptions = () =>
  queryOptions({ queryKey: ['posts'], queryFn: () => listPosts() })

export const postQueryOptions = (postId: string) =>
  queryOptions({ queryKey: ['post', postId], queryFn: () => getPost({ data: { postId } }) })
```

---

## File: src/queries/posts.functions.ts

```ts
/**
 * Server functions: the isomorphic-safe data source. Their bodies run only on
 * the server; the client gets an RPC stub. Safe to import from client code.
 */
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '~/db'

export const listPosts = createServerFn({ method: 'GET' }).handler(async () => {
  return db.posts.findMany()
})

export const getPost = createServerFn({ method: 'GET' })
  .validator(z.object({ postId: z.string() }))
  .handler(async ({ data }) => {
    return db.posts.findById(data.postId)
  })
```

---

## File: src/router.tsx

```tsx
/**
 * Register the QueryClient in router context so loaders can call
 * context.queryClient.ensureQueryData(...).
 */
import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function createAppRouter() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000 } },
  })

  return createRouter({
    routeTree,
    context: { queryClient }, // available as context in every loader/beforeLoad
    defaultPreload: 'intent',
  })
}
```

---

## File: src/routes/posts.$postId.tsx

```tsx
/**
 * Loader prefetches on the server (isomorphic — also runs on client navigation).
 * Component reads the already-cached data; no client-side waterfall.
 */
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { postQueryOptions } from '~/queries/posts'
import { deletePost } from '~/queries/posts.functions'

export const Route = createFileRoute('/posts/$postId')({
  // ensureQueryData fetches only if the key is not already cached, then
  // returns the promise Start awaits before rendering.
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(postQueryOptions(params.postId)),
  component: PostPage,
})

function PostPage() {
  const { postId } = Route.useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: post } = useQuery(postQueryOptions(postId))

  async function onDelete() {
    await deletePost({ data: { postId } })
    // Refresh both sources: Query cache and loader-driven routes.
    await queryClient.invalidateQueries({ queryKey: ['post', postId] })
    await router.invalidate()
  }

  return (
    <article>
      <h1>{post?.title}</h1>
      <button type="button" onClick={onDelete}>Delete</button>
    </article>
  )
}
```

---

## Notes

- `context.queryClient` MUST be the same client passed to `createRouter` and the app provider — never `new QueryClient()` inside a loader.
- Identical `queryKey` in loader and component is what makes hydration reuse the data.
- For SSR hydration of the Query cache, wire the standard Start + Query SSR integration (dehydrate/hydrate) in your root route.
