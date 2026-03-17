---
name: cloudflare-adapter
description: @astrojs/cloudflare v13+ adapter for Astro 6 — Workers, D1, KV, R2, wrangler config
when-to-use: Deploying Astro to Cloudflare Workers with platform bindings
keywords: Cloudflare, Workers, D1, KV, R2, wrangler, platformProxy, astrojs/cloudflare
priority: high
---

# Cloudflare Adapter

## When to Use

- Deploying to Cloudflare Workers (edge computing)
- Using Cloudflare D1 (SQLite), KV (key-value), or R2 (object storage)
- Astro 6: `astro dev` runs on workerd (same as production)

## Requirements

- `@astrojs/cloudflare` v13+
- Astro 6+
- Node.js 22+
- Wrangler 4.x

## Install

```bash
npx astro add cloudflare
```

## astro.config.mjs

```js
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'cloudflare', // Use Cloudflare's image resizing
    platformProxy: { enabled: true }, // Enable D1/KV/R2 in dev
  }),
});
```

## wrangler.toml

```toml
name = "my-astro-app"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "your-database-id"

[[kv_namespaces]]
binding = "KV"
id = "your-kv-namespace-id"

[[r2_buckets]]
binding = "STORAGE"
bucket_name = "my-bucket"
```

## Access Bindings in Astro

```ts
// In .astro frontmatter or API routes
const { DB, KV, STORAGE } = Astro.locals.runtime.env;

// D1 query
const result = await DB.prepare('SELECT * FROM posts').all();

// KV get/set
await KV.put('key', 'value');
const val = await KV.get('key');
```

## Per-Page Prerender

```ts
// Mix static + SSR per page
export const prerender = true;  // Static
export const prerender = false; // SSR (default in server mode)
```

## Key Breaking Change (Astro 6)

`Astro.locals.runtime` API replaced. Access via `Astro.locals.runtime.env` directly. `Astro.glob()` removed — use `import.meta.glob()`.
