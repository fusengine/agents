---
name: project-anatomy
applies-to: "**/src/router.tsx, **/src/routes/__root.tsx, **/src/routeTree.gen.ts, **/src/routes/**/*.tsx"
description: TanStack Start project anatomy - src layout, getRouter factory, root route, generated route tree
when-to-use: understanding where files go, the role of each wiring file, the generated tree
keywords: anatomy, structure, router.tsx, __root.tsx, routeTree.gen.ts, getRouter, HeadContent, Scripts
priority: high
related: project-setup.md, common-mistakes.md, templates/minimal-project.md
---

# Project Anatomy — TanStack Start

Load to understand the file tree and the role of each wiring file.

## Directory Tree

```text
.
├── src/
│   ├── routes/
│   │   ├── __root.tsx       # Document shell (required)
│   │   └── index.tsx        # First page route
│   ├── router.tsx           # getRouter() factory (required)
│   ├── routeTree.gen.ts     # GENERATED — do not edit
│   └── env.d.ts             # Env var typings (optional but recommended)
├── vite.config.ts           # or rsbuild.config.ts
├── package.json
└── tsconfig.json
```

No manual `client entry` / `server entry` files are required for a basic app —
Start provides them; you only author `router.tsx` and `routes/`.

---

## `src/router.tsx` — Router Factory

A **function** named `getRouter` that builds and returns the router. Start calls
it on both server and client to create per-request/per-load instances.

```tsx
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    // defaultPreload: 'intent', // optional
  })
  return router
}
```

Configure router-wide behavior here: preloading, cache staleness, default
error/pending components.

---

## `src/routes/__root.tsx` — Document Shell

The root route wraps every other route and renders the full HTML document. Three
components are mandatory:

- `<HeadContent />` in `<head>` — injects meta/title/links from route `head()`.
- `<Outlet />` — renders the matched child route.
- `<Scripts />` in `<body>` — injects the client bundle; without it there is no
  hydration and no client interactivity.

```tsx
import type { ReactNode } from 'react'
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
```

Use `createRootRouteWithContext<TContext>()` instead when routes need typed
context (e.g. a session). See `solid-tanstack-start` templates.

---

## `src/routeTree.gen.ts` — Generated Tree

Produced by the `tanstackStart()` plugin from the files in `src/routes/`. It wires
every route into a single typed tree that `getRouter` consumes. **Never edit it.**
Add/rename files under `src/routes/` and the plugin regenerates it on dev/build.

---

## A Route File

```tsx
// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const getGreeting = createServerFn({ method: 'GET' }).handler(async () => {
  return { message: 'Hello from the server!' }
})

export const Route = createFileRoute('/')({
  loader: () => getGreeting(),
  component: () => <h1>{Route.useLoaderData().message}</h1>,
})
```

Full assembled project → `templates/minimal-project.md`.
