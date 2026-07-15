---
name: middleware
description: Astro 6 middleware — request/response interception, auth, redirects, locals
when-to-use: auth guards, redirects, request logging, setting locals
keywords: middleware, locals, auth, redirect, request, response
priority: medium
---

# Astro 6 Middleware

## When to Use

- Protecting routes with authentication checks
- Redirecting based on cookies or headers
- Setting shared data via `locals` for all routes
- Logging requests

## Basic Structure

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Before handler
  const response = await next();
  // After handler
  return response;
});
```

## Auth Guard Pattern

```typescript
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ cookies, redirect, url }, next) => {
  const isProtected = url.pathname.startsWith('/dashboard');
  const session = cookies.get('session')?.value;

  if (isProtected && !session) {
    return redirect('/login');
  }

  return next();
});
```

## Setting Locals

```typescript
// middleware.ts
export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.user = await getUser(context.cookies);
  return next();
});
```

```astro
---
// src/pages/dashboard.astro
const { user } = Astro.locals;
---
```
