---
name: react-i18n
description: react-i18next modular SOLID - modules/cores/i18n/, useTranslation hook, namespaces, pluralization. Use when implementing translations in React apps (not Next.js).
user-invocable: false
---

# React Internationalization (SOLID)

## Modular Architecture

```text
src/
├── modules/cores/i18n/
│   ├── src/
│   │   ├── interfaces/
│   │   │   └── i18n.interface.ts
│   │   ├── services/
│   │   │   └── i18n.service.ts
│   │   ├── hooks/
│   │   │   └── useLanguage.ts
│   │   └── config/
│   │       └── i18n.config.ts
│   ├── components/
│   │   └── LanguageSwitcher.tsx
│   └── locales/
│       ├── en/
│       │   └── translation.json
│       └── fr/
│           └── translation.json
│
└── main.tsx
```

---

## Config (modules/cores/i18n/src/config/i18n.config.ts)

```typescript
/** Supported locales. */
export const locales = ['en', 'fr', 'de'] as const

/** Default locale. */
export const defaultLocale = 'en'

/** Locale type. */
export type Locale = (typeof locales)[number]

/** Namespaces for translations. */
export const namespaces = ['translation', 'common'] as const

/** Namespace type. */
export type Namespace = (typeof namespaces)[number]
```

---

## Interfaces (modules/cores/i18n/src/interfaces/i18n.interface.ts)

```typescript
import type { Locale, Namespace } from '../config/i18n.config'

/** Language switcher props. */
export interface LanguageSwitcherProps {
  className?: string
}

/** i18n context value. */
export interface I18nContextValue {
  locale: Locale
  changeLanguage: (lng: Locale) => Promise<void>
}
```

---

## Service (modules/cores/i18n/src/services/i18n.service.ts)

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { defaultLocale, namespaces } from '../config/i18n.config'

/**
 * Initialize i18n instance.
 *
 * @returns Configured i18n instance
 */
export function initI18n() {
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: defaultLocale,
      ns: [...namespaces],
      defaultNS: 'translation',
      interpolation: { escapeValue: false },
      backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
    })

  return i18n
}

export { i18n }
```

---

## Hook (modules/cores/i18n/src/hooks/useLanguage.ts)

```typescript
import { useTranslation } from 'react-i18next'
import type { Locale } from '../config/i18n.config'

/**
 * Language management hook.
 *
 * @returns Current locale and change function
 */
export function useLanguage() {
  const { i18n } = useTranslation()

  const changeLanguage = async (lng: Locale) => {
    await i18n.changeLanguage(lng)
  }

  return {
    locale: i18n.language as Locale,
    changeLanguage,
  }
}
```

---

## Component (modules/cores/i18n/components/LanguageSwitcher.tsx)

```typescript
import { locales } from '../src/config/i18n.config'
import { useLanguage } from '../src/hooks/useLanguage'
import type { LanguageSwitcherProps } from '../src/interfaces/i18n.interface'

/**
 * Language switcher component.
 */
export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, changeLanguage } = useLanguage()

  return (
    <div className={className}>
      {locales.map((lng) => (
        <button
          key={lng}
          onClick={() => changeLanguage(lng)}
          disabled={locale === lng}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
```

---

## Entry Point (main.tsx)

```typescript
import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { initI18n } from '@/modules/cores/i18n/src/services/i18n.service'
import App from './App'

// Initialize i18n
initI18n()

createRoot(document.getElementById('root')!).render(
  <Suspense fallback="Loading...">
    <App />
  </Suspense>
)
```

---

## Usage in Components

```typescript
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/modules/cores/i18n/components/LanguageSwitcher'

/**
 * Home page component.
 */
export function HomePage() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('hello', { name: 'John' })}</p>
      <LanguageSwitcher />
    </div>
  )
}
```

---

## Namespace Usage

```typescript
import { useTranslation } from 'react-i18next'

// Single namespace
const { t } = useTranslation('common')

// Multiple namespaces
const { t } = useTranslation(['translation', 'common'])
t('translation:welcome')
t('common:buttons.save')
```

---

## Trans Component (JSX in translations)

```typescript
import { Trans } from 'react-i18next'

<Trans
  i18nKey="richText"
  values={{ name: 'Alice' }}
  components={{
    bold: <strong />,
    link: <a href="/docs" />,
  }}
/>
```

```json
{
  "richText": "Hello <bold>{{name}}</bold>! <link>Read docs</link>"
}
```

---

## Pluralization

```json
{
  "items": "{{count}} item",
  "items_plural": "{{count}} items",
  "items_0": "No items"
}
```

```typescript
t('items', { count: 0 })  // "No items"
t('items', { count: 1 })  // "1 item"
t('items', { count: 5 })  // "5 items"
```

---

## Dependencies

```bash
bun add i18next react-i18next i18next-http-backend i18next-browser-languagedetector
```

---

## Best Practices

1. **Module in `modules/cores/i18n/`** - Shared across app
2. **Interfaces separated** - `src/interfaces/i18n.interface.ts`
3. **Service for init** - `i18n.service.ts`
4. **Custom hook** - `useLanguage.ts` for language management
5. **Config centralized** - `config/i18n.config.ts`
6. **JSDoc on exports** - All public functions documented
7. **Use namespaces** - Organize by feature
8. **Suspense** - For loading states
