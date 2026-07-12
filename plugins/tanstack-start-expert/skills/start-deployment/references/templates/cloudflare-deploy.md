---
name: cloudflare-deploy
description: Complete Cloudflare Workers deployment setup for TanStack Start
keywords: cloudflare, workers, wrangler, vite-plugin, server-entry, nodejs_compat, deploy
source: https://tanstack.com/start/latest/docs/framework/react/guide/hosting
---

# Cloudflare Workers Deploy

## Overview

Every file needed to deploy a TanStack Start app to Cloudflare Workers: the Vite config with the Cloudflare plugin, the `wrangler.jsonc`, and the adjusted `package.json` scripts.

---

## Prerequisites

- A TanStack Start app
- `pnpm add -D @cloudflare/vite-plugin wrangler`
- A Cloudflare account (`npx wrangler login`)

---

## File: vite.config.ts

```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The Cloudflare plugin runs the SSR build in the 'ssr' Vite environment.
    // It MUST come before tanstackStart().
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart(),
    viteReact(),
  ],
})
```

---

## File: wrangler.jsonc

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "tanstack-start-app",
  "compatibility_date": "2025-09-02",
  "compatibility_flags": ["nodejs_compat"],
  // TanStack Start ships a Workers-ready server entry.
  "main": "@tanstack/react-start/server-entry"
}
```

---

## File: package.json (scripts)

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build && tsc --noEmit",
    "preview": "vite preview",
    "deploy": "npm run build && wrangler deploy",
    "cf-typegen": "wrangler types"
  }
}
```

> Remove any Nitro-style `"start": "node .output/server/index.mjs"` — Cloudflare deploys via `wrangler deploy`, not a Node process.

---

## Deploy Flow

```bash
# 1. Authenticate (once)
npx wrangler login      # verify with: npx wrangler whoami

# 2. Build + deploy
pnpm run deploy         # → vite build && tsc --noEmit && wrangler deploy

# 3. (optional) regenerate binding types after editing wrangler.jsonc
pnpm run cf-typegen
```

---

## Notes

- Set secrets with `wrangler secret put SESSION_SECRET` (or the dashboard) — never in the repo.
- Read env/bindings PER REQUEST; Workers inject them at request time, so module-scope reads are `undefined`.
- Full reference example: `examples/react/start-basic-cloudflare` in the TanStack router repo.
- Bump `compatibility_date` to a recent date and keep the `nodejs_compat` flag.
