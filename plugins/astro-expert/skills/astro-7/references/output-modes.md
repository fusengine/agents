---
name: output-modes
description: Astro 7 output modes — static, server, and hybrid rendering via per-route prerender — and when to use each
when-to-use: configuring project output, choosing rendering strategy
keywords: output, static, server, hybrid, prerender, SSR, SSG
priority: high
---

# Astro 7 Output Modes

## When to Use

- Choosing between static site generation and server rendering
- Mixing prerendered and on-demand routes
- Adding a server adapter for SSR

## Modes

| Mode | Config | Behavior |
|------|--------|----------|
| `static` | Default | All pages prerendered at build time |
| `server` | `output: 'server'` | All pages rendered on demand |
| Hybrid | `output: 'static'` + adapter | Static by default, opt-in to on-demand per route with `prerender = false` |

`output` only accepts `'static' | 'server'` — the former `'hybrid'` value was merged into `'static'` (Astro 5) and is invalid in Astro 7.

## Configuration

```typescript
// astro.config.ts
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server', // or 'static' (default) + per-route prerender = false
  adapter: node({ mode: 'standalone' }),
});
```

## Per-Route Overrides

```astro
---
// In 'server' mode — this route is static
export const prerender = true;
---

---
// In 'static' mode (with an adapter) — this route is rendered on demand
export const prerender = false;
---
```

## Adapter Options

| Adapter | Package |
|---------|---------|
| Node.js | `@astrojs/node` |
| Cloudflare | `@astrojs/cloudflare` |
| Netlify | `@astrojs/netlify` |
| Vercel | `@astrojs/vercel` |

## `public/` Behavior

Files in `public/` are copied verbatim into the output directory, regardless of output mode — no processing, optimization, or transformation.
