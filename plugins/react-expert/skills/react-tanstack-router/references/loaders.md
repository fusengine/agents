---
name: loaders
description: Route loaders for data fetching with TanStack Query integration
when-to-use: Fetching data before render, prefetching, handling async data
keywords: loader, data, fetch, prefetch, async, query, ensureQueryData
priority: high
requires: file-based-routing.md
related: tanstack-query.md, error-handling.md, route-context.md
template: templates/feature-module.md
---

# Route Loaders

> **Full code**: See [templates/feature-module.md](templates/feature-module.md)

## Recommended Pattern

Use `queryClient.ensureQueryData` with query options:

```typescript
loader: ({ context: { queryClient }, params }) =>
  queryClient.ensureQueryData(postQueryOptions(params.postId))
```

---

## Loader Parameters

| Parameter | Description |
|-----------|-------------|
| `params` | Route params (`$postId` → `params.postId`) |
| `context` | Router context (queryClient, user, etc.) |
| `abortController` | To cancel requests |
| `deps` | Dependencies declared via `loaderDeps` |

---

## Loader with Search Params

```typescript
loaderDeps: ({ search }) => ({ page: search.page }),
loader: ({ deps }) => fetchPosts({ page: deps.page })
```

**Important**: Use `loaderDeps` to declare dependencies that trigger re-fetch.

---

## Parallel Loading

```typescript
loader: async ({ context: { queryClient } }) => {
  const [posts, categories] = await Promise.all([
    queryClient.ensureQueryData(postsQueryOptions),
    queryClient.ensureQueryData(categoriesQueryOptions),
  ])
  return { posts, categories }
}
```

---

## Cancellation (AbortController)

```typescript
loader: async ({ abortController }) => {
  const res = await fetch(url, { signal: abortController.signal })
  return res.json()
}
```

---

## Accessing Data

| Method | Usage |
|--------|-------|
| `Route.useLoaderData()` | In route component (recommended) |
| `useLoaderData({ from })` | In child component |
| `getRouteApi('/path').useLoaderData()` | In external component |

---

## Stale Time Configuration

```typescript
// Route-level
staleTime: 30_000

// Global
createRouter({ defaultStaleTime: 0 })
```

---

## Best Practices

| Do ✅ | Don't ❌ |
|-------|---------|
| `ensureQueryData` | Direct fetch in loader |
| Separate query options | Inline query config |
| `loaderDeps` for search | Search in loader without deps |
| AbortController | Non-cancellable requests |
| Parallel loading | Unnecessary sequential |
