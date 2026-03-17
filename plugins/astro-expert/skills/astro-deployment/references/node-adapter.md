---
name: node-adapter
description: @astrojs/node standalone adapter for Node.js server deployment or Express integration
when-to-use: Self-hosted Node.js server, VPS, Docker, or Express integration
keywords: node, standalone, Express, Docker, self-hosted, middleware mode
priority: medium
---

# Node.js Adapter

## When to Use

- Self-hosting on VPS or bare metal
- Docker container deployment
- Integrating Astro into existing Express/Fastify app
- AWS EC2, Railway, Fly.io deployments

## Install

```bash
npx astro add node
```

## Standalone Mode (Recommended)

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
});
```

Run the built server:

```bash
npm run build
node ./dist/server/entry.mjs
```

## Middleware Mode (Express Integration)

```js
adapter: node({ mode: 'middleware' })
```

```ts
// server.ts (custom Express server)
import express from 'express';
import { handler as ssrHandler } from './dist/server/entry.mjs';

const app = express();
app.use(express.static('dist/client'));
app.use(ssrHandler);
app.listen(4321);
```

## Docker

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY dist ./dist
ENV HOST=0.0.0.0 PORT=4321 NODE_ENV=production
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
```

## Environment Variables

```bash
HOST=0.0.0.0  # Bind to all interfaces
PORT=4321      # Server port
```
