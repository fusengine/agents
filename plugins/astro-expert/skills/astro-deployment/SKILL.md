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
Configures Astro 7 deployment across the four major adapters: `@astrojs/cloudflare` (Workers runtime, D1/KV/R2 bindings, workerd local dev via `platformProxy`, v13+ required), `@astrojs/vercel` (Serverless/Edge, built-in Image CDN, skew protection), `@astrojs/netlify` (Deno-based Edge Functions), and `@astrojs/node` (standalone server).

Also covers output-mode selection (`static`/`server`, per-page `prerender`), ISR patterns implemented via platform caching (Cloudflare KV or Vercel `stale-while-revalidate`, since Astro has no native ISR), and edge middleware for auth/redirects/A-B testing. Does not cover Astro DB setup itself (astro-db) or Islands hydration directives (astro-islands) beyond what's needed to pick a server adapter.
</objective>

# Astro Deployment

Production deployment for Astro 7 across all major platforms — Cloudflare, Vercel, Netlify, and Node.js.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

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
| Cloudflare | `@astrojs/cloudflare` v13+ | workerd | Astro 6: `astro dev` runs on workerd |
| Vercel | `@astrojs/vercel` | Node/Edge | Image CDN built-in |
| Netlify | `@astrojs/netlify` | Edge | Deno-based edge functions |
| Node.js | `@astrojs/node` | Node | Standalone server mode |

---

## Core Concepts

### Output Modes

- `output: 'static'` — Full SSG, no adapter needed
- `output: 'server'` — Full SSR, adapter required
- Per-page: Mix with `export const prerender = true/false`

### Cloudflare Astro

Astro 6 runs `astro dev` on workerd — same runtime as production. Enables D1, KV, R2 bindings in local dev via `platformProxy`. No more simulation gaps. Requires `@astrojs/cloudflare` v13+ and Node.js 22+.

### ISR Pattern

Astro has no native ISR. Implement with platform caching: Cloudflare KV as cache layer, or Vercel's `Cache-Control` with `stale-while-revalidate`.

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
2. **Cloudflare: use v13+ for Astro 7** - Required for workerd local dev
3. **Node.js 22+ for Astro 7** - Drops Node 18/20 support
4. **Per-page prerender** - Mix static and SSR for optimal performance
5. **Test bindings locally** - Cloudflare platformProxy enables local D1/KV/R2
