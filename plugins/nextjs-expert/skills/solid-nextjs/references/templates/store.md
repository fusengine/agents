---
name: store-template
description: Zustand store template with persistence and typed actions
when-to-use: global state, client state, persisted state
keywords: zustand, store, state, persistence, create
priority: medium
related: hook.md, client-component.md
---

# Zustand Store

```typescript
// modules/auth/src/stores/auth.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../interfaces/user.interface'

/**
 * Auth store state
 */
interface AuthState {
  user: User | null
  token: string | null
  setUser: (user: User) => void
  setToken: (token: string) => void
  clearUser: () => void
}

/**
 * Authentication store with persistence
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      clearUser: () => set({ user: null, token: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token })
    }
  )
)
```

## Simple Store (No Persistence)

```typescript
// modules/ui/src/stores/modal.store.ts
import { create } from 'zustand'

interface ModalState {
  isOpen: boolean
  content: React.ReactNode | null
  open: (content: React.ReactNode) => void
  close: () => void
}

/**
 * Modal state store
 */
export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  content: null,
  open: (content) => set({ isOpen: true, content }),
  close: () => set({ isOpen: false, content: null })
}))
```

## Store with Computed Values

```typescript
// modules/cart/src/stores/cart.store.ts
import { create } from 'zustand'
import type { CartItem } from '../interfaces/cart.interface'

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  getTotal: () => number
  getCount: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item]
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id)
    })),

  clearCart: () => set({ items: [] }),

  getTotal: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  getCount: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0)
}))
```
