# Data Fetching

## Fetch in Server Components

```typescript
// app/page.tsx
export default async function Page() {
  // Cached by default
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()

  return <div>{data.title}</div>
}
```

## Fetch Options

```typescript
// Default: cached
const cached = await fetch(url, { cache: 'force-cache' })

// No cache (dynamic)
const dynamic = await fetch(url, { cache: 'no-store' })

// Revalidate every 60 seconds
const revalidated = await fetch(url, { next: { revalidate: 60 } })

// Tag for manual revalidation
const tagged = await fetch(url, { next: { tags: ['products'] } })
```

## Database Access

```typescript
// app/users/page.tsx
import { prisma } from '@/modules/cores/database/prisma'

export default async function UsersPage() {
  const users = await prisma.user.findMany()

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

## Server Actions

```typescript
// modules/users/src/services/actions.ts
'use server'
import { prisma } from '@/modules/cores/database/prisma'
import { revalidatePath } from 'next/cache'

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string

  await prisma.user.create({ data: { name } })
  revalidatePath('/users')
}
```

## Form with Server Action

```typescript
// app/users/new/page.tsx
import { createUser } from '@/modules/users/src/services/actions'

export default function NewUserPage() {
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

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Loading stats...</div>}>
        <Stats />
      </Suspense>
    </div>
  )
}

async function Stats() {
  const stats = await fetchStats()  // Slow query
  return <div>{stats.total}</div>
}
```

## Parallel Data Fetching

```typescript
export default async function Page() {
  // Parallel fetching
  const [users, products] = await Promise.all([
    fetchUsers(),
    fetchProducts()
  ])

  return (
    <div>
      <UserList users={users} />
      <ProductList products={products} />
    </div>
  )
}
```
