---
name: nextjs-integration
description: Zustand with Next.js 16 App Router using Context pattern
when-to-use: Building stores for Next.js App Router applications
keywords: App Router, Context, Provider, SSR, request isolation
priority: critical
requires: installation.md
related: hydration.md, store-patterns.md
---

# Next.js App Router Integration

## Why Context Pattern?

In Next.js App Router, global stores are shared between requests. This can leak data between users. Use Context-based stores for request isolation.

---

## Context-Based Store Pattern

### 1. Create Vanilla Store

```typescript
// modules/auth/src/stores/auth.store.ts
import { createStore } from 'zustand/vanilla'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

export type AuthStore = ReturnType<typeof createAuthStore>

export const createAuthStore = (initialState?: Partial<AuthState>) => {
  return createStore<AuthState>()((set) => ({
    user: initialState?.user ?? null,
    isAuthenticated: initialState?.isAuthenticated ?? false,
    setUser: (user) =>
      set({
        user,
        isAuthenticated: !!user,
      }),
    logout: () =>
      set({
        user: null,
        isAuthenticated: false,
      }),
  }))
}
```

### 2. Create Provider

```typescript
// modules/auth/src/providers/auth-store-provider.tsx
'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { createAuthStore, type AuthState, type AuthStore } from '../stores/auth.store'

const AuthStoreContext = createContext<AuthStore | null>(null)

interface AuthStoreProviderProps {
  children: ReactNode
  initialState?: Partial<AuthState>
}

export function AuthStoreProvider({
  children,
  initialState,
}: AuthStoreProviderProps) {
  const storeRef = useRef<AuthStore>()

  if (!storeRef.current) {
    storeRef.current = createAuthStore(initialState)
  }

  return (
    <AuthStoreContext.Provider value={storeRef.current}>
      {children}
    </AuthStoreContext.Provider>
  )
}

export function useAuthStore<T>(selector: (state: AuthState) => T): T {
  const store = useContext(AuthStoreContext)

  if (!store) {
    throw new Error('useAuthStore must be used within AuthStoreProvider')
  }

  return useStore(store, selector)
}
```

### 3. Add Provider to Layout

```typescript
// app/layout.tsx
import { AuthStoreProvider } from '@/modules/auth/src/providers/auth-store-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthStoreProvider>
          {children}
        </AuthStoreProvider>
      </body>
    </html>
  )
}
```

### 4. Use in Client Components

```typescript
// modules/auth/src/components/UserProfile.tsx
'use client'

import { useAuthStore } from '../providers/auth-store-provider'

export function UserProfile() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  if (!user) {
    return <p>Not logged in</p>
  }

  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

---

## Server-Side Initial State

Pass initial state from Server Component to Provider.

```typescript
// app/dashboard/page.tsx
import { getSession } from '@/modules/auth/src/services/session'
import { AuthStoreProvider } from '@/modules/auth/src/providers/auth-store-provider'
import { Dashboard } from '@/modules/auth/src/components/Dashboard'

export default async function DashboardPage() {
  const session = await getSession()

  return (
    <AuthStoreProvider
      initialState={{
        user: session?.user ?? null,
        isAuthenticated: !!session?.user,
      }}
    >
      <Dashboard />
    </AuthStoreProvider>
  )
}
```

---

## Multiple Stores Pattern

```typescript
// app/layout.tsx
import { AuthStoreProvider } from '@/modules/auth/src/providers/auth-store-provider'
import { ThemeStoreProvider } from '@/modules/cores/providers/theme-store-provider'
import { CartStoreProvider } from '@/modules/cart/src/providers/cart-store-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeStoreProvider>
          <AuthStoreProvider>
            <CartStoreProvider>
              {children}
            </CartStoreProvider>
          </AuthStoreProvider>
        </ThemeStoreProvider>
      </body>
    </html>
  )
}
```

---

## When to Use Global vs Context Stores

| Use Case | Pattern |
|----------|---------|
| Next.js App Router | Context-based stores |
| Next.js Pages Router | Global stores OK |
| React SPA | Global stores OK |
| Multi-tenant apps | Context-based stores |
| User-specific state | Context-based stores |
| Static/shared state | Global stores OK |
