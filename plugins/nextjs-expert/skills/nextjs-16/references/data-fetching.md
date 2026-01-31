---
name: data-fetching
description: Server-side data fetching with fetch, Prisma, Server Actions, and Suspense
when-to-use: fetching data in Server Components, database queries, mutations with forms
keywords: fetch, database, Prisma, Server Actions, Suspense, streaming
priority: high
requires: server-components.md, forms.md
related: caching.md, streaming.md
---

# Data Fetching

## When to Use

- Fetching data in Server Components
- Direct database access with Prisma
- Server Actions for mutations
- Parallel data loading patterns

## Why Server-Side Fetching

| Feature | Benefit |
|---------|---------|
| Direct DB | No API layer needed |
| Caching | Automatic with `use cache` |
| Streaming | Progressive UI with Suspense |
| Security | Secrets stay on server |

## Fetch in Server Components
```typescript
// modules/public/home/src/components/HomePage.tsx
export default async function HomePage() {
  const res = await fetch('https://api.example.com/data')  // Cached by default
  const data = await res.json()
  return <div>{data.title}</div>
}
```

## Fetch Options
```typescript
const cached = await fetch(url, { cache: 'force-cache' })        // Default: cached
const dynamic = await fetch(url, { cache: 'no-store' })          // No cache
const revalidated = await fetch(url, { next: { revalidate: 60 }})// Revalidate 60s
const tagged = await fetch(url, { next: { tags: ['products'] }}) // Tagged
```

## Database Access (SOLID)
```typescript
// modules/auth/users/src/components/UsersPage.tsx
import { prisma } from '@/modules/cores/database/prisma'

export default async function UsersPage() {
  const users = await prisma.user.findMany()
  return <ul>{users.map(user => <li key={user.id}>{user.name}</li>)}</ul>
}
```

## Server Actions (SOLID)
```typescript
// modules/auth/users/src/services/actions.ts
'use server'
import { prisma } from '@/modules/cores/database/prisma'
import { revalidatePath } from 'next/cache'

export async function createUser(formData: FormData) {
  await prisma.user.create({ data: { name: formData.get('name') as string } })
  revalidatePath('/users')
}
```

## Form with Server Action
```typescript
// modules/auth/users/src/components/NewUserForm.tsx
import { createUser } from '../services/actions'

export default function NewUserForm() {
  return (
    <form action={createUser}>
      <input name="name" required />
      <button type="submit">Create</button>
    </form>
  )
}
```

## Streaming with Suspense
```typescript
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Stats />
    </Suspense>
  )
}

async function Stats() {
  const stats = await fetchStats()
  return <div>{stats.total}</div>
}
```

## Parallel Data Fetching
```typescript
export default async function Page() {
  const [users, products] = await Promise.all([fetchUsers(), fetchProducts()])
  return <div><UserList users={users} /><ProductList products={products} /></div>
}
```
