---
name: store-template
description: Zustand store template with persistence (< 40 lines)
---

# Zustand Store (< 40 lines)

## Basic Store

```typescript
// modules/users/src/stores/user.store.ts
import { create } from 'zustand'
import type { User } from '../interfaces/user.interface'

interface UserStore {
  user: User | null
  setUser: (user: User) => void
  clear: () => void
}

/**
 * User store for current session.
 */
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null })
}))
```

---

## Store with Persistence

```typescript
// modules/auth/src/stores/auth.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Session } from '../interfaces/auth.interface'

interface AuthStore {
  session: Session | null
  setSession: (session: Session) => void
  logout: () => void
}

/**
 * Auth store with localStorage persistence.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      logout: () => set({ session: null })
    }),
    {
      name: 'auth-storage'
    }
  )
)
```

---

## Store with Immer

```typescript
// modules/cart/src/stores/cart.store.ts
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { CartItem } from '../interfaces/cart.interface'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
}

/**
 * Cart store with immer for immutable updates.
 */
export const useCartStore = create<CartStore>()(
  immer((set) => ({
    items: [],
    addItem: (item) =>
      set((state) => {
        state.items.push(item)
      }),
    removeItem: (id) =>
      set((state) => {
        state.items = state.items.filter((i) => i.id !== id)
      }),
    updateQuantity: (id, quantity) =>
      set((state) => {
        const item = state.items.find((i) => i.id === id)
        if (item) item.quantity = quantity
      }),
    clear: () => set({ items: [] })
  }))
)
```

---

## Store with Selectors

```typescript
// modules/settings/src/stores/settings.store.ts
import { create } from 'zustand'

interface SettingsStore {
  theme: 'light' | 'dark'
  locale: string
  setTheme: (theme: 'light' | 'dark') => void
  setLocale: (locale: string) => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  theme: 'light',
  locale: 'en',
  setTheme: (theme) => set({ theme }),
  setLocale: (locale) => set({ locale })
}))

// Selectors (separate file or same file)
export const selectTheme = (state: SettingsStore) => state.theme
export const selectLocale = (state: SettingsStore) => state.locale

// Usage with selector
// const theme = useSettingsStore(selectTheme)
```

---

## Rules

- Max 40 lines
- Import types from `../interfaces/`
- Use `persist` middleware for localStorage
- Use `immer` for complex nested updates
- JSDoc for all exports
