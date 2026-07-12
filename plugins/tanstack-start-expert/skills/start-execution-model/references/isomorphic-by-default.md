---
name: isomorphic-by-default
applies-to: "**/src/routes/**/*.tsx, **/src/routes/**/*.ts, **/src/modules/**/*.ts, **/src/modules/**/*.tsx"
description: Why TanStack Start code runs on both server and client, and what that means for loaders
when-to-use: deciding where code runs, understanding SSR + client execution, loader assumptions
keywords: isomorphic, loader, server, client, SSR, hydration, execution model, both environments
priority: high
related: environment-boundaries.md, environment-variables.md, templates/boundaries.md
---

# Isomorphic by Default

Load to build the mental model of where Start code runs.

## The Principle

Every module you write is bundled for **both** environments and can execute in
**both**:

- On the **server** during SSR (the initial HTML render).
- On the **client** during hydration and subsequent navigations.

There is no `"use server"` / `"use client"` split as in Next.js. A plain function
is isomorphic unless you deliberately mark a boundary.

## Loaders Run Twice

The most consequential case. A route `loader`:

- runs on the **server** for the first page load (SSR), and
- runs on the **client** for every client-side navigation into that route.

```tsx
export const Route = createFileRoute('/posts')({
  loader: async () => {
    // Runs on the server (SSR) AND on the client (navigation).
    // Anything here is present in the CLIENT bundle.
    return getPosts() // ✅ if getPosts is a createServerFn, the client call is a fetch
  },
})
```

So a loader is the right place to **call** a server function, but the wrong place
to **do** server-only work inline.

## What "present in the client bundle" costs you

Two independent failures, both from the same mistake (server-only code in
isomorphic scope):

1. **Security** — secrets read at module scope or in a loader get inlined into the
   JS shipped to the browser.
2. **Correctness on edge runtimes** — on Cloudflare Workers and similar, env vars
   are injected per request; module-scope reads happen before that, so they are
   `undefined` even on the server. The bug only appears after deploy.

## The Fix Is Always a Boundary

When code must NOT be isomorphic, pick an explicit boundary (full catalogue in
`environment-boundaries.md`):

```tsx
// Server-only work → createServerFn (client calls it over the network)
const getUsers = createServerFn().handler(async () => db.users.findMany())

// Server-only utility that must throw if reached on the client
const readSecret = createServerOnlyFn(() => process.env.DATABASE_URL)

// Browser-only work → createClientOnlyFn / <ClientOnly>
const save = createClientOnlyFn((v: string) => localStorage.setItem('k', v))
```

## Isomorphic Is Good — Use It

Most code SHOULD stay isomorphic: formatting, validation schemas, pure business
logic, and loaders that orchestrate server-function calls. Isomorphism is what
gives Start seamless SSR + client navigation with one codebase.

## Checklist

- [ ] Loaders only orchestrate; server work is inside `createServerFn`.
- [ ] No `process.env` at module scope.
- [ ] No secret/DB/filesystem access in isomorphic files.
- [ ] Render output is deterministic (no `Date.now()` in JSX) — see hydration
      notes in `environment-boundaries.md`.
