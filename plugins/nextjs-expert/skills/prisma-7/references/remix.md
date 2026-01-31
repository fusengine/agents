---
name: remix
description: Prisma 7 integration with Remix framework
when-to-use: Building Remix applications with loaders and actions
keywords: Remix, loaders, actions, fetcher, form data
priority: high
requires: client.md
related: sveltekit.md, solidstart.md, react-router.md
---

# Remix Integration

Prisma 7 with Remix for full-stack React applications.

## Setup

```typescript
// app/interfaces/db.ts
/**
 * Global Prisma singleton declaration
 * @see /app/utils/db.server.ts
 */
declare global {
  var __db__: PrismaClient | undefined
}

// app/utils/db.server.ts
import { PrismaClient } from '@prisma/client'
import type { Prisma } from '@prisma/client'

/**
 * Singleton Prisma client instance
 * Uses global variable in development to prevent connection leaks
 * Creates new instance in production for proper cleanup
 */
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient()
  }
  prisma = global.__db__
}

export { prisma }
```

---

## Loaders

```typescript
// app/routes/users._index.tsx
import type { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { prisma } from '~/utils/db.server'

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { createdAt: 'desc' },
  })

  return { users }
}

export default function UsersPage() {
  const { users } = useLoaderData<typeof loader>()

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <a href={`/users/${user.id}`}>
            {user.name}
          </a>
        </li>
      ))}
    </ul>
  )
}
```

---

## Dynamic Route Loaders

```typescript
// app/routes/users.$id.tsx
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { prisma } from '~/utils/db.server'

export async function loader({
  params,
}: LoaderFunctionArgs) {
  const user = await prisma.user.findUnique({
    where: { id: params.id! },
    include: {
      posts: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!user) {
    throw new Response('Not Found', { status: 404 })
  }

  return json({ user })
}

export default function UserDetailPage() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

---

## Actions

```typescript
// app/interfaces/user.ts
/**
 * User creation form payload
 * @see /app/routes/users.create.tsx
 */
export interface CreateUserFormPayload {
  name: string
  email: string
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  error: string
}

// app/routes/users.create.tsx
import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import type { CreateUserFormPayload, ApiErrorResponse } from '~/interfaces/user'
import { prisma } from '~/utils/db.server'

/**
 * Handle user creation form submission
 * Validates form fields and creates user in database
 * @param {ActionFunctionArgs} args - Request context
 * @returns {Promise} - Redirect on success or error response
 */
export async function action({
  request,
}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    throw new Response('Method not allowed', {
      status: 405,
    })
  }

  const formData = await request.formData()
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  if (!name || !email) {
    return json<ApiErrorResponse>(
      { error: 'Missing fields' },
      { status: 400 }
    )
  }

  const user = await prisma.user.create({
    data: { name, email },
  })

  throw redirect(`/users/${user.id}`)
}

/**
 * Create user form component
 */
export default function CreateUserPage() {
  return (
    <form method="post">
      <input name="name" placeholder="Name" />
      <input
        name="email"
        type="email"
        placeholder="Email"
      />
      <button type="submit">Create User</button>
    </form>
  )
}
```

---

## Mutations with Fetcher

```typescript
// app/routes/users.$id.delete.tsx
import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { prisma } from '~/utils/db.server'

export async function action({
  params,
  request,
}: ActionFunctionArgs) {
  if (request.method !== 'DELETE') {
    throw new Response('Method not allowed', {
      status: 405,
    })
  }

  await prisma.user.delete({
    where: { id: params.id! },
  })

  throw redirect('/users')
}

export default function UserDeleteButton({
  userId,
}: {
  userId: string
}) {
  const fetcher = useFetcher()

  return (
    <fetcher.Form
      method="delete"
      action={`/users/${userId}/delete`}
    >
      <button type="submit">Delete</button>
    </fetcher.Form>
  )
}
```

---

## Transactions

```typescript
// app/routes/posts.publish.tsx
import type { ActionFunctionArgs } from '@remix-run/node'
import { prisma } from '~/utils/db.server'

export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData()
  const postId = formData.get('postId') as string
  const userId = formData.get('userId') as string

  const result = await prisma.$transaction(
    async (tx) => {
      // Update post
      const post = await tx.post.update({
        where: { id: postId },
        data: { published: true },
      })

      // Log activity
      await tx.activity.create({
        data: {
          userId,
          action: 'published',
          postId,
        },
      })

      return post
    }
  )

  return { success: true, post: result }
}
```

---

## Best Practices

1. **Separate loaders from actions** - Keep read and write clear
2. **Use useLoaderData type-safely** - Import LoaderFunctionArgs type
3. **Validate in actions** - Check required fields
4. **Use fetcher for UI** - Non-navigational mutations
5. **Transaction for consistency** - Multi-step operations
