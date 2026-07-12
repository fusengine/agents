---
name: start-server-functions
description: >-
  Use when creating type-safe RPC server logic in TanStack Start with
  createServerFn — GET/POST methods, .validator() (Zod or function),
  .handler(), useServerFn hook, FormData input, Response output, strict
  serialization, throw redirect()/notFound(), server context utilities,
  and CSRF protection. Do NOT use for: raw external HTTP endpoints
  (use start-server-routes), reusable middleware chains (use
  start-middleware), or Next.js/Remix "use server" patterns.
version: 1.0.0
user-invocable: true
references: references/creating.md, references/calling.md, references/security.md, references/templates/crud-server-functions.md, references/templates/form-with-validation.md
---

# TanStack Start Server Functions

Server functions are same-origin, type-safe RPC endpoints created with
`createServerFn`. They run only on the server but are callable from loaders,
components, hooks, and other server functions. This skill targets
`@tanstack/react-start` **v1.166.2**.

## Agent Workflow (MANDATORY)

Before implementing, verify current APIs against Context7
(`/websites/tanstack_start_framework_react`) + Exa, then explore the target
codebase. After changes, run `fuse-ai-pilot:sniper`.

## Critical Rules (read first)

1. **A server function is an independent HTTP endpoint.** A route `beforeLoad`
   redirect protects the route UI, NOT the RPC — an attacker can hit the
   endpoint directly. Put auth **inside** the `.handler()` or in middleware for
   every function touching private data.
2. **Never use Next.js/Remix patterns.** No `"use server"`, `getServerSideProps`,
   Remix `loader`/`action`, or `react-router-dom`. Use `createServerFn`
   exclusively (from `@tanstack/react-start`).
3. **Loaders are isomorphic** (run on client AND server). DB queries, secrets,
   and file-system access MUST live in a server function, never in a loader.
4. **`useServerFn` is MANDATORY** when the function does `throw redirect()` or
   `throw notFound()` — the hook wires the throw into the router. Optional for
   plain-data functions (a direct call or `useMutation`/`useQuery` is fine).
5. **Strict serialization is on by default.** Validator input and handler return
   types must be serializable (`FormData` allowed as POST input, `Response`
   allowed as output). `strict: false` disables only the TS check, not runtime.

## Overview

| When to Use | Do NOT Use |
|-------------|------------|
| Internal type-safe RPC from your own app | Public/cross-origin API (use start-server-routes) |
| Data fetching in loaders | Raw HTTP method routing on a URL path |
| Mutations from event handlers | Composable auth/logging chains (use start-middleware) |

## Architecture

```
src/utils/
├── users.functions.ts   # createServerFn wrappers — safe to import anywhere
├── users.server.ts      # Server-only helpers (DB queries, secrets)
└── schemas.ts           # Shared Zod schemas — client-safe
```

The build replaces server function bodies with RPC stubs in the client bundle,
so static imports of `.functions.ts` from client components are safe.

→ See [crud-server-functions.md](references/templates/crud-server-functions.md)

## Reference Guide

### Concepts

| Topic | Reference | Load when |
|-------|-----------|-----------|
| Creating functions | [creating.md](references/creating.md) | Defining createServerFn, validators, serialization |
| Calling functions | [calling.md](references/calling.md) | Invoking from loaders/components, useServerFn, redirect/notFound |
| Security | [security.md](references/security.md) | Enforcing auth, CSRF, caching auth'd responses |

### Templates

| Template | When to Use |
|----------|-------------|
| [crud-server-functions.md](references/templates/crud-server-functions.md) | Building a full CRUD module |
| [form-with-validation.md](references/templates/form-with-validation.md) | Handling FormData submissions with Zod |

## Quick Reference

### Basic function with validation

```tsx
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export const createUser = createServerFn({ method: 'POST' })
  .validator(z.object({ name: z.string().min(1) }))
  .handler(async ({ data }) => db.users.create(data))

await createUser({ data: { name: 'John' } })
```

### Redirect (requires useServerFn in components)

```tsx
import { useServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'

const signup = createServerFn({ method: 'POST' })
  .handler(async () => { throw redirect({ to: '/dashboard' }) })

// In a component:
const signupFn = useServerFn(signup)
```

→ See [calling.md](references/calling.md) for the full redirect/notFound rules

## Best Practices

### DO
- Enforce auth inside every handler that reads/writes private data
- Split server-only helpers into `.server.ts`, wrappers into `.functions.ts`
- Validate every input crossing the network boundary with Zod
- Wrap with `useServerFn` when in doubt (no-op for plain-data functions)

### DON'T
- Rely on route guards to protect a server function
- Use `"use server"`, `getServerSideProps`, or Remix `action`
- Put DB queries or secrets in a route loader
- Dynamically `import()` server functions (breaks bundler shaking)
