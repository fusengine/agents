---
name: resource-loading
description: React 19 Resource Preloading APIs - preload, preinit, prefetchDNS, preconnect
when-to-use: performance optimization, resource hints, font loading, script preloading
keywords: preload, preinit, prefetchDNS, preconnect, preloadModule, preinitModule
priority: medium
related: document-metadata.md, templates/resource-loading.md
---

# Resource Preloading APIs (React 19)

## New APIs

React 19 adds APIs to optimize resource loading.

---

## Available Functions

| API | Purpose |
|-----|---------|
| `prefetchDNS(href)` | Pre-resolve DNS for a domain |
| `preconnect(href)` | Establish connection to server |
| `preload(href, options)` | Download resource (font, image, CSS) |
| `preloadModule(href)` | Download ESM module |
| `preinit(href, options)` | Download AND execute script/CSS |
| `preinitModule(href)` | Download AND execute ESM module |

---

## Import Location

All functions from `react-dom`:

```
import { preload, preinit, prefetchDNS, preconnect } from 'react-dom'
```

---

## When to Use

### prefetchDNS

- Third-party domains you'll fetch from later
- CDN domains

### preconnect

- API servers
- CDN with multiple resources

### preload

- Critical fonts
- Hero images
- CSS needed immediately

### preinit

- Scripts that must execute early
- Critical CSS

---

## Options Parameter

| Option | Used By | Values |
|--------|---------|--------|
| `as` | preload, preinit | 'font', 'image', 'style', 'script' |
| `crossOrigin` | All | 'anonymous', 'use-credentials' |
| `fetchPriority` | preload | 'high', 'low', 'auto' |
| `nonce` | preinit | CSP nonce string |

---

## Key Points

- Call early in component lifecycle
- Works with SSR (injects hints in HTML)
- Automatic deduplication
- No effect if resource already loaded

---

## Where to Find Code Templates?

→ `templates/resource-loading.md` - Full examples
