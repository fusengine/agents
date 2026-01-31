---
name: sveltekit
description: Prisma 7 integration with SvelteKit framework
when-to-use: Building SvelteKit applications with server load functions and form actions
keywords: SvelteKit, load functions, form actions, server hooks, SSR
priority: high
requires: client.md
related: nuxt.md, remix.md, solidstart.md
---

# SvelteKit Integration

Prisma 7 with SvelteKit for full-stack applications.

## Setup

```typescript
// src/lib/server/interfaces/prisma.ts
/**
 * Global Prisma singleton type
 * @see /src/lib/server/prisma.ts
 */
export interface PrismaGlobal {
  prisma: PrismaClient | undefined
}

// src/lib/server/prisma.ts
import { PrismaClient } from '@prisma/client'
import type { PrismaGlobal } from './interfaces/prisma'

/**
 * Singleton Prisma client with global caching
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

## Load Functions

```typescript
// src/routes/users/+page.server.ts
import { prisma } from '$lib/server/prisma'

export async function load() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { createdAt: 'desc' },
  })

  return { users }
}

// src/routes/users/[id]/+page.server.ts
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({
  params,
}) => {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { posts: true },
  })

  if (!user) {
    throw error(404, 'User not found')
  }

  return { user }
}
```

---

## Form Actions

```typescript
// src/routes/users/+page.server.ts
import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
  create: async ({ request }) => {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const email = formData.get('email') as string

    if (!name || !email) {
      return fail(400, { message: 'Missing fields' })
    }

    try {
      const user = await prisma.user.create({
        data: { name, email },
      })

      throw redirect(303, `/users/${user.id}`)
    } catch (e) {
      return fail(500, { message: 'Creation failed' })
    }
  },

  delete: async ({ request }) => {
    const formData = await request.formData()
    const id = formData.get('id') as string

    await prisma.user.delete({
      where: { id },
    })

    return { success: true }
  },
}
```

---

## API Routes

```typescript
// src/routes/api/users/+server.ts
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
  const users = await prisma.user.findMany()
  return new Response(JSON.stringify(users))
}

export const POST: RequestHandler = async ({
  request,
}) => {
  const data = await request.json()

  const user = await prisma.user.create({
    data,
  })

  return new Response(JSON.stringify(user), {
    status: 201,
  })
}

// src/routes/api/users/[id]/+server.ts
export const DELETE: RequestHandler = async ({
  params,
}) => {
  await prisma.user.delete({
    where: { id: params.id },
  })

  return new Response(null, { status: 204 })
}
```

---

## Hooks

```typescript
// src/lib/interfaces/auth.ts
/**
 * Authenticated user in request context
 * @see /src/hooks.server.ts
 */
export interface RequestUser {
  id: string
  email: string
  token: string
  name?: string
}

/**
 * SvelteKit locals with auth context
 */
export interface AppLocals {
  user: RequestUser | null
}

// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit'
import type { AppLocals } from '$lib/interfaces/auth'
import { prisma } from '$lib/server/prisma'

/**
 * Authenticate user via token cookie
 * Adds user context to event.locals
 */
export const handle: Handle = async ({
  event,
  resolve,
}) => {
  const token = event.cookies.get('token')

  if (token) {
    const user = await prisma.user.findFirst({
      where: { token },
    })

    event.locals.user = user || null
  }

  return resolve(event)
}

// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types'
import type { AppLocals } from '$lib/interfaces/auth'

/**
 * Share authenticated user with all routes
 */
export const load: LayoutServerLoad = ({ locals }: { locals: AppLocals }) => {
  return {
    user: locals.user,
  }
}
```

---

## Transactions

```typescript
// src/routes/posts/+page.server.ts
export const actions: Actions = {
  publish: async ({ request, locals }) => {
    const formData = await request.formData()
    const postId = formData.get('postId') as string

    try {
      const post = await prisma.$transaction(
        async (tx) => {
          // Update post status
          const updated = await tx.post.update({
            where: { id: postId },
            data: { published: true },
          })

          // Log activity
          await tx.activity.create({
            data: {
              userId: locals.user!.id,
              action: 'published_post',
              postId,
            },
          })

          return updated
        }
      )

      return { success: true, post }
    } catch (e) {
      return fail(500, { message: 'Publish failed' })
    }
  },
}
```

---

## Best Practices

1. **Separate load and actions** - Keep concerns isolated
2. **Type page data** - Use generated $types
3. **Error handling** - Use fail() for form errors
4. **Transactions** - Use $transaction for multi-step operations
5. **Hooks for auth** - Validate in handle hook
