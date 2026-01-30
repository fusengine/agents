# Advanced Routing

## Parallel Routes
Load multiple pages simultaneously in the same layout.

```
app/
├── @team/page.tsx        # Slot @team
├── @analytics/page.tsx   # Slot @analytics
└── layout.tsx            # Receives both slots
```

```typescript
// app/layout.tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode
  team: React.ReactNode
  analytics: React.ReactNode
}) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  )
}
```

## Intercepting Routes
Open modals while preserving URL context.

**Convention:**
- `(.)` = same level
- `(..)` = parent level
- `(..)(..)` = two levels up

```
app/
├── @modal/
│   └── (..)photo/[id]/page.tsx  # Modal view
├── photo/[id]/page.tsx          # Full page view
└── layout.tsx
```

```typescript
// app/@modal/(..)photo/[id]/page.tsx
'use client'
import { useRouter } from 'next/navigation'

export default async function PhotoModal({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { id } = await params

  return (
    <div className="modal" onClick={() => router.back()}>
      <img src={`/photos/${id}.jpg`} alt="Photo" />
    </div>
  )
}
```

## Default Slots
```typescript
// app/@modal/default.tsx
export default function Default() {
  return null  // No modal by default
}
```

## Conditional Routes
```typescript
// app/layout.tsx
import { getUser } from '@/modules/auth/src/services/session'

export default async function Layout({ children, admin, user }) {
  const role = await getUser()
  return role === 'admin' ? admin : user
}
```
