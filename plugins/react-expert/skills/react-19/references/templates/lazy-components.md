---
name: lazy-components
description: React.lazy code splitting - route-based, component-based, preloading, named exports
when-to-use: bundle optimization, route splitting, heavy components, initial load
keywords: lazy, suspense, code splitting, dynamic import, preload
priority: high
related: ../lazy-loading.md, ../suspense-patterns.md
---

# Lazy Loading Examples

## Basic Lazy Component

```typescript
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./Dashboard'))

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  )
}
```

---

## Route-Based Splitting

```typescript
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))
const Profile = lazy(() => import('./pages/Profile'))

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
```

---

## Named Export Lazy Loading

```typescript
import { lazy, Suspense } from 'react'

// For named exports, wrap with default
const Chart = lazy(() =>
  import('./components/charts').then((module) => ({
    default: module.BarChart,
  }))
)

const Table = lazy(() =>
  import('./components/tables').then((module) => ({
    default: module.DataTable,
  }))
)

export function Analytics() {
  return (
    <Suspense fallback={<div>Loading charts...</div>}>
      <Chart data={data} />
      <Table rows={rows} />
    </Suspense>
  )
}
```

---

## Preloading on Hover

```typescript
import { lazy, Suspense, useState } from 'react'

const HeavyModal = lazy(() => import('./HeavyModal'))

// Preload function
const preloadModal = () => {
  import('./HeavyModal')
}

export function ModalTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onMouseEnter={preloadModal}
        onFocus={preloadModal}
        onClick={() => setIsOpen(true)}
      >
        Open Modal
      </button>

      {isOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <HeavyModal onClose={() => setIsOpen(false)} />
        </Suspense>
      )}
    </>
  )
}
```

---

## Preloading on Idle

```typescript
import { lazy, Suspense, useEffect } from 'react'

const Analytics = lazy(() => import('./Analytics'))
const Reports = lazy(() => import('./Reports'))

// Preload during idle time
function preloadComponents() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      import('./Analytics')
      import('./Reports')
    })
  } else {
    setTimeout(() => {
      import('./Analytics')
      import('./Reports')
    }, 2000)
  }
}

export function Dashboard() {
  useEffect(() => {
    preloadComponents()
  }, [])

  return (
    <Suspense fallback={<Loading />}>
      <Analytics />
      <Reports />
    </Suspense>
  )
}
```

---

## Nested Suspense Boundaries

```typescript
import { lazy, Suspense } from 'react'

const Header = lazy(() => import('./Header'))
const Sidebar = lazy(() => import('./Sidebar'))
const Content = lazy(() => import('./Content'))
const Comments = lazy(() => import('./Comments'))

export function Page() {
  return (
    <div className="grid grid-cols-[200px_1fr]">
      <Suspense fallback={<div>Loading sidebar...</div>}>
        <Sidebar />
      </Suspense>

      <main>
        <Suspense fallback={<div>Loading header...</div>}>
          <Header />
        </Suspense>

        <Suspense fallback={<div>Loading content...</div>}>
          <Content />

          {/* Nested boundary for less critical content */}
          <Suspense fallback={<div>Loading comments...</div>}>
            <Comments />
          </Suspense>
        </Suspense>
      </main>
    </div>
  )
}
```

---

## With Error Boundary

```typescript
import { lazy, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

const Dashboard = lazy(() => import('./Dashboard'))

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="p-4 bg-destructive/10 rounded">
      <h2>Something went wrong loading this component</h2>
      <pre className="text-sm">{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    </ErrorBoundary>
  )
}
```

---

## Conditional Lazy Loading

```typescript
import { lazy, Suspense } from 'react'

const AdminPanel = lazy(() => import('./AdminPanel'))
const UserDashboard = lazy(() => import('./UserDashboard'))

interface Props {
  isAdmin: boolean
}

export function Dashboard({ isAdmin }: Props) {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      {isAdmin ? <AdminPanel /> : <UserDashboard />}
    </Suspense>
  )
}
```

---

## TanStack Router Integration

```typescript
import { createLazyFileRoute } from '@tanstack/react-router'

// In routes/dashboard.lazy.tsx
export const Route = createLazyFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return <div>Dashboard content</div>
}
```
