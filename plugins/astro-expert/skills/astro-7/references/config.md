---
name: config
description: astro.config.ts configuration — defineConfig, integrations, vite, server options
when-to-use: configuring Astro project, adding integrations, Vite config
keywords: config, defineConfig, integrations, vite, base, site, server
priority: high
---

# Astro 7 Configuration

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
  output: 'static', // 'static' | 'server' (no 'hybrid' — use per-route prerender)
  trailingSlash: 'ignore', // 'always' | 'never' | 'ignore'
  compressHTML: 'jsx', // default in Astro 7 — JSX-style whitespace stripping
});
```

## Common Options

| Option | Type | Description |
|--------|------|-------------|
| `site` | string | Full URL of deployed site |
| `base` | string | Base path (e.g. '/docs') |
| `output` | string | Rendering mode |
| `compressHTML` | `boolean \| 'jsx'` | HTML whitespace compression; defaults to `'jsx'` in Astro 7 |
| `integrations` | array | Framework + feature integrations |
| `adapter` | object | Server runtime adapter |
| `vite` | object | Vite config passthrough (Vite 8) |
| `srcDir` | string | Source directory (default: `./src`) |
| `session` | `object \| false` | Session driver config; `false` opts out entirely (7.2+) — runtime tree-shaken, adapters skip their default driver |
| `logger.entrypoint` | `URL \| string` | Custom logger module (option since 7.0; URL form 7.1+, relative string 7.2+) |
| `fetchFile` | `string \| null` | Advanced Routing entrypoint (default `src/fetch.ts`); `null` disables it |
| `cache` / `routeRules` | object | Stable route caching (7.0), e.g. `cache: { provider: memoryCache() }` |
| `publicDir` | string | Public assets (default: `./public`) |

## Removed Experimental Flags (Astro 7)

Astro 7 removed the following `experimental.*` flags — they no longer exist under `experimental` and will error if set there: `logger`, `queuedRendering`, `rustCompiler`, `advancedRouting`, `cache`, `routeRules`.

- `rustCompiler` / `queuedRendering` / `logger` / `advancedRouting` — fully stabilized as default behavior, no replacement flag or key needed.
- `cache` / `routeRules` — **not removed, stabilized**: `experimental.cache` and `experimental.routeRules` were replaced by top-level `cache` and `routeRules` config keys. Use `cache: {...}` / `routeRules: {...}` directly on `defineConfig`, not nested under `experimental`.

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
