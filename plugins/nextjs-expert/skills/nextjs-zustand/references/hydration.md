# Zustand Hydration Patterns

SSR hydration handling with Zustand in Next.js App Router.

## Hydration Component

```typescript
// components/StoreHydration.tsx
'use client'

import { useEffect, useState } from 'react'

export function StoreHydration({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return null // or loading skeleton
  }

  return <>{children}</>
}
```

---

## Auth Guard with Store Hydration

```typescript
// components/AuthGuard.tsx
'use client'

import { useAuthStore } from '@/stores/useAuthStore'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isHydrated = useAuthStore((s) => s.isHydrated)

  if (!isHydrated) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}
```

---

## Usage in Client Components

```typescript
// components/UserProfile.tsx
'use client'

import { useUserStore } from '@/stores/useUserStore'
import { useEffect } from 'react'

export function UserProfile({ userId }: { userId: string }) {
  const { user, loading, error, fetchUser } = useUserStore()

  useEffect(() => {
    fetchUser(userId)
  }, [userId, fetchUser])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return <div>No user</div>

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}
```

---

## Important: Client Components Only

```typescript
// ❌ BAD - Server Component
// app/page.tsx
export default function Page() {
  const count = useCounterStore((s) => s.count) // Error!
}

// ✅ GOOD - Client Component
// app/Counter.tsx
'use client'
export function Counter() {
  const count = useCounterStore((s) => s.count)
}
```
