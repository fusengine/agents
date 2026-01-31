---
name: basic-setup
description: Complete TanStack Router setup with SOLID architecture
keywords: setup, installation, router, config, solid
---

# Basic Setup Template

Complete TanStack Router setup following SOLID principles.

## Project Structure (SOLID)

```text
src/
├── modules/
│   ├── cores/                      # Shared core functionality
│   │   ├── lib/
│   │   │   ├── router/
│   │   │   │   ├── router.ts       # Router configuration
│   │   │   │   └── context.ts      # Router context types
│   │   │   └── query/
│   │   │       └── client.ts       # QueryClient configuration
│   │   ├── components/
│   │   │   ├── layouts/
│   │   │   │   └── RootLayout.tsx  # Root layout component
│   │   │   └── navigation/
│   │   │       └── NavLink.tsx     # Custom Link component
│   │   └── interfaces/
│   │       ├── router.interface.ts
│   │       └── user.interface.ts
│   └── posts/                      # Feature module
│       ├── src/
│       │   ├── interfaces/
│       │   │   └── post.interface.ts
│       │   ├── queries/
│       │   │   └── posts.queries.ts
│       │   ├── components/
│       │   │   ├── PostCard.tsx
│       │   │   └── PostList.tsx
│       │   └── hooks/
│       │       └── usePosts.ts
│       └── index.ts
├── routes/                         # Route definitions only
│   ├── __root.tsx
│   ├── index.tsx
│   └── posts/
│       ├── index.tsx
│       └── $postId.tsx
├── routeTree.gen.ts               # Auto-generated
└── main.tsx
```

---

## Core Files

### Router Configuration

```typescript
// src/modules/cores/lib/router/router.ts
import { createRouter } from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'
import { queryClient } from '../query/client'
import type { RouterContext } from '../../interfaces/router.interface'

/**
 * Create and configure the application router.
 *
 * @returns Configured router instance
 */
export function createAppRouter() {
  return createRouter({
    routeTree,
    context: {
      queryClient,
      user: null,
    } satisfies RouterContext,
    defaultPreload: 'intent',
    defaultPreloadDelay: 50,
  })
}

export const router = createAppRouter()

// Type registration (MANDATORY)
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

### Router Context Types

```typescript
// src/modules/cores/interfaces/router.interface.ts
import type { QueryClient } from '@tanstack/react-query'

/**
 * User entity for router context.
 */
export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
}

/**
 * Router context available in all routes.
 */
export interface RouterContext {
  queryClient: QueryClient
  user: User | null
}

/**
 * Extended context for authenticated routes.
 */
export interface AuthenticatedContext extends RouterContext {
  user: User
  permissions: string[]
}
```

### QueryClient Configuration

```typescript
// src/modules/cores/lib/query/client.ts
import { QueryClient } from '@tanstack/react-query'

/**
 * Configured QueryClient for the application.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

---

## Root Route

```typescript
// src/routes/__root.tsx
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import type { RouterContext } from '@/modules/cores/interfaces/router.interface'
import { RootLayout } from '@/modules/cores/components/layouts/RootLayout'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
})

function RootComponent() {
  return (
    <RootLayout>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </RootLayout>
  )
}

function NotFoundPage() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
    </div>
  )
}
```

### Root Layout Component

```typescript
// src/modules/cores/components/layouts/RootLayout.tsx
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

interface RootLayoutProps {
  children: ReactNode
}

/**
 * Root layout with navigation and footer.
 */
export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 py-4">
        <Link to="/" activeProps={{ className: 'font-bold' }}>
          Home
        </Link>
        <Link to="/posts" activeProps={{ className: 'font-bold' }}>
          Posts
        </Link>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t py-4 text-center">
      <p>© 2026</p>
    </footer>
  )
}
```

---

## Entry Point

```typescript
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { router } from '@/modules/cores/lib/router/router'
import { queryClient } from '@/modules/cores/lib/query/client'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
)
```

---

## Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

---

## Package Installation

```bash
# Core
bun add @tanstack/react-router @tanstack/react-query @tanstack/zod-adapter zod

# Dev
bun add -D @tanstack/router-plugin @tanstack/router-devtools @tanstack/react-query-devtools
```

---

## TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

---

## .gitignore

```gitignore
# TanStack Router
src/routeTree.gen.ts
```
