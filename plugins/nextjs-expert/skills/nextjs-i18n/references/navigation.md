# next-intl Navigation (SOLID)

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
  const pathname = usePathname()  // Returns path WITHOUT locale
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
