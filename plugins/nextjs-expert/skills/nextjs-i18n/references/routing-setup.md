---
name: routing-setup
description: Configuration de routing avec locales et création de navigation type-safe
when-to-use: setup routage, définir locales, créer composants navigation, interfaces i18n
keywords: defineRouting, createNavigation, routing config, navigation components
priority: high
requires: installation.md
related: routing-config.md, navigation.md, middleware-proxy.md
---

# next-intl Routing Setup (SOLID)

## When to Use

- Initial setup of i18n routing
- Define supported locales
- Create locale-aware navigation components
- Set up layout with provider

## Why This Setup

| Step | Purpose |
|------|---------|
| routing.ts | Central locale config |
| createNavigation | Locale-preserving Link/router |
| i18n.interface.ts | Type-safe props |
| proxy.ts | Locale detection |

## Routing Configuration

```typescript
// modules/cores/i18n/src/config/routing.ts
import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['en', 'fr', 'de'],
  defaultLocale: 'en'
})

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
```

## Interfaces

```typescript
// modules/cores/i18n/src/interfaces/i18n.interface.ts
import type { routing } from '../config/routing'

export type Locale = (typeof routing.locales)[number]

export interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}

export interface LocalePageProps {
  params: Promise<{ locale: Locale }>
}
```

## Proxy (Next.js 16)

```typescript
// proxy.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/modules/cores/i18n/src/config/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/', '/(fr|en|de)/:path*']
}
```

## Layout

```typescript
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/modules/cores/i18n/src/config/routing'
import type { LocaleLayoutProps } from '@/modules/cores/i18n/src/interfaces/i18n.interface'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  if (!routing.locales.includes(locale as any)) notFound()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
```
