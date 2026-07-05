---
name: build-and-adapters
description: Start build pipeline (Vite/Rsbuild) and Nitro-based adapters for Vercel, Node, Bun, Railway, Netlify
when-to-use: Choosing and configuring a hosting target other than Cloudflare
keywords: nitro, vite, adapter, vercel, node, bun, railway, netlify, preset, .output
priority: high
related: cloudflare.md, env-and-checklist.md
source: https://tanstack.com/start/latest/docs/framework/react/guide/hosting
---

# Build & Adapters

## Overview

TanStack Start builds with **Vite** (or Rsbuild). It is designed to deploy anywhere; most hosts go through **Nitro** (`nitro/vite`), an agnostic layer that natively integrates with Vite's Environment API. Cloudflare and Netlify have their own dedicated Vite plugins instead.

---

## Key Concepts

| Target | Plugin / preset | Start command |
|--------|-----------------|---------------|
| **Node / Docker** | `nitro/vite` | `node .output/server/index.mjs` |
| **Vercel** | `nitro/vite` (one-click deploy) | handled by Vercel |
| **Bun** | `nitro({ preset: 'bun' })` | `node .output/server/index.mjs` or custom `server.ts` |
| **Railway** ⭐ | `nitro/vite` (auto-detected) | auto |
| **Netlify** ⭐ | `@netlify/vite-plugin-tanstack-start` | `netlify deploy` |

Official hosting partners: **Cloudflare, Netlify, Railway**.

---

## Decision Guide

```
Where are you deploying?
├── Cloudflare Workers → dedicated plugin → see cloudflare.md
├── Netlify           → @netlify/vite-plugin-tanstack-start
├── Vercel            → Nitro, one-click deploy
├── Bun runtime       → Nitro preset 'bun' (+ react/react-dom >= 19)
├── Node / Docker     → Nitro, node .output/server/index.mjs
└── Railway           → Nitro, connect repo (auto-detect)
```

---

## Core Pattern

```ts
// Node / Vercel / Railway — Nitro layer
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [tanstackStart(), nitro(), viteReact()],
})
```

→ See [vite-config-adapters.md](templates/vite-config-adapters.md) for Bun/Netlify variants

---

## Best Practices

### DO
- Ensure `build` (`vite build`) and the right `start` script exist in `package.json`
- Pin `react`/`react-dom` to `>= 19` for Bun deployments
- Prefer an official partner adapter over manual config when available

### DON'T
- Ship a Cloudflare build with a Nitro `node` start script (mismatched output)
- Assume Nitro's `nitro/vite` plugin is stable — it is under active development; report repros

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `start` script missing for Node | Add `"start": "node .output/server/index.mjs"` |
| Bun build fails on React | `bun install react@19 react-dom@19` |
| Wrong preset on Bun | `nitro({ preset: 'bun' })` |

---

## Related References

- [cloudflare.md](cloudflare.md) — the non-Nitro dedicated path
- [env-and-checklist.md](env-and-checklist.md) — env vars + pre-deploy checklist
