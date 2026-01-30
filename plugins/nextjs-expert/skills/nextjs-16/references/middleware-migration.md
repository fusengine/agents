# Migration: Middleware → Proxy

## Breaking Change in v16
`middleware.ts` is **deprecated**. Use `proxy.ts` instead.

## Automatic Migration
```bash
bunx @next/codemod middleware-to-proxy .
```

## Manual Migration

### Before (v15)
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

### After (v16)
```typescript
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

## Key Changes
| v15 (middleware) | v16 (proxy) |
|------------------|-------------|
| `middleware.ts` | `proxy.ts` |
| `middleware()` | `proxy()` |
| Edge runtime | Node.js runtime |
| `src/middleware.ts` | Root `proxy.ts` |

## Runtime Difference
```typescript
// middleware.ts (v15) - Edge Runtime
export const runtime = 'edge'  // Default and only option

// proxy.ts (v16) - Node.js Runtime
// Runs in Node.js, NOT Edge
// More APIs available (fs, etc.)
```

## File Location
```
# v16 proxy.ts location
project/
├── proxy.ts          # Same level as app/
├── app/
└── ...
```

## When to Keep middleware.ts
If you **need Edge runtime** specifically, you can still use `middleware.ts`, but `proxy.ts` is recommended for most use cases.
