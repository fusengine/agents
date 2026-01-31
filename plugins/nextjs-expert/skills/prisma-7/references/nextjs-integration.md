---
name: nextjs-integration
description: Prisma 7 integration with Next.js 16 App Router
when-to-use: Using Prisma in Next.js Server Components and API routes
keywords: Next.js, App Router, Server Component, API route, RSC
priority: critical
requires: client.md
related: optimization.md
---

# Next.js Integration

Prisma 7 with Next.js 16 App Router.

## Singleton Setup

```typescript
// modules/cores/db/src/interfaces/types.ts
import type { PrismaClient } from '@prisma/client'

/**
 * Global Prisma singleton type
 * @module modules/cores/db/src/interfaces
 */
export interface GlobalPrisma {
  prisma: PrismaClient | undefined
}
```

```typescript
// modules/cores/db/src/prisma.ts
import 'dotenv/config'
import type { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import type { GlobalPrisma } from './src/interfaces/types'

/**
 * Initialize Prisma singleton with PostgreSQL adapter
 * Prevents connection exhaustion in serverless environment
 * @module modules/cores/db
 */
const globalForPrisma = globalThis as unknown as GlobalPrisma

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

export const prisma = new (require('@prisma/client').PrismaClient)({
  adapter,
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

---

## Server Components

```typescript
// app/users/page.tsx
import { prisma } from '@/modules/cores/db/src/prisma'

/**
 * Users listing page - Server Component
 * Fetches and renders user list with optimized select fields
 * @module app/users
 */
export default async function UsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  })

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

---

## Server Actions

```typescript
// app/users/src/actions/userActions.ts
'use server'

import { prisma } from '@/modules/cores/db/src/prisma'
import { revalidatePath } from 'next/cache'

/**
 * Create new user from form data
 * Revalidates users page cache after creation
 * @module app/users/src/actions
 * @param formData Form submission data containing name and email
 */
export async function createUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  await prisma.user.create({
    data: { name, email },
  })

  revalidatePath('/users')
}

/**
 * Delete user by ID
 * Revalidates users page cache after deletion
 * @module app/users/src/actions
 */
export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: { id },
  })

  revalidatePath('/users')
}
```

---

## API Routes

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/modules/cores/db/src/prisma'

/**
 * GET /api/users - Fetch all users
 * @module app/api/users
 */
export async function GET() {
  const users = await prisma.user.findMany()
  return NextResponse.json(users)
}

/**
 * POST /api/users - Create new user
 * @module app/api/users
 */
export async function POST(request: NextRequest) {
  const body = await request.json()

  const user = await prisma.user.create({
    data: body,
  })

  return NextResponse.json(user, { status: 201 })
}
```

---

## Dynamic Route Params

```typescript
// app/users/[id]/src/interfaces/pageProps.ts
/**
 * Dynamic route page props interface
 * @module app/users/[id]/src/interfaces
 */
export interface UserPageProps {
  params: Promise<{ id: string }>
}
```

```typescript
// app/users/[id]/page.tsx
import { prisma } from '@/modules/cores/db/src/prisma'
import { notFound } from 'next/navigation'
import type { UserPageProps } from './src/interfaces/pageProps'

/**
 * Dynamic user detail page
 * Fetches and displays user information by ID
 * @module app/users/[id]
 */
export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    notFound()
  }

  return <div>{user.name}</div>
}
```

---

## With unstable_cache

```typescript
// modules/users/src/queries/getCachedUsers.ts
import { unstable_cache } from 'next/cache'
import { prisma } from '@/modules/cores/db/src/prisma'

/**
 * Fetch cached user list with 60-second revalidation
 * Optimized for repetitive reads in Server Components
 * @module modules/users/src/queries
 * @returns Promise resolving to user list with id and name
 */
export const getCachedUsers = unstable_cache(
  async () => {
    return prisma.user.findMany({
      select: { id: true, name: true },
    })
  },
  ['users-list'],
  { revalidate: 60 }
)
```

```typescript
// app/users/page.tsx
import { getCachedUsers } from '@/modules/users/src/queries/getCachedUsers'

/**
 * Users listing page with cached queries
 * @module app/users
 */
export default async function UsersPage() {
  const users = await getCachedUsers()
  return <UserList users={users} />
}
```

---

## Edge Runtime

```typescript
// modules/cores/db/src/edge-client.ts
import { PrismaNeon } from '@prisma/adapter-neon'
import { neon } from '@neondatabase/serverless'
import { PrismaClient } from '@prisma/client'

/**
 * Create Prisma client for Edge Runtime (Vercel Edge Functions)
 * Uses Neon serverless PostgreSQL adapter
 * @module modules/cores/db/src
 * @returns PrismaClient configured for edge runtime
 */
export function getEdgePrisma() {
  const sql = neon(process.env.DATABASE_URL!)
  const adapter = new PrismaNeon(sql)
  return new PrismaClient({ adapter })
}
```

```typescript
// app/api/users/route.ts
import { getEdgePrisma } from '@/modules/cores/db/src/edge-client'

export const runtime = 'edge'

/**
 * GET /api/users - Edge runtime endpoint
 * @module app/api/users
 */
export async function GET() {
  const prisma = getEdgePrisma()
  const users = await prisma.user.findMany()
  return Response.json(users)
}
```

---

## Best Practices

1. **Singleton pattern** - Prevent connection exhaustion
2. **Server only** - Never import prisma in client components
3. **Use select** - Only fetch needed fields
4. **Revalidate after mutations** - Call revalidatePath
5. **Edge-compatible adapter** - Use Neon for edge runtime
