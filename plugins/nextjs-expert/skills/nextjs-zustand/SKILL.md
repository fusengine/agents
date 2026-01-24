---
name: nextjs-zustand
description: Zustand for Next.js App Router - Client Components only, hydration handling, persist middleware. Use when implementing global state in Next.js.
user-invocable: false
---

# Zustand for Next.js

State management for Next.js Client Components.

## Installation

```bash
bun add zustand
```

---

## Important: Client Components Only

Zustand stores work in **Client Components only**. Server Components cannot use hooks.

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

---

## Basic Store

```typescript
// stores/useCounterStore.ts
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))
```

---

## Store with Async Actions

```typescript
// stores/useUserStore.ts
import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
}

interface UserState {
  user: User | null
  loading: boolean
  error: string | null
  fetchUser: (id: string) => Promise<void>
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUser: async (id) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`/api/users/${id}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const user = await res.json()
      set({ user, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  logout: () => set({ user: null }),
}))
```

---

## Persist with SSR Hydration

```typescript
// stores/useAuthStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  token: string | null
  isHydrated: boolean
  setToken: (token: string) => void
  clearToken: () => void
  setHydrated: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isHydrated: false,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
```

---

## Hydration Component

```typescript
// components/StoreHydration.tsx
'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'

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

// Alternative: use store's isHydrated
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

## Devtools

```typescript
// stores/useAppStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // state and actions
    }),
    { name: 'AppStore' }
  )
)
```

---

## Combined Middlewares

```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const useStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        // state
      }),
      { name: 'app-storage' }
    ),
    { name: 'AppStore' }
  )
)
```

---

## Best Practices

1. **Client Components only** - Use `'use client'` directive
2. **Handle hydration** - Avoid hydration mismatches
3. **Selector pattern** - `useStore((s) => s.field)` for performance
4. **Separate stores** - One store per domain (auth, cart, ui)
5. **Server state** - Use TanStack Query for server data
