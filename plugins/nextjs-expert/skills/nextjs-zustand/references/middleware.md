---
name: middleware
description: Zustand middleware - devtools, persist, immer
when-to-use: Adding persistence, debugging, or immutable updates
keywords: devtools, persist, immer, middleware, localStorage
priority: high
requires: installation.md
related: hydration.md, store-patterns.md
---

# Zustand Middleware

## Middleware Composition

Stack order matters for TypeScript: devtools → persist → immer.

```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface AppState {
  user: User | null
  theme: 'light' | 'dark'
  setUser: (user: User | null) => void
  toggleTheme: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((set) => ({
        user: null,
        theme: 'light',
        setUser: (user) =>
          set((state) => {
            state.user = user
          }),
        toggleTheme: () =>
          set((state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light'
          }),
      })),
      { name: 'app-storage' }
    ),
    { name: 'AppStore' }
  )
)
```

---

## DevTools Middleware

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface JungleState {
  bears: number
  addBear: () => void
}

export const useJungleStore = create<JungleState>()(
  devtools(
    (set) => ({
      bears: 0,
      addBear: () =>
        set(
          (state) => ({ bears: state.bears + 1 }),
          false,           // replace: false (merge)
          'jungle/addBear' // action name in Redux DevTools
        ),
    }),
    { name: 'JungleStore' }
  )
)
```

### DevTools in Development Only

```typescript
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

const storeCreator: StateCreator<AppState> = (set) => ({
  // state and actions
})

export const useAppStore = create<AppState>()(
  process.env.NODE_ENV === 'development'
    ? devtools(storeCreator, { name: 'AppStore' })
    : storeCreator
)
```

---

## Persist Middleware

```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface SettingsState {
  theme: 'light' | 'dark'
  language: string
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (lang: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'en',
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),

      // Persist only specific fields
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),

      // Version for migrations
      version: 1,

      // Skip hydration for SSR
      skipHydration: true,
    }
  )
)
```

### Persist with Migration

```typescript
persist(
  (set) => ({ /* state */ }),
  {
    name: 'app-storage',
    version: 2,
    migrate: (persistedState: any, version: number) => {
      if (version === 0) {
        // v0 → v1: add language field
        persistedState.language = 'en'
      }
      if (version === 1) {
        // v1 → v2: rename theme values
        if (persistedState.theme === 'system') {
          persistedState.theme = 'light'
        }
      }
      return persistedState as SettingsState
    },
  }
)
```

---

## Immer Middleware

Enable direct state mutations (internally immutable).

```typescript
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface TodoState {
  todos: Todo[]
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  removeTodo: (id: string) => void
}

export const useTodoStore = create<TodoState>()(
  immer((set) => ({
    todos: [],

    addTodo: (text) =>
      set((state) => {
        state.todos.push({
          id: crypto.randomUUID(),
          text,
          completed: false,
        })
      }),

    toggleTodo: (id) =>
      set((state) => {
        const todo = state.todos.find((t) => t.id === id)
        if (todo) {
          todo.completed = !todo.completed
        }
      }),

    removeTodo: (id) =>
      set((state) => {
        const index = state.todos.findIndex((t) => t.id === id)
        if (index !== -1) {
          state.todos.splice(index, 1)
        }
      }),
  }))
)
```

---

## SessionStorage

```typescript
import { persist, createJSONStorage } from 'zustand/middleware'

persist(
  (set) => ({ /* state */ }),
  {
    name: 'session-storage',
    storage: createJSONStorage(() => sessionStorage),
  }
)
```

---

## Custom Storage

```typescript
import { StateStorage, createJSONStorage } from 'zustand/middleware'

const customStorage: StateStorage = {
  getItem: async (name) => {
    return await asyncLocalStorage.getItem(name)
  },
  setItem: async (name, value) => {
    await asyncLocalStorage.setItem(name, value)
  },
  removeItem: async (name) => {
    await asyncLocalStorage.removeItem(name)
  },
}

persist(
  (set) => ({ /* state */ }),
  {
    name: 'custom-storage',
    storage: createJSONStorage(() => customStorage),
  }
)
```
