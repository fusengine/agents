---
name: config
description: astro.config.ts configuration — defineConfig, integrations, vite, server options
when-to-use: configuring Astro project, adding integrations, Vite config
keywords: config, defineConfig, integrations, vite, base, site, server
priority: high
---

# Astro 6 Configuration

## When to Use

- Setting up project-level options
- Adding integrations or adapters
- Configuring Vite or dev server options

## Base Config

```typescript
// astro.config.ts
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
  base: '/',
  output: 'static', // 'static' | 'server' | 'hybrid'
  trailingSlash: 'ignore', // 'always' | 'never' | 'ignore'
});
```

## Common Options

| Option | Type | Description |
|--------|------|-------------|
| `site` | string | Full URL of deployed site |
| `base` | string | Base path (e.g. '/docs') |
| `output` | string | Rendering mode |
| `integrations` | array | Framework + feature integrations |
| `adapter` | object | Server runtime adapter |
| `vite` | object | Vite config passthrough |
| `srcDir` | string | Source directory (default: `./src`) |
| `publicDir` | string | Public assets (default: `./public`) |

## Experimental Astro 6 Features

```typescript
export default defineConfig({
  experimental: {
    rustCompiler: true,     // Rust-based .astro compiler
    routeCaching: true,     // Edge route caching
    queuedRendering: true,  // Limit concurrent renders
  },
});
```

## Vite Passthrough

```typescript
export default defineConfig({
  vite: {
    define: {
      'process.env.MY_VAR': JSON.stringify('value'),
    },
    plugins: [],
  },
});
```
