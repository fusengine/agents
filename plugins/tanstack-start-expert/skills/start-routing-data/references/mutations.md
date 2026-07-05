---
name: mutations
description: Mutating data via Start server functions and refreshing loader/Query state
when-to-use: Writing data (create/update/delete) and refreshing the UI after the write
keywords: mutation, createServerFn, useServerFn, router.invalidate, invalidateQueries
priority: medium
requires: query-in-loader.md
source: https://tanstack.com/start/latest/docs/framework/react/guide/server-functions
---

# Mutations in Start

## Overview

Mutations in Start go through **server functions** (`createServerFn({ method: 'POST' })`). After a successful write you refresh the UI by invalidating whatever holds the stale data: `router.invalidate()` for loader data, or `queryClient.invalidateQueries()` for the TanStack Query cache.

> The generic `useMutation` API belongs to react-expert's `react-tanstack-router`. Here we cover the Start-specific server-fn write + invalidation loop.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **`createServerFn({ method: 'POST' })`** | Server-only mutation handler, callable from the client |
| **`.validator(schema)`** | Validates input across the network boundary (Zod recommended) |
| **`useServerFn(fn)`** | Hook to call a server fn from a component with redirect/error handling |
| **`router.invalidate()`** | Re-runs loaders → refetches loader-driven data |
| **`queryClient.invalidateQueries`** | Refetches Query cache entries after the write |

---

## Decision Guide

```
Data was rendered via...?
├── Route loader (Route.useLoaderData) → await mutate(); router.invalidate()
└── TanStack Query (useQuery)          → await mutate(); queryClient.invalidateQueries({ queryKey })
```

---

## Core Pattern

```tsx
const updateCount = createServerFn({ method: 'POST' })
  .validator((d: number) => d)
  .handler(async ({ data }) => writeCount(data))

function Counter() {
  const router = useRouter()
  return <button onClick={() => updateCount({ data: 1 }).then(() => router.invalidate())} />
}
```

→ See [query-loader-route.md](templates/query-loader-route.md) for the Query-cache variant

---

## Best Practices

### DO
- Validate every server-fn input with a schema (`.validator`)
- Invalidate the SAME source that rendered the data (loader vs Query)
- Enforce auth INSIDE the server-fn handler — see the start-auth skill

### DON'T
- Mutate through a `GET` server function (use POST/PUT/DELETE)
- Forget invalidation — the UI keeps showing stale data
- Assume `beforeLoad` protected the write; the endpoint is reachable independently

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| UI stale after write | Call `router.invalidate()` or `invalidateQueries` |
| Type error passing args | Server fns take one arg: `fn({ data })` |
| Unauthorized write succeeds | Add auth middleware to the handler (start-auth) |

---

## Related References

- [query-in-loader.md](query-in-loader.md) — the read side that mutations refresh
