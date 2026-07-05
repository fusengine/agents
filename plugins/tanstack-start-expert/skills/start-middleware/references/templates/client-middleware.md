---
name: client-middleware
description: Client-side middleware for headers, custom fetch, and telemetry
keywords: client, headers, customFetch, telemetry, ssr guard, sendContext
---

# Client Middleware (headers, fetch, telemetry)

Client middleware is unique to TanStack Start (vs Next/Remix): `.client()` runs
in the browser around the RPC call. Remember it also runs on the server during
SSR, so guard browser-only APIs.

## Usage

Copy into `src/middleware/client.ts`.

---

## Auth Header from a Token

```tsx
// src/middleware/client.ts
import { createMiddleware } from '@tanstack/react-start'
import { getToken } from '~/lib/token'

export const authHeaderMiddleware = createMiddleware({ type: 'function' })
  .client(async ({ next }) =>
    next({ headers: { Authorization: `Bearer ${getToken()}` } }),
  )
```

Headers merge across middleware; later middleware and the call site override
earlier values.

---

## SSR-Safe localStorage Access

```tsx
// .client() runs on the server during SSR — guard browser APIs
export const prefsMiddleware = createMiddleware({ type: 'function' })
  .client(async ({ next }) => {
    const theme =
      typeof window !== 'undefined' ? localStorage.getItem('theme') : null
    return next({ sendContext: { theme } })
  })
```

---

## Custom Fetch (telemetry / retries)

```tsx
import type { CustomFetch } from '@tanstack/react-start'

export const timingMiddleware = createMiddleware({ type: 'function' })
  .client(async ({ next }) => {
    const timedFetch: CustomFetch = async (url, init) => {
      const start = Date.now()
      const response = await fetch(url, init)
      console.log('RPC', url, `${Date.now() - start}ms`)
      return response
    }
    return next({ fetch: timedFetch })
  })
```

Fetch precedence (highest → lowest): call site → later middleware → earlier
middleware → `createStart` global → default `fetch`. Override per call:

```tsx
await myServerFn({ data, fetch: myTestFetch }) // wins over middleware fetch
```

---

## Global Custom Fetch (createStart)

```tsx
// src/start.ts
import { createStart } from '@tanstack/react-start'
import type { CustomFetch } from '@tanstack/react-start'

const globalFetch: CustomFetch = async (url, init) => {
  // add retry logic / telemetry
  return fetch(url, init)
}

export const startInstance = createStart(() => ({
  serverFns: { fetch: globalFetch },
}))
```
