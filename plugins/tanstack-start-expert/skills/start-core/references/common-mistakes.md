---
name: common-mistakes
applies-to: "**/vite.config.ts, **/rsbuild.config.ts, **/tsconfig.json, **/src/routes/__root.tsx"
description: TanStack Start setup pitfalls - plugin order, missing Scripts, verbatimModuleSyntax, loader assumptions
when-to-use: blank page, hydration fails, no client JS, server code in client bundle, generation errors
priority: high
keywords: mistakes, plugin order, Scripts, verbatimModuleSyntax, hydration, blank page, generation
related: project-setup.md, project-anatomy.md
---

# Common Setup Mistakes — TanStack Start

Load when the app builds but misbehaves (blank page, no interactivity, leaks).

## 1. CRITICAL — React plugin before Start plugin

Route generation and server-function compilation silently fail.

```ts
// WRONG
plugins: [viteReact(), tanstackStart()]

// CORRECT — Start plugin first
plugins: [tanstackStart(), viteReact()]
```

## 2. HIGH — Missing `<Scripts />` in the root route

The client bundle is injected by `<Scripts />` in the `<body>`. Without it the
page renders (SSR HTML) but is inert: no hydration, no `onClick`, no navigation.

```tsx
// WRONG — no Scripts, page is dead on the client
<body>
  <Outlet />
</body>

// CORRECT
<body>
  <Outlet />
  <Scripts />
</body>
```

Symmetrically, missing `<HeadContent />` in `<head>` drops meta/title from
route `head()`.

## 3. HIGH — Enabling `verbatimModuleSyntax`

In tsconfig this causes server bundles to leak into client bundles. Keep it
disabled (omit it, or `false`).

## 4. CRITICAL — Assuming loaders are server-only

Loaders are **isomorphic** — they run on both server and client. Putting
`process.env`, DB, or secret access in a loader leaks it to the browser. Move
such code into `createServerFn`. Full model in the `start-execution-model` skill.

```tsx
// WRONG — secret shipped to the client
loader: async () => fetch(url, { headers: { Authorization: process.env.SECRET } })

// CORRECT
const getData = createServerFn().handler(async () =>
  fetch(url, { headers: { Authorization: process.env.SECRET } }),
)
export const Route = createFileRoute('/x')({ loader: () => getData() })
```

## 5. MEDIUM — Editing the generated route tree

`src/routeTree.gen.ts` is overwritten every dev/build. Any manual edit is lost
and can break route types. Add files in `src/routes/` instead.

## 6. MEDIUM — Applying Next.js patterns

Start is not Next.js. `getServerSideProps`, `"use server"` directives, and
`app/layout.tsx` do nothing here. Use loaders + `createServerFn` + `__root.tsx`.

---

## Quick Triage

| Symptom | Likely cause |
|---------|--------------|
| Buttons/links do nothing | Missing `<Scripts />` |
| Title/meta absent | Missing `<HeadContent />` |
| `routeTree.gen.ts` not created | Plugin order or no `__root.tsx` |
| Secret visible in browser bundle | `process.env` in loader / `VITE_` prefix on secret |
| Server import errors in client | `verbatimModuleSyntax` enabled |
