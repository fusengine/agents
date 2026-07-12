---
name: cloudflare
description: Deploy TanStack Start to Cloudflare Workers with @cloudflare/vite-plugin and wrangler
when-to-use: Target is Cloudflare Workers
keywords: cloudflare, workers, vite-plugin, viteEnvironment, wrangler, nodejs_compat, server-entry
priority: high
requires: build-and-adapters.md
related: env-and-checklist.md
source: https://tanstack.com/start/latest/docs/framework/react/guide/hosting
---

# Cloudflare Workers

## Overview

Cloudflare is an official partner. Its setup does NOT use Nitro — it uses `@cloudflare/vite-plugin` with `viteEnvironment: { name: 'ssr' }`, plus a `wrangler.jsonc` pointing `main` at `@tanstack/react-start/server-entry`. Deploy with `wrangler deploy` (no `node` start script).

---

## Key Concepts

| Piece | Value |
|-------|-------|
| **Plugin** | `cloudflare({ viteEnvironment: { name: 'ssr' } })` — BEFORE `tanstackStart()` |
| **Config** | `wrangler.jsonc` with `compatibility_flags: ["nodejs_compat"]` |
| **Entry** | `"main": "@tanstack/react-start/server-entry"` |
| **Deploy** | `vite build && tsc --noEmit` then `wrangler deploy` |

---

## Core Pattern

```ts
// vite.config.ts — plugin ORDER matters
export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart(),
    viteReact(),
  ],
})
```

→ See [cloudflare-deploy.md](templates/cloudflare-deploy.md) for wrangler.jsonc + scripts

---

## Setup Steps

| Step | Command |
|------|---------|
| Install | `pnpm add -D @cloudflare/vite-plugin wrangler` |
| Authenticate | `npx wrangler login` (`wrangler whoami` to check) |
| Deploy | `npm run deploy` (→ `vite build && wrangler deploy`) |
| Types | `wrangler types` (`cf-typegen` script) |

---

## Best Practices

### DO
- Put `cloudflare(...)` before `tanstackStart()` in the plugins array
- Set a recent `compatibility_date` and `nodejs_compat` flag in `wrangler.jsonc`
- Read env/bindings per request (Workers inject them at request time)

### DON'T
- Keep the Nitro `"start": "node .output/server/index.mjs"` script (remove it for CF)
- Read `process.env` / bindings at module scope — they are `undefined` at import on the edge

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Env undefined on Worker | Move the read inside the request handler |
| Build ignores CF plugin | Ensure `cloudflare()` precedes `tanstackStart()` |
| `node` start script left in | Replace with `deploy: wrangler deploy` |

---

## Related References

- [build-and-adapters.md](build-and-adapters.md) — the Nitro alternative for other hosts
- [env-and-checklist.md](env-and-checklist.md) — the per-request env rule in full
