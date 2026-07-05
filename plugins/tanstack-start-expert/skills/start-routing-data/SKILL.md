---
name: start-routing-data
description: "Use when: loading data in TanStack Start routes with isomorphic loaders, wiring TanStack Query into a Start loader (ensureQueryData), running mutations via server functions, or tuning per-route SSR (ssr flag). Do NOT use for: generic TanStack Router/Query API — route trees, search params, useQuery/useMutation basics (use react-expert's react-tanstack-router)."
versions:
  "@tanstack/react-start": "^1"
  "@tanstack/react-router": "^1"
  "@tanstack/react-query": "^5"
user-invocable: false
references: references/isomorphic-loaders.md, references/query-in-loader.md, references/selective-ssr.md, references/mutations.md, references/templates/query-loader-route.md, references/templates/selective-ssr-route.md
related-skills: react-tanstack-router, nextjs-tanstack-query
---

# TanStack Start — Routing Data

## Agent Workflow (MANDATORY)

Before ANY implementation, spawn in parallel:

1. **fuse-ai-pilot:explore-codebase** — map `src/routes/`, existing loaders, `router.tsx`, queryClient wiring
2. **fuse-ai-pilot:research-expert** — verify Start API via Context7 `/websites/tanstack_start_framework_react`
3. **mcp__context7__query-docs** — confirm loader / ssr / ensureQueryData signatures

After implementation, run **fuse-ai-pilot:sniper**.

---

## Scope Boundary (READ FIRST)

Generic TanStack Router and TanStack Query — route trees, file-based routing, search-param validation, `useQuery`/`useMutation` mechanics, cache config — are covered by **react-expert's `react-tanstack-router`**. This skill covers ONLY what is **specific to Start**:

- Loaders are **isomorphic** (server on first request, client on navigation)
- `context.queryClient.ensureQueryData()` inside a loader (SSR prefetch + hydration)
- Per-route `ssr: true | false | 'data-only'`
- Mutations through **server functions** + `router.invalidate()`

---

## Overview

| Start-specific feature | Description |
|------------------------|-------------|
| **Isomorphic loader** | `Route.loader` runs on server (initial) AND client (navigation) — no `window` at top level |
| **Query in loader** | `ensureQueryData(queryOptions)` prefetches on server, `useQuery` reads cache in component |
| **Selective SSR** | `ssr` flag per route: full SSR, data-only, or client-only |
| **Server-fn mutation** | Call `createServerFn` handler, then `router.invalidate()` to refetch loaders |

---

## Critical Rules

1. **Loaders are isomorphic** — never touch `window`/`localStorage` at loader top level; gate with `ssr: false`/`'data-only'` or `useEffect`.
2. **Share `queryOptions`** — define once, pass to BOTH `ensureQueryData` (loader) and `useQuery` (component) so the cache key matches.
3. **Prefetch via `context.queryClient`** — the loader receives `queryClient` from router context; do not create a new client.
4. **Mutations invalidate** — after a server-fn write, call `router.invalidate()` (loader data) or `queryClient.invalidateQueries` (Query cache).
5. **`ssr` inherits down and only tightens** — a child cannot loosen a parent's `ssr: false` back to `true`.

---

## Architecture

```
src/
├── router.tsx              # createRouter({ context: { queryClient } })
├── routes/
│   └── posts.$postId.tsx   # loader: ensureQueryData + component: useQuery
└── queries/
    └── posts.ts            # queryOptions factory (shared loader + component)
```

→ See [query-loader-route.md](references/templates/query-loader-route.md) for the complete route

---

## Reference Guide

### Concepts

| Topic | Reference | Load when |
|-------|-----------|-----------|
| **Isomorphic loaders** | [isomorphic-loaders.md](references/isomorphic-loaders.md) | Loader touches browser API or you see hydration mismatch |
| **Query in loader** | [query-in-loader.md](references/query-in-loader.md) | Integrating TanStack Query prefetch with a Start loader |
| **Selective SSR** | [selective-ssr.md](references/selective-ssr.md) | Disabling/tuning SSR per route |
| **Mutations** | [mutations.md](references/mutations.md) | Writing data via server functions and refreshing the UI |

### Templates

| Template | When to Use |
|----------|-------------|
| [query-loader-route.md](references/templates/query-loader-route.md) | Route that prefetches with Query and reads in the component |
| [selective-ssr-route.md](references/templates/selective-ssr-route.md) | Route needing client-only render or data-only SSR |

---

## Best Practices

### DO
- Keep `queryOptions` factories in `src/queries/` and reuse them loader + component
- Return the `ensureQueryData` promise directly from the loader (Start awaits it)
- Use `ssr: 'data-only'` when the component needs `window` but the data should still SSR

### DON'T
- Duplicate query keys between loader and component (breaks hydration dedupe)
- Read `localStorage`/`window` at loader top level (loader also runs on the server)
- Re-fetch in `useEffect` when the loader already primed the cache
