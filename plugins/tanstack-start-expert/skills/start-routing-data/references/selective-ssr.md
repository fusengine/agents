---
name: selective-ssr
description: Per-route SSR control in Start with the ssr flag (true, false, data-only)
when-to-use: A route needs client-only rendering, data-only SSR, or runtime SSR decisions
keywords: ssr, data-only, selective, defaultSsr, spa-mode, inheritance, shellComponent
priority: high
related: isomorphic-loaders.md
source: https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr
---

# Selective SSR

## Overview

By default, routes matching the initial request are fully server-rendered: `beforeLoad` and `loader` run on the server, and the component HTML is streamed to the client. The per-route `ssr` property lets you opt individual routes out of some or all of that — statically or at runtime.

---

## Key Concepts

| `ssr` value | `beforeLoad` / `loader` on server | Component SSR |
|-------------|-----------------------------------|---------------|
| `true` (default) | Yes | Yes |
| `'data-only'` | Yes (data serialized to client) | **No** (renders on client) |
| `false` | No (runs on client during hydration) | No |

- Set the default with `createStart(() => ({ defaultSsr: false }))` in `src/start.ts`.
- **SPA mode** disables server execution globally; Selective SSR is the per-route tool.

---

## Decision Guide

```
Route needs...?
├── Full SSR (SEO + data) → ssr: true (default, omit it)
├── Data on server but browser-only component → ssr: 'data-only'
├── Entirely client-rendered (canvas, browser API in loader) → ssr: false
└── Depends on params/search at runtime → ssr: ({ params, search }) => ...
```

---

## Core Pattern

```tsx
export const Route = createFileRoute('/posts/$postId')({
  ssr: 'data-only', // beforeLoad + loader on server, component on client
  loader: () => fetchPost(),
  component: PostComponent,
})
```

→ See [selective-ssr-route.md](templates/selective-ssr-route.md) for functional form + shell setup

---

## Common Patterns

### Functional (runtime) form

The `ssr` function runs ONLY on the server during the initial request and is stripped from the client bundle. `params`/`search` arrive post-validation as a discriminated union (`{ status: 'success', value }` or `{ status: 'error', error }`).

### Inheritance (tightening only)

A child inherits its parent's `ssr` and can only make it **more restrictive** (`true → 'data-only' → false`). A child `ssr: true` under a parent `ssr: false` has no effect.

---

## Best Practices

### DO
- Prefer `'data-only'` over `false` when the data can still SSR (keeps SEO + fast data)
- Configure `pendingComponent` — it is the SSR fallback for `false`/`'data-only'` routes
- Use the root `shellComponent` (always SSR'd) when disabling SSR on the root component

### DON'T
- Use `ssr: false` just to avoid a hydration warning — fix the loader instead
- Expect a child to loosen a parent's restriction

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Child `ssr: true` ignored | Parent is more restrictive; inheritance only tightens |
| No fallback flashes on client-only route | Add `pendingComponent` (or `defaultPendingComponent`) |
| Root component uses `window` and crashes SSR | Keep `<html>` in `shellComponent`, set root `ssr: false` |

---

## Related References

- [isomorphic-loaders.md](isomorphic-loaders.md) — the reason browser APIs need `ssr` tuning
