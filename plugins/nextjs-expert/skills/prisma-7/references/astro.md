---
name: astro
description: Prisma 7 integration with Astro framework for SSG and SSR
when-to-use: Building static sites or server-rendered pages with Astro and Prisma
keywords: Astro, SSG, SSR, endpoints, data fetching, integration
priority: high
requires: client.md
related: sveltekit.md, nuxt.md, remix.md
---

# Astro Integration

Prisma 7 with Astro framework for static site generation and server-side rendering.

## Setup

```typescript
// src/lib/interfaces/prisma.ts
/**
 * Global Prisma instance type definition
 * @see /src/lib/prisma.ts
 */
export interface PrismaGlobal {
  prisma: PrismaClient | undefined
}

// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import type { PrismaGlobal } from './interfaces/prisma'

/**
 * Singleton Prisma client instance with global caching
 * Prevents multiple PrismaClient instances in development
 * @returns {PrismaClient} - Cached Prisma instance
 */
const globalForPrisma = globalThis as unknown as PrismaGlobal

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

---

## SSG with getStaticPaths

```typescript
// src/pages/interfaces/post.ts
/**
 * Post page route parameters
 * @see /src/pages/posts/[id].astro
 */
export interface PostPageProps {
  id: string
}

// src/pages/posts/[id].astro
import type { PostPageProps } from '../interfaces/post'
import { prisma } from '@/lib/prisma'

/**
 * Generate static paths for all posts at build time
 * @returns {Promise<Array>} - Array of static route params
 */
export async function getStaticPaths() {
  const posts = await prisma.post.findMany({
    select: { id: true },
  })

  return posts.map((post) => ({
    params: { id: post.id },
  }))
}

const { id } = Astro.params as PostPageProps

const post = await prisma.post.findUnique({
  where: { id },
  include: { author: true },
})
---

<h1>{post?.title}</h1>
<p>{post?.content}</p>
```

---

## API Endpoints

```typescript
// src/pages/interfaces/api.ts
/**
 * POST create request payload
 * @see /src/pages/api/posts.ts
 */
export interface CreatePostRequest {
  title: string
  slug: string
  content: string
}

// src/pages/api/posts.ts
import type { APIRoute } from 'astro'
import type { CreatePostRequest } from '../interfaces/api'
import { prisma } from '@/lib/prisma'

/**
 * Fetch all posts with pagination
 */
export const GET: APIRoute = async () => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return new Response(JSON.stringify(posts))
}

/**
 * Create new post
 * @param {CreatePostRequest} data - Post data from request body
 */
export const POST: APIRoute = async ({ request }) => {
  const data = await request.json() as CreatePostRequest

  const post = await prisma.post.create({
    data,
  })

  return new Response(JSON.stringify(post), {
    status: 201,
  })
}
```

---

## Dynamic Route with SSR

```typescript
// astro.config.mjs
export default defineConfig({
  output: 'hybrid',
  integrations: [tailwind()],
})

// src/pages/api/posts/[id].ts
import type { APIRoute } from 'astro'
import { prisma } from '@/lib/prisma'

export const prerender = false

export const GET: APIRoute = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { author: true, comments: true },
  })

  if (!post) {
    return new Response(null, { status: 404 })
  }

  return new Response(JSON.stringify(post))
}
```

---

## Server-Side Component Data

```astro
---
// src/components/PostList.astro
import { prisma } from '@/lib/prisma'

const posts = await prisma.post.findMany({
  take: 10,
  orderBy: { createdAt: 'desc' },
  include: { author: { select: { name: true } } },
})
---

<ul>
  {posts.map((post) => (
    <li>
      <a href={`/posts/${post.id}`}>{post.title}</a>
      <span>{post.author.name}</span>
    </li>
  ))}
</ul>
```

---

## Best Practices

1. **Use getStaticPaths** - Generate routes at build time
2. **Lazy load data** - Fetch in endpoints when needed
3. **Revalidate ISR** - Use `revalidate` for incremental updates
4. **Type safety** - Export types from schema
5. **Connection pooling** - Set DATABASE_URL_POOL for Astro
