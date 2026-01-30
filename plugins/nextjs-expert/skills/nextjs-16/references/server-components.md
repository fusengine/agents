# Server Components vs Client Components

## Server Components (Default)

All components are Server Components by default.

```typescript
// app/page.tsx - Server Component
import { db } from '@/modules/cores/database/prisma'

export default async function Page() {
  const users = await db.user.findMany()  // Direct DB access

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

## When to Use Server Components

- Fetch data from database/APIs
- Access backend resources directly
- Keep secrets secure (API keys, tokens)
- Reduce client-side JavaScript
- Improve First Contentful Paint (FCP)

## Client Components

Add `'use client'` directive for interactivity.

```typescript
// modules/ui/components/counter.tsx
'use client'
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

## When to Use Client Components

- Event handlers (onClick, onChange)
- State and lifecycle (useState, useEffect)
- Browser APIs (localStorage, window)
- Custom hooks with state/effects

## Composition Pattern

```typescript
// app/page.tsx - Server Component
import Counter from '@/modules/ui/components/counter'

export default async function Page() {
  const data = await fetchData()  // Server-side

  return (
    <div>
      <h1>{data.title}</h1>
      <Counter />  {/* Client Component */}
    </div>
  )
}
```

## Passing Server to Client

```typescript
// ClientWrapper.tsx
'use client'
export default function ClientWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return <div onClick={() => setOpen(!open)}>{children}</div>
}

// page.tsx - Server Component
import ClientWrapper from './ClientWrapper'
import ServerContent from './ServerContent'

export default function Page() {
  return (
    <ClientWrapper>
      <ServerContent />  {/* Passed as children */}
    </ClientWrapper>
  )
}
```

## Rules

| Rule | Server | Client |
|------|--------|--------|
| `async/await` | Yes | No |
| `useState` | No | Yes |
| `useEffect` | No | Yes |
| Direct DB access | Yes | No |
| Event handlers | No | Yes |
