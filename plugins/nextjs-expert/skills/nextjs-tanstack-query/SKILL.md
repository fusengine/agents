---
name: nextjs-tanstack-query
description: TanStack Query v5 integration with Next.js 16. Server-side prefetching, hydration, useQuery, useMutation, cache management.
versions:
  tanstack-query: 5
  nextjs: 16
  react: 19
user-invocable: true
references: references/query-patterns.md, references/hydration.md
related-skills: nextjs-16, nextjs-server-components, react-19
---

# TanStack Query for Next.js

TanStack Query v5 provides powerful server state management with Next.js 16 integration.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing data fetching patterns
2. **fuse-ai-pilot:research-expert** - Verify latest TanStack Query v5 docs
3. **mcp__context7__query-docs** - Check TanStack Query + Next.js patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Client-side data fetching with caching and revalidation
- Server-side prefetching with hydration to client
- Optimistic updates for mutations
- Infinite scrolling and pagination
- Real-time data synchronization

### Why TanStack Query

| Feature | Benefit |
|---------|---------|
| Server prefetching | Data ready on first render, no loading flash |
| Automatic caching | Deduplication, stale-while-revalidate |
| Mutations | Optimistic updates, rollback on error |
| DevTools | Visual cache inspection |
| TypeScript-first | Full type inference |

---

## Critical Rules

1. **One QueryClient per request** - Create in Server Component, share via context
2. **Prefetch in Server Components** - Use `prefetchQuery` for SSR data
3. **HydrationBoundary required** - Wrap client tree to transfer server cache
4. **Query keys must be serializable** - Arrays of strings/numbers only
5. **`staleTime` on prefetched queries** - Prevent immediate refetch on mount
6. **Never use `queryClient` in Client Components directly** - Use hooks

---

## Installation

```bash
bun add @tanstack/react-query @tanstack/react-query-devtools
```

---

## Best Practices

1. **Prefetch on server** - Avoid loading states for critical data
2. **Set `staleTime`** - Prevent unnecessary refetches after hydration
3. **Collocate query keys** - Define keys near their usage
4. **Invalidate on mutation** - Use `invalidateQueries` after writes
5. **Error boundaries** - Use `throwOnError` for critical queries
6. **DevTools in dev only** - Wrap in `process.env.NODE_ENV` check

---

## Reference Guide

| Need | Reference |
|------|-----------|
| useQuery, useMutation | [query-patterns.md](references/query-patterns.md) |
| Server prefetching | [hydration.md](references/hydration.md) |
| QueryClient setup | [hydration.md](references/hydration.md) |
| Cache invalidation | [query-patterns.md](references/query-patterns.md) |
