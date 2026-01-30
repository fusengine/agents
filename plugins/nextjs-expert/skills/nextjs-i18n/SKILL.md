---
name: nextjs-i18n
description: This skill should be used when the user asks about "internationalization", "i18n", "translations", "localization", "multilingual", "language switch", or "[lang] routing". Covers Next.js 16 i18n with modular SOLID architecture and proxy.ts.
version: 1.0.0
user-invocable: false
references:
  - path: references/services.md
    title: i18n Services
  - path: references/proxy-middleware.md
    title: Proxy Configuration
---

# Next.js 16 Internationalization (SOLID)

## Modular Architecture

```text
src/
├── app/[lang]/
│   ├── layout.tsx
│   └── page.tsx
│
├── modules/cores/i18n/
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
└── proxy.ts                  # Root level (Next.js 16)
```

---

## Config

```typescript
// modules/cores/i18n/src/config/locales.ts
export const locales = ['en', 'fr', 'de'] as const
export const defaultLocale = 'en'
export type Locale = (typeof locales)[number]
```

---

## Dictionaries

```json
// modules/cores/i18n/dictionaries/en.json
{
  "home": {
    "title": "Welcome",
    "description": "This is the home page"
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
4. **`proxy.ts`** - NOT middleware (Next.js 16)
5. **`await params`** - Promise-based params
6. **`server-only`** - Dictionaries stay on server

See [Services](references/services.md) and [Proxy](references/proxy-middleware.md) for complete implementation.
