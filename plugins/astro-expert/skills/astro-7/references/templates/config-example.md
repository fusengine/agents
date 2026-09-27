---
name: config-example
description: astro.config.ts examples for static, server, and hybrid (per-route prerender) setups with adapters
when-to-use: configuring Astro output mode with adapter
keywords: config, adapter, node, cloudflare, vercel, netlify, hybrid
---

# Astro 7 Config Examples

## Static (Default)

```typescript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
  output: 'static',
});
```

## Server Mode (Node.js)

```typescript
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
});
```

## Hybrid (Cloudflare)

There is no `output: 'hybrid'` — keep `output: 'static'` (default) and opt routes into on-demand rendering with `export const prerender = false`.

```typescript
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare'; // v14+ for Astro 7
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  integrations: [react()],
});
```

## Stable Fonts + CSP (Astro 7)

`fonts` (top-level) and `security.csp` are stable — no `experimental` wrapper. The Rust compiler is now the only compiler and needs no flag.

```typescript
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  security: { csp: true },
  fonts: [{
    provider: fontProviders.google(),
    name: 'Inter',
    cssVariable: '--font-inter',
  }],
  compressHTML: 'jsx', // default in Astro 7
});
```
