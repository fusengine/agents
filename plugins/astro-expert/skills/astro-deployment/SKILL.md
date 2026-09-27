---
name: astro-deployment
description: Use when deploying an Astro 7 app to Cloudflare, Vercel, Netlify, or Node.js — adapter setup, ISR patterns, edge middleware.
versions:
  astro: "7"
user-invocable: true
references: references/cloudflare-adapter.md, references/vercel-adapter.md, references/netlify-adapter.md, references/node-adapter.md, references/isr-patterns.md, references/edge-middleware.md, references/templates/cloudflare-setup.md, references/templates/vercel-setup.md
related-skills: astro-7, astro-db, astro-islands
---

<objective>
Configures Astro 7 deployment across the four major adapters: `@astrojs/cloudflare` v14 (Workers runtime, D1/KV/R2 bindings via `cloudflare:workers`, `astro dev` on workerd through the Cloudflare Vite plugin), `@astrojs/vercel` v11 (Serverless/Edge, built-in Image CDN, skew protection), `@astrojs/netlify` v8 (Deno-based Edge Functions), and `@astrojs/node` v11 (standalone server).

Also covers output-mode selection (`static`/`server`, per-page `prerender`), Astro 7's stable route caching (`cache` provider + `routeRules`, experimental CDN providers per adapter) alongside platform ISR (Vercel `isr`, Cloudflare KV, `stale-while-revalidate` headers), and edge middleware for auth/redirects/A-B testing. Does not cover Astro DB setup itself (astro-db) or Islands hydration directives (astro-islands) beyond what's needed to pick a server adapter.
</objective>

# Astro Deployment

Production deployment for Astro 7 across all major platforms — Cloudflare, Vercel, Netlify, and Node.js.

## Agent Workflow (MANDATORY)

Before ANY implementation, spawn 3 agents in parallel, one `Agent` call each with a `name`:

1. **fuse-ai-pilot:explore-codebase** - Analyze astro.config.mjs, output mode, and existing adapter
2. **fuse-ai-pilot:research-expert** - Verify adapter docs via Context7/Exa for target platform
3. **mcp__context7__query-docs** - Check Astro 7 adapter compatibility and breaking changes

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Deploying Astro to Cloudflare Workers with D1/KV/R2 bindings
- Configuring Vercel Serverless or Edge runtime with image CDN
- Setting up Netlify Edge Functions
- Running Astro as standalone Node.js server
- Implementing ISR (Incremental Static Regeneration) patterns
- Configuring edge middleware for auth/redirects

### Adapter Matrix

| Platform | Package | Runtime | Notes |
|----------|---------|---------|-------|
| Cloudflare | `@astrojs/cloudflare` v14 (Astro 7) | workerd | `astro dev` runs on workerd since Astro 6 (v13) |
| Vercel | `@astrojs/vercel` v11 | Node/Edge | Image CDN built-in |
| Netlify | `@astrojs/netlify` v8 | Edge | Deno-based edge functions |
| Node.js | `@astrojs/node` v11 | Node | Standalone server mode |

---

## Core Concepts

### Output Modes

- `output: 'static'` — Full SSG, no adapter needed
- `output: 'server'` — Full SSR, adapter required
- Per-page: Mix with `export const prerender = true/false`

### Cloudflare Astro

Since Astro 6, `astro dev` and `astro preview` run on workerd via the Cloudflare Vite plugin — same runtime as production, so D1, KV, R2 bindings work locally without `platformProxy` (no longer a documented adapter option). Access bindings with `import { env } from 'cloudflare:workers'` (`Astro.locals.runtime` was removed). Astro 7 requires `@astrojs/cloudflare` v14 (v13 peers `astro ^6`) and Node.js 22.12+.

### ISR Pattern

Astro 7 ships stable route caching: set a `cache.provider` (`memoryCache()`, or the experimental `cacheVercel()` / `cacheNetlify()` / `cacheCloudflare()` CDN providers) and call `Astro.cache.set({ maxAge, swr, tags })` or declare `routeRules`. Platform alternatives remain: Vercel `isr`, Cloudflare KV as cache layer, or `Cache-Control` with `stale-while-revalidate`.

### Skew Protection

On Vercel, enable skew protection to prevent asset mismatches between old client and new server during deployments.

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Cloudflare** | [cloudflare-adapter.md](references/cloudflare-adapter.md) | Workers, D1, KV, R2, wrangler |
| **Vercel** | [vercel-adapter.md](references/vercel-adapter.md) | Serverless, Edge, Image CDN |
| **Netlify** | [netlify-adapter.md](references/netlify-adapter.md) | Edge Functions, forms |
| **Node.js** | [node-adapter.md](references/node-adapter.md) | Standalone, Express integration |
| **ISR Patterns** | [isr-patterns.md](references/isr-patterns.md) | Cache strategies, revalidation |
| **Edge Middleware** | [edge-middleware.md](references/edge-middleware.md) | Auth, redirects, A/B testing |

### Templates

| Template | When to Use |
|----------|-------------|
| [cloudflare-setup.md](references/templates/cloudflare-setup.md) | Full Cloudflare config with bindings |
| [vercel-setup.md](references/templates/vercel-setup.md) | Vercel config with Edge/Image CDN |

---

## Best Practices

1. **Match adapter to platform early** - Switching adapters mid-project is painful
2. **Cloudflare: use v14 for Astro 7** - v13 targets Astro 6; workerd local dev since v13
3. **Node.js 22.12+ for Astro 7** - `engines.node >=22.12.0`; Node 18/20 unsupported
4. **Per-page prerender** - Mix static and SSR for optimal performance
5. **Test bindings locally** - `astro dev` on workerd exposes local D1/KV/R2 (no `platformProxy` needed)
