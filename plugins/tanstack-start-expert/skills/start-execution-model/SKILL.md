---
name: start-execution-model
version: 1.0.0
description: >-
  TanStack Start execution model — isomorphic-by-default, environment boundary
  functions (createServerFn, createServerOnlyFn, createClientOnlyFn,
  createIsomorphicFn), <ClientOnly>, useHydrated(), server-only/client-only
  import markers, and env-var safety (VITE_/PUBLIC_ prefix vs process.env). Use
  when: deciding where code runs, fixing secret leaks, DB/filesystem in a loader,
  hydration mismatches, "process.env is undefined on the server". Do NOT use for:
  initial setup (use start-core), file/directory SOLID organization (use
  solid-tanstack-start).
user-invocable: true
references: references/isomorphic-by-default.md, references/environment-boundaries.md, references/environment-variables.md, references/templates/boundaries.md
---

# TanStack Start Execution Model

Understanding **where code runs** is the single most important concept in Start,
and the #1 source of AI-generated bugs. Targets `@tanstack/react-start` v1.166.2.

> **CRITICAL — everything is isomorphic by default.** Every module runs in BOTH
> the server and client bundles. Route **loaders run on both** — during SSR AND
> during client navigation. DB, filesystem, and secrets MUST live inside
> `createServerFn` (or `createServerOnlyFn`), never a bare loader or module scope.
>
> **CRITICAL — read `process.env` per request, not at module scope.** Module-level
> reads (1) can be inlined into the client bundle (secret leak) and (2) are
> `undefined` on edge runtimes (Cloudflare Workers inject env at request time).
>
> **CRITICAL — `VITE_`/`PUBLIC_` prefixed vars are exposed to the client.** Server
> secrets must have NO public prefix.

## Agent Workflow (MANDATORY)

Verify APIs against Context7 (`/websites/tanstack_start_framework_react`) + Exa
before writing boundary code. After changes, run `fuse-ai-pilot:sniper`.

---

## The Boundary APIs at a Glance

| API | Use case | Client behavior | Server behavior |
|-----|----------|-----------------|-----------------|
| `createServerFn()` | RPC, data, mutations | network request | direct execution |
| `createServerOnlyFn(fn)` | server utility | **throws** | direct execution |
| `createClientOnlyFn(fn)` | browser utility | direct execution | **throws** |
| `createIsomorphicFn()` | per-env implementation | `.client()` impl | `.server()` impl |
| `<ClientOnly fallback>` | browser-only UI | renders children | renders fallback |
| `useHydrated()` | post-hydration logic | `true` after hydrate | `false` |
| `import '@tanstack/react-start/server-only'` | whole file server-only | import denied | allowed |
| `import '@tanstack/react-start/client-only'` | whole file client-only | allowed | import denied |

All boundary creators are imported from `@tanstack/react-start`; `<ClientOnly>`
and `useHydrated` come from `@tanstack/react-router`.

---

## The One Gotcha to Remember

```tsx
// ❌ WRONG — loader is isomorphic; SECRET ships to the browser
export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    const secret = process.env.API_SECRET // leaked
    return fetch(url, { headers: { Authorization: secret } })
  },
})

// ✅ CORRECT — server-only work behind createServerFn
const getData = createServerFn({ method: 'GET' }).handler(async () => {
  const secret = process.env.API_SECRET // stays on the server
  return fetch(url, { headers: { Authorization: secret } })
})
export const Route = createFileRoute('/dashboard')({ loader: () => getData() })
```

---

## Reference Guide

| Topic | Reference | Load when |
|-------|-----------|-----------|
| Why loaders/modules are isomorphic; the mental model | `references/isomorphic-by-default.md` | deciding server vs client vs both |
| Each boundary API + import markers + which to pick | `references/environment-boundaries.md` | choosing an API, marking a file |
| `VITE_`/`PUBLIC_` vs `process.env`, per-request reads, runtime vars | `references/environment-variables.md` | env var undefined / leaked |
| Complete copy-paste examples of every boundary | `references/templates/boundaries.md` | writing boundary code |

---

## Decision Framework

- **Server-only** (`createServerFn` / `createServerOnlyFn`): secrets, DB,
  filesystem, external API keys.
- **Client-only** (`createClientOnlyFn` / `<ClientOnly>`): DOM, `localStorage`,
  geolocation, analytics.
- **Isomorphic** (default / `createIsomorphicFn`): formatting, business logic,
  shared utilities, loaders.

## Forbidden

- DB / secrets / filesystem in a bare loader (→ `createServerFn`).
- `process.env` at module scope (leak + `undefined` on edge).
- `VITE_`/`PUBLIC_` prefix on a secret.
- Non-deterministic render output (`new Date()` directly) → hydration mismatch.
- Dynamic `import()` of a `*.functions.ts` server function (bundler issues).
