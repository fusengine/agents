# DIY i18n - Dictionaries (No Library)

## Structure

```
modules/cores/i18n/
├── dictionaries/
│   ├── en.json
│   └── fr.json
├── src/
│   ├── config/locales.ts
│   ├── interfaces/i18n.interface.ts
│   └── services/dictionary.service.ts
```

## Config

```typescript
// modules/cores/i18n/src/config/locales.ts
export const locales = ['en', 'fr', 'de'] as const
export const defaultLocale = 'en'
export type Locale = (typeof locales)[number]
```

## Interface

```typescript
// modules/cores/i18n/src/interfaces/i18n.interface.ts
import type { Locale } from '../config/locales'

export interface Dictionary {
  home: { title: string; description: string }
  nav: { home: string; about: string }
}

export interface LangPageProps {
  params: Promise<{ lang: Locale }>
}

export interface LangLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}
```

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

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]()
}
```

## Dictionary JSON

```json
// modules/cores/i18n/dictionaries/en.json
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

## Usage in Page

```typescript
// app/[lang]/page.tsx
import { getDictionary } from '@/modules/cores/i18n/src/services/dictionary.service'
import type { LangPageProps } from '@/modules/cores/i18n/src/interfaces/i18n.interface'

export default async function HomePage({ params }: LangPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return <h1>{dict.home.title}</h1>
}
```
