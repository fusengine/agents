---
name: turbopack
description: Turbopack bundler with faster builds and improved performance
when-to-use: all Next.js 16 projects, build performance optimization
keywords: Turbopack, bundler, build, performance, webpack migration
priority: medium
requires: installation.md
---

# Turbopack

## When to Use

- All Next.js 16 projects (default)
- Need faster development builds
- Want improved HMR performance
- Migrating from webpack

## Why Turbopack

| Metric | Improvement |
|--------|-------------|
| Production builds | 2-5x faster |
| Fast Refresh | Up to 10x faster |
| Cold start | 3x faster |
| Memory usage | 40% less |

## Default Bundler in v16
Turbopack is now the **default bundler** for `next dev` and `next build` in Next.js 16.
- **2-5x faster** production builds
- **Up to 10x faster** Fast Refresh
- No configuration needed
- Webpack remains available as an opt-out: `next build --webpack`

## Glob Imports (16.3)
```typescript
// Vite-compatible import.meta.glob, with HMR in Server Components
const posts = import.meta.glob('./posts/*.md', { eager: true })  // .md needs a loader in next.config
```

## Configuration
```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: { underscore: 'lodash' },
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js']
  }
}
export default nextConfig
```

## File System Cache
On by default for `next dev` (since 16.1) and `next build` (since 16.3).
Set a flag to `false` to opt out (e.g. CI that never restores `.next/cache`).
```typescript
const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,    // default true — .next/dev/cache/turbopack
    turbopackFileSystemCacheForBuild: true,  // default true — .next/cache/turbopack
  }
}
```

## Sass Import Changes
```scss
// ❌ Old: @import '~bootstrap/dist/css/bootstrap.min.css';
// ✅ New: @import 'bootstrap/dist/css/bootstrap.min.css';
```

## Loaders Configuration
```typescript
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' }
    }
  }
}
```

## Environment Variables
```typescript
const nextConfig: NextConfig = {
  turbopack: {
    env: { MY_VAR: 'value' }
  }
}
```

## Performance Tips
1. Use TypeScript for better caching
2. Minimize `node_modules` size
3. Use path aliases (`@/`)
4. Keep the file system cache enabled (default) and persist `.next/cache` in CI
