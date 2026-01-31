---
name: solidstart
description: Prisma 7 integration with SolidStart framework
when-to-use: Building SolidStart applications with server functions
keywords: SolidStart, solid.js, server functions, streaming, RSC
priority: high
requires: client.md
related: sveltekit.md, remix.md, nuxt.md
---

# SolidStart Integration

Prisma 7 with SolidStart for full-stack Solid.js applications.

## Setup

```typescript
// src/server/interfaces/prisma.ts
/**
 * Global Prisma singleton type definition
 * @see /src/server/db.ts
 */
export interface PrismaGlobal {
  prisma: PrismaClient | undefined
}

// src/server/db.ts
import { PrismaClient } from '@prisma/client'
import type { PrismaGlobal } from './interfaces/prisma'

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

## Server Functions

```typescript
// src/routes/users.tsx
import { server$ } from 'solid-start/server'
import { prisma } from '~/server/db'

const fetchUsers = server$(async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: { createdAt: 'desc' },
  })
})

const createUser = server$(
  async (data: { name: string; email: string }) => {
    return prisma.user.create({
      data,
    })
  }
)

export default function UsersPage() {
  const users = createResource(() => fetchUsers())

  return (
    <div>
      <Show
        when={users()}
        fallback={<div>Loading...</div>}
      >
        {(userList) => (
          <ul>
            {userList().map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        )}
      </Show>
    </div>
  )
}
```

---

## Form Mutations

```typescript
// src/routes/interfaces/user.ts
/**
 * User creation form data
 * @see /src/routes/users/create.tsx
 */
export interface CreateUserFormData {
  name: string
  email: string
}

/**
 * Server action context
 */
export interface ServerActionContext {
  pending: boolean
}

// src/routes/users/create.tsx
import { server$ } from 'solid-start/server'
import { createServerAction$ } from 'solid-start/server'
import type { CreateUserFormData } from '../interfaces/user'
import { prisma } from '~/server/db'

/**
 * Server action to create new user
 * Validates form data and persists to database
 * @param {FormData} data - Form data from submission
 * @returns {Promise<User>} - Created user object
 */
const createUserAction = server$(
  async (
    data: FormData,
    _info: unknown
  ) => {
    const name = data.get('name') as string
    const email = data.get('email') as string

    if (!name || !email) {
      throw new Error('Missing fields')
    }

    return prisma.user.create({
      data: { name, email },
    })
  }
)

/**
 * Form component for user creation
 * Handles submission state and form rendering
 */
export default function CreateUserPage() {
  const [creating, { Form }] = createServerAction$(
    createUserAction
  )

  return (
    <Form>
      <input name="name" placeholder="Name" />
      <input
        name="email"
        type="email"
        placeholder="Email"
      />
      <button type="submit" disabled={creating.pending}>
        Create
      </button>
    </Form>
  )
}
```

---

## Dynamic Routes

```typescript
// src/routes/users/[id].tsx
import { server$ } from 'solid-start/server'
import { useParams, HttpStatusCode } from 'solid-start'

const getUserById = server$(async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: { posts: true },
  })
})

export default function UserPage() {
  const params = useParams<{ id: string }>()

  const user = createResource(
    () => params.id,
    (id) => getUserById(id)
  )

  return (
    <Show
      when={user()}
      fallback={<HttpStatusCode code={404} />}
    >
      {(userData) => (
        <div>
          <h1>{userData().name}</h1>
          <p>{userData().email}</p>
        </div>
      )}
    </Show>
  )
}
```

---

## Batch Data Loading

```typescript
// src/server/queries.ts
export const getUsersWithPosts = server$(
  async () => {
    return prisma.user.findMany({
      include: {
        posts: {
          select: { id: true, title: true },
          take: 5,
        },
      },
    })
  }
)

export const getPostComments = server$(
  async (postId: string) => {
    return prisma.comment.findMany({
      where: { postId },
      include: { author: { select: { name: true } } },
    })
  }
)

// Usage in component
export default function PostPage() {
  const [comments] = createResource(
    () => params.postId,
    (id) => getPostComments(id)
  )

  return (
    <For each={comments()}>
      {(comment) => <p>{comment.text}</p>}
    </For>
  )
}
```

---

## Streaming

```typescript
// src/routes/api/users.ts
import { json } from 'solid-start/server'

export async function GET() {
  const users = await prisma.user.findMany()
  return json(users)
}

// Streaming response
export async function POST({ request }: any) {
  const data = await request.json()

  const user = await prisma.user.create({
    data,
  })

  return json(user, { status: 201 })
}
```

---

## Best Practices

1. **Use server$** - Mark functions for server execution
2. **createServerAction$** - Handle form submissions
3. **createResource** - Load data reactively
4. **Batch queries** - Fetch all needed data at once
5. **Error boundaries** - Wrap in Show component for fallbacks
