---
name: start-deployment
description: Use when building or deploying a TanStack Start app — Cloudflare, Netlify, Vercel/Node/Bun, prerendering, or env vars. Do NOT use for app logic or generic Vite config.
versions:
  "@tanstack/react-start": "^1"
  vite: "^6"
user-invocable: false
references: references/build-and-adapters.md, references/cloudflare.md, references/prerendering.md, references/env-and-checklist.md, references/templates/vite-config-adapters.md, references/templates/cloudflare-deploy.md
related-skills: nextjs-16, astro-deployment
---

<objective>
Covers building and deploying TanStack Start apps across hosting targets: dedicated Vite plugins for Cloudflare Workers (@cloudflare/vite-plugin + wrangler.jsonc) and Netlify (@netlify/vite-plugin-tanstack-start), the Nitro layer for Vercel/Node/Docker/Bun/Railway (.output/server/index.mjs), and static prerendering via tanstackStart({ prerender }).

Covers production env-var handling (read process.env per request, never at module scope — Cloudflare injects env at request time so module-level reads are undefined on the edge), plugin ordering (cloudflare() before tanstackStart()), matching start scripts to the build output, React 19 pinning for Bun, and prerendering limits (dynamic $id routes, layout _ routes, and component-less routes are skipped unless linked via crawlLinks).

Includes full vite.config.ts templates per adapter and a complete Cloudflare Workers deploy template, plus a production checklist.

Do NOT use this skill for app data/auth logic (see start-routing-data / start-auth) or for generic Vite config unrelated to Start.
</objective>

# TanStack Start — Deployment

## Agent Workflow (MANDATORY)

Before ANY implementation, spawn in parallel:

1. **fuse-ai-pilot:explore-codebase** — read `vite.config.ts`, `package.json` scripts, existing adapter/wrangler config
2. **fuse-ai-pilot:research-expert** — verify adapter setup via Context7 `/websites/tanstack_start_framework_react`
3. **mcp__context7__query-docs** — confirm `tanstackStart` plugin + adapter options for the target host

After implementation, run **fuse-ai-pilot:sniper**.

---

## Overview

| Target | Setup |
|--------|-------|
| **Cloudflare Workers** ⭐ | `@cloudflare/vite-plugin` (`viteEnvironment: { name: 'ssr' }`) + `wrangler.jsonc` |
| **Netlify** ⭐ | `@netlify/vite-plugin-tanstack-start` |
| **Vercel / Node / Docker / Bun / Railway** | Nitro layer (`nitro/vite`), `.output/server/index.mjs` |
| **Static** | `tanstackStart({ prerender: { routes, crawlLinks } })` |

Start builds with **Vite** (or Rsbuild). Most hosts go through **Nitro**, an agnostic deploy layer; Cloudflare and Netlify have dedicated Vite plugins.

---

## Critical Rules

1. **Read env per request** — `process.env.X` inside handlers, NEVER at module scope; Cloudflare injects env at request time, so module reads are `undefined` on the edge.
2. **Cloudflare plugin order** — `cloudflare({ viteEnvironment: { name: 'ssr' } })` before `tanstackStart()` in the plugins array.
3. **Match `start` to the build** — Nitro output starts with `node .output/server/index.mjs`; Cloudflare uses `wrangler deploy` (no `node` start).
4. **React 19 for Bun** — pin `react`/`react-dom` to `>= 19` when deploying on Bun.
5. **Prerender excludes dynamics** — param routes (`$id`), layout routes (`_`), and component-less routes are skipped unless linked with `crawlLinks`.

---

## Architecture

```
vite.config.ts        # tanstackStart() + host adapter (cloudflare / netlify / nitro)
wrangler.jsonc        # Cloudflare only — main: @tanstack/react-start/server-entry
package.json          # scripts differ per target (deploy vs start)
.output/server/       # Nitro build output (Node/Vercel/Bun/Railway)
```

→ See [vite-config-adapters.md](references/templates/vite-config-adapters.md) for every adapter config

---

## Reference Guide

### Concepts

| Topic | Reference | Load when |
|-------|-----------|-----------|
| **Build & adapters** | [build-and-adapters.md](references/build-and-adapters.md) | Choosing/configuring a host (Nitro, Vercel, Node, Bun, Railway, Netlify) |
| **Cloudflare** | [cloudflare.md](references/cloudflare.md) | Deploying to Cloudflare Workers |
| **Prerendering** | [prerendering.md](references/prerendering.md) | Generating static HTML at build time |
| **Env & checklist** | [env-and-checklist.md](references/env-and-checklist.md) | Production env vars + pre-deploy checklist |

### Templates

| Template | When to Use |
|----------|-------------|
| [vite-config-adapters.md](references/templates/vite-config-adapters.md) | Full `vite.config.ts` per target + prerender |
| [cloudflare-deploy.md](references/templates/cloudflare-deploy.md) | Complete Cloudflare Workers setup |

---

## Best Practices

### DO
- Confirm the official partner list (Cloudflare, Netlify, Railway) before hand-rolling config
- Keep secrets in the host's env store; read them per request
- Prerender marketing/blog routes; keep dynamic/auth routes SSR

### DON'T
- Read `process.env` at import time (edge = undefined; bundle leak)
- Mix a Nitro `node` start script with a Cloudflare build
- Expect `$param` routes to prerender without `crawlLinks`
