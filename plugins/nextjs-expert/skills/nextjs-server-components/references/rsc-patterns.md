---
name: rsc-patterns
description: Server vs Client Component patterns, serialization rules, async components, data fetching in RSC
when-to-use: Deciding component boundaries, fetching data in Server Components, passing props across boundary
keywords: server components, client components, use client, serialization, async, data fetching
priority: high
requires: null
related: streaming.md
---

# RSC Patterns

## Server vs Client Components

| Capability | Server | Client |
|-----------|--------|--------|
| Fetch data (async/await) | Yes | No (use hooks) |
| Access backend resources | Yes | No |
| Use hooks (useState, etc.) | No | Yes |
| Event handlers (onClick) | No | Yes |
| Browser APIs (window, etc.) | No | Yes |
| `use cache` directive | Yes | No |

## Async Server Components

```tsx
// app/users/page.tsx — Server Component (default)
import { db } from '@/modules/cores/lib/db'

export default async function UsersPage() {
  const users = await db.user.findMany()
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

## Client Component Declaration

```tsx
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

## Serialization Rules

Props passed from Server to Client must be serializable:

| Allowed | Not Allowed |
|---------|-------------|
| string, number, boolean | Functions, callbacks |
| null, undefined | Class instances |
| Array, plain objects | Date objects (use `.toISOString()`) |
| JSON-compatible data | Map, Set, WeakMap |
| Server Actions (functions with `'use server'`) | Symbols |

## Composition Pattern

Pass Server Components as `children` to Client Components:

```tsx
// page.tsx — Server Component
import { ClientWrapper } from './ClientWrapper' // 'use client'
import { ServerData } from './ServerData'

export default function Page() {
  return (
    <ClientWrapper>
      <ServerData /> {/* Rendered on server, passed as children */}
    </ClientWrapper>
  )
}
```

## Parallel Data Fetching

Use `Promise.all()` for independent fetches: `const [user, posts] = await Promise.all([getUser(), getPosts()])`. Prevents waterfall requests in Server Components.

## Prevent Client Import

Use `import 'server-only'` at the top of server-only modules to cause a build error if imported in a Client Component.
