# Lazy Loading Translations per Route

Load translation namespaces on-demand when navigating to routes.

---

## File Structure

```text
src/
├── i18n/
│   └── config.ts
├── routes/
│   ├── index.tsx          # Route definitions
│   ├── HomePage.tsx
│   ├── DashboardPage.tsx
│   └── SettingsPage.tsx
└── locales/
    ├── en/
    │   ├── common.json    # Always loaded
    │   ├── dashboard.json # Lazy loaded
    │   └── settings.json  # Lazy loaded
    └── fr/
        ├── common.json
        ├── dashboard.json
        └── settings.json
```

---

## i18n Configuration

### src/i18n/config.ts

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'fr'],
    fallbackLng: 'en',

    // Only load 'common' initially
    defaultNS: 'common',
    ns: ['common'],

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    react: {
      useSuspense: true,
    },
  })

export default i18n
```

---

## React Router Integration

### src/routes/index.tsx

```typescript
import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom'
import i18n from '@/i18n'
import { Layout } from '@/components/Layout'
import { PageSkeleton } from '@/components/PageSkeleton'

// Home - uses pre-loaded 'common' namespace
import { HomePage } from './HomePage'

// Dashboard - lazy load component + translations
const DashboardPage = lazy(async () => {
  await i18n.loadNamespaces(['dashboard'])
  return import('./DashboardPage')
})

// Settings - lazy load component + translations
const SettingsPage = lazy(async () => {
  await i18n.loadNamespaces(['settings'])
  return import('./SettingsPage')
})

// Profile - lazy load multiple namespaces
const ProfilePage = lazy(async () => {
  await i18n.loadNamespaces(['profile', 'settings'])
  return import('./ProfilePage')
})

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <SettingsPage />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <ProfilePage />
          </Suspense>
        ),
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
```

---

## TanStack Router Integration

### src/routes/index.tsx

```typescript
import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import i18n from '@/i18n'
import { Layout } from '@/components/Layout'

const rootRoute = createRootRoute({
  component: Layout,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => import('./HomePage').then(m => m.HomePage),
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  // Load translations before rendering
  beforeLoad: async () => {
    await i18n.loadNamespaces(['dashboard'])
  },
  component: () => import('./DashboardPage').then(m => m.DashboardPage),
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  beforeLoad: async () => {
    await i18n.loadNamespaces(['settings'])
  },
  component: () => import('./SettingsPage').then(m => m.SettingsPage),
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  dashboardRoute,
  settingsRoute,
])

export const router = createRouter({ routeTree })
```

---

## Page Components

### src/routes/DashboardPage.tsx

```typescript
import { useTranslation } from 'react-i18next'

/**
 * Dashboard page - requires 'dashboard' namespace.
 */
export function DashboardPage() {
  // 'dashboard' namespace loaded by route
  const { t } = useTranslation(['dashboard', 'common'])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        {t('dashboard:title')}
      </h1>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium">
            {t('dashboard:metrics.users')}
          </h2>
          <p className="text-3xl font-bold">1,234</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium">
            {t('dashboard:metrics.revenue')}
          </h2>
          <p className="text-3xl font-bold">$12,345</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium">
            {t('dashboard:metrics.orders')}
          </h2>
          <p className="text-3xl font-bold">567</p>
        </div>
      </div>

      <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">
        {t('common:actions.save')}
      </button>
    </div>
  )
}
```

---

## Preload on Hover

### src/components/NavLink.tsx

```typescript
import { Link } from 'react-router-dom'
import { useCallback } from 'react'
import i18n from '@/i18n'

interface NavLinkProps {
  to: string
  namespace?: string
  children: React.ReactNode
}

/**
 * Navigation link that preloads translations on hover.
 */
export function NavLink({ to, namespace, children }: NavLinkProps) {
  const handleMouseEnter = useCallback(() => {
    if (namespace) {
      // Preload translations when user hovers
      i18n.loadNamespaces([namespace])
    }
  }, [namespace])

  const handleFocus = useCallback(() => {
    if (namespace) {
      // Also preload on focus for keyboard navigation
      i18n.loadNamespaces([namespace])
    }
  }, [namespace])

  return (
    <Link
      to={to}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      className="px-3 py-2 text-gray-700 hover:text-gray-900"
    >
      {children}
    </Link>
  )
}
```

### Usage in Navigation

```typescript
import { NavLink } from './NavLink'

function Navigation() {
  const { t } = useTranslation()

  return (
    <nav className="flex gap-4">
      <NavLink to="/">
        {t('nav.home')}
      </NavLink>
      <NavLink to="/dashboard" namespace="dashboard">
        {t('nav.dashboard')}
      </NavLink>
      <NavLink to="/settings" namespace="settings">
        {t('nav.settings')}
      </NavLink>
    </nav>
  )
}
```

---

## Loading Component

### src/components/PageSkeleton.tsx

```typescript
/**
 * Skeleton loader for page transitions.
 */
export function PageSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      {/* Title skeleton */}
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />

      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  )
}
```

---

## Check Namespace Loaded

### src/hooks/useNamespaceReady.ts

```typescript
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

/**
 * Hook to check if namespace is loaded.
 */
export function useNamespaceReady(namespace: string) {
  const { i18n } = useTranslation()
  const [ready, setReady] = useState(
    i18n.hasLoadedNamespace(namespace)
  )

  useEffect(() => {
    if (!ready) {
      i18n.loadNamespaces([namespace]).then(() => {
        setReady(true)
      })
    }
  }, [i18n, namespace, ready])

  return ready
}
```

---

## Translation Files

### public/locales/en/dashboard.json

```json
{
  "title": "Dashboard",
  "subtitle": "Overview of your account",
  "metrics": {
    "users": "Total Users",
    "revenue": "Revenue",
    "orders": "Orders",
    "growth": "Growth"
  },
  "charts": {
    "monthly": "Monthly Overview",
    "yearly": "Yearly Trends"
  }
}
```

### public/locales/en/settings.json

```json
{
  "title": "Settings",
  "sections": {
    "profile": "Profile Settings",
    "notifications": "Notification Preferences",
    "security": "Security",
    "billing": "Billing"
  },
  "profile": {
    "name": "Display Name",
    "email": "Email Address",
    "avatar": "Profile Picture"
  }
}
```

---

## Best Practices

| Practice | Description |
|----------|-------------|
| Initial namespace | Only load `common` at startup |
| Route-based loading | Load per-route namespaces |
| Preload on hover | Anticipate navigation |
| Suspense boundaries | Granular loading states |
| Skeleton UI | Better perceived performance |
