---
name: react-router
description: Prisma 7 integration with React Router 7
when-to-use: Building React Router v7+ applications with API routes
keywords: React Router, route handlers, server functions, API
priority: high
requires: client.md
related: remix.md, express.md, hono.md
---

# React Router 7 Integration

Prisma 7 with React Router 7 for modern full-stack React applications.

## Setup

```typescript
// app/interfaces/db.ts
/**
 * Global Prisma singleton type
 * @see /app/db.server.ts
 */
export interface PrismaGlobal {
  prisma: PrismaClient | undefined
}

// app/db.server.ts
import { PrismaClient } from '@prisma/client'
import type { PrismaGlobal } from './interfaces/db'

/**
 * Singleton Prisma client instance
 * Prevents multiple connections in development
 */
const globalForPrisma = globalThis as unknown as PrismaGlobal

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

---

## Route Handlers

```typescript
// app/routes.tsx
import { createBrowserRouter } from 'react-router-dom'
import { prisma } from './db.server'

// Loader for fetching data
export async function getUsersLoader() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

// Dynamic route loader
export async function getUserLoader({
  params,
}: {
  params: { id: string }
}) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { posts: true },
  })

  if (!user) {
    throw new Response('Not found', { status: 404 })
  }

  return user
}

export const router = createBrowserRouter([
  {
    path: '/users',
    lazy: () => import('./pages/Users'),
    loader: getUsersLoader,
  },
  {
    path: '/users/:id',
    lazy: () => import('./pages/UserDetail'),
    loader: getUserLoader,
  },
])
```

---

## API Routes with actions

```typescript
// app/interfaces/api.ts
/**
 * User creation request payload
 * @see /app/api/users.ts
 */
export interface CreateUserRequest {
  name: string
  email: string
}

/**
 * User update request payload
 */
export interface UpdateUserRequest {
  name?: string
  email?: string
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  error: string
}

// app/api/users.ts
import type { CreateUserRequest, UpdateUserRequest, ApiErrorResponse } from '../interfaces/api'
import { prisma } from '../db.server'

/**
 * Create new user via POST
 * @param {Request} request - HTTP request
 * @returns {Promise<Response>} - User object or error
 */
export async function handleCreateUser(
  request: Request
) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
    })
  }

  const data = await request.json() as CreateUserRequest

  if (!data.name || !data.email) {
    return new Response(
      JSON.stringify({ error: 'Missing fields' } as ApiErrorResponse),
      { status: 400 }
    )
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
    },
  })

  return new Response(JSON.stringify(user), {
    status: 201,
  })
}

/**
 * Update existing user via PATCH
 * @param {string} id - User ID
 * @param {Request} request - HTTP request
 * @returns {Promise<Response>} - Updated user object
 */
export async function handleUpdateUser(
  id: string,
  request: Request
) {
  const data = await request.json() as UpdateUserRequest

  const user = await prisma.user.update({
    where: { id },
    data,
  })

  return new Response(JSON.stringify(user))
}

/**
 * Delete user via DELETE
 * @param {string} id - User ID
 * @returns {Promise<Response>} - 204 No Content
 */
export async function handleDeleteUser(id: string) {
  await prisma.user.delete({
    where: { id },
  })

  return new Response(null, { status: 204 })
}
```

---

## Form Actions

```typescript
// app/components/UserForm.tsx
import { Form, useNavigation } from 'react-router-dom'
import { handleCreateUser } from '../api/users'

export function UserForm() {
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  async function handleSubmit(
    formData: FormData
  ) {
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
    }

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error)
    }

    return await response.json()
  }

  return (
    <Form method="post" onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" />
      <input
        name="email"
        type="email"
        placeholder="Email"
      />
      <button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create'}
      </button>
    </Form>
  )
}
```

---

## Server Functions

```typescript
// app/server/queries.ts
import { prisma } from '../db.server'

export async function fetchUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true },
  })
}

export async function fetchUserById(
  userId: string
) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { posts: true },
  })
}

export async function createUserTransaction(
  data: any
) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email: data.email },
    })

    await tx.profile.create({
      data: {
        userId: user.id,
        name: data.name,
      },
    })

    return user
  })
}
```

---

## Error Handling

```typescript
// app/error.tsx
import { useRouteError } from 'react-router-dom'

export function ErrorBoundary() {
  const error = useRouteError()

  return (
    <div>
      <h1>Error</h1>
      <p>
        {error instanceof Error
          ? error.message
          : 'An error occurred'}
      </p>
    </div>
  )
}
```

---

## Best Practices

1. **Separate loaders from actions** - Keep fetch and mutation clear
2. **Use useNavigation** - Track form submission state
3. **Error boundaries** - Handle loader errors gracefully
4. **Type loaders** - Export loader functions with types
5. **Transactions** - Multi-step operations with consistency
