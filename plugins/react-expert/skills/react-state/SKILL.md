---
name: react-state
description: State management with Zustand, Jotai, Context API. Use when implementing global state, stores, or state management patterns in React.
user-invocable: false
---

# React State Management

## Zustand (Recommended)

Simple, fast, and scalable state management.

### Installation

```bash
bun add zustand
```

### Basic Store

```typescript
// src/stores/useCounterStore.ts
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))

// Usage
function Counter() {
  const { count, increment } = useCounterStore()
  return <button onClick={increment}>{count}</button>
}
```

### Store with Async Actions

```typescript
// src/stores/useUserStore.ts
import { create } from 'zustand'
import type { User } from '../interfaces/user.interface'

interface UserState {
  user: User | null
  loading: boolean
  error: string | null
  fetchUser: (id: string) => Promise<void>
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUser: async (id) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`/api/users/${id}`)
      const user = await res.json()
      set({ user, loading: false })
    } catch (err) {
      set({ error: 'Failed to fetch user', loading: false })
    }
  },

  logout: () => set({ user: null }),
}))
```

### Persist Middleware

```typescript
// src/stores/useAuthStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

### Devtools Middleware

```typescript
// src/stores/useTodoStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface TodoState {
  todos: Todo[]
  addTodo: (text: string) => void
}

export const useTodoStore = create<TodoState>()(
  devtools(
    (set) => ({
      todos: [],
      addTodo: (text) => set(
        (state) => ({ todos: [...state.todos, { id: Date.now(), text }] }),
        false,
        'addTodo' // Action name for devtools
      ),
    }),
    { name: 'TodoStore' }
  )
)
```

### Combined Middlewares

```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const useStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        // state and actions
      }),
      { name: 'app-storage' }
    ),
    { name: 'AppStore' }
  )
)
```

---

## Jotai (Alternative)

Atomic state management.

### Installation

```bash
bun add jotai
```

### Basic Atoms

```typescript
// src/atoms/counterAtom.ts
import { atom, useAtom } from 'jotai'

export const countAtom = atom(0)

// Derived atom
export const doubleCountAtom = atom((get) => get(countAtom) * 2)

// Writable derived atom
export const incrementAtom = atom(
  null,
  (get, set) => set(countAtom, get(countAtom) + 1)
)

// Usage
function Counter() {
  const [count, setCount] = useAtom(countAtom)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

---

## Context API (Simple Cases)

For small, localized state.

```typescript
// src/contexts/ThemeContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be within ThemeProvider')
  return context
}
```

---

## When to Use What

| Scenario | Solution |
|----------|----------|
| Global app state | Zustand |
| Server state | TanStack Query |
| Form state | React Hook Form |
| Local component state | useState |
| Shared UI state | Zustand or Context |
| Complex derived state | Jotai |
