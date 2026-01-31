---
name: hydration
description: SSR hydration patterns for Zustand with Next.js App Router
when-to-use: Handling SSR, avoiding hydration mismatches, persist middleware
keywords: hydration, SSR, skipHydration, rehydrate, persist, mismatch
priority: critical
requires: store-patterns.md
related: nextjs-integration.md, middleware.md
---

# SSR Hydration Patterns

Avoid hydration mismatches with Zustand in Next.js App Router.

## The Hydration Problem

```typescript
// ❌ Problem: Server and client render different values
'use client'

export function ThemeToggle() {
  // On server: always 'light' (default)
  // On client: might be 'dark' (from localStorage)
  const theme = useSettingsStore((state) => state.theme)

  return <button>{theme}</button> // Hydration mismatch!
}
```

---

## Solution 1: skipHydration + Manual Rehydrate

```typescript
// modules/cores/stores/settings.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'settings-storage',
      skipHydration: true, // Don't auto-hydrate
    }
  )
)
```

```typescript
// modules/cores/components/StoreInitializer.tsx
'use client'

import { useEffect } from 'react'
import { useSettingsStore } from '../stores/settings.store'

export function StoreInitializer() {
  useEffect(() => {
    // Manually rehydrate after mount
    useSettingsStore.persist.rehydrate()
  }, [])

  return null
}
```

```typescript
// app/layout.tsx
import { StoreInitializer } from '@/modules/cores/components/StoreInitializer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StoreInitializer />
        {children}
      </body>
    </html>
  )
}
```

---

## Solution 2: Hydration Guard Component

```typescript
// modules/cores/components/HydrationGuard.tsx
'use client'

import { useState, useEffect, type ReactNode } from 'react'

interface HydrationGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export function HydrationGuard({
  children,
  fallback = null,
}: HydrationGuardProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return fallback
  }

  return <>{children}</>
}
```

```typescript
// Usage
'use client'

import { HydrationGuard } from '@/modules/cores/components/HydrationGuard'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header>
      <HydrationGuard fallback={<div className="w-8 h-8" />}>
        <ThemeToggle />
      </HydrationGuard>
    </header>
  )
}
```

---

## Solution 3: useIsMounted Hook

```typescript
// modules/cores/hooks/use-is-mounted.ts
'use client'

import { useState, useEffect } from 'react'

export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}
```

```typescript
// modules/cores/components/ThemeToggle.tsx
'use client'

import { useIsMounted } from '../hooks/use-is-mounted'
import { useSettingsStore } from '../stores/settings.store'

export function ThemeToggle() {
  const isMounted = useIsMounted()
  const theme = useSettingsStore((state) => state.theme)
  const setTheme = useSettingsStore((state) => state.setTheme)

  // Show skeleton until hydrated
  if (!isMounted) {
    return <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
  }

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
```

---

## Solution 4: onRehydrateStorage Callback

```typescript
// modules/cores/stores/auth.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  isHydrated: boolean
  setToken: (token: string | null) => void
  setHydrated: (hydrated: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isHydrated: false,
      setToken: (token) => set({ token }),
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // Called when hydration completes
        state?.setHydrated(true)
      },
    }
  )
)
```

```typescript
// modules/auth/src/components/AuthGuard.tsx
'use client'

import { useAuthStore } from '../stores/auth.store'
import { Skeleton } from '@/modules/cores/shadcn/components/ui/skeleton'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isHydrated = useAuthStore((state) => state.isHydrated)
  const token = useAuthStore((state) => state.token)

  if (!isHydrated) {
    return <Skeleton className="h-screen w-full" />
  }

  if (!token) {
    return <div>Please login</div>
  }

  return <>{children}</>
}
```

---

## Best Practices

1. **Always use skipHydration** with persist middleware in SSR apps
2. **Show loading state** during hydration to avoid flash
3. **Keep hydration-dependent UI minimal** to reduce layout shift
4. **Use Skeleton components** from shadcn/ui for loading states
5. **Test with JavaScript disabled** to verify SSR output
