---
name: auth-protected-routes
description: Authentication with protected routes and role-based access
keywords: auth, login, protected, guard, rbac, permissions
---

# Auth Protected Routes Template

Complete authentication implementation with protected routes.

## Structure

```text
src/
├── modules/
│   ├── cores/
│   │   ├── interfaces/
│   │   │   ├── router.interface.ts
│   │   │   └── auth.interface.ts
│   │   └── lib/
│   │       └── auth/
│   │           ├── guards.ts        # Reusable guards
│   │           └── context.ts       # Auth context
│   └── auth/
│       ├── src/
│       │   ├── interfaces/
│       │   │   └── credentials.interface.ts
│       │   ├── queries/
│       │   │   └── auth.mutations.ts
│       │   └── components/
│       │       └── LoginForm.tsx
│       └── index.ts
└── routes/
    ├── __root.tsx
    ├── login.tsx
    ├── _authenticated/
    │   ├── _authenticated.tsx       # Auth guard layout
    │   ├── dashboard.tsx
    │   └── _admin/
    │       ├── _admin.tsx           # Admin guard layout
    │       └── users.tsx
```

---

## Auth Interfaces

```typescript
// src/modules/cores/interfaces/auth.interface.ts

/**
 * User entity.
 */
export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  permissions: string[]
}

/**
 * Auth service interface.
 */
export interface AuthService {
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  refreshToken: () => Promise<User>
  getUser: () => Promise<User | null>
}
```

```typescript
// src/modules/cores/interfaces/router.interface.ts
import type { QueryClient } from '@tanstack/react-query'
import type { User, AuthService } from './auth.interface'

/**
 * Base router context.
 */
export interface RouterContext {
  queryClient: QueryClient
  user: User | null
  auth: AuthService
}

/**
 * Authenticated route context.
 */
export interface AuthenticatedContext extends RouterContext {
  user: User
}

/**
 * Admin route context.
 */
export interface AdminContext extends AuthenticatedContext {
  user: User & { role: 'admin' }
}
```

---

## Auth Guards

```typescript
// src/modules/cores/lib/auth/guards.ts
import { redirect } from '@tanstack/react-router'
import type { RouterContext } from '../../interfaces/router.interface'

interface GuardParams {
  context: RouterContext
  location: { href: string }
}

/**
 * Require authenticated user.
 * Redirects to login with return URL.
 */
export function requireAuth({ context, location }: GuardParams) {
  if (!context.user) {
    throw redirect({
      to: '/login',
      search: { redirect: location.href },
    })
  }
}

/**
 * Require admin role.
 * Redirects to dashboard if not admin.
 */
export function requireAdmin({ context }: GuardParams) {
  if (context.user?.role !== 'admin') {
    throw redirect({ to: '/dashboard' })
  }
}

/**
 * Require specific permission.
 */
export function requirePermission(permission: string) {
  return ({ context }: GuardParams) => {
    if (!context.user?.permissions.includes(permission)) {
      throw redirect({ to: '/unauthorized' })
    }
  }
}

/**
 * Redirect if already authenticated.
 */
export function redirectIfAuth({ context, search }: {
  context: RouterContext
  search: { redirect?: string }
}) {
  if (context.user) {
    throw redirect({ to: search.redirect || '/dashboard' })
  }
}
```

---

## Root Route with Auth

```typescript
// src/routes/__root.tsx
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { RouterContext } from '@/modules/cores/interfaces/router.interface'

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    // Check token expiry on each navigation
    if (context.user) {
      try {
        await context.auth.refreshToken()
      } catch {
        // Token refresh failed, user will be null
      }
    }
  },
  component: () => <Outlet />,
})
```

---

## Login Route

```typescript
// src/routes/login.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { redirectIfAuth } from '@/modules/cores/lib/auth/guards'
import { LoginForm } from '@/modules/auth'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  validateSearch: zodValidator(searchSchema),
  beforeLoad: ({ context, search }) => {
    redirectIfAuth({ context, search })
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { redirect: redirectTo } = Route.useSearch()
  const { auth } = Route.useRouteContext()

  const handleLogin = async (email: string, password: string) => {
    await auth.login(email, password)
    navigate({ to: redirectTo || '/dashboard' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm onSubmit={handleLogin} />
    </div>
  )
}
```

---

## Authenticated Layout

```typescript
// src/routes/_authenticated/_authenticated.tsx
import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import { requireAuth } from '@/modules/cores/lib/auth/guards'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: requireAuth,
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { user } = Route.useRouteContext()

  return (
    <div className="min-h-screen flex">
      <Sidebar user={user} />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}

function Sidebar({ user }: { user: User }) {
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <p className="font-bold">{user.name}</p>
      <nav className="mt-4 space-y-2">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/settings">Settings</Link>
        {user.role === 'admin' && <Link to="/users">Users</Link>}
      </nav>
    </aside>
  )
}
```

---

## Dashboard Route

```typescript
// src/routes/_authenticated/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = Route.useRouteContext()

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome back, {user.name}!</p>
    </div>
  )
}
```

---

## Admin Layout

```typescript
// src/routes/_authenticated/_admin/_admin.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireAdmin } from '@/modules/cores/lib/auth/guards'

export const Route = createFileRoute('/_authenticated/_admin')({
  beforeLoad: ({ context }) => {
    requireAdmin({ context, location: { href: '/dashboard' } })

    // Extend context with admin flag
    return { isAdmin: true }
  },
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div>
      <div className="bg-red-100 p-2 text-red-800">
        Admin Area
      </div>
      <Outlet />
    </div>
  )
}
```

---

## Admin Users Route

```typescript
// src/routes/_authenticated/_admin/users.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_admin/users')({
  component: UsersPage,
})

function UsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">User Management</h1>
      {/* Admin-only content */}
    </div>
  )
}
```

---

## Login Form Component

```typescript
// src/modules/auth/src/components/LoginForm.tsx
import { useState } from 'react'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
}

/**
 * Login form component.
 */
export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await onSubmit(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>

      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded">{error}</div>
      )}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full border p-2 rounded"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

---

## Auth Module Exports

```typescript
// src/modules/auth/index.ts
export { LoginForm } from './src/components/LoginForm'
export type { Credentials } from './src/interfaces/credentials.interface'
```
