---
name: cloudflare-adapter
description: "@astrojs/cloudflare v14 adapter for Astro 7 — Workers, D1, KV, R2, wrangler config"
when-to-use: Deploying Astro to Cloudflare Workers with platform bindings
keywords: Cloudflare, Workers, D1, KV, R2, wrangler, cloudflare:workers, astrojs/cloudflare
priority: high
---

# Cloudflare Adapter

## When to Use

- Deploying to Cloudflare Workers (edge computing)
- Using Cloudflare D1 (SQLite), KV (key-value), or R2 (object storage)
- Since Astro 6: `astro dev` / `astro preview` run on workerd (same as production)

## Requirements

- `@astrojs/cloudflare` v14 for Astro 7 (v13 targets Astro 6)
- Astro 7.2+ (peer range of v14)
- Node.js 22.12+
- Wrangler 4.x (peer `^4.125.0`)

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
    imageService: 'cloudflare-binding', // default since v13 (Cloudflare Images binding)
  }),
});
```

Local bindings (D1/KV/R2) work in `astro dev` out of the box — the adapter runs the Cloudflare Vite plugin on workerd; `platformProxy` is no longer a documented option.

## wrangler.toml

Optional for simple projects (Astro generates a default config). `wrangler.jsonc` is also supported and is what the official docs use.

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
import { env } from 'cloudflare:workers';
const { DB, KV } = env;

// D1 query
const result = await DB.prepare('SELECT * FROM posts').all();

// KV get/set
await KV.put('key', 'value');
const val = await KV.get('key');

// cf object and execution context
const country = Astro.request.cf?.country;
Astro.locals.cfContext.waitUntil(somePromise);
```

## Per-Page Prerender

```ts
// Mix static + SSR per page
export const prerender = true;  // Static
export const prerender = false; // SSR (default in server mode)
```

## Key Breaking Change (Astro 6 / adapter v13)

`Astro.locals.runtime` was removed: use `import { env } from 'cloudflare:workers'` for env/bindings, `Astro.request.cf` for the `cf` object, global `caches`, and `Astro.locals.cfContext` for the `ExecutionContext`. Cloudflare Pages deployment is no longer supported (Workers only). `Astro.glob()` removed — use `import.meta.glob()`.

## Astro 7.3: `finalize()` for Custom Worker Entrypoints

With `@astrojs/cloudflare` 14.3+, custom `astro/fetch` pipelines should pass the response through `finalize()` to apply cookies and CDN cache defaults:

```ts
import { astro, FetchState } from 'astro/fetch';
import { cf, finalize } from '@astrojs/cloudflare/fetch';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const state = new FetchState(request);
    const asset = await cf(state, env, ctx);
    if (asset) return asset;
    return finalize(state, await astro(state));
  },
};
```
