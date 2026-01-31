---
name: auto-selectors
description: Auto-generating selectors for Zustand stores
when-to-use: Creating type-safe selectors without boilerplate
keywords: selectors, auto-generate, createSelectors, use, hooks
priority: medium
requires: typescript.md
related: store-patterns.md
---

# Auto-Generating Selectors

Create type-safe selectors automatically from store state.

## Basic Pattern

```typescript
// modules/cores/lib/create-selectors.ts
import { StoreApi, UseBoundStore } from 'zustand'

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

export function createSelectors<S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) {
  const store = _store as WithSelectors<typeof _store>
  store.use = {} as typeof store.use

  for (const key of Object.keys(store.getState())) {
    ;(store.use as Record<string, () => unknown>)[key] = () =>
      store((s) => s[key as keyof typeof s])
  }

  return store
}
```

---

## Usage

```typescript
// modules/cores/stores/counter.store.ts
import { create } from 'zustand'
import { createSelectors } from '../lib/create-selectors'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
}

const useCounterStoreBase = create<CounterState>()((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: s.count - 1 })),
}))

// Wrap with auto-selectors
export const useCounterStore = createSelectors(useCounterStoreBase)
```

```typescript
// In components - use auto-generated selectors


import { useCounterStore } from '@/modules/cores/stores/counter.store'

export function Counter() {
  // Auto-generated .use selectors
  const count = useCounterStore.use.count()
  const increment = useCounterStore.use.increment()

  // Equivalent to:
  // const count = useCounterStore((s) => s.count)
  // const increment = useCounterStore((s) => s.increment)

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

---

## With Middleware

```typescript
// modules/cores/stores/app.store.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createSelectors } from '../lib/create-selectors'

interface AppState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  setTheme: (theme: 'light' | 'dark') => void
  toggleSidebar: () => void
}

const useAppStoreBase = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        sidebarOpen: false,
        setTheme: (theme) => set({ theme }),
        toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      }),
      { name: 'app-storage' }
    )
  )
)

export const useAppStore = createSelectors(useAppStoreBase)
```

```typescript
// Usage
const theme = useAppStore.use.theme()
const setTheme = useAppStore.use.setTheme()
const sidebarOpen = useAppStore.use.sidebarOpen()
```

---

## Type-Safe Selector Factory

```typescript
// modules/cores/lib/create-selectors.ts
import { StoreApi, UseBoundStore } from 'zustand'

type State = Record<string, unknown>

type Selectors<T extends State> = {
  [K in keyof T]: () => T[K]
}

export function createSelectors<T extends State>(
  store: UseBoundStore<StoreApi<T>>
): UseBoundStore<StoreApi<T>> & { use: Selectors<T> } {
  const storeWithSelectors = store as UseBoundStore<StoreApi<T>> & {
    use: Selectors<T>
  }

  storeWithSelectors.use = {} as Selectors<T>

  const state = store.getState()
  for (const key of Object.keys(state) as Array<keyof T>) {
    storeWithSelectors.use[key] = () => store((s) => s[key])
  }

  return storeWithSelectors
}
```

---

## Benefits

| Benefit | Description |
|---------|-------------|
| Less boilerplate | No manual selector functions |
| Type inference | Full TypeScript autocompletion |
| Consistent API | `.use.propertyName()` pattern |
| Optimal re-renders | Each selector subscribes only to its value |

---

## When to Use

- **Use auto-selectors** for simple state access
- **Use manual selectors** for computed/derived values
- **Use useShallow** when selecting multiple values together
