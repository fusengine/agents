---
name: vite-config-adapters
description: Complete vite.config.ts for every official TanStack Start host adapter plus prerender
keywords: vite.config, tanstackStart, nitro, cloudflare, netlify, bun, prerender, viteEnvironment
source: https://tanstack.com/start/latest/docs/framework/react/guide/hosting
---

# Vite Config per Adapter

## Overview

Copy the block matching your host. All examples use the `tanstackStart` Vite plugin plus `@vitejs/plugin-react`. Cloudflare and Netlify use dedicated plugins; everything else goes through Nitro.

---

## Prerequisites

- `@tanstack/react-start`, `vite`, `@vitejs/plugin-react` installed
- Host-specific plugin installed (see each block)

---

## File: vite.config.ts — Node / Vercel / Railway (Nitro)

```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'

// npm install nitro
export default defineConfig({
  plugins: [tanstackStart(), nitro(), viteReact()],
})
```

`package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "start": "node .output/server/index.mjs"
  }
}
```

---

## File: vite.config.ts — Bun (Nitro preset)

```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'

// Ensure react/react-dom >= 19: bun install react@19 react-dom@19
export default defineConfig({
  plugins: [tanstackStart(), nitro({ preset: 'bun' }), viteReact()],
})
```

---

## File: vite.config.ts — Cloudflare Workers

```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import viteReact from '@vitejs/plugin-react'

// pnpm add -D @cloudflare/vite-plugin wrangler
export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }), // BEFORE tanstackStart
    tanstackStart(),
    viteReact(),
  ],
})
```

---

## File: vite.config.ts — Netlify

```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'
import viteReact from '@vitejs/plugin-react'

// pnpm add -D @netlify/vite-plugin-tanstack-start ; deploy: npx netlify deploy
export default defineConfig({
  plugins: [tanstackStart(), netlify(), viteReact()],
})
```

---

## File: vite.config.ts — with Static Prerendering (full options)

```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    tanstackStart({
      prerender: {
        enabled: true, // master switch (default false)
        autoSubfolderIndex: true, // /page/index.html vs /page.html
        autoStaticPathsDiscovery: true, // discover + merge static routes
        concurrency: 14,
        crawlLinks: true, // follow links from rendered HTML
        filter: ({ path }) => !path.startsWith('/do-not-render-me'),
        retryCount: 2,
        retryDelay: 1000,
        failOnError: true,
        onSuccess: ({ page }) => console.log(`Rendered ${page.path}!`),
      },
      pages: [
        { path: '/my-page', prerender: { enabled: true, outputPath: '/my-page/index.html' } },
      ],
    }),
    viteReact(),
  ],
})
```

Simpler explicit-routes form:

```ts
tanstackStart({
  prerender: { routes: ['/blog', '/blog/posts/*'], crawlLinks: true },
})
```

---

## Notes

- Cloudflare plugin MUST precede `tanstackStart()`; other adapters are order-tolerant.
- The Nitro `nitro/vite` plugin is under active development — pin versions and report repros.
- For Vercel, follow the Nitro setup then use Vercel's one-click deploy.
- Prerendering also works with the Rsbuild plugin (`@tanstack/react-start/plugin/rsbuild`) using the same `prerender` shape.
