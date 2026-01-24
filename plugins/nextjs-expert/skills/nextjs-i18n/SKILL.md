---
name: nextjs-i18n
description: Next.js 16 i18n modular SOLID - proxy.ts, modules/cores/i18n/, [lang] segment, await params. Use when implementing translations in Next.js App Router.
user-invocable: false
---

# Next.js 16 Internationalization (SOLID)

## Modular Architecture

```text
src/
├── app/[lang]/
│   ├── layout.tsx           # Imports from modules/cores/i18n
│   └── page.tsx
│
├── modules/cores/i18n/       # i18n module in cores
│   ├── src/
│   │   ├── interfaces/
│   │   │   └── i18n.interface.ts
│   │   ├── services/
│   │   │   ├── dictionary.service.ts
│   │   │   └── locale.service.ts
│   │   └── config/
│   │       └── locales.ts
│   └── dictionaries/
│       ├── en.json
│       └── fr.json
│
└── proxy.ts                  # Root level (Next.js requirement)
```

---

## Config (modules/cores/i18n/src/config/locales.ts)

```typescript
/** Supported locales configuration. */
export const locales = ['en', 'fr', 'de'] as const

/** Default locale. */
export const defaultLocale = 'en'

/** Locale type. */
export type Locale = (typeof locales)[number]
```

---

## Interfaces (modules/cores/i18n/src/interfaces/i18n.interface.ts)

```typescript
import type { Locale } from '../config/locales'

/** Dictionary structure. */
export interface Dictionary {
  home: {
    title: string
    description: string
  }
  nav: {
    home: string
    about: string
  }
}

/** Page props with lang param. */
export interface LangPageProps {
  params: Promise<{ lang: Locale }>
}

/** Layout props with lang param. */
export interface LangLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}
```

---

## Services (modules/cores/i18n/src/services/)

### dictionary.service.ts

```typescript
import 'server-only'
import type { Locale } from '../config/locales'
import type { Dictionary } from '../interfaces/i18n.interface'

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('../../dictionaries/en.json').then((m) => m.default),
  fr: () => import('../../dictionaries/fr.json').then((m) => m.default),
  de: () => import('../../dictionaries/de.json').then((m) => m.default),
}

/**
 * Get dictionary for locale.
 *
 * @param locale - Target locale
 * @returns Translated dictionary
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]()
}
```

### locale.service.ts

```typescript
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { locales, defaultLocale, type Locale } from '../config/locales'

/**
 * Detect locale from Accept-Language header.
 *
 * @param acceptLanguage - Header value
 * @returns Matched locale
 */
export function getLocaleFromHeader(acceptLanguage: string): Locale {
  const headers = { 'accept-language': acceptLanguage }
  const languages = new Negotiator({ headers }).languages()
  return match(languages, locales, defaultLocale) as Locale
}

/**
 * Check if pathname has locale prefix.
 *
 * @param pathname - URL pathname
 * @returns True if locale present
 */
export function hasLocalePrefix(pathname: string): boolean {
  return locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
}
```

---

## Proxy (proxy.ts)

> Next.js 16: `middleware.ts` deprecated → `proxy.ts`

```typescript
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

## Layout (app/[lang]/layout.tsx)

```typescript
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

## Page (app/[lang]/page.tsx)

```typescript
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

---

## Dictionaries (modules/cores/i18n/dictionaries/)

### en.json

```json
{
  "home": {
    "title": "Welcome",
    "description": "This is the home page"
  },
  "nav": {
    "home": "Home",
    "about": "About"
  }
}
```

---

## Dependencies

```bash
bun add @formatjs/intl-localematcher negotiator
bun add -D @types/negotiator
```

---

## Best Practices

1. **Module in `modules/cores/i18n/`** - Shared across app
2. **Interfaces separated** - `src/interfaces/i18n.interface.ts`
3. **Services for logic** - `dictionary.service.ts`, `locale.service.ts`
4. **Config centralized** - `config/locales.ts`
5. **`proxy.ts`** - NOT middleware (Next.js 16)
6. **`await params`** - Promise-based params
7. **JSDoc on exports** - All public functions documented
8. **`server-only`** - Dictionaries stay on server
