---
name: server-components
description: Understanding Server Components, Client Components, and composition patterns
when-to-use: data fetching, database access, performance optimization, component architecture
keywords: Server Components, Client Components, use client, async components, rendering
priority: high
requires: app-router.md, data-fetching.md
related: directives.md, rendering.md
---

# Server Components vs Client Components

## When to Use

- **Server**: Data fetching, DB access, secrets
- **Client**: Interactivity, state, browser APIs
- Choosing rendering strategy
- Optimizing bundle size

## Why Server Components

| Feature | Benefit |
|---------|---------|
| Zero JS | No client bundle for server code |
| Direct DB | No API layer needed |
| Secure | Secrets never leak to client |
| SEO | Full HTML on first render |

## Server Components (Default)
All components are Server Components by default.

```typescript
// modules/auth/users/src/components/UsersPage.tsx
import { prisma } from '@/modules/cores/database/prisma'

export default async function UsersPage() {
  const users = await prisma.user.findMany()  // Direct DB access
  return <ul>{users.map(user => <li key={user.id}>{user.name}</li>)}</ul>
}
```

## When to Use Server Components
- Fetch data from database/APIs
- Access backend resources directly
- Keep secrets secure (API keys, tokens)
- Reduce client-side JavaScript

## Client Components
Add `'use client'` directive for interactivity.

```typescript
// modules/ui/components/Counter.tsx
'use client'
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>
}
```

## When to Use Client Components
- Event handlers (onClick, onChange)
- State and lifecycle (useState, useEffect)
- Browser APIs (localStorage, window)

## Composition Pattern
```typescript
// modules/public/home/src/components/HomePage.tsx (Server)
import Counter from '@/modules/ui/components/Counter'

export default async function HomePage() {
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
// modules/ui/components/ClientWrapper.tsx
'use client'
export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return <div onClick={() => setOpen(!open)}>{children}</div>
}

// Server Component
import ClientWrapper from '@/modules/ui/components/ClientWrapper'
export default function Page() {
  return <ClientWrapper><ServerContent /></ClientWrapper>
}
```

## Rules
| Rule | Server | Client |
|------|--------|--------|
| `async/await` | Yes | No |
| `useState/useEffect` | No | Yes |
| Direct DB access | Yes | No |
| Event handlers | No | Yes |
