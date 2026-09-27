---
name: routing
description: Astro 7 file-based routing, dynamic routes, catch-all routes, endpoints
when-to-use: creating pages, dynamic routes, API endpoints
keywords: routing, pages, dynamic, slug, catch-all, endpoint
priority: high
---

# Astro 7 Routing

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

## Pagination URL Format (7.1+)

`paginate()` accepts a `format` function to rewrite the generated `next`/`prev`/`first`/`last` URLs (e.g. for `build.format: 'file'` hosts without rewrites):

```astro
---
import { getCollection } from 'astro:content';

export async function getStaticPaths({ paginate }) {
  const posts = await getCollection('blog');
  return paginate(posts, { pageSize: 10, format: (url) => `${url}.html` });
}
---
```

## Per-Route Prerender Override

```astro
---
// In static mode (with an adapter): render this route on demand
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

## `src/fetch.ts` (Advanced Routing)

Reserved file, structured like `src/middleware.ts`, for advanced routing scenarios. Its resolution is controlled by the `fetchFile` config option, which can override the path or be set to `null` to disable it.

```ts
// src/fetch.ts
import { astro, FetchState } from 'astro/fetch';

export default {
  fetch(request: Request) {
    const state = new FetchState(request);
    return astro(state); // or compose astro/hono handlers: actions(), middleware(), pages(), i18n()
  },
};
```
