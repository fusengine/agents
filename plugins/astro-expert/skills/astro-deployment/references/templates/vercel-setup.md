---
name: vercel-setup-template
description: Complete Vercel setup for Astro 6 with Image CDN, ISR, and edge functions
type: template
---

# Vercel Deployment Setup Template

## Install

```bash
npx astro add vercel
npm install -D vercel
```

## astro.config.mjs

```js
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    imageService: true,      // Vercel Image CDN
    isr: {
      expiration: 300,       // Revalidate every 5 minutes
      bypassToken: process.env.ISR_BYPASS_TOKEN,
    },
    skewProtection: true,    // Prevent asset mismatch on deploy
    edgeMiddleware: false,   // true = run middleware on edge
  }),
});
```

## vercel.json (optional overrides)

```json
{
  "framework": "astro",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

## Environment Variables (.env.local)

```bash
# Vercel auto-sets these in production
VERCEL_URL=         # Current deployment URL
VERCEL_ENV=         # production, preview, development
ISR_BYPASS_TOKEN=   # Secret for manual revalidation
```

## Edge Function (Per-Route)

```ts
// src/pages/api/geo.ts
export const runtime = 'edge';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const country = request.headers.get('x-vercel-ip-country') ?? 'US';
  return new Response(JSON.stringify({ country }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

## Deploy

```bash
npx vercel deploy --prod
# Or connect GitHub repo for auto-deploy
```
