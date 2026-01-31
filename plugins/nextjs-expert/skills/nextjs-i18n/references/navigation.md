---
name: navigation
description: Link preservant locale, useRouter, usePathname, redirect, language switcher
when-to-use: navigation entre pages, préservation locale, sélecteur langue, navigation client
keywords: Link, useRouter, usePathname, redirect, locale switcher, programmatic nav
priority: high
requires: routing-setup.md
related: routing-config.md, client-components.md
---

# next-intl Navigation (SOLID)

## When to Use

- Navigate between pages while preserving locale
- Build language switcher component
- Programmatic navigation in client components
- Server-side redirects with locale

## Why Custom Navigation

| next/link | next-intl Link |
|-----------|----------------|
| Loses locale on navigate | Auto-preserves locale |
| Manual locale handling | Built-in locale support |
| No typed routes | Type-safe with pathnames |

## Setup

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

## Link Component

```typescript
import { Link } from '@/modules/cores/i18n/src/config/routing'

<Link href="/about">About</Link>                    // Preserves locale
<Link href="/about" locale="fr">À propos</Link>     // Explicit locale
```

## useRouter Hook

```typescript
'use client'
import { useRouter } from '@/modules/cores/i18n/src/config/routing'

function Component() {
  const router = useRouter()
  router.push('/about')                    // Preserves locale
  router.push('/about', { locale: 'fr' }) // Change locale
}
```

## usePathname Hook

```typescript
'use client'
import { usePathname } from '@/modules/cores/i18n/src/config/routing'

function Component() {
  const pathname = usePathname()  // Returns path WITHOUT locale prefix
}
```

## redirect (Server)

```typescript
import { redirect } from '@/modules/cores/i18n/src/config/routing'

async function serverAction() {
  redirect('/dashboard')  // Preserves locale
}
```

## Language Switcher

```typescript
'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/modules/cores/i18n/src/config/routing'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <select value={locale} onChange={(e) => router.replace(pathname, { locale: e.target.value })}>
      <option value="en">English</option>
      <option value="fr">Français</option>
    </select>
  )
}
```
