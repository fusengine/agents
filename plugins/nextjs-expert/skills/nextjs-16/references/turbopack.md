# Turbopack

## Default Bundler in v16

Turbopack is now the **default bundler** for both development and production.

- **2-5x faster** production builds
- **Up to 10x faster** Fast Refresh
- No configuration needed

## Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // Custom module aliases
      underscore: 'lodash'
    },
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js']
  }
}

export default nextConfig
```

## Opt-out to Webpack

```bash
# Development
next dev --webpack

# Production
next build --webpack
```

Or in scripts:
```json
{
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build --webpack"
  }
}
```

## File System Cache (Beta)

Enable persistent caching:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true
  }
}
```

## Sass Import Changes

```scss
// ❌ Old (Webpack)
@import '~bootstrap/dist/css/bootstrap.min.css';

// ✅ New (Turbopack)
@import 'bootstrap/dist/css/bootstrap.min.css';
```

## Webpack Loaders in Turbopack

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js'
      }
    }
  }
}
```

## Environment Variables

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  turbopack: {
    env: {
      MY_VAR: 'value'
    }
  }
}
```

## Unsupported Features

Features not yet supported in Turbopack:
- `webpack()` function in next.config.js
- Some Webpack plugins
- Custom Webpack configurations

Use `--webpack` flag if you need these features.

## Performance Tips

1. Use TypeScript for better caching
2. Minimize `node_modules` size
3. Use path aliases (`@/`)
4. Enable file system cache
