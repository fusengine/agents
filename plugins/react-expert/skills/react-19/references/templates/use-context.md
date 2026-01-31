---
name: use-context-template
description: Context patterns with use() hook and direct Context provider
---

# Context with use() Hook

## Basic Context Provider (React 19)

```typescript
// modules/cores/contexts/ThemeContext.tsx
import { createContext, use, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * Custom hook with null check.
 */
export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeContext')
  }
  return context
}

/**
 * Theme provider using Context directly (React 19).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext>
  )
}
```

---

## Conditional Context Reading

```typescript
// modules/users/components/UserCard.tsx
import { use } from 'react'
import { ThemeContext } from '@/modules/cores/contexts/ThemeContext'
import { FeatureFlagsContext } from '@/modules/cores/contexts/FeatureFlagsContext'

interface UserCardProps {
  userId: string
  useTheme?: boolean
  useFeatureFlags?: boolean
}

/**
 * Component with conditional context.
 */
export function UserCard({
  userId,
  useTheme = true,
  useFeatureFlags = false
}: UserCardProps) {
  // Conditional context - NOT possible with useContext
  const theme = useTheme ? use(ThemeContext) : null
  const flags = useFeatureFlags ? use(FeatureFlagsContext) : null

  return (
    <div className={theme?.theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
      <UserInfo userId={userId} />
      {flags?.newProfile && <NewProfileBadge />}
    </div>
  )
}
```

---

## Context in Loops

```typescript
// modules/dashboard/components/WidgetGrid.tsx
import { use } from 'react'

interface Widget {
  id: string
  type: 'chart' | 'table' | 'stats'
  contextKey: 'analytics' | 'sales' | 'users'
}

const contextMap = {
  analytics: AnalyticsContext,
  sales: SalesContext,
  users: UsersContext
}

/**
 * Dynamic context reading in loop.
 */
export function WidgetGrid({ widgets }: { widgets: Widget[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {widgets.map((widget) => {
        // use() can be called in loops!
        const data = use(contextMap[widget.contextKey])

        return (
          <WidgetCard key={widget.id} type={widget.type} data={data} />
        )
      })}
    </div>
  )
}
```

---

## Auth Context Pattern

```typescript
// modules/auth/contexts/AuthContext.tsx
import { createContext, use, useState, useEffect, ReactNode } from 'react'
import type { User } from '../interfaces/auth.interface'
import { authService } from '../services/auth.service'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Auth hook with type safety.
 */
export function useAuth(): AuthContextValue {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

/**
 * Auth provider with React 19 syntax.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const user = await authService.login({ email, password })
    setUser(user)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext value={{ user, loading, login, logout }}>
      {children}
    </AuthContext>
  )
}
```

---

## Nested Contexts

```typescript
// modules/app/components/Providers.tsx
import { ReactNode } from 'react'
import { ThemeProvider } from '@/modules/cores/contexts/ThemeContext'
import { AuthProvider } from '@/modules/auth/contexts/AuthContext'
import { QueryProvider } from '@/modules/cores/contexts/QueryContext'

/**
 * App providers with React 19 syntax.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
```

---

## Context with Reducer

```typescript
// modules/cart/contexts/CartContext.tsx
import { createContext, use, useReducer, ReactNode, Dispatch } from 'react'
import type { CartItem, CartAction } from '../interfaces/cart.interface'
import { cartReducer } from '../reducers/cart.reducer'

interface CartContextValue {
  items: CartItem[]
  dispatch: Dispatch<CartAction>
  total: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function useCart(): CartContextValue {
  const context = use(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [])

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <CartContext value={{ items, dispatch, total }}>
      {children}
    </CartContext>
  )
}
```

---

## Optimized Context (Split State/Dispatch)

```typescript
// modules/settings/contexts/SettingsContext.tsx
import { createContext, use, useReducer, ReactNode, Dispatch } from 'react'

// Split into two contexts to prevent unnecessary re-renders
const SettingsStateContext = createContext<SettingsState | null>(null)
const SettingsDispatchContext = createContext<Dispatch<SettingsAction> | null>(null)

export function useSettingsState(): SettingsState {
  const context = use(SettingsStateContext)
  if (!context) throw new Error('useSettingsState requires SettingsProvider')
  return context
}

export function useSettingsDispatch(): Dispatch<SettingsAction> {
  const context = use(SettingsDispatchContext)
  if (!context) throw new Error('useSettingsDispatch requires SettingsProvider')
  return context
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState)

  return (
    <SettingsStateContext value={state}>
      <SettingsDispatchContext value={dispatch}>
        {children}
      </SettingsDispatchContext>
    </SettingsStateContext>
  )
}
```

---

## Migration from React 18

```typescript
// BEFORE (React 18)
<ThemeContext.Provider value={{ theme, toggleTheme }}>
  {children}
</ThemeContext.Provider>

// AFTER (React 19)
<ThemeContext value={{ theme, toggleTheme }}>
  {children}
</ThemeContext>

// BEFORE (useContext)
const theme = useContext(ThemeContext)

// AFTER (use - especially for conditional)
const theme = condition ? use(ThemeContext) : null
```

---

## Rules

- Use `<Context value={}>` directly (no `.Provider`)
- Use `use(Context)` for conditional/loop reading
- Always create custom hook with null check
- Split state/dispatch for optimized re-renders
- Export hooks, not raw context
