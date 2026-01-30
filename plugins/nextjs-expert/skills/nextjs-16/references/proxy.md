# proxy.ts (Route Protection)

> **Note**: `middleware.ts` is deprecated in Next.js 16. Use `proxy.ts`.

## File Location

```
# Project root (same level as app/)
proxy.ts
app/
└── ...
```

## Basic proxy.ts

```typescript
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect example
  if (pathname === '/old-page') {
    return NextResponse.redirect(new URL('/new-page', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
}
```

## Authentication Protection

```typescript
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  const { pathname } = request.nextUrl

  const protectedRoutes = ['/dashboard', '/settings', '/profile']
  const isProtected = protectedRoutes.some(r => pathname.startsWith(r))

  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/login']
}
```

## Matcher Patterns

```typescript
export const config = {
  matcher: [
    // Single path
    '/about',
    // Dynamic segments
    '/blog/:slug*',
    // Exclude static files
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}
```

## Setting Headers

```typescript
export function proxy(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set('x-custom-header', 'value')
  return response
}
```

## Migration from middleware.ts

```bash
# Codemod
bunx @next/codemod middleware-to-proxy .
```

Changes:
- Rename `middleware.ts` → `proxy.ts`
- Rename function `middleware()` → `proxy()`

## Runtime

- **Default**: Node.js runtime
- Edge runtime is **not supported** in proxy.ts
- If you need Edge, continue using `middleware.ts`
