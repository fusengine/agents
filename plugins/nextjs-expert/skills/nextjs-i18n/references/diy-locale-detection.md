# DIY i18n - Locale Detection (No Library)

## Dependencies

```bash
bun add @formatjs/intl-localematcher negotiator
bun add -D @types/negotiator
```

## Locale Service

```typescript
// modules/cores/i18n/src/services/locale.service.ts
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { locales, defaultLocale, type Locale } from '../config/locales'

/**
 * Detect locale from Accept-Language header.
 */
export function getLocaleFromHeader(acceptLanguage: string): Locale {
  const headers = { 'accept-language': acceptLanguage }
  const languages = new Negotiator({ headers }).languages()
  return match(languages, locales, defaultLocale) as Locale
}

/**
 * Check if pathname has locale prefix.
 */
export function hasLocalePrefix(pathname: string): boolean {
  return locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
}

/**
 * Extract locale from pathname.
 */
export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split('/')[1]
  return locales.includes(segment as Locale) ? (segment as Locale) : null
}
```

## Proxy (Next.js 16)

```typescript
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  getLocaleFromHeader,
  hasLocalePrefix,
} from '@/modules/cores/i18n/src/services/locale.service'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip if already has locale
  if (hasLocalePrefix(pathname)) return

  // Detect locale from header
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const locale = getLocaleFromHeader(acceptLanguage)

  // Redirect to localized URL
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
```

## Layout with generateStaticParams

```typescript
// app/[lang]/layout.tsx
import { locales } from '@/modules/cores/i18n/src/config/locales'

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}
```
