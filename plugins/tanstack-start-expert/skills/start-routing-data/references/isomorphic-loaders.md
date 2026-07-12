---
name: isomorphic-loaders
description: Why Start route loaders run on both server and client, and how to keep them safe
when-to-use: Loader touches browser-only APIs, hydration mismatch, or deciding where code runs
keywords: loader, isomorphic, ssr, hydration, window, execution-model
priority: high
related: selective-ssr.md, query-in-loader.md
source: https://tanstack.com/start/latest/docs/framework/react/guide/execution-model
---

# Isomorphic Loaders

## Overview

In TanStack Start, `Route.loader` (and `beforeLoad`) are **isomorphic**: they execute on the **server** during the initial SSR request, then on the **client** during subsequent client-side navigations. This is the single biggest difference from a plain SPA loader — the same code path must be valid in both runtimes.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **First request** | Loader runs on the server, result is serialized into the HTML and hydrated |
| **Client navigation** | Same loader runs in the browser — no server round-trip unless it calls a server fn |
| **Server-only work** | Wrap in a server function (`createServerFn`) so it never ships to the client bundle |
| **Browser-only work** | Move to the component (`useEffect`) or set `ssr: false` / `'data-only'` |

---

## Decision Guide

```
Loader needs to touch...?
├── Database / secrets / fs → wrap in createServerFn (runs server-side only)
├── window / localStorage    → do NOT do it in the loader
│   ├── data must still SSR   → ssr: 'data-only' + read browser API in component
│   └── whole route is client → ssr: false
└── plain fetch / pure logic  → fine as-is (runs in both runtimes)
```

---

## Core Pattern

```tsx
// ✅ Isomorphic: runs on server (initial) AND client (navigation)
export const Route = createFileRoute('/products')({
  loader: async () => {
    const res = await fetch('/api/products')
    return res.json()
  },
})
```

→ See [query-loader-route.md](templates/query-loader-route.md) for the Query-integrated version

---

## Best Practices

### DO
- Treat every loader as if it runs on a server (because it does, on first paint)
- Push privileged work (DB, env, secrets) into `createServerFn` handlers
- Keep loaders pure and serializable-returning

### DON'T
- Reference `window`, `document`, or `localStorage` at loader top level
- Assume the loader is client-only — that assumption breaks SSR
- Import server-only modules directly in a route file (leaks to the client bundle)

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `localStorage.getItem()` in loader → SSR crash | Read it in `useEffect`, gate route with `ssr: false`/`'data-only'` |
| Direct DB import in route file | Move to `*.functions.ts` via `createServerFn` |
| Non-serializable loader return | Return plain JSON-serializable data (or a `Response`) |

---

## Related References

- [selective-ssr.md](selective-ssr.md) — control where the loader and component render
- [query-in-loader.md](query-in-loader.md) — isomorphic prefetch with TanStack Query
