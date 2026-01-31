---
name: store-patterns
description: Zustand v5 store patterns for Next.js App Router
when-to-use: Creating stores with async actions, persistence, and selectors
keywords: create, store, async, selector, useShallow, actions
priority: high
requires: installation.md
related: hydration.md, middleware.md
---

# Zustand Store Patterns

Core patterns for Zustand v5 in Next.js 16.

## Basic Store (v5 Syntax)

```typescript
// modules/cores/stores/counter.store.ts
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

// v5: Double parentheses for TypeScript inference
export const useCounterStore = create<CounterState>()((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))
```

---

## Selector Pattern

```typescript
'use client'

import { useCounterStore } from '@/modules/cores/stores/counter.store'

export function Counter() {
  // Select individual values for optimal re-renders
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

---

## useShallow for Multiple Values

```typescript
'use client'

import { useShallow } from 'zustand/shallow'
import { useCounterStore } from '@/modules/cores/stores/counter.store'

export function CounterControls() {
  // Use useShallow for array/object selectors
  const [count, increment, decrement] = useCounterStore(
    useShallow((state) => [state.count, state.increment, state.decrement])
  )

  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

---

## Async Actions

```typescript
// modules/auth/src/stores/user.store.ts
import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
}

interface UserState {
  user: User | null
  isLoading: boolean
  error: string | null
  fetchUser: (id: string) => Promise<void>
  logout: () => void
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchUser: async (id) => {
    set({ isLoading: true, error: null })

    try {
      const response = await fetch(`/api/users/${id}`)
      if (!response.ok) throw new Error('Failed to fetch user')

      const user = await response.json()
      set({ user, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      })
    }
  },

  logout: () => set({ user: null, error: null }),
}))
```

---

## Computed Values (get)

```typescript
// modules/cart/src/stores/cart.store.ts
import { create } from 'zustand'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        }
      }
      return { items: [...state.items, item] }
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  // Computed values using get()
  getTotal: () => {
    const { items } = get()
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },

  getItemCount: () => {
    const { items } = get()
    return items.reduce((sum, item) => sum + item.quantity, 0)
  },
}))
```

---

## Reset Store

```typescript
// modules/cores/stores/app.store.ts
import { create } from 'zustand'

interface AppState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  setTheme: (theme: 'light' | 'dark') => void
  toggleSidebar: () => void
  reset: () => void
}

const initialState = {
  theme: 'light' as const,
  sidebarOpen: false,
}

export const useAppStore = create<AppState>()((set) => ({
  ...initialState,

  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Reset to initial state
  reset: () => set(initialState),
}))
```

---

## Subscribe to Changes

```typescript
// Subscribe outside React
const unsubscribe = useCounterStore.subscribe(
  (state) => state.count,
  (count, previousCount) => {
    console.log(`Count changed from ${previousCount} to ${count}`)
  }
)

// Cleanup
unsubscribe()
```

---

## Access Store Outside React

```typescript
// Get current state
const currentCount = useCounterStore.getState().count

// Set state directly
useCounterStore.setState({ count: 10 })

// Call actions
useCounterStore.getState().increment()
```
