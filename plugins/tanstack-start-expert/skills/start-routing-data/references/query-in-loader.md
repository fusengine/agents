---
name: query-in-loader
description: Prefetch TanStack Query data inside a Start loader with ensureQueryData
when-to-use: Integrating TanStack Query with Start SSR so components hydrate from a warm cache
keywords: queryOptions, ensureQueryData, queryClient, useQuery, prefetch, hydration
priority: high
requires: isomorphic-loaders.md
related: mutations.md
source: https://tanstack.com/start/latest/docs/framework/react/comparison
---

# TanStack Query in a Start Loader

## Overview

The Start-specific pattern is to **prefetch on the server inside the loader** and **read the cache in the component**. The loader calls `context.queryClient.ensureQueryData(queryOptions)`; the component calls `useQuery(queryOptions)` with the SAME options object. On first paint the data is already in the cache (SSR-serialized), so the component renders instantly with no client fetch.

> Generic `useQuery`/`useMutation`/cache config is covered by react-expert's `react-tanstack-router`. This reference is only about the loader ↔ Query bridge.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **`queryOptions` factory** | Single source of truth for `queryKey` + `queryFn`, reused loader + component |
| **`context.queryClient`** | The router-context QueryClient — never construct a new one in the loader |
| **`ensureQueryData`** | Fetches only if not cached; returns the promise the loader awaits |
| **Cache-key match** | Loader and component MUST use identical `queryKey` or hydration dedupe fails |

---

## Core Pattern

```tsx
const postQueryOptions = (postId: string) =>
  queryOptions({ queryKey: ['post', postId], queryFn: () => fetchPost(postId) })

export const Route = createFileRoute('/posts/$postId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(postQueryOptions(params.postId)),
})

function Post() {
  const { postId } = Route.useParams()
  const { data } = useQuery(postQueryOptions(postId)) // reads warm cache
}
```

→ See [query-loader-route.md](templates/query-loader-route.md) for router setup + full route

---

## When to Use

| Scenario | Approach |
|----------|----------|
| Data must SSR and be interactive | `ensureQueryData` in loader + `useQuery` in component |
| Data should block navigation | `await` the `ensureQueryData` promise (default) |
| Data may load after paint | Return without `await` (deferred) or use `usePrefetchQuery` in component |

---

## Best Practices

### DO
- Register `queryClient` in router context (`createRouter({ context: { queryClient } })`)
- Export `queryOptions` factories from `src/queries/` and import in both places
- Let the loader return the `ensureQueryData` promise directly

### DON'T
- Call `new QueryClient()` inside a loader — use `context.queryClient`
- Diverge query keys between loader and component
- Duplicate the fetch in a component `useEffect`

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Component refetches on mount despite SSR | Same `queryOptions` object/key in loader and `useQuery` |
| `context.queryClient` is undefined | Pass `queryClient` into `createRouter({ context })` and the provider |

---

## Related References

- [mutations.md](mutations.md) — invalidate the cache after a write
- [isomorphic-loaders.md](isomorphic-loaders.md) — why the loader also runs server-side
