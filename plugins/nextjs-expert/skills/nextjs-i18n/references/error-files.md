# next-intl Error Files

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
