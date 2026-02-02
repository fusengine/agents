---
name: deployment
description: Production build, CDN, cache busting
when-to-use: Deploying Laravel app with Vite assets
keywords: deploy, production, cdn, cache, manifest
---

# Deployment

## Decision Tree

```
Using CDN for assets?
├── YES → Configure asset URL
└── NO → Using cache headers?
    ├── YES → Hash naming (default)
    └── NO → Consider enabling
```

## Build Process

| Step | Command |
|------|---------|
| Install deps | `npm ci` |
| Build assets | `npm run build` |
| Deploy | Include `public/build/` |

## CI/CD Pipeline

| Stage | Action |
|-------|--------|
| Install | `npm ci --production=false` |
| Build | `npm run build` |
| Test | `npm run test` (if configured) |
| Deploy | Sync files to server |

## Manifest File

| File | Purpose |
|------|---------|
| `public/build/manifest.json` | Asset mapping |
| Auto-generated | By Vite build |

## Cache Busting

| Feature | How |
|---------|-----|
| Content hash | `[name]-[hash].js` |
| Manifest | Maps original → hashed |
| Long cache | Set far-future expires |

## CDN Configuration

| Method | Purpose |
|--------|---------|
| `Vite::createAssetPathsUsing()` | Custom URL |
| Returns | Full CDN URL |

## Environment Detection

| Variable | Use |
|----------|-----|
| `import.meta.env.PROD` | Production check |
| `import.meta.env.DEV` | Development check |

## Deployment Checklist

| Check | Action |
|-------|--------|
| Build | `npm run build` |
| Manifest | Exists in `public/build/` |
| Permissions | `public/build/` readable |
| .env | `APP_ENV=production` |
| Cache | Clear Laravel cache |

## Server Config

| Server | Config |
|--------|--------|
| Nginx | Cache headers for `/build/` |
| Apache | mod_expires for assets |
| Cloudflare | Page rules for caching |

## Rollback Strategy

| Approach | Method |
|----------|--------|
| Keep old builds | Version directories |
| Symlink | Point to current build |
| Atomic deploy | Replace entire public/ |

→ **Code examples**: See [ViteConfigAdvanced.js.md](templates/ViteConfigAdvanced.js.md)
