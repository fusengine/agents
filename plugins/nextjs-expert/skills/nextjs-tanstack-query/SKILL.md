---
name: nextjs-tanstack-query
description: Use when implementing client-side data fetching, server prefetching with hydration, or optimistic mutations in Next.js 16 with TanStack Query.
versions:
  tanstack-query: 5
  nextjs: 16
  react: 19
user-invocable: true
references: references/query-patterns.md, references/hydration.md
related-skills: nextjs-16, nextjs-server-components, react-19
---

<objective>
Implements TanStack Query v5 server-state management in Next.js 16: creating one `QueryClient` per request in a Server Component and sharing it via context, `prefetchQuery` for SSR data with `HydrationBoundary` to transfer the server cache to the client, and optimistic mutations with rollback on error.

Covers serializable query keys, `staleTime` tuning on prefetched queries to avoid immediate refetch, cache invalidation with `invalidateQueries` after writes, infinite scrolling/pagination, and DevTools setup gated to development only. Does not cover the Server Component boundary itself (nextjs-server-components) or core Next.js caching primitives like `use cache` (nextjs-16) — this skill is specifically about TanStack Query's client-side cache layer.
</objective>

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
