# Zustand Store Patterns

Zustand store patterns for Next.js App Router.

## Basic Store

```typescript
// stores/useCounterStore.ts
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
```

---

## Store with Async Actions

```typescript
// stores/useUserStore.ts
import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
}

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
      if (!res.ok) throw new Error('Failed to fetch')
      const user = await res.json()
      set({ user, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  logout: () => set({ user: null }),
}))
```

---

## Persist with SSR Hydration

```typescript
// stores/useAuthStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  token: string | null
  isHydrated: boolean
  setToken: (token: string) => void
  clearToken: () => void
  setHydrated: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isHydrated: false,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
```

---

## Combined Middlewares

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
