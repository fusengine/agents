---
name: other-frameworks
description: Integration guide for non-Next.js frameworks
when-to-use: sveltekit, nuxt, remix, astro, other frameworks
keywords: frameworks, sveltekit, nuxt, remix, astro, svelte
priority: medium
requires: installation.md, basic-usage.md
related: integrations/nextjs.md
---

# Better Auth Framework Integrations

## When to Use

- Non-Next.js framework integration
- SvelteKit, Nuxt, Remix, Astro setup
- Express, Hono, Fastify backend
- Framework-specific handler patterns

## Why Same Auth, Different Handlers

| Component | Shared |
|-----------|--------|
| Auth config | Same `betterAuth()` |
| Plugins | Same plugins |
| Database | Same adapters |
| Client | Framework-specific |

## SvelteKit

```typescript
// src/hooks.server.ts
import { auth } from "$lib/auth"
import { svelteKitHandler } from "better-auth/svelte-kit"

export const handle = svelteKitHandler({ auth })

// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/svelte"
export const authClient = createAuthClient()
```

## Nuxt

```typescript
// server/api/auth/[...all].ts
import { auth } from "~/server/auth"
export default defineEventHandler((event) => auth.handler(toWebRequest(event)))

// composables/auth.ts
import { createAuthClient } from "better-auth/vue"
export const useAuth = () => createAuthClient()
```

## Remix

```typescript
// app/routes/api.auth.$.ts
import { auth } from "~/auth.server"
export const loader = ({ request }) => auth.handler(request)
export const action = ({ request }) => auth.handler(request)
```

## Astro

```typescript
// src/pages/api/auth/[...all].ts
import { auth } from "../../../auth"
export const ALL = ({ request }) => auth.handler(request)
```

## Express

```typescript
import express from "express"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./auth"

const app = express()
app.all("/api/auth/*", toNodeHandler(auth))
```

## Hono

```typescript
import { Hono } from "hono"
import { auth } from "./auth"

const app = new Hono()
app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw))
```

## Fastify

```typescript
import Fastify from "fastify"
import { toNodeHandler } from "better-auth/node"

fastify.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  handler: toNodeHandler(auth)
})
```

## Common Pattern
All frameworks use the same `auth` instance. Only the handler differs.
