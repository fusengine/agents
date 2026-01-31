---
name: nextjs-i18n
description: Next.js 16 internationalization with next-intl or DIY. Use when implementing i18n, translations, localization, multilingual, language switch, [locale] routing, or formatters.
user-invocable: true
references: [references/installation.md, references/pages-router.md, references/routing-setup.md, references/routing-config.md, references/translations.md, references/formatting.md, references/navigation.md, references/server-components.md, references/client-components.md, references/middleware-proxy.md, references/error-files.md, references/configuration.md, references/plugin.md, references/extraction.md, references/messages-validation.md, references/typescript.md, references/testing.md, references/integrations.md, references/seo.md, references/core-library.md, references/runtime-requirements.md, references/diy-dictionaries.md, references/diy-locale-detection.md]
related-skills: [nextjs-16]
---

# Next.js 16 Internationalization (SOLID)

## Modular Architecture

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

## Quick Start

```bash
bun add next-intl
```

## Two Approaches

### 1. next-intl (Recommended)

```typescript
// modules/cores/i18n/src/config/routing.ts
import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['en', 'fr', 'de'],
  defaultLocale: 'en'
})

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
```

### 2. DIY (No Library)

```typescript
// modules/cores/i18n/src/services/dictionary.service.ts
export async function getDictionary(locale: Locale) {
  return import(`../../messages/${locale}.json`)
}
```

## When to Use References

- **Setup**: installation, routing-setup, routing-config
- **Usage**: translations, formatting, navigation
- **Components**: server-components, client-components
- **Routing**: middleware-proxy, error-files
- **Quality**: typescript, testing, seo
- **DIY**: diy-dictionaries, diy-locale-detection
