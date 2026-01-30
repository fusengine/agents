# Proxy (Next.js 16)

Proxy configuration for internationalization.

> Next.js 16: `middleware.ts` deprecated → `proxy.ts`

## proxy.ts

```typescript
// proxy.ts (root level)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from '@/modules/cores/i18n/src/config/locales'
import {
  getLocaleFromHeader,
  hasLocalePrefix,
} from '@/modules/cores/i18n/src/services/locale.service'

/**
 * Locale detection and redirect proxy.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (hasLocalePrefix(pathname)) return

  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const locale = getLocaleFromHeader(acceptLanguage)

  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
```

---

## Layout avec Locales

```typescript
// app/[lang]/layout.tsx
import { locales } from '@/modules/cores/i18n/src/config/locales'
import type { LangLayoutProps } from '@/modules/cores/i18n/src/interfaces/i18n.interface'

/** Generate static params for all locales. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

/**
 * Language layout wrapper.
 */
export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params

  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  )
}
```

---

## Page avec Traductions

```typescript
// app/[lang]/page.tsx
import { getDictionary } from '@/modules/cores/i18n/src/services/dictionary.service'
import type { LangPageProps } from '@/modules/cores/i18n/src/interfaces/i18n.interface'

/**
 * Home page with translations.
 */
export default async function HomePage({ params }: LangPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <main>
      <h1>{dict.home.title}</h1>
      <p>{dict.home.description}</p>
    </main>
  )
}
```
