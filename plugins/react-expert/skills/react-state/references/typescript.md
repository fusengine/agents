---
name: typescript
description: TypeScript patterns for Zustand v5 with full type inference
when-to-use: Building type-safe stores with Zustand
keywords: TypeScript, types, inference, StateCreator, generics
priority: high
requires: installation.md
related: slices.md, middleware.md
---

# TypeScript Patterns

## Basic Typed Store

```typescript
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: (by: number) => void
  reset: () => void
}

// v5 syntax with currying for full inference
export const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  reset: () => set({ bears: 0 }),
}))
```

---

## Store with Middleware

When using middleware, types are inferred automatically.

```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface UserState {
  user: User | null
  preferences: UserPreferences
  setUser: (user: User | null) => void
  updatePreferences: (prefs: Partial<UserPreferences>) => void
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      immer((set) => ({
        user: null,
        preferences: { theme: 'light', language: 'en' },

        setUser: (user) =>
          set((state) => {
            state.user = user
          }),

        updatePreferences: (prefs) =>
          set((state) => {
            Object.assign(state.preferences, prefs)
          }),
      })),
      { name: 'user-storage' }
    ),
    { name: 'UserStore' }
  )
)
```

---

## useShallow with TypeScript

```typescript
import { useShallow } from 'zustand/shallow'

// Without useShallow - re-renders on any store change
const [count, increment] = useCounterStore((state) => [
  state.count,
  state.increment,
])

// With useShallow - re-renders only when selected values change
const [count, increment] = useCounterStore(
  useShallow((state) => [state.count, state.increment])
)

// Object selector with useShallow
const { user, isAuthenticated } = useAuthStore(
  useShallow((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }))
)
```

---

## StateCreator Type

For extracting store logic or testing.

```typescript
import { create, StateCreator } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
}

// Separate creator function for testing
const createCounterSlice: StateCreator<CounterState> = (set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
})

export const useCounterStore = create<CounterState>()(createCounterSlice)
```

---

## Typed Selectors

```typescript
import { StoreApi, UseBoundStore } from 'zustand'

// Create typed selector factory
function createSelectors<S extends UseBoundStore<StoreApi<object>>>(
  store: S
) {
  const selectors: Record<string, (state: ReturnType<S['getState']>) => any> = {}

  for (const key of Object.keys(store.getState())) {
    selectors[key] = (state: ReturnType<S['getState']>) => state[key as keyof typeof state]
  }

  return { ...store, use: selectors as any }
}

// Usage
const useCounterStoreBase = create<CounterState>()((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}))

export const useCounterStore = createSelectors(useCounterStoreBase)

// Now you can use:
const count = useCounterStore.use.count()
```

---

## Async Actions with Types

```typescript
interface ProductState {
  products: Product[]
  isLoading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null })

    try {
      const response = await fetch('/api/products')
      const products = await response.json()
      set({ products, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      })
    }
  },

  addProduct: async (product) => {
    set({ isLoading: true })

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(product),
      })
      const newProduct = await response.json()

      set((state) => ({
        products: [...state.products, newProduct],
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      })
    }
  },
}))
```

---

## Interface Separation (SOLID)

```typescript
// modules/cart/src/interfaces/cart.interface.ts
export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
}

export interface CartState {
  items: CartItem[]
  total: number
}

export interface CartActions {
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export type CartStore = CartState & CartActions
```

```typescript
// modules/cart/src/stores/cart.store.ts
import { create } from 'zustand'
import type { CartStore, CartItem } from '../interfaces/cart.interface'

export const useCartStore = create<CartStore>()((set) => ({
  items: [],
  total: 0,

  addItem: (item) =>
    set((state) => {
      const newItem: CartItem = {
        ...item,
        id: crypto.randomUUID(),
      }
      const items = [...state.items, newItem]
      return {
        items,
        total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      }
    }),

  removeItem: (id) =>
    set((state) => {
      const items = state.items.filter((i) => i.id !== id)
      return {
        items,
        total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      }
    }),

  updateQuantity: (id, quantity) =>
    set((state) => {
      const items = state.items.map((i) =>
        i.id === id ? { ...i, quantity } : i
      )
      return {
        items,
        total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      }
    }),

  clearCart: () => set({ items: [], total: 0 }),
}))
```
