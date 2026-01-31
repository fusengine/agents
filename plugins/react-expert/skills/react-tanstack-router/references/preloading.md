---
name: preloading
description: Route preloading strategies for better UX
when-to-use: Optimizing navigation speed, prefetching data, improving UX
keywords: preload, prefetch, intent, render, hover, performance
priority: medium
requires: loaders.md
related: code-splitting.md, navigation.md
template: templates/feature-module.md
---

# Preloading

> **Full code**: See [templates/feature-module.md](templates/feature-module.md)

## Strategies

| Strategy | Trigger | Usage |
|----------|---------|-------|
| `intent` | Hover/focus | Default, normal links |
| `render` | Immediate | Critical navigation |
| `false` | Never | Secondary links |

---

## Link Preloading

```typescript
<Link to="/posts/$postId" params={{ postId }} preload="intent">
```

---

## Global Configuration

```typescript
createRouter({
  defaultPreload: 'intent',
  defaultPreloadDelay: 50,
  defaultPreloadStaleTime: 30_000,
})
```

| Option | Description |
|--------|-------------|
| `defaultPreloadDelay` | Delay before preload (ms) |
| `defaultPreloadStaleTime` | Preloaded data validity duration |

---

## Programmatic Preload

```typescript
const router = useRouter()

router.preloadRoute({
  to: '/posts/$postId',
  params: { postId },
})
```

---

## With TanStack Query

Prefetch in loader:

```typescript
loader: async ({ context: { queryClient } }) => {
  const posts = await queryClient.ensureQueryData(postsQueryOptions)

  // Prefetch first posts
  posts.slice(0, 5).forEach((post) =>
    queryClient.prefetchQuery(postQueryOptions(post.id))
  )
}
```

---

## Best Practices

| Do ✅ | Don't ❌ |
|-------|---------|
| `intent` for normal links | Skip preload |
| `render` for critical nav | `render` everywhere |
| `preloadDelay` to avoid spam | Immediate preload |
| Limit prefetch (5-10) | Prefetch everything |
