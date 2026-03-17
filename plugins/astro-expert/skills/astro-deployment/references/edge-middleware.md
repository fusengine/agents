---
name: edge-middleware
description: Astro edge middleware for auth checks, redirects, A/B testing, and geo-routing
when-to-use: Route protection, geo-based redirects, A/B testing
keywords: middleware, edge, auth, redirect, geo, A/B testing, onRequest
priority: medium
---

# Edge Middleware

## When to Use

- Auth check before protected pages
- Geo-based content or access control
- A/B testing with cookie-based routing
- Request/response modification at edge

## src/middleware.ts

```ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect, locals } = context;

  // Auth check example
  const token = cookies.get('auth-token');
  if (url.pathname.startsWith('/dashboard') && !token) {
    return redirect('/login');
  }

  // Add data to locals (available in all pages)
  locals.user = token ? await validateToken(token.value) : null;

  return next();
});
```

## Geo Routing (Cloudflare)

```ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const runtime = context.locals.runtime;
  const country = runtime?.cf?.country ?? 'US';

  // Redirect to locale-specific page
  if (context.url.pathname === '/' && country === 'FR') {
    return context.redirect('/fr/');
  }

  return next();
});
```

## A/B Testing

```ts
export const onRequest = defineMiddleware(async (context, next) => {
  const variant = context.cookies.get('ab-variant')?.value
    ?? (Math.random() < 0.5 ? 'a' : 'b');

  // Set cookie for consistent experience
  const response = await next();
  if (!context.cookies.has('ab-variant')) {
    response.headers.append('Set-Cookie',
      `ab-variant=${variant}; Path=/; Max-Age=86400`);
  }

  context.locals.variant = variant;
  return response;
});
```

## Multiple Middleware (Sequence)

```ts
// src/middleware/auth.ts
export async function authMiddleware(context, next) { ... }

// src/middleware/logging.ts
export async function loggingMiddleware(context, next) { ... }

// src/middleware.ts
import { sequence } from 'astro:middleware';
import { authMiddleware } from './middleware/auth';
import { loggingMiddleware } from './middleware/logging';

export const onRequest = sequence(loggingMiddleware, authMiddleware);
```
