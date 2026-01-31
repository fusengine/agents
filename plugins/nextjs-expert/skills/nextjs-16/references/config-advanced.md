---
name: config-advanced
description: Advanced configuration with headers, redirects, rewrites, and experimental features
when-to-use: security headers, URL migrations, proxy routing
keywords: headers, redirects, rewrites, next.config.ts
priority: medium
requires: installation.md
related: security.md, proxy.md
---

# Advanced Configuration

## When to Use

- Custom HTTP headers
- URL redirects and rewrites
- Experimental features
- Build output configuration

## Why next.config.ts

| Feature | Purpose |
|---------|---------|
| Headers | Security, CORS |
| Redirects | URL migrations |
| Rewrites | Proxy, URL masking |
| Output | Deployment mode |

## Headers
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },
}
```

## Redirects
```typescript
const nextConfig = {
  async redirects() {
    return [
      { source: '/old/:slug', destination: '/new/:slug', permanent: true },  // 308
      { source: '/docs/:path*', destination: '/documentation/:path*', permanent: false },
    ]
  },
}
```

## Rewrites
```typescript
const nextConfig = {
  async rewrites() {
    return [
      { source: '/api/proxy/:path*', destination: 'https://external-api.com/:path*' },
      { source: '/blog/:slug', destination: '/posts/:slug' },
    ]
  },
}
```

## Experimental Features
```typescript
const nextConfig = {
  experimental: {
    ppr: true,                    // Partial Pre-rendering
    typedRoutes: true,            // Type-safe routes
    serverActions: { bodySizeLimit: '2mb' },
  },
}
```

## Output Configuration
```typescript
const nextConfig = {
  output: 'standalone',           // or 'export' for static
  basePath: '/app',
  assetPrefix: 'https://cdn.example.com',
  trailingSlash: true,
  poweredByHeader: false,
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
}
```
