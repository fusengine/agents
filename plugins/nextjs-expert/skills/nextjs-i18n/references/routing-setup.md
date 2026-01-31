# next-intl Routing Setup (SOLID)

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
