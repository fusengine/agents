---
name: tanstack-query
description: TanStack Query integration patterns for data fetching and caching
when-to-use: Implementing data fetching, caching, mutations, optimistic updates
keywords: query, fetch, cache, mutation, prefetch, ensureQueryData
priority: high
requires: loaders.md
related: route-context.md, preloading.md
template: templates/feature-module.md
---

# TanStack Query Integration

> **Full code**: See [templates/feature-module.md](templates/feature-module.md)

## Setup

1. QueryClient in router context
2. `QueryClientProvider` wrapper
3. Query options in separate modules

---

## Query Options Pattern

```typescript
// modules/posts/queries/posts.queries.ts
export const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ['posts', postId],
    queryFn: () => fetchPost(postId),
    staleTime: 5 * 60 * 1000,
  })
```

---

## Loader with ensureQueryData

```typescript
loader: ({ context: { queryClient }, params }) =>
  queryClient.ensureQueryData(postQueryOptions(params.postId))
```

**Advantages**:
- Cached data if present
- Preloading for preload
- Type-safe

---

## In Component

```typescript
// Suspense-enabled (recommended with loader)
const { data } = useSuspenseQuery(postQueryOptions(postId))

// Non-suspense
const { data, isLoading } = useQuery(postQueryOptions(postId))
```

---

## Mutations

```typescript
export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePost,
    onSuccess: (post) => {
      queryClient.setQueryData(['posts', post.id], post)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
```

---

## Optimistic Updates

```typescript
onMutate: async (newData) => {
  await queryClient.cancelQueries({ queryKey })
  const previous = queryClient.getQueryData(queryKey)
  queryClient.setQueryData(queryKey, newData)
  return { previous }
},
onError: (err, vars, context) => {
  queryClient.setQueryData(queryKey, context.previous)
},
```

---

## Query Keys

```text
['posts']                    # All posts
['posts', { page, sort }]    # Posts with filters
['posts', postId]            # One post
['posts', postId, 'comments'] # Post comments
```

---

## Best Practices

| Do ✅ | Don't ❌ |
|-------|---------|
| `queryOptions` factory | Inline query |
| `ensureQueryData` in loader | Fetch in useEffect |
| `useSuspenseQuery` with loader | useQuery without suspense |
| Invalidate after mutation | Forget invalidate |
| Hierarchical keys | Flat keys |
