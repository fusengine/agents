---
name: minimal-project-template
applies-to: "**/vite.config.ts, **/src/router.tsx, **/src/routes/**/*.tsx"
description: Complete minimal TanStack Start project - every file needed to run
---

# Minimal TanStack Start Project (complete)

Every file for a runnable app (`@tanstack/react-start` v1.168.58). Create these,
then `npm run dev` → http://localhost:3000. The plugin generates
`src/routeTree.gen.ts` on first run.

## `package.json`

```json
{
  "name": "my-start-app",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build"
  },
  "dependencies": {
    "@tanstack/react-router": "^1.170.39",
    "@tanstack/react-start": "^1.168.58",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^6.1.1",
    "typescript": "^6.0.3",
    "vite": "^8.3.1"
  }
}
```

> `@tanstack/react-start` peers on `vite >=7`; `@vitejs/plugin-react` 6 requires
> `vite ^8`. The official `start-basic` example keeps the `typescript` package on
> 6.x and installs TypeScript 7 separately as `@typescript/native`.

## `tsconfig.json`

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "target": "ES2022",
    "skipLibCheck": true,
    "strictNullChecks": true
  }
}
```

## `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  plugins: [tanstackStart(), viteReact()],
})
```

## `src/router.tsx`

```tsx
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
  })
}
```

## `src/routes/__root.tsx`

```tsx
import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My Start App' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

## `src/routes/index.tsx`

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const getGreeting = createServerFn({ method: 'GET' }).handler(async () => {
  return { message: 'Hello from the server!' }
})

export const Route = createFileRoute('/')({
  loader: () => getGreeting(),
  component: Home,
})

function Home() {
  const data = Route.useLoaderData()
  return <h1>{data.message}</h1>
}
```

## `src/env.d.ts` (optional)

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}

export {}
```

---

## Run

```bash
npm install
npm run dev
```

Do NOT create `src/routeTree.gen.ts` yourself — the plugin writes it. Add server
boundaries per the `start-execution-model` skill; organize growth per
`solid-tanstack-start`.
