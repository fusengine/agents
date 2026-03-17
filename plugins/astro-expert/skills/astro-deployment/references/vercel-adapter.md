---
name: vercel-adapter
description: @astrojs/vercel adapter — Serverless, Edge runtime, Image CDN, skew protection
when-to-use: Deploying Astro to Vercel platform
keywords: Vercel, Serverless, Edge Functions, Image CDN, skew protection, isr
priority: high
---

# Vercel Adapter

## When to Use

- Deploying Astro to Vercel
- Need Vercel's Image CDN for automatic optimization
- Mixing Serverless and Edge runtimes per-page

## Install

```bash
npx astro add vercel
```

## astro.config.mjs

```js
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    imageService: true,       // Use Vercel Image CDN
    isr: true,                // Enable ISR
    skewProtection: true,     // Prevent asset mismatches on deploy
    edgeMiddleware: false,    // Run middleware at edge (optional)
  }),
});
```

## Image CDN

With `imageService: true`, `<Image />` and `<Picture />` use Vercel's Image CDN. No need for `@astrojs/sharp` locally — Vercel handles optimization.

## ISR (Incremental Static Regeneration)

```ts
// Per-page ISR config
export const prerender = false;

// vercel.json or adapter config
{
  isr: {
    expiration: 60, // seconds
    bypassToken: process.env.ISR_BYPASS_TOKEN,
  }
}
```

## Edge vs Serverless Runtime

```ts
// src/pages/api/fast.ts
export const runtime = 'edge'; // Edge (Deno-like, global)
// default is serverless (Node.js)
```

## Skew Protection

Prevents serving old JS bundles with new HTML after deployment. Enable in Vercel dashboard + adapter config:

```js
adapter: vercel({ skewProtection: true })
```

## Environment Variables

```bash
# .env.local
VERCEL_URL=          # Auto-set by Vercel
VERCEL_ENV=          # preview, production, development
```

## Deploy Command

```bash
npx vercel deploy
# Or push to git — auto-deploys on Vercel
```
