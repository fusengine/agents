---
name: security
description: Content Security Policy, nonces, and security headers
when-to-use: XSS protection, clickjacking prevention, security hardening
keywords: CSP, nonce, security headers, HSTS, X-Frame-Options
priority: medium
requires: proxy.md
related: proxy.md, config-advanced.md
---

# Security (Content Security Policy)

## When to Use

- Content Security Policy setup
- Nonce-based script loading
- Security headers
- XSS protection

## Why CSP

| Header | Protection |
|--------|------------|
| CSP | XSS, injection |
| X-Frame-Options | Clickjacking |
| HSTS | HTTPS enforcement |
| Referrer-Policy | Privacy |

## CSP with Nonces
```typescript
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()

  const response = NextResponse.next()
  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('x-nonce', nonce)
  return response
}
```

## Reading Nonce in Components
```typescript
// app/layout.tsx
import { headers } from 'next/headers'
import Script from 'next/script'

export default async function RootLayout({ children }) {
  const nonce = (await headers()).get('x-nonce')

  return (
    <html>
      <body>
        {children}
        <Script src="https://analytics.com/script.js" nonce={nonce} />
      </body>
    </html>
  )
}
```

## Security Headers
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=()' },
      ],
    }]
  },
}
```

## Strict Transport Security
```typescript
{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }
```

## Development vs Production
```typescript
const isDev = process.env.NODE_ENV === 'development'
const scriptSrc = isDev
  ? "'self' 'unsafe-eval' 'unsafe-inline'"
  : `'self' 'nonce-${nonce}' 'strict-dynamic'`
```
