# Code Templates for Next.js SOLID

## Server Component (< 80 lines)

```typescript
// app/(dashboard)/users/page.tsx
import { UserList } from '@/modules/users/components/UserList'
import { getUsers } from '@/modules/users/src/services/user.service'

/**
 * Users list page - Server Component.
 */
export default async function UsersPage() {
  const users = await getUsers()
  return <UserList users={users} />
}
```

---

## Client Component (< 60 lines)

```typescript
// modules/auth/components/LoginForm.tsx
'use client'

import { useState } from 'react'
import type { LoginFormProps } from '../src/interfaces/form.interface'

/**
 * Login form - Client Component.
 */
export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')

  return (
    <form onSubmit={() => onSuccess()}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button>Login</button>
    </form>
  )
}
```

---

## Service File

```typescript
// modules/auth/src/services/auth.service.ts
import { prisma } from '@/modules/cores/database/prisma'
import type { Credentials, Session } from '../interfaces/user.interface'

/**
 * Authenticate user with credentials.
 */
export async function authenticate(credentials: Credentials): Promise<Session | null> {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email }
  })

  if (!user) return null
  return { user, token: '...', expiresAt: new Date() }
}
```

---

## Interface Definition

```typescript
// modules/auth/src/interfaces/user.interface.ts

/**
 * User credentials for authentication.
 */
export interface Credentials {
  email: string
  password: string
}

/**
 * Session token after successful login.
 */
export interface Session {
  user: {
    id: string
    email: string
    name: string
  }
  token: string
  expiresAt: Date
}
```

---

## React Hook

```typescript
// modules/auth/src/hooks/useAuth.ts
import { useState } from 'react'
import { authenticate } from '../services/auth.service'
import type { Credentials, Session } from '../interfaces/user.interface'

/**
 * Hook for authentication logic.
 */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(false)

  const login = async (credentials: Credentials) => {
    setLoading(true)
    try {
      const result = await authenticate(credentials)
      setSession(result)
    } finally {
      setLoading(false)
    }
  }

  return { session, login, loading }
}
```
