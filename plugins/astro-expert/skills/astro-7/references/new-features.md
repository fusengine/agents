---
name: new-features
description: Astro 6/7 new features — unified dev runtime, stable Fonts API, stable CSP, Live Collections, Cloudflare support, single Rust compiler
when-to-use: learning Astro 6/7 capabilities, upgrading, using new APIs
keywords: fonts, CSP, live collections, cloudflare, dev runtime, rust compiler, strict HTML parsing
priority: medium
---

# Astro 6/7 New Features

## When to Use

- Leveraging Astro 6/7 stable features (7.1–7.3 additions at the end)
- Setting up font optimization
- Implementing Content Security Policy
- Using Live Content Collections for real-time data

## Unified Dev Runtime

Dev server now uses the exact production runtime (via Vite Environment API).

**Key benefit:** No more "works in dev, breaks in prod" — especially on Cloudflare Workers (uses `workerd` runtime locally).

## Built-in Fonts API (stable)

The Fonts API is stable since Astro 6.0 — `experimental.fonts` no longer exists, configure it as a top-level option:

```typescript
// astro.config.ts
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  fonts: [{
    provider: fontProviders.google(),
    name: 'Inter',
    cssVariable: '--font-inter',
  }],
});
```

## Content Security Policy (stable)

CSP is stable since Astro 6.0 — `experimental.csp` no longer exists, configure it under `security.csp`:

```typescript
export default defineConfig({
  security: {
    csp: true, // Hash-based: auto-hashes bundled scripts/styles (SHA-256 default)
  },
});
```

## Live Content Collections

Fetch real-time external data at request time (adapter required). Live collections live in `src/live.config.ts` (not `content.config.ts`) and use `defineLiveCollection()`:

```typescript
// src/live.config.ts
import { defineLiveCollection } from 'astro:content';
import { myLiveLoader } from './loaders/live';

const news = defineLiveCollection({
  loader: myLiveLoader({ url: 'https://api.example.com/news' }),
});

export const collections = { news };
```

Query with `getLiveCollection()` / `getLiveEntry()`.

## Single Rust Compiler (Astro 7)

Astro 7 removed the Go compiler entirely — the Rust compiler is now the only `.astro` file compiler, no flag needed (`experimental.rustCompiler` no longer exists). It also enforces **strict HTML parsing**: unclosed tags and invalid HTML now raise a build error instead of being silently auto-corrected. Audit existing `.astro` templates for unclosed tags before upgrading.

## Astro 7.1 – 7.3 Additions

| Version | Feature | Usage |
|---------|---------|-------|
| 7.1 | Fine-grained CSP directives | `kind: 'element' \| 'attribute'` on CSP hashes/resources → `script-src-elem`, `script-src-attr`, `style-src-elem`, `style-src-attr` |
| 7.1 | Pagination URL control | `paginate(items, { pageSize, format: (url) => url + '.html' })` |
| 7.1 | Multiple dev servers | `astro dev --ignore-lock` (bypasses the dev lockfile) |
| 7.1 | Lower sync memory | `glob({ ..., deferRender: true })` renders entries on demand |
| 7.1 | Logger entrypoint as URL (option exists since 7.0) | `logger: { entrypoint: new URL('./src/custom-logger.js', import.meta.url) }` + `AstroRuntimeLogger` type |
| 7.2 | Opt out of sessions | `session: false` — session runtime removed from the SSR bundle |
| 7.2 | Background preview | `astro preview --background`, then `astro preview status \| logs \| stop` |
| 7.2 | Relative logger entrypoint | `logger: { entrypoint: './src/custom-logger.js' }` |
| 7.3 | Multiple preview servers | `astro preview --ignore-lock` |
| 7.3 | Logger in extension points | Custom image services (`transform(..., logger)`) and cache providers (`onRequest({ logger }, next)`) receive Astro's logger |

Experimental (opt-in, not stable): `experimental.collectionStorage: 'chunked'` (7.1) and `experimental.incrementalBuild` + per-path `cacheKey` in `getStaticPaths()` (7.2).
