---
name: reset-state
description: Patterns for resetting Zustand store state
when-to-use: Implementing logout, clear data, or reset functionality
keywords: reset, initial state, clear, logout, setState
priority: medium
requires: store-patterns.md
related: testing.md
---

# Resetting Store State

Patterns for resetting Zustand stores to initial state.

## Basic Reset Pattern

```typescript
// modules/cores/stores/counter.store.ts
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

// Extract initial state
const initialState = {
  count: 0,
}

export const useCounterStore = create<CounterState>()((set) => ({
  ...initialState,
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: s.count - 1 })),
  reset: () => set(initialState),
}))
```

---

## Reset with Actions Preserved

```typescript
// modules/auth/src/stores/auth.store.ts
import { create } from 'zustand'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setUser: (user: User, token: string) => void
  logout: () => void
}

// Only state, not actions
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
}

export const useAuthStore = create<AuthState>()((set) => ({
  ...initialState,

  setUser: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
    }),

  // Reset to initial state
  logout: () => set(initialState),
}))
```

---

## Global Reset Function

```typescript
// modules/cores/stores/reset-stores.ts
import { useAuthStore } from '@/modules/auth/src/stores/auth.store'
import { useCartStore } from '@/modules/cart/src/stores/cart.store'
import { useSettingsStore } from './settings.store'

// Store initial states
const stores = {
  auth: useAuthStore,
  cart: useCartStore,
  settings: useSettingsStore,
}

const initialStates = {
  auth: { user: null, token: null, isAuthenticated: false },
  cart: { items: [], total: 0 },
  settings: { theme: 'light', language: 'en' },
}

/**
 * Reset all stores to initial state
 * Use on logout or app reset
 */
export function resetAllStores() {
  Object.entries(stores).forEach(([key, store]) => {
    store.setState(initialStates[key as keyof typeof initialStates], true)
  })
}

/**
 * Reset specific store
 */
export function resetStore(storeName: keyof typeof stores) {
  stores[storeName].setState(
    initialStates[storeName] as Parameters<typeof stores[typeof storeName]['setState']>[0],
    true
  )
}
```

---

## Reset with Persist Middleware

```typescript
// modules/cores/stores/settings.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  theme: 'light' | 'dark'
  language: string
  notifications: boolean
  setTheme: (theme: 'light' | 'dark') => void
  reset: () => void
}

const initialState = {
  theme: 'light' as const,
  language: 'en',
  notifications: true,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,

      setTheme: (theme) => set({ theme }),

      reset: () => {
        // Reset state
        set(initialState)
        // Clear persisted storage
        useSettingsStore.persist.clearStorage()
      },
    }),
    {
      name: 'settings-storage',
    }
  )
)
```

---

## Typed Reset Factory

```typescript
// modules/cores/lib/create-store-with-reset.ts
import { create, StateCreator } from 'zustand'

type ResetFn = () => void

export function createStoreWithReset<T extends object>(
  initialState: T,
  createState: StateCreator<T & { reset: ResetFn }, [], [], T>
) {
  return create<T & { reset: ResetFn }>()((set, get, api) => ({
    ...createState(set, get, api),
    reset: () => set(initialState as T & { reset: ResetFn }),
  }))
}
```

```typescript
// Usage
const useCounterStore = createStoreWithReset(
  { count: 0 },
  (set) => ({
    count: 0,
    increment: () => set((s) => ({ count: s.count + 1 })),
  })
)

// Now has .reset() automatically
useCounterStore.getState().reset()
```

---

## Reset on Logout

```typescript
// modules/auth/src/services/auth.service.ts
import { resetAllStores } from '@/modules/cores/stores/reset-stores'
import { useAuthStore } from '../stores/auth.store'

export async function logout() {
  // Call API to invalidate session
  await fetch('/api/auth/logout', { method: 'POST' })

  // Reset all stores
  resetAllStores()

  // Redirect to login
  window.location.href = '/login'
}
```

---

## Best Practices

1. **Separate initial state** from actions for clean reset
2. **Use `true` as second arg** to `setState` for full replace
3. **Clear persist storage** when resetting persisted stores
4. **Create global reset** for logout scenarios
5. **Test reset behavior** to ensure no state leaks
