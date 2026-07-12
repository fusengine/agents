---
name: environment-variables
applies-to: "**/.env, **/.env.*, **/src/**/*.ts, **/src/**/*.tsx"
description: Env var safety in TanStack Start - VITE_/PUBLIC_ client exposure vs process.env server, per-request reads
when-to-use: env var undefined, secret leaked to bundle, runtime vars, edge runtime, prefix rules
keywords: environment variables, VITE_, PUBLIC_, process.env, import.meta.env, secret, edge, cloudflare, runtime
priority: high
related: environment-boundaries.md, isomorphic-by-default.md, templates/boundaries.md
---

# Environment Variables

Load when an env var is `undefined`, or a secret risks leaking to the client.

## The Two Contexts

| Context | Read with | Sees |
|---------|-----------|------|
| Server (inside `createServerFn`, middleware, server routes) | `process.env.X` | **any** variable, prefixed or not |
| Client (components, isomorphic code) | `import.meta.env.X` | only variables with the public prefix |

Public prefix: **`VITE_`** with Vite, **`PUBLIC_`** with Rsbuild. Anything without
the prefix is server-only.

```ts
// Server function — any variable
const getUser = createServerFn().handler(async () => {
  const db = await connect(process.env.DATABASE_URL) // ✅ no prefix needed
  return db.user.findFirst()
})

// Client component — only prefixed variables
export function AppHeader() {
  return <h1>{import.meta.env.VITE_APP_NAME}</h1> // ✅ public
  // import.meta.env.DATABASE_URL → undefined (security)
}
```

## Rule 1 — Never prefix a secret

```bash
# ❌ exposed to the client bundle
VITE_STRIPE_SECRET=sk_live_xxx

# ✅ server-only
STRIPE_SECRET=sk_live_xxx
# ✅ VITE_ only for public values
VITE_APP_NAME=My App
```

## Rule 2 — Read env per request, not at module scope

Module-level reads fail on **two** axes:

1. **Security** — the value can be inlined into the client bundle.
2. **Edge correctness** — on Cloudflare Workers and other edge SSR runtimes, env
   is injected at request time; module-level code runs before it exists, so the
   read is `undefined` even on the server.

```ts
// ❌ WRONG — leaks AND undefined under Worker SSR
const apiKey = process.env.SECRET_KEY
export function fetchData() { /* uses apiKey === undefined on Workers */ }

// ✅ CORRECT — read inside the per-request handler
const fetchData = createServerFn().handler(async () => {
  const apiKey = process.env.SECRET_KEY
  return fetch(url, { headers: { Authorization: apiKey } })
})
```

The same applies to middleware `.server()` callbacks and server-route handlers.

## `.env` File Hierarchy (loaded in order)

```text
.env.local          # local overrides — add to .gitignore
.env.production     # production
.env.development    # development
.env                # defaults — commit
```

## Runtime Client Variables (no prefix, still needed on the client)

Bundle-time replacement can't carry a runtime value to the browser. Pass it
through a server function via the loader:

```tsx
const getRuntimeVar = createServerFn({ method: 'GET' }).handler(() => {
  return process.env.MY_RUNTIME_VAR // server, no public prefix
})

export const Route = createFileRoute('/')({
  loader: async () => ({ foo: await getRuntimeVar() }),
  component: () => <div>{Route.useLoaderData().foo}</div>,
})
```

## Type Safety (`src/env.d.ts`)

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_API_URL: string
}
interface ImportMeta { readonly env: ImportMetaEnv }

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly DATABASE_URL: string
      readonly JWT_SECRET: string
    }
  }
}
export {}
```

## Triage

| Symptom | Cause / fix |
|---------|-------------|
| `import.meta.env.X` undefined in client | Missing `VITE_`/`PUBLIC_` prefix, or dev server not restarted |
| `process.env.X` undefined on server (edge) | Reading at module scope — move inside `.handler()` |
| Secret visible in browser bundle | Remove public prefix; move access into a server function |
