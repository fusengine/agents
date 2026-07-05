---
name: global
description: Global middleware, execution order, and staticFunctionMiddleware
when-to-use: Registering app-wide middleware, understanding chain order, caching static server functions
keywords: createStart, start.ts, requestMiddleware, functionMiddleware, order, staticFunctionMiddleware
priority: medium
requires: types.md
related: context.md
---

# Global & Static Middleware

## Overview

Global middleware runs automatically for every request (or every server
function) in the app. It is configured with `createStart` in `src/start.ts`.

---

## Registering Global Middleware

```tsx
// src/start.ts
import { createStart, createMiddleware } from '@tanstack/react-start'

const requestLogger = createMiddleware().server(async ({ next, request }) => {
  console.log(`${request.method} ${request.url}`)
  return next()
})

const functionAuth = createMiddleware({ type: 'function' }).server(
  async ({ next }) => next(),
)

export const startInstance = createStart(() => ({
  requestMiddleware: [requestLogger], // every server request
  functionMiddleware: [functionAuth], // every server function
}))
```

| Array | Applies to |
|-------|-----------|
| `requestMiddleware` | Every server request (SSR, routes, functions) |
| `functionMiddleware` | Every server function |

---

## Execution Order

Middleware runs **dependency-first**, then global, then per-function. For this
chain the log order is: `globalMiddleware1`, `globalMiddleware2`, `a`, `b`, `c`,
`d`, `fn` — dependencies (`a` before `b`) resolve before the function's own
middleware, and the handler (`fn`) runs last.

---

## CSRF Middleware

Defining `src/start.ts` disables Start's automatic CSRF install for server
functions. Add it back explicitly:

```tsx
import { createStart, createCsrfMiddleware } from '@tanstack/react-start'

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
})

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware],
}))
```

Without it, Start shows a dev warning. Silence it only if you handle CSRF
elsewhere: `tanstackStart({ serverFns: { disableCsrfMiddlewareWarning: true } })`.

---

## Static Function Middleware

`staticFunctionMiddleware` caches a server function's result at build time for
prerendering / static generation. It comes from a separate package and **must
be the last middleware** in the chain (experimental).

```tsx
import { createServerFn } from '@tanstack/react-start'
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions'

const getBuildData = createServerFn({ method: 'GET' })
  .middleware([staticFunctionMiddleware]) // LAST in the chain
  .handler(async () => 'Hello, world!')
```

---

## Best Practices

### DO
- Put logging/observability in `requestMiddleware`
- Re-add `createCsrfMiddleware()` when you own `src/start.ts`
- Keep `staticFunctionMiddleware` last

### DON'T
- Assume CSRF is auto-installed once `src/start.ts` exists
- Chain anything after `staticFunctionMiddleware`

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Custom `src/start.ts` with no CSRF | Add `createCsrfMiddleware()` |
| `staticFunctionMiddleware` not last | Move it to the end of `.middleware([])` |

---

## Related References

- [types.md](types.md) — middleware types
- [context.md](context.md) — data transfer

## Related Templates

- [auth-authorization.md](templates/auth-authorization.md) — factory usage
