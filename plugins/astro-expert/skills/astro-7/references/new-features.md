---
name: new-features
description: Astro 6/7 new features — unified dev runtime, stable Fonts API, stable CSP, Live Collections, Cloudflare support, single Rust compiler
when-to-use: learning Astro 6/7 capabilities, upgrading, using new APIs
keywords: fonts, CSP, live collections, cloudflare, dev runtime, rust compiler, strict HTML parsing
priority: medium
---

# Astro 6/7 New Features

## When to Use

- Leveraging new Astro 6 stable features
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

CSP is stable since Astro 6.0 — `experimental.csp` no longer exists, configure it as a top-level option:

```typescript
export default defineConfig({
  csp: true, // Generates nonces automatically
});
```

## Live Content Collections

Fetch real-time external data through the content layer:

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { myLiveLoader } from './loaders/live';

const news = defineCollection({
  loader: myLiveLoader({ url: 'https://api.example.com/news' }),
});
```

## Single Rust Compiler (Astro 7)

Astro 7 removed the Go compiler entirely — the Rust compiler is now the only `.astro` file compiler, no flag needed (`experimental.rustCompiler` no longer exists). It also enforces **strict HTML parsing**: unclosed tags and invalid HTML now raise a build error instead of being silently auto-corrected. Audit existing `.astro` templates for unclosed tags before upgrading.
