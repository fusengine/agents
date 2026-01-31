---
name: nuxt
description: Prisma 7 integration with Nuxt 3 framework
when-to-use: Building Nuxt 3 applications with Prisma database access
keywords: Nuxt 3, server routes, composables, middleware, SSR
priority: high
requires: client.md
related: astro.md, sveltekit.md, solidstart.md
---

# Nuxt 3 Integration

Prisma 7 with Nuxt 3 for server-side rendering and API routes.

## Setup

```typescript
// server/utils/interfaces/prisma.ts
/**
 * Global Prisma singleton type definition
 * @see /server/utils/prisma.ts
 */
export interface PrismaGlobal {
  prisma: PrismaClient | undefined
}

// server/utils/prisma.ts
import { PrismaClient } from '@prisma/client'
import type { PrismaGlobal } from './interfaces/prisma'

/**
 * Get or create Prisma singleton instance
 * Prevents multiple connections in development
 * @returns {PrismaClient} - Cached Prisma instance
 */
const globalForPrisma = globalThis as unknown as PrismaGlobal

export const usePrisma = () =>
  (globalForPrisma.prisma ??=
    new PrismaClient())
```

---

## Server Routes

```typescript
// server/api/users.ts
export default defineEventHandler(async () => {
  const prisma = usePrisma()

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
  })

  return users
})

// server/api/users/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    })
  }

  return user
})

// server/api/users.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const user = await prisma.user.create({
    data: body,
  })

  return user
})
```

---

## Server Middleware

```typescript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  if (event.node.req.url?.startsWith('/api/admin')) {
    const token = getCookie(event, 'token')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    // Verify token and fetch user
    const prisma = usePrisma()
    const user = await prisma.user.findFirst({
      where: { token },
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token',
      })
    }

    event.context.user = user
  }
})
```

---

## Composables

```typescript
// composables/interfaces/user.ts
/**
 * User API response/state
 * @see /composables/useUsers.ts
 */
export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

/**
 * User creation request payload
 */
export interface CreateUserPayload {
  name: string
  email: string
}

/**
 * Composable state snapshot
 */
export interface UseUsersState {
  users: Readonly<Ref<User[]>>
  loading: Readonly<Ref<boolean>>
  error: Readonly<Ref<Error | null>>
  fetchUsers: () => Promise<void>
  createUser: (userData: CreateUserPayload) => Promise<User>
}

// composables/useUsers.ts
import type { Ref } from 'vue'
import { ref, readonly } from 'vue'
import type { User, CreateUserPayload, UseUsersState } from './interfaces/user'

/**
 * Composable for user management with API integration
 * Handles user list fetching and creation with error handling
 * @returns {UseUsersState} - User state and actions
 */
export const useUsers = (): UseUsersState => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  /**
   * Fetch all users from API
   */
  const fetchUsers = async () => {
    loading.value = true
    try {
      const data = await $fetch('/api/users')
      users.value = data
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  /**
   * Create new user via API
   * @param {CreateUserPayload} userData - User data
   * @returns {Promise<User>} - Created user
   */
  const createUser = async (userData: CreateUserPayload): Promise<User> => {
    const user = await $fetch('/api/users', {
      method: 'POST',
      body: userData,
    })
    users.value.push(user)
    return user
  }

  return {
    users: readonly(users),
    loading: readonly(loading),
    error: readonly(error),
    fetchUsers,
    createUser,
  }
}
```

---

## Server Utilities

```typescript
// server/utils/userService.ts
export const getUserWithPosts = async (
  userId: string
) => {
  const prisma = usePrisma()

  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        select: { id: true, title: true },
      },
    },
  })
}

export const createUserWithProfile = async (
  data: any
) => {
  const prisma = usePrisma()

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

## Best Practices

1. **Use usePrisma** - Composable for consistent access
2. **Server routes only** - Keep DB queries server-side
3. **Error handling** - Use createError for proper responses
4. **Transactions** - Use prisma.$transaction for consistency
5. **Type safety** - Auto-generate types in middleware
