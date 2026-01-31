---
name: clerk
description: Clerk authentication integration with Prisma 7
when-to-use: Building authentication with Clerk and storing user data in Prisma
keywords: Clerk, authentication, user sync, webhooks
priority: high
requires: client.md, nextjs-integration.md
related: authjs.md, betterauth.md
---

# Clerk Authentication with Prisma

Integrate Clerk authentication with Prisma 7 for user management.

## Schema Setup

```prisma
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts Post[]
}

model Post {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String
  content   String
  createdAt DateTime @default(now())
}
```

---

## Webhook Handler

```typescript
// modules/auth/src/interfaces/clerk-webhook.interface.ts
/**
 * Clerk webhook event types
 */
export type ClerkWebhookEventType = 'user.created' | 'user.deleted'

/**
 * Clerk user event data
 */
export interface ClerkUserEvent {
  type: ClerkWebhookEventType
  data: {
    id: string
    first_name: string
    last_name: string
    email_addresses: Array<{ email_address: string }>
  }
}
```

```typescript
// modules/auth/src/services/clerk-webhook.service.ts
import type { ClerkUserEvent } from '../interfaces/clerk-webhook.interface'
import { prisma } from '@/modules/cores/db/prisma'

/**
 * Handle user created event from Clerk webhook
 */
export async function handleUserCreated(event: ClerkUserEvent): Promise<void> {
  await prisma.user.create({
    data: {
      clerkId: event.data.id,
      email: event.data.email_addresses[0].email_address,
      name: `${event.data.first_name} ${event.data.last_name}`.trim(),
    },
  })
}

/**
 * Handle user deleted event from Clerk webhook
 */
export async function handleUserDeleted(event: ClerkUserEvent): Promise<void> {
  await prisma.user.deleteMany({
    where: { clerkId: event.data.id },
  })
}
```

```typescript
// app/api/webhooks/clerk/route.ts
import { prisma } from '@/modules/cores/db/prisma'
import { handleUserCreated, handleUserDeleted } from '@/modules/auth/src/services/clerk-webhook.service'
import type { ClerkUserEvent } from '@/modules/auth/src/interfaces/clerk-webhook.interface'
import { Webhook } from 'svix'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!

/**
 * POST handler for Clerk webhook events
 */
export async function POST(req: Request) {
  const svix_id = req.headers.get('svix-id')
  const svix_timestamp = req.headers.get('svix-timestamp')
  const svix_signature = req.headers.get('svix-signature')

  const body = await req.text()
  const wh = new Webhook(webhookSecret)

  const evt = wh.verify(body, {
    'svix-id': svix_id!,
    'svix-timestamp': svix_timestamp!,
    'svix-signature': svix_signature!,
  }) as ClerkUserEvent

  if (evt.type === 'user.created') {
    await handleUserCreated(evt)
  }

  if (evt.type === 'user.deleted') {
    await handleUserDeleted(evt)
  }

  return new Response('OK', { status: 200 })
}
```

---

## Using in Server Components

```typescript
// modules/dashboard/src/services/dashboard.service.ts
import { prisma } from '@/modules/cores/db/prisma'
import type { User, Post } from '@prisma/client'

interface UserWithPosts {
  user: User
  posts: Post[]
}

/**
 * Fetch user dashboard data by Clerk ID
 */
export async function getUserDashboard(clerkId: string): Promise<UserWithPosts | null> {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { posts: true },
  })

  if (!user) return null
  return { user, posts: user.posts }
}
```

```typescript
// app/dashboard/page.tsx
import { currentUser } from '@clerk/nextjs/server'
import { getUserDashboard } from '@/modules/dashboard/src/services/dashboard.service'
import { DashboardView } from '@/modules/dashboard/components/DashboardView'

/**
 * Dashboard page - fetches user and posts data
 */
export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) return <div>Not authenticated</div>

  const dashboard = await getUserDashboard(user.id)
  if (!dashboard) return <div>User not found</div>

  return <DashboardView dashboard={dashboard} />
}
```

---

## Server Actions with Auth

```typescript
// modules/posts/src/interfaces/post.interface.ts
import type { Post } from '@prisma/client'

/**
 * Create post request payload
 */
export interface CreatePostRequest {
  title: string
  content: string
}

/**
 * Post creation response
 */
export interface CreatePostResponse extends Post {}
```

```typescript
// modules/posts/src/services/post.service.ts
import type { CreatePostRequest, CreatePostResponse } from '../interfaces/post.interface'
import { prisma } from '@/modules/cores/db/prisma'

/**
 * Create a new post for the authenticated user
 * @throws {Error} If user not found in database
 */
export async function createPost(
  userId: string,
  request: CreatePostRequest
): Promise<CreatePostResponse> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) throw new Error('User not found in database')

  return prisma.post.create({
    data: {
      userId,
      title: request.title,
      content: request.content,
    },
  })
}
```

```typescript
// app/posts/actions.ts
'use server'

import { currentUser } from '@clerk/nextjs/server'
import { createPost } from '@/modules/posts/src/services/post.service'
import { prisma } from '@/modules/cores/db/prisma'
import { revalidatePath } from 'next/cache'
import type { CreatePostRequest } from '@/modules/posts/src/interfaces/post.interface'

/**
 * Server action to create a new post
 * Requires authentication
 */
export async function createPostAction(title: string, content: string) {
  const user = await currentUser()
  if (!user) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  })

  if (!dbUser) throw new Error('User not found in database')

  const request: CreatePostRequest = { title, content }
  await createPost(dbUser.id, request)

  revalidatePath('/posts')
}
```

---

## Best Practices

1. **Sync on webhook** - Keep Prisma user data in sync via webhooks
2. **Use clerkId** - Store Clerk ID as unique identifier
3. **Cascade deletes** - Remove user posts when user is deleted
4. **Check both** - Always verify Clerk auth and database user exists
5. **Index frequently queried fields** - Add @@index for clerkId searches
