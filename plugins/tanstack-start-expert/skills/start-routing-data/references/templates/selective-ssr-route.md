---
name: selective-ssr-route
description: Complete examples of per-route SSR control (data-only, false, functional form)
keywords: ssr, data-only, functional-ssr, shellComponent, pendingComponent, defaultSsr
source: https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr
---

# Selective SSR Routes

## Overview

Three concrete configurations of the `ssr` flag: data-only SSR (data on server, component on client), fully client-only, and a runtime decision based on validated params/search.

---

## File: src/routes/dashboard.tsx (data-only)

```tsx
/**
 * beforeLoad + loader run on the server (data is SSR'd and serialized),
 * but the component renders on the client so it can use window / browser APIs.
 */
import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getDashboard } from '~/queries/dashboard.functions'

export const Route = createFileRoute('/dashboard')({
  ssr: 'data-only',
  loader: async () => ({ dashboard: await getDashboard() }),
  pendingComponent: () => <div>Loading dashboard…</div>, // SSR fallback
  component: DashboardPage,
})

function DashboardPage() {
  const { dashboard } = Route.useLoaderData()
  const [width, setWidth] = React.useState(0)

  React.useEffect(() => {
    setWidth(window.innerWidth) // browser-only API, safe here
  }, [])

  return <Chart data={dashboard} width={width} />
}
```

---

## File: src/routes/editor.tsx (client-only)

```tsx
/**
 * ssr: false — neither beforeLoad/loader nor the component run on the server.
 * Use for routes whose loader itself needs browser APIs (e.g. IndexedDB, canvas).
 */
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/editor')({
  ssr: false,
  loader: () => {
    // Executes on the client during hydration only.
    return { draft: localStorage.getItem('draft') }
  },
  component: () => <CanvasEditor />,
})
```

---

## File: src/routes/docs.$docType.$docId.tsx (functional form)

```tsx
/**
 * The ssr function runs ONLY on the server during the initial request and is
 * stripped from the client bundle. params/search arrive as a discriminated union.
 */
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/docs/$docType/$docId')({
  validateSearch: z.object({ details: z.boolean().optional() }),
  ssr: ({ params, search }) => {
    if (params.status === 'success' && params.value.docType === 'sheet') {
      return false // spreadsheet view is client-only
    }
    if (search.status === 'success' && search.value.details) {
      return 'data-only'
    }
    // undefined → fall back to inherited/default ssr
  },
  loader: () => fetchDoc(),
  component: DocPage,
})
```

---

## File: src/routes/__root.tsx (disable root component SSR)

```tsx
/**
 * The <html> shell must always be SSR'd via shellComponent, even when the root
 * route component itself is client-only.
 */
import * as React from 'react'
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  ssr: false, // or defaultSsr: false on the router
  shellComponent: RootShell, // always SSR'd
  component: () => (
    <div>
      <h1>Rendered on the client</h1>
      <Outlet />
    </div>
  ),
})

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  )
}
```

---

## Notes

- Inheritance only tightens: `true → 'data-only' → false`. A child cannot re-enable SSR a parent disabled.
- Set an app-wide default with `createStart(() => ({ defaultSsr: false }))` in `src/start.ts`.
- The first `false`/`'data-only'` route renders its `pendingComponent` as the SSR fallback (held at least `minPendingMs` on hydration).
- `window.innerWidth` is read in `useEffect` (client-only), the React 19 way to touch browser APIs without breaking SSR — never at loader top level.
