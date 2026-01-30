# i18n Services

Services for Next.js 16 internationalization.

## Dictionary Service

```typescript
// modules/cores/i18n/src/services/dictionary.service.ts
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

---

## Locale Service

```typescript
// modules/cores/i18n/src/services/locale.service.ts
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

## Config

```typescript
// modules/cores/i18n/src/config/locales.ts

/** Supported locales configuration. */
export const locales = ['en', 'fr', 'it', 'es', 'de'] as const

/** Default locale. */
export const defaultLocale = 'en'

/** Locale type. */
export type Locale = (typeof locales)[number]
```

---

## Interfaces

```typescript
// modules/cores/i18n/src/interfaces/i18n.interface.ts
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
