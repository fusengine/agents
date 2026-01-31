# next-intl Middleware/Proxy (SOLID)

## Next.js 16: proxy.ts

```typescript
// proxy.ts (root level)
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/modules/cores/i18n/src/config/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/', '/(fr|en|de)/:path*']
}
```

## Middleware Options

```typescript
export default createMiddleware(routing, {
  localeDetection: true,
  localeCookie: { name: 'NEXT_LOCALE', maxAge: 60 * 60 * 24 * 365 },
  localePrefix: 'as-needed'
})
```

## Custom Logic in Proxy

```typescript
// proxy.ts
import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from '@/modules/cores/i18n/src/config/routing'

const intlMiddleware = createMiddleware(routing)

export default function proxy(request: NextRequest) {
  // Skip API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Auth check
  const token = request.cookies.get('token')
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)']
}
```

## Matcher Patterns

```typescript
export const config = {
  // All pages except static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],

  // Only specific locales
  matcher: ['/', '/(en|fr|de)/:path*'],
}
```

## Domain-Based Routing

```typescript
export default createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  domains: [
    { domain: 'example.com', defaultLocale: 'en' },
    { domain: 'example.fr', defaultLocale: 'fr' }
  ]
})
```
