---
name: deployment
description: Deployment to Vercel, Docker, and static export
when-to-use: deploying to production, containerization, self-hosting
keywords: Vercel, Docker, deployment, standalone, environment variables
priority: high
requires: installation.md
related: environment.md
---

# Deployment

## When to Use

- Deploying to Vercel (recommended)
- Self-hosting with Docker
- Static export for CDN
- Environment configuration

## Why Standalone Output

| Feature | Benefit |
|---------|---------|
| Smaller image | Only necessary files |
| No node_modules | Dependencies traced |
| Docker ready | Easy containerization |
| Fast startup | Minimal runtime |

## Vercel (Recommended)
```bash
# Install CLI
bun add -g vercel

# Deploy preview
vercel

# Deploy production
vercel --prod
```

## Docker with Standalone
```typescript
// next.config.ts
const nextConfig = {
  output: 'standalone',
}
```

```dockerfile
# Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json bun.lockb ./
RUN npm install -g bun && bun install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g bun && bun run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

## Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://...
```

## Static Export
```typescript
// next.config.ts
const nextConfig = {
  output: 'export',
}
```

```bash
bun run build  # Generates /out folder
```

## Environment Variables
```bash
# .env.production
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Build Commands
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start -p $PORT"
  }
}
```
