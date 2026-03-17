---
name: netlify-adapter
description: @astrojs/netlify adapter — Edge Functions, Netlify Forms, Image CDN
when-to-use: Deploying Astro to Netlify platform
keywords: Netlify, Edge Functions, Deno, netlify.toml, forms
priority: medium
---

# Netlify Adapter

## When to Use

- Deploying to Netlify
- Using Netlify Edge Functions (Deno runtime)
- Netlify Forms for form submissions

## Install

```bash
npx astro add netlify
```

## astro.config.mjs

```js
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  adapter: netlify({
    edgeMiddleware: true, // Run middleware at edge
    imageCDN: true,       // Use Netlify Image CDN
  }),
});
```

## netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

## Edge Functions Runtime

Netlify Edge Functions run on Deno-based V8 isolates. Access Netlify context:

```ts
// src/middleware.ts
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const geo = context.locals.netlify?.context.geo;
  if (geo?.country?.code === 'CN') {
    return new Response('Not available', { status: 403 });
  }
  return next();
};
```

## Environment Variables

```bash
# Set in Netlify dashboard or .env
NETLIFY_SITE_ID=your-site-id
```

## Deploy

```bash
npx netlify deploy --build
# Or push to git — auto-deploys
```
