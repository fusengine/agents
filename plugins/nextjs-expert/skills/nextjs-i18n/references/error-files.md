---
name: error-files
description: Fichiers d'erreur localisés (not-found, error, loading) avec traductions
when-to-use: pages 404, pages d'erreur, états loading, fallbacks non trouvés, UX localisée
keywords: not-found.tsx, error.tsx, loading.tsx, error boundaries, custom errors
priority: medium
requires: client-components.md, server-components.md
related: error handling
---

# next-intl Error Files

## When to Use

- Localized 404 pages (not-found.tsx)
- Localized error pages (error.tsx)
- Loading states with translations
- Global fallback for unmatched routes

## Why Localized Error Pages

| Standard Error | Localized Error |
|----------------|-----------------|
| English only | User's language |
| Generic text | Helpful context |
| Poor UX | Professional UX |

## not-found.tsx

```typescript
// app/[locale]/not-found.tsx
import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('NotFound')
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  )
}
```

## Global not-found.tsx

```typescript
// app/not-found.tsx (outside [locale])
import { redirect } from 'next/navigation'

export default function GlobalNotFound() {
  redirect('/en/not-found')
}
```

## error.tsx

```typescript
// app/[locale]/error.tsx
'use client'
import { useTranslations } from 'next-intl'

export default function Error({
  error,
  reset
}: {
  error: Error
  reset: () => void
}) {
  const t = useTranslations('Error')
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <button onClick={reset}>{t('retry')}</button>
    </div>
  )
}
```

## loading.tsx

```typescript
// app/[locale]/loading.tsx
import { useTranslations } from 'next-intl'

export default function Loading() {
  const t = useTranslations('Common')
  return <div>{t('loading')}</div>
}
```

## Messages

```json
{
  "NotFound": {
    "title": "Page not found",
    "description": "The page you're looking for doesn't exist."
  },
  "Error": {
    "title": "Something went wrong",
    "description": "An error occurred.",
    "retry": "Try again"
  },
  "Common": {
    "loading": "Loading..."
  }
}
```
