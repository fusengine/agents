---
name: ssr
description: Server-side rendering with TanStack Router and TanStack Start
when-to-use: Implementing SSR, meta tags, streaming, hydration
keywords: ssr, server, rendering, hydration, meta, head, start
priority: low
requires: loaders.md
related: error-handling.md, typescript.md
template: null
---

# Server-Side Rendering

> **Note**: SSR is optional for TanStack Router. For React SPAs, see [installation.md](installation.md).

## TanStack Start

TanStack Start is the full-stack framework built on TanStack Router for SSR.

| Package | Usage |
|---------|-------|
| `@tanstack/react-start` | SSR Framework |
| `@tanstack/react-router` | Routing (included) |

---

## Key Concepts

### Selective SSR

Enable/disable SSR per route:

| Option | Behavior |
|--------|----------|
| `ssr: true` | SSR for this route |
| `ssr: false` | Client-only (dashboard, etc.) |
| `defaultSsr: true` | Global SSR by default |

**When to use SSR**: SEO-critical pages (landing, blog, products).

---

### Head/Meta Tags

The `head` option allows defining meta tags per route.

| Element | Usage |
|---------|-------|
| `meta` | title, description, og:*, twitter:* |
| `links` | canonical, stylesheet, favicon |
| `scripts` | analytics, tracking |

**Pattern**: Define head in root for global, override in child routes.

---

### Hydration

Dehydrate/hydrate pattern for TanStack Query:

1. **Server**: `dehydrate(queryClient)` after `router.load()`
2. **Client**: `HydrationBoundary` with dehydrated state
3. **Result**: Preloaded data without re-fetch

---

### Streaming SSR

React 18 streaming with `renderToPipeableStream`:

| Callback | Moment |
|----------|--------|
| `onShellReady` | Shell ready, start streaming |
| `onAllReady` | All Suspense resolved |

**Advantage**: Faster TTFB.

---

## TanStack Start vs Manual SSR

| Feature | TanStack Start | Manual SSR |
|---------|---------------|------------|
| Setup | Minimal | Complex |
| Streaming | Built-in | Manual |
| Head Management | Built-in | Manual |
| Build Tooling | Included | Configure yourself |

**Recommendation**: Use TanStack Start for SSR projects.

---

## Best Practices

| Do ✅ | Don't ❌ |
|-------|---------|
| `ssr: true` for SEO-critical | SSR everywhere |
| `head` for meta tags | Forget meta |
| Dehydrate query state | Skip hydration |
| Streaming for TTFB | Blocking render |
| Guard browser APIs | Direct `window` access |
