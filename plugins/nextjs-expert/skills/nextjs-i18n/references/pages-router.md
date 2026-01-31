---
name: pages-router
description: Utilisation next-intl avec Pages Router legacy, getStaticProps, middleware.ts
when-to-use: projets Pages Router legacy, migration, projets non-upgradeable
keywords: Pages Router, getStaticProps, getStaticPaths, middleware.ts, legacy
priority: low
requires: installation.md
related: routing-setup.md, middleware-proxy.md
---

# next-intl Pages Router

## When to Use

- Legacy Next.js projects using Pages Router
- Migration path before App Router
- Existing projects that cannot upgrade

## Why Pages Router is Different

| App Router | Pages Router |
|------------|--------------|
| proxy.ts | middleware.ts |
| Server Components | getStaticProps |
| getMessages() | Manual message loading |
| Recommended | Legacy |

## Installation

```bash
bun add next-intl
```

## Structure

```
src/
├── pages/
│   ├── _app.tsx
│   └── [locale]/
│       └── index.tsx
├── modules/cores/i18n/
│   ├── src/config/routing.ts
│   └── messages/
└── middleware.ts
```

## _app.tsx

```typescript
// pages/_app.tsx
import { NextIntlClientProvider } from 'next-intl'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextIntlClientProvider
      locale={pageProps.locale}
      messages={pageProps.messages}
    >
      <Component {...pageProps} />
    </NextIntlClientProvider>
  )
}
```

## getStaticProps

```typescript
// pages/[locale]/index.tsx
import { useTranslations } from 'next-intl'
import { routing } from '@/modules/cores/i18n/src/config/routing'

export default function HomePage() {
  const t = useTranslations('HomePage')
  return <h1>{t('title')}</h1>
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      locale,
      messages: (await import(`../../modules/cores/i18n/messages/${locale}.json`)).default
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: routing.locales.map((locale) => ({ params: { locale } })),
    fallback: false
  }
}
```

## Middleware

```typescript
// middleware.ts (NOT proxy.ts for Pages Router)
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/modules/cores/i18n/src/config/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
```

> **Note**: Pages Router is legacy. Prefer App Router for new projects.
