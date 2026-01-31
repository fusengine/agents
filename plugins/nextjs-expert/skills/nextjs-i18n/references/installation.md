---
name: installation
description: Installation et configuration initiale de next-intl avec structure SOLID
when-to-use: ajouter i18n, nouveau projet multilingue, setup initial, configuration
keywords: setup, bun add, package, messages, routing, configuration
priority: high
requires: routing-setup.md
related: core-library.md, plugin.md
---

# next-intl Installation

## When to Use

- New multilingual Next.js project
- Adding i18n to existing project
- Need full-featured i18n (ICU, pluralization, formatting)

## Why next-intl

| Feature | next-intl | DIY |
|---------|-----------|-----|
| ICU format | Yes | Manual |
| Pluralization | Built-in | Manual |
| Type safety | Yes | Manual |
| Client hooks | Yes | No |

## Install

```bash
bun add next-intl
```

## SOLID Project Structure

```
src/
├── app/[locale]/
│   ├── layout.tsx
│   └── page.tsx
├── modules/cores/i18n/
│   ├── src/
│   │   ├── config/
│   │   │   └── routing.ts
│   │   ├── interfaces/
│   │   │   └── i18n.interface.ts
│   │   └── services/
│   │       └── request.ts
│   └── messages/
│       ├── en.json
│       └── fr.json
└── proxy.ts
```

## 1. Messages (JSON)

```json
// modules/cores/i18n/messages/en.json
{
  "HomePage": { "title": "Hello world!", "about": "Go to the about page" }
}
```

## 2. Request Config

```typescript
// modules/cores/i18n/src/services/request.ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from '../config/routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})
```

## 3. next.config.ts

```typescript
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./modules/cores/i18n/src/services/request.ts')

export default withNextIntl({
  // Other Next.js config
})
```

## 4. Minimal Example

```typescript
// app/[locale]/page.tsx
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('HomePage')
  return <h1>{t('title')}</h1>
}
```
