---
name: output-modes
description: Astro 6 output modes — static, server, hybrid — and when to use each
when-to-use: configuring project output, choosing rendering strategy
keywords: output, static, server, hybrid, prerender, SSR, SSG
priority: high
---

# Astro 6 Output Modes

## When to Use

- Choosing between static site generation and server rendering
- Mixing prerendered and on-demand routes
- Adding a server adapter for SSR

## Modes

| Mode | Config | Behavior |
|------|--------|----------|
| `static` | Default | All pages prerendered at build time |
| `server` | `output: 'server'` | All pages rendered on demand |
| `hybrid` | `output: 'hybrid'` | Static by default, opt-in to server per route |

## Configuration

```typescript
// astro.config.ts
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server', // or 'hybrid'
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
// In 'hybrid' mode — this route is server-rendered
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
