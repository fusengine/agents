---
name: config-example
description: astro.config.ts examples for static, server, and hybrid modes with adapters
when-to-use: configuring Astro output mode with adapter
keywords: config, adapter, node, cloudflare, vercel, netlify, hybrid
---

# Astro 6 Config Examples

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

## Hybrid Mode (Cloudflare)

```typescript
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';

export default defineConfig({
  output: 'hybrid',
  adapter: cloudflare({ mode: 'directory' }),
  integrations: [react()],
});
```

## Stable Fonts + CSP (Astro 7)

`fonts` and `csp` are stable top-level options — no `experimental` wrapper. The Rust compiler is now the only compiler and needs no flag.

```typescript
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  csp: true,
  fonts: [{
    provider: fontProviders.google(),
    name: 'Inter',
    cssVariable: '--font-inter',
  }],
  compressHTML: 'jsx', // default in Astro 7
});
```
