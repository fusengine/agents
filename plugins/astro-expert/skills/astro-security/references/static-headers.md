# CSP with Static Headers (experimentalStaticHeaders)

## Overview

For adapter deployments (Vercel, Netlify), you can deliver CSP via HTTP headers instead of `<meta>` tags using `experimentalStaticHeaders`.

## Why HTTP Headers vs Meta Tags

| Method | Advantage |
|--------|-----------|
| `<meta>` tag | Works everywhere, no adapter needed |
| HTTP headers | Applied before page parse, stronger protection |

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
    experimentalStaticHeaders: true
  }),
  security: {
    csp: {
      algorithm: 'SHA-512'
    }
  }
});
```

## globalCsp Option (for Large Sites)

For sites with 2,500+ static pages, the per-route CSP can exceed Vercel's 3,300KB config limit. Use `globalCsp`:

```javascript
adapter: vercel({
  experimentalStaticHeaders: {
    globalCsp: true  // Single catch-all route instead of per-page
  }
})
```

This reduces `.vercel/output/config.json` from MB to KB for large sites.

## Netlify Adapter

```javascript
import netlify from '@astrojs/netlify';

export default defineConfig({
  adapter: netlify(),
  security: {
    csp: { algorithm: 'SHA-512' }
  }
});
```

Netlify generates `_headers` file with CSP headers per route.

## Verifying Headers in Production

```bash
curl -I https://yoursite.com | grep -i content-security-policy
```
