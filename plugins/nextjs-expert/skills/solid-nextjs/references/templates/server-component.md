---
name: server-component-template
description: Server Component template with data fetching, Suspense, and proper typing
---

# Server Component (< 80 lines)

```typescript
// app/(dashboard)/users/page.tsx
import { Suspense } from 'react'
import { UserList } from '@/modules/users/components/UserList'
import { UserListSkeleton } from '@/modules/users/components/UserListSkeleton'
import { getUsers } from '@/modules/users/src/services/user.service'

/**
 * Users list page - Server Component
 *
 * @param params - Route parameters
 * @returns Users list page
 */
export default async function UsersPage({
  params
}: {
  params: Promise<{ teamId: string }>
}) {
  const { teamId } = await params
  const users = await getUsers(teamId)

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Team Members</h1>
      <Suspense fallback={<UserListSkeleton />}>
        <UserList users={users} />
      </Suspense>
    </main>
  )
}
```

## With Error Handling

```typescript
// app/(dashboard)/users/[id]/page.tsx
import { notFound } from 'next/navigation'
import { UserProfile } from '@/modules/users/components/UserProfile'
import { getUserById } from '@/modules/users/src/services/user.service'

/**
 * User profile page
 *
 * @param params - Route params with user ID
 */
export default async function UserProfilePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) {
    notFound()
  }

  return (
    <main className="container py-8">
      <UserProfile user={user} />
    </main>
  )
}
```

## With Metadata

```typescript
// app/(dashboard)/users/[id]/page.tsx
import type { Metadata } from 'next'
import { getUserById } from '@/modules/users/src/services/user.service'

/**
 * Generate dynamic metadata
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const user = await getUserById(id)

  return {
    title: user?.name || 'User Profile',
    description: user?.bio || 'User profile page'
  }
}
```
