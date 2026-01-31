---
name: use-promise-template
description: use() hook patterns with promises and Suspense
---

# use() Hook with Promises

## Basic Data Fetching

```typescript
// modules/users/components/UserProfile.tsx
import { use, Suspense } from 'react'
import type { User } from '../src/interfaces/user.interface'
import { userService } from '../src/services/user.service'

// Promise created outside component (or in loader)
function fetchUser(id: string): Promise<User> {
  return userService.getById(id)
}

/**
 * User profile with use() hook.
 */
function UserProfileContent({ userPromise }: { userPromise: Promise<User> }) {
  // Suspends until promise resolves
  const user = use(userPromise)

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}

export function UserProfile({ userId }: { userId: string }) {
  // Create promise once
  const userPromise = fetchUser(userId)

  return (
    <Suspense fallback={<UserSkeleton />}>
      <UserProfileContent userPromise={userPromise} />
    </Suspense>
  )
}
```

---

## Conditional use()

```typescript
// Unique to use() - can be called conditionally
function UserDetails({ userId, showPosts }: Props) {
  const user = use(fetchUser(userId))

  // Conditional data fetching
  const posts = showPosts ? use(fetchPosts(userId)) : null

  return (
    <div>
      <h1>{user.name}</h1>
      {posts && (
        <ul>
          {posts.map((p) => <li key={p.id}>{p.title}</li>)}
        </ul>
      )}
    </div>
  )
}
```

---

## Parallel Data Fetching

```typescript
// modules/dashboard/components/Dashboard.tsx
import { use, Suspense } from 'react'

function DashboardContent({
  userPromise,
  statsPromise,
  notificationsPromise
}: {
  userPromise: Promise<User>
  statsPromise: Promise<Stats>
  notificationsPromise: Promise<Notification[]>
}) {
  // All fetched in parallel
  const user = use(userPromise)
  const stats = use(statsPromise)
  const notifications = use(notificationsPromise)

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <StatsCard stats={stats} />
      <NotificationList items={notifications} />
    </div>
  )
}

export function Dashboard({ userId }: { userId: string }) {
  // Start all fetches immediately
  const userPromise = fetchUser(userId)
  const statsPromise = fetchStats(userId)
  const notificationsPromise = fetchNotifications(userId)

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent
        userPromise={userPromise}
        statsPromise={statsPromise}
        notificationsPromise={notificationsPromise}
      />
    </Suspense>
  )
}
```

---

## use() with Context

```typescript
// Can replace useContext
import { use, createContext } from 'react'

const ThemeContext = createContext<'light' | 'dark'>('light')

function ThemedButton() {
  // use() can read context
  const theme = use(ThemeContext)

  return (
    <button className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
      Click me
    </button>
  )
}

// Conditional context (not possible with useContext)
function MaybeThemed({ useTheme }: { useTheme: boolean }) {
  // Conditionally read context
  const theme = useTheme ? use(ThemeContext) : 'light'

  return <div className={theme}>Content</div>
}
```

---

## Error Handling with Error Boundary

```typescript
// modules/cores/components/ErrorBoundary.tsx
import { Component, Suspense } from 'react'

interface Props {
  fallback: React.ReactNode
  children: React.ReactNode
}

class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// Usage
function DataPage({ dataPromise }: { dataPromise: Promise<Data> }) {
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <Suspense fallback={<Loading />}>
        <DataContent dataPromise={dataPromise} />
      </Suspense>
    </ErrorBoundary>
  )
}
```

---

## TanStack Router Integration

```typescript
// routes/users.$id.tsx
import { createFileRoute } from '@tanstack/react-router'
import { use, Suspense } from 'react'

export const Route = createFileRoute('/users/$id')({
  loader: ({ params }) => ({
    userPromise: fetchUser(params.id)
  }),
  component: UserPage
})

function UserPage() {
  const { userPromise } = Route.useLoaderData()

  return (
    <Suspense fallback={<UserSkeleton />}>
      <UserContent userPromise={userPromise} />
    </Suspense>
  )
}

function UserContent({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise)
  return <UserProfile user={user} />
}
```

---

## Rules

- Always wrap with `<Suspense>` for promises
- Create promise **outside** the component or in loader
- Can be called conditionally and in loops (unique!)
- Use Error Boundary for error handling
- For caching, prefer TanStack Query or Router loaders
