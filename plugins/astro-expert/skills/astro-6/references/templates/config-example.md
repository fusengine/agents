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

## With Experimental Features

```typescript
import { defineConfig } from 'astro/config';

export default defineConfig({
  experimental: {
    rustCompiler: true,
    csp: true,
    fonts: [],
  },
});
```
