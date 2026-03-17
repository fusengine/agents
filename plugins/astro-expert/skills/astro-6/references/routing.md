---
name: routing
description: Astro 6 file-based routing, dynamic routes, catch-all routes, endpoints
when-to-use: creating pages, dynamic routes, API endpoints
keywords: routing, pages, dynamic, slug, catch-all, endpoint
priority: high
---

# Astro 6 Routing

## When to Use

- Creating new pages with dynamic parameters
- Building REST endpoints in `src/pages/`
- Setting up catch-all routes

## File-Based Routing

```
src/pages/
├── index.astro          → /
├── about.astro          → /about
├── blog/
│   ├── index.astro      → /blog
│   └── [slug].astro     → /blog/:slug
├── [...all].astro       → /* (catch-all)
└── api/
    └── data.ts          → /api/data (endpoint)
```

## Dynamic Routes

```astro
---
// src/pages/blog/[slug].astro
export async function getStaticPaths() {
  return [
    { params: { slug: 'post-1' } },
    { params: { slug: 'post-2' } },
  ];
}
const { slug } = Astro.params;
---
```

## Per-Route Prerender Override

```astro
---
// In hybrid/server mode: opt out of prerendering
export const prerender = false;
---

---
// In server mode: opt into prerendering
export const prerender = true;
---
```

## REST Endpoints

```typescript
// src/pages/api/users.ts
export function GET({ request }) {
  return new Response(JSON.stringify({ users: [] }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```
