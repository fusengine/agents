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
Turbopack is now the **only bundler** for Next.js 16.
- **2-5x faster** production builds
- **Up to 10x faster** Fast Refresh
- No configuration needed

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

## File System Cache (Beta)
```typescript
const nextConfig: NextConfig = {
  experimental: { turbopackFileSystemCacheForDev: true }
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
4. Enable file system cache
