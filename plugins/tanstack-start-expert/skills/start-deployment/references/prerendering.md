---
name: prerendering
description: Static prerendering in Start via the tanstackStart prerender option
when-to-use: Generating static HTML at build time for performance or static hosting
keywords: prerender, tanstackStart, pages, crawlLinks, autoStaticPathsDiscovery, static
priority: high
related: build-and-adapters.md
source: https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering
---

# Static Prerendering

## Overview

TanStack Start can render routes to static HTML at build time via the `prerender` option on the `tanstackStart` plugin. Use it for performance (serve pre-rendered HTML) or to deploy fully static sites. Paths come from automatic discovery of static routes, merged with an explicit top-level `pages: [{ path }]` list (concrete paths, no globs). There is no `prerender.routes` option — unknown keys are silently dropped by the plugin's schema.

---

## Key Concepts

| Option | Meaning |
|--------|---------|
| **`pages: [{ path }]`** | Top-level `tanstackStart` option: explicit concrete paths to prerender (per-page `prerender` overrides) |
| **`crawlLinks`** | Extract links from rendered HTML and prerender them too (default `true`) |
| **`enabled`** | Master switch — off unless `true`, or unless a `pages[]` entry sets `prerender.enabled: true` |
| **`maxRedirects`** | Max redirects followed per prerender request |
| **`autoStaticPathsDiscovery`** | Auto-collect static routes and merge with `pages` (default `true`) |
| **`filter` / `pages`** | Exclude paths / per-page overrides (e.g. `outputPath`) |

---

## What is excluded from auto-discovery

```
Route type → prerendered by discovery?
├── Static route with a component → yes
├── Param route ($userId)         → no (needs concrete values) *
├── Layout route (_prefixed)      → no (not a standalone page)
└── Component-less (API) route    → no
* still prerendered if linked from another page and crawlLinks is on
```

---

## Core Pattern

```ts
tanstackStart({
  prerender: {
    enabled: true, // required — nothing prerenders without it
    crawlLinks: true,
  },
  pages: [{ path: '/blog' }, { path: '/blog/posts/hello-world' }],
})
```

→ See [vite-config-adapters.md](templates/vite-config-adapters.md) for the full-options form

---

## Best Practices

### DO
- Prerender stable, public routes (marketing, blog, docs)
- Rely on `crawlLinks` to reach dynamic routes linked from static pages
- Use `pages[].prerender.outputPath` when you need `/page.html` instead of `/page/index.html` (or set `autoSubfolderIndex: false`)

### DON'T
- Prerender authenticated or per-user routes (they need runtime SSR)
- Expect `$param` routes to appear without a link + `crawlLinks`, or an explicit `pages[]` entry

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Dynamic route not generated | Add a concrete `pages: [{ path }]` entry or link it with `crawlLinks` on |
| Nothing prerenders | Set `prerender.enabled: true` |
| `prerender.routes` ignored | Not an option — use top-level `pages` |
| Wrong file layout | Toggle `autoSubfolderIndex` / set `outputPath` |

---

## Related References

- [build-and-adapters.md](build-and-adapters.md) — where the plugin config lives
