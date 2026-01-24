---
name: react-tanstack-router
description: TanStack Router - 100% type-safe routing, file-based routes, loaders, search params. Use when implementing routing in React apps (NOT Next.js).
user-invocable: false
---

# TanStack Router

100% type-safe router for React with file-based routing.

## Installation

```bash
bun add @tanstack/react-router
bun add -D @tanstack/router-plugin @tanstack/router-devtools
```

## Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
})
```

---

## File-Based Routing

### Structure

```text
src/routes/
├── __root.tsx          # Root layout
├── index.tsx           # / route
├── about.tsx           # /about route
├── posts/
│   ├── index.tsx       # /posts route
│   └── $postId.tsx     # /posts/:postId route
└── _layout/
    └── dashboard.tsx   # Pathless layout group
```

### Root Route

```typescript
// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

### File Route

```typescript
// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return <h1>Welcome</h1>
}
```

---

## Route Parameters

```typescript
// src/routes/posts/$postId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    return fetchPost(params.postId)
  },
  component: PostPage,
})

function PostPage() {
  const post = Route.useLoaderData()
  return <article>{post.title}</article>
}
```

---

## Search Parameters

### Define Schema

```typescript
// src/routes/search.tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  query: z.string().optional(),
  page: z.number().default(1),
  sort: z.enum(['asc', 'desc']).default('asc'),
})

export const Route = createFileRoute('/search')({
  validateSearch: searchSchema,
  component: SearchPage,
})

function SearchPage() {
  const { query, page, sort } = Route.useSearch()
  return <div>Searching: {query}, Page: {page}</div>
}
```

### Navigate with Search Params

```typescript
import { Link, useNavigate } from '@tanstack/react-router'

// Link with search params
<Link
  to="/search"
  search={{ query: 'react', page: 1, sort: 'asc' }}
>
  Search React
</Link>

// Update search params
<Link
  to="."
  search={(prev) => ({ ...prev, page: prev.page + 1 })}
>
  Next Page
</Link>

// Programmatic navigation
const navigate = useNavigate()
navigate({
  to: '/search',
  search: { query: 'router', page: 1 },
})
```

---

## Loaders

### Basic Loader

```typescript
// src/routes/users.tsx
export const Route = createFileRoute('/users')({
  loader: async () => {
    const users = await fetchUsers()
    return { users }
  },
  component: UsersPage,
})

function UsersPage() {
  const { users } = Route.useLoaderData()
  return <UserList users={users} />
}
```

### Loader with Context

```typescript
// src/routes/posts/$postId.tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params, context }) => {
    return context.queryClient.ensureQueryData({
      queryKey: ['post', params.postId],
      queryFn: () => fetchPost(params.postId),
    })
  },
})
```

---

## Router Setup

```typescript
// src/main.tsx
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return <RouterProvider router={router} />
}
```

---

## Best Practices

1. **Use file-based routing** - Auto-generated type safety
2. **Validate search params** - Use Zod schemas
3. **Use loaders** - Data fetching before render
4. **Type your routes** - Full type inference
5. **Integrate TanStack Query** - For caching and mutations
