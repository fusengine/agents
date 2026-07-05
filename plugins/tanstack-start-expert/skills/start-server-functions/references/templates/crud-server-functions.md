---
name: crud-server-functions
description: Complete CRUD module using createServerFn with auth and Zod
keywords: crud, createServerFn, zod, middleware, loader, useServerFn
---

# Complete CRUD Server Functions Module

Full working example split across the recommended file layout.

## Usage

Copy these files into `src/utils/` and adapt the imports (`db`, `authMiddleware`).

---

## Shared Schemas (client-safe)

```ts
// src/utils/schemas.ts
import { z } from 'zod'

export const PostInput = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
})

export const PostId = z.object({ id: z.string().uuid() })

export type PostInput = z.infer<typeof PostInput>
```

---

## Server-Only Helpers

```ts
// src/utils/posts.server.ts
import { db } from '~/db'
import type { PostInput } from './schemas'

export async function listPosts(userId: string) {
  return db.posts.findMany({ where: { userId } })
}

export async function findPost(id: string, userId: string) {
  return db.posts.findFirst({ where: { id, userId } })
}

export async function insertPost(data: PostInput, userId: string) {
  return db.posts.create({ data: { ...data, userId } })
}

export async function removePost(id: string, userId: string) {
  return db.posts.delete({ where: { id, userId } })
}
```

---

## Server Function Wrappers

```tsx
// src/utils/posts.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'
import { authMiddleware } from '~/middleware/auth' // see start-middleware skill
import { PostInput, PostId } from './schemas'
import { listPosts, findPost, insertPost, removePost } from './posts.server'

// READ — auth enforced on the endpoint, not the route
export const getPosts = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listPosts(context.session.userId))

export const getPost = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(PostId)
  .handler(async ({ data, context }) => {
    const post = await findPost(data.id, context.session.userId)
    if (!post) throw notFound()
    return post
  })

// CREATE
export const createPost = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(PostInput)
  .handler(async ({ data, context }) =>
    insertPost(data, context.session.userId),
  )

// DELETE
export const deletePost = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(PostId)
  .handler(async ({ data, context }) =>
    removePost(data.id, context.session.userId),
  )
```

---

## Consuming in a Route

```tsx
// src/routes/posts.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { getPosts, deletePost } from '~/utils/posts.functions'

export const Route = createFileRoute('/posts')({
  loader: () => getPosts(), // isomorphic loader → server fn does the DB work
  component: PostList,
})

function PostList() {
  const posts = Route.useLoaderData()
  const router = Route.useRouter()
  const remove = useServerFn(deletePost)

  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>
          {p.title}
          <button
            onClick={async () => {
              await remove({ data: { id: p.id } })
              router.invalidate()
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
```
