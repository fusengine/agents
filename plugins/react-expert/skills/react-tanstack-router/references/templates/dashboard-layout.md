---
name: dashboard-layout
description: Nested dashboard layout with sidebar and tabs
keywords: dashboard, layout, sidebar, tabs, nested, outlet
---

# Dashboard Layout Template

Complete dashboard with nested layouts and navigation.

## Structure

```text
src/
├── modules/
│   └── dashboard/
│       ├── src/
│       │   ├── interfaces/
│       │   │   └── navigation.interface.ts
│       │   ├── components/
│       │   │   ├── DashboardLayout.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   ├── TopBar.tsx
│       │   │   └── TabNav.tsx
│       │   └── hooks/
│       │       └── useNavigation.ts
│       └── index.ts
└── routes/
    ├── _dashboard/
    │   ├── _dashboard.tsx          # Dashboard layout
    │   ├── index.tsx               # /dashboard
    │   ├── projects/
    │   │   ├── index.tsx           # /projects
    │   │   └── $projectId/
    │   │       ├── index.tsx       # /projects/:id
    │   │       ├── settings.tsx    # /projects/:id/settings
    │   │       └── members.tsx     # /projects/:id/members
    │   └── settings/
    │       ├── index.tsx           # /settings
    │       ├── profile.tsx         # /settings/profile
    │       └── security.tsx        # /settings/security
```

---

## Navigation Interface

```typescript
// src/modules/dashboard/src/interfaces/navigation.interface.ts
import type { ReactNode } from 'react'

/**
 * Sidebar navigation item.
 */
export interface NavItem {
  to: string
  label: string
  icon: ReactNode
  exact?: boolean
  children?: NavItem[]
}

/**
 * Tab navigation item.
 */
export interface TabItem {
  to: string
  label: string
  params?: Record<string, string>
}
```

---

## Dashboard Layout Route

```typescript
// src/routes/_dashboard/_dashboard.tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { DashboardLayout } from '@/modules/dashboard'

export const Route = createFileRoute('/_dashboard')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ),
})
```

---

## Dashboard Layout Component

```typescript
// src/modules/dashboard/src/components/DashboardLayout.tsx
import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

interface DashboardLayoutProps {
  children: ReactNode
}

/**
 * Main dashboard layout with sidebar.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
```

---

## Sidebar Component

```typescript
// src/modules/dashboard/src/components/Sidebar.tsx
import { Link } from '@tanstack/react-router'
import type { NavItem } from '../interfaces/navigation.interface'

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Overview', icon: '📊', exact: true },
  { to: '/projects', label: 'Projects', icon: '📁' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

/**
 * Dashboard sidebar navigation.
 */
export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      <nav className="mt-4">
        {navItems.map((item) => (
          <SidebarItem key={item.to} item={item} />
        ))}
      </nav>
    </aside>
  )
}

function SidebarItem({ item }: { item: NavItem }) {
  return (
    <Link
      to={item.to}
      activeOptions={{ exact: item.exact }}
      activeProps={{ className: 'bg-gray-800' }}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800"
    >
      <span>{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  )
}
```

---

## TopBar Component

```typescript
// src/modules/dashboard/src/components/TopBar.tsx
import { useRouteContext, useNavigate } from '@tanstack/react-router'

/**
 * Top navigation bar with user menu.
 */
export function TopBar() {
  const { user, auth } = useRouteContext({ from: '__root__' })
  const navigate = useNavigate()

  const handleLogout = async () => {
    await auth.logout()
    navigate({ to: '/login' })
  }

  return (
    <header className="h-16 bg-white border-b flex items-center justify-end px-6">
      <div className="flex items-center gap-4">
        <span>{user?.name}</span>
        <button onClick={handleLogout} className="text-gray-600">
          Logout
        </button>
      </div>
    </header>
  )
}
```

---

## Project Detail with Tabs

```typescript
// src/routes/_dashboard/projects/$projectId/index.tsx
import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import { projectQueryOptions } from '@/modules/projects'
import { TabNav } from '@/modules/dashboard'

export const Route = createFileRoute('/_dashboard/projects/$projectId/')({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(projectQueryOptions(params.projectId)),
  component: ProjectLayout,
})

function ProjectLayout() {
  const project = Route.useLoaderData()
  const { projectId } = Route.useParams()

  const tabs = [
    { to: '/projects/$projectId', label: 'Overview', params: { projectId } },
    { to: '/projects/$projectId/settings', label: 'Settings', params: { projectId } },
    { to: '/projects/$projectId/members', label: 'Members', params: { projectId } },
  ]

  return (
    <div>
      <header className="mb-6">
        <Link to="/projects" className="text-blue-600">
          ← Back to Projects
        </Link>
        <h1 className="text-2xl font-bold mt-2">{project.name}</h1>
      </header>

      <TabNav tabs={tabs} />

      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  )
}
```

---

## Tab Navigation Component

```typescript
// src/modules/dashboard/src/components/TabNav.tsx
import { Link } from '@tanstack/react-router'
import type { TabItem } from '../interfaces/navigation.interface'

interface TabNavProps {
  tabs: TabItem[]
}

/**
 * Tab navigation for nested routes.
 */
export function TabNav({ tabs }: TabNavProps) {
  return (
    <nav className="border-b">
      <div className="flex gap-4">
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            params={tab.params}
            activeOptions={{ exact: true }}
            activeProps={{
              className: 'border-b-2 border-blue-600 text-blue-600',
            }}
            className="px-4 py-2 -mb-px"
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
```

---

## Settings with Nested Routes

```typescript
// src/routes/_dashboard/settings/index.tsx
import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import { TabNav } from '@/modules/dashboard'

export const Route = createFileRoute('/_dashboard/settings/')({
  component: SettingsLayout,
})

function SettingsLayout() {
  const tabs = [
    { to: '/settings/profile', label: 'Profile' },
    { to: '/settings/security', label: 'Security' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <TabNav tabs={tabs} />
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  )
}
```

```typescript
// src/routes/_dashboard/settings/profile.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/settings/profile')({
  component: ProfileSettings,
})

function ProfileSettings() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      {/* Profile form */}
    </div>
  )
}
```

```typescript
// src/routes/_dashboard/settings/security.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/settings/security')({
  component: SecuritySettings,
})

function SecuritySettings() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
      {/* Security form */}
    </div>
  )
}
```

---

## Module Exports

```typescript
// src/modules/dashboard/index.ts

// Interfaces
export type { NavItem, TabItem } from './src/interfaces/navigation.interface'

// Components
export { DashboardLayout } from './src/components/DashboardLayout'
export { Sidebar } from './src/components/Sidebar'
export { TopBar } from './src/components/TopBar'
export { TabNav } from './src/components/TabNav'
```
