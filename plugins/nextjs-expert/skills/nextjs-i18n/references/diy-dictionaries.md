---
name: diy-dictionaries
description: Approche minimaliste sans dépendance, contrôle complet chargement messages
when-to-use: zéro dépendances, projets simples, contrôle complet, server components only
keywords: DIY i18n, dictionaries, getDictionary, minimaliste, zéro deps
priority: low
requires:
related: diy-locale-detection.md, core-library.md
---

# DIY i18n - Dictionaries (No Library)

## When to Use

- Minimal i18n without dependencies
- Full control over translation loading
- Server Components only (no client hydration)
- Simple projects with few translations

## Why DIY vs next-intl

| DIY | next-intl |
|-----|-----------|
| 0 dependencies | ~50KB |
| Manual pluralization | ICU format |
| No client hooks | useTranslations |
| Full control | Convention-based |

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

## Usage

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
