---
name: cloudflare-setup-template
description: Complete Cloudflare Workers setup for Astro 7 (@astrojs/cloudflare v14) with D1, KV, and R2 bindings
type: template
---

# Cloudflare Workers Setup Template

## Install

```bash
npm create cloudflare@latest -- my-app --framework=astro
# OR add to existing project
npx astro add cloudflare
npm install wrangler@4 --save-dev
```

## astro.config.mjs

```js
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'cloudflare',
  }),
});
```

Bindings work in `astro dev` (workerd) without extra options — `platformProxy` is no longer a documented adapter option.

## wrangler.toml

`main` is optional: when set, it must point to `@astrojs/cloudflare/entrypoints/server` (or your custom worker), not a built file.

```toml
name = "my-astro-app"
main = "@astrojs/cloudflare/entrypoints/server"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "my-db"
database_id = "xxxx-xxxx-xxxx"

[[kv_namespaces]]
binding = "CACHE"
id = "xxxx-xxxx-xxxx"

[[r2_buckets]]
binding = "UPLOADS"
bucket_name = "my-uploads"

[vars]
PUBLIC_APP_URL = "https://my-app.workers.dev"
```

## .env (local dev only)

```bash
# Never commit this file
CLOUDFLARE_ACCOUNT_ID=your-account-id
```

## src/pages/api/data.ts

```ts
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async () => {
  const { DB, CACHE } = env;

  // Try cache first
  const cached = await CACHE.get('data');
  if (cached) return new Response(cached);

  // Query D1
  const { results } = await DB.prepare('SELECT * FROM items LIMIT 10').all();
  const json = JSON.stringify(results);

  // Cache for 5 minutes
  await CACHE.put('data', json, { expirationTtl: 300 });
  return new Response(json, { headers: { 'Content-Type': 'application/json' } });
};
```

## Deploy

```bash
npx wrangler deploy
```
