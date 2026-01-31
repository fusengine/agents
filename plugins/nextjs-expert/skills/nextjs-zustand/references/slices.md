---
name: slices
description: Zustand slices pattern for large stores
when-to-use: Building complex stores with multiple domains
keywords: slices, combine, StateCreator, modular, large stores
priority: medium
requires: typescript.md
related: store-patterns.md, middleware.md
---

# Slices Pattern

Split large stores into modular slices for maintainability.

## Basic Slices

```typescript
// modules/app/src/stores/slices/counter.slice.ts
import { StateCreator } from 'zustand'

export interface CounterSlice {
  count: number
  increment: () => void
  decrement: () => void
}

export const createCounterSlice: StateCreator<
  CounterSlice & TextSlice,  // Combined store type
  [],
  [],
  CounterSlice               // This slice type
> = (set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
})
```

```typescript
// modules/app/src/stores/slices/text.slice.ts
import { StateCreator } from 'zustand'

export interface TextSlice {
  text: string
  setText: (text: string) => void
  clearText: () => void
}

export const createTextSlice: StateCreator<
  CounterSlice & TextSlice,
  [],
  [],
  TextSlice
> = (set) => ({
  text: '',
  setText: (text) => set({ text }),
  clearText: () => set({ text: '' }),
})
```

---

## Combining Slices

```typescript
// modules/app/src/stores/app.store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createCounterSlice, CounterSlice } from './slices/counter.slice'
import { createTextSlice, TextSlice } from './slices/text.slice'

type AppStore = CounterSlice & TextSlice

export const useAppStore = create<AppStore>()(
  devtools(
    (...a) => ({
      ...createCounterSlice(...a),
      ...createTextSlice(...a),
    }),
    { name: 'AppStore' }
  )
)
```

---

## Slices with Cross-References

When slices need to access other slices' state:

```typescript
// modules/app/src/stores/slices/user.slice.ts
import { StateCreator } from 'zustand'
import type { AppStore } from '../app.store'

export interface UserSlice {
  user: User | null
  setUser: (user: User | null) => void
  getUserDisplayName: () => string
}

export const createUserSlice: StateCreator<
  AppStore,
  [],
  [],
  UserSlice
> = (set, get) => ({
  user: null,

  setUser: (user) => set({ user }),

  // Access full store via get()
  getUserDisplayName: () => {
    const { user } = get()
    if (!user) return 'Guest'
    return `${user.firstName} ${user.lastName}`
  },
})
```

```typescript
// modules/app/src/stores/slices/cart.slice.ts
import { StateCreator } from 'zustand'
import type { AppStore } from '../app.store'

export interface CartSlice {
  items: CartItem[]
  addItem: (item: CartItem) => void
  getDiscountedTotal: () => number
}

export const createCartSlice: StateCreator<
  AppStore,
  [],
  [],
  CartSlice
> = (set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  // Cross-reference user slice for premium discount
  getDiscountedTotal: () => {
    const { items, user } = get()
    const subtotal = items.reduce((sum, i) => sum + i.price, 0)

    // Premium users get 10% off
    const discount = user?.isPremium ? 0.1 : 0
    return subtotal * (1 - discount)
  },
})
```

---

## Slices with Middleware

```typescript
// modules/app/src/stores/app.store.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createUserSlice, UserSlice } from './slices/user.slice'
import { createCartSlice, CartSlice } from './slices/cart.slice'
import { createSettingsSlice, SettingsSlice } from './slices/settings.slice'

export type AppStore = UserSlice & CartSlice & SettingsSlice

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createUserSlice(...a),
        ...createCartSlice(...a),
        ...createSettingsSlice(...a),
      })),
      {
        name: 'app-storage',
        // Only persist settings slice
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
        }),
      }
    ),
    { name: 'AppStore' }
  )
)
```

---

## File Structure for Slices

```
modules/
└── app/
    └── src/
        ├── stores/
        │   ├── app.store.ts          # Combined store
        │   └── slices/
        │       ├── user.slice.ts
        │       ├── cart.slice.ts
        │       └── settings.slice.ts
        └── interfaces/
            ├── user.interface.ts
            ├── cart.interface.ts
            └── settings.interface.ts
```

---

## Best Practices

1. **One slice per domain** - user, cart, settings, ui
2. **Interfaces separated** - Keep types in `interfaces/` folder
3. **Cross-references via get()** - Access other slices when needed
4. **Partial persist** - Use `partialize` to persist only what's needed
5. **Type safety** - Use `StateCreator` with full store type
