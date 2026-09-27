# CSP with Static Headers (staticHeaders)

## Overview

For adapter deployments (Vercel, Netlify, Node), you can deliver CSP via HTTP headers instead of `<meta>` tags using the adapter's `staticHeaders` option. It was stabilized in Astro 6 (renamed from `experimentalStaticHeaders`; available since `@astrojs/vercel@10`, `@astrojs/netlify@7`, `@astrojs/node@10`).

## Why HTTP Headers vs Meta Tags

| Method | Advantage |
|--------|-----------|
| `<meta>` tag | Works everywhere, no adapter needed |
| HTTP headers | Applied before page parse, stronger protection; supports directives a `<meta>` cannot carry (e.g. `frame-ancestors`) |

## Vercel Adapter Setup

```bash
npm install @astrojs/vercel
```

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel({
    staticHeaders: true
  }),
  security: {
    csp: {
      algorithm: 'SHA-512'
    }
  }
});
```

The adapter writes the CSP of prerendered pages into Vercel's configuration instead of emitting a `<meta>` element. `staticHeaders` is a `boolean` (no object form).

## Netlify Adapter

```javascript
import netlify from '@astrojs/netlify';

export default defineConfig({
  adapter: netlify({
    staticHeaders: true
  }),
  security: {
    csp: { algorithm: 'SHA-512' }
  }
});
```

With `staticHeaders: true`, Netlify saves the CSP headers in its Framework API config; without it, Astro keeps the `<meta>` tag.

## Verifying Headers in Production

```bash
curl -I https://yoursite.com | grep -i content-security-policy
```
