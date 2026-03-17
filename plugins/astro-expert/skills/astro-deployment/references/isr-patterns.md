---
name: isr-patterns
description: ISR-like patterns in Astro — Cloudflare KV cache, Vercel ISR, stale-while-revalidate
when-to-use: Dynamic pages that need periodic cache invalidation without full rebuild
keywords: ISR, cache, KV, stale-while-revalidate, revalidation, Cache-Control
priority: medium
---

# ISR Patterns in Astro

## When to Use

- Pages that update occasionally but don't need real-time data
- Avoiding full site rebuilds for content updates
- High-traffic pages needing both freshness and performance

## Astro Has No Native ISR

Implement ISR-like behavior using platform caching:

## Vercel ISR

```js
// astro.config.mjs
adapter: vercel({
  isr: {
    expiration: 60, // Revalidate every 60 seconds
  }
})
```

```ts
// Per-page ISR override
export const prerender = false;

// In the route handler
export async function GET() {
  const data = await fetchData();
  return new Response(JSON.stringify(data), {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=86400',
    },
  });
}
```

## Cloudflare KV Cache

```ts
// src/pages/api/blog/[slug].ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, locals }) => {
  const { KV } = locals.runtime.env;
  const cacheKey = `post:${params.slug}`;

  // Check cache first
  const cached = await KV.get(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
    });
  }

  // Fetch and cache
  const data = await fetchPost(params.slug);
  await KV.put(cacheKey, JSON.stringify(data), { expirationTtl: 3600 });

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
  });
};
```

## Cache-Control Headers (Any Platform)

```ts
// Return proper cache headers for CDN caching
return new Response(html, {
  headers: {
    'Content-Type': 'text/html',
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  },
});
```

## Strategy Decision

| Need | Solution |
|------|----------|
| Vercel + simple TTL | Vercel ISR adapter option |
| Cloudflare + fine control | KV cache with manual invalidation |
| Any platform + headers | `Cache-Control: s-maxage + stale-while-revalidate` |
| Full rebuild on change | CMS webhook → rebuild trigger |
