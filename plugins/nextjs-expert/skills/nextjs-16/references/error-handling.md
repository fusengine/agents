# Error Handling

## error.tsx (Route Error Boundary)
```typescript
// app/dashboard/error.tsx
'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

## global-error.tsx (Root Error Boundary)
```typescript
// app/global-error.tsx
'use client'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html><body>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </body></html>
  )
}
```

## not-found.tsx
```typescript
// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <Link href="/">Return Home</Link>
    </div>
  )
}
```

## Trigger notFound
```typescript
import { notFound } from 'next/navigation'

export default async function Page({ params }) {
  const { id } = await params
  const item = await getItem(id)
  if (!item) notFound()  // Renders not-found.tsx
  return <div>{item.name}</div>
}
```

## Error Hierarchy
```
app/
├── error.tsx           # Catches dashboard/layout.tsx errors
└── dashboard/
    ├── layout.tsx
    ├── error.tsx       # Catches dashboard/page.tsx errors
    └── page.tsx
```

## Throw in Server Components
```typescript
export default async function Page() {
  const data = await fetchData()
  if (!data) throw new Error('Failed to fetch')  // Bubbles to error.tsx
  return <div>{data}</div>
}
```
