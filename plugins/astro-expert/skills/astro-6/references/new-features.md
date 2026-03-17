---
name: new-features
description: Astro 6 new features — unified dev runtime, Fonts API, CSP, Live Collections, Cloudflare support
when-to-use: learning Astro 6 capabilities, upgrading, using new APIs
keywords: fonts, CSP, live collections, cloudflare, dev runtime, rust compiler
priority: medium
---

# Astro 6 New Features

## When to Use

- Leveraging new Astro 6 stable features
- Setting up font optimization
- Implementing Content Security Policy
- Using Live Content Collections for real-time data

## Unified Dev Runtime

Dev server now uses the exact production runtime (via Vite Environment API).

**Key benefit:** No more "works in dev, breaks in prod" — especially on Cloudflare Workers (uses `workerd` runtime locally).

## Built-in Fonts API

```typescript
// astro.config.ts
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  experimental: {
    fonts: [{
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
    }],
  },
});
```

## Content Security Policy

```typescript
export default defineConfig({
  experimental: {
    csp: true, // Generates nonces automatically
  },
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

## Experimental Rust Compiler

```typescript
export default defineConfig({
  experimental: {
    rustCompiler: true,
  },
});
```
