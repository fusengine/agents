---
name: error-handling
description: Error boundaries, not found handling, and error recovery
when-to-use: Handling errors, 404 pages, error recovery, pending states
keywords: error, boundary, notFound, pending, loading, recovery
priority: medium
requires: loaders.md
related: components.md, ssr.md
template: templates/feature-module.md
---

# Error Handling

> **Full code**: See [templates/feature-module.md](templates/feature-module.md)

## Error Components

| Component | Usage |
|-----------|-------|
| `errorComponent` | Loader/component errors |
| `notFoundComponent` | Route/resource not found |
| `pendingComponent` | Loading state |

---

## Error Component

```typescript
errorComponent: ({ error, reset }) => (
  <div>
    <p>{error.message}</p>
    <button onClick={reset}>Retry</button>
  </div>
)
```

---

## Not Found

### Throw notFound

```typescript
loader: async ({ params }) => {
  const post = await fetchPost(params.postId)
  if (!post) throw notFound()
  return { post }
}
```

### Component

```typescript
notFoundComponent: () => <div>Post not found</div>
```

---

## Pending Component

```typescript
pendingComponent: () => <Skeleton />
```

### Timing Configuration

```typescript
createRouter({
  defaultPendingMs: 1000,     // Wait before showing
  defaultPendingMinMs: 500,   // Min display duration
})
```

---

## Global Configuration

```typescript
createRouter({
  defaultErrorComponent: GlobalError,
  defaultNotFoundComponent: GlobalNotFound,
  defaultPendingComponent: GlobalLoading,
})
```

---

## Recovery

| Action | Method |
|--------|--------|
| Retry | `reset()` in errorComponent |
| Navigate | `navigate({ to: '/' })` |
| Invalidate | `router.invalidate()` |

---

## Best Practices

| Do ✅ | Don't ❌ |
|-------|---------|
| `errorComponent` on each route | Skip error handling |
| `notFound()` for 404 | Throw generic Error |
| `pendingMs` to avoid flash | Immediate loading |
| Useful error message | Generic "Error" |
