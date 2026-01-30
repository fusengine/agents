# Directives

## 'use client'
Mark a component as Client Component.

```typescript
// modules/ui/components/Counter.tsx
'use client'  // Must be first line

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

## 'use server'
Mark functions as Server Actions.

```typescript
// modules/auth/src/services/actions.ts
'use server'  // All exports become Server Actions

export async function login(formData: FormData) {
  const email = formData.get('email')
  // Server-side only code
}

export async function logout() {
  // Server-side only code
}
```

## Inline 'use server'
```typescript
// Inside a Server Component
export default async function Page() {
  async function submitForm(formData: FormData) {
    'use server'  // This function runs on server
    await saveToDatabase(formData)
  }

  return <form action={submitForm}>...</form>
}
```

## 'use cache'
Cache component or function output.

```typescript
async function getProducts() {
  'use cache'
  return await db.product.findMany()
}
```

## 'use cache' with Tags
```typescript
import { cacheTag, cacheLife } from 'next/cache'

async function getUser(id: string) {
  'use cache'
  cacheTag(`user-${id}`)
  cacheLife('hours')
  return await db.user.findUnique({ where: { id } })
}
```

## Directive Rules
| Directive | Location | Effect |
|-----------|----------|--------|
| `'use client'` | File top | Client Component |
| `'use server'` | File top or function | Server Action |
| `'use cache'` | Function top | Cached output |

## Boundary Behavior
```
Server Component (default)
└── 'use client' boundary
    └── Client Component
        └── Can import Server Components as children
```
