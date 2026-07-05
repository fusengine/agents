---
name: 03-execution
description: Implement Next.js features following SOLID principles
prev_step: references/nextjs/02-features-plan.md
next_step: references/nextjs/03.5-elicit.md
---

# 03 - Execution (Next.js)

**Implement Next.js features following SOLID principles (APEX Phase E).**

## When to Use

- After planning phase complete
- Following TaskCreate task order
- With verified APIs from research

---

## Server Component Template

```typescript
// modules/users/components/UserList.tsx
import type { User } from '../src/interfaces/user.interface'

interface UserListProps {
  users: User[]
}

/**
 * Display list of users - Server Component.
 */
export function UserList({ users }: UserListProps) {
  if (users.length === 0) {
    return <p>No users found.</p>
  }

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

## Client Component Template

```typescript
// modules/auth/components/LoginForm.tsx
'use client'

import { useActionState } from 'react'
import { loginAction } from '../src/actions/auth.actions'

/**
 * Login form - Client Component with Server Action.
 */
export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null)

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={pending}>
        {pending ? 'Loading...' : 'Login'}
      </button>
      {state?.error && <p>{state.error}</p>}
    </form>
  )
}
```

---

## Server Action Template

```typescript
// modules/auth/src/actions/auth.actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { authenticate } from '../services/auth.service'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

/**
 * Login user with form data.
 */
export async function loginAction(prevState: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: 'Invalid credentials format' }
  }

  const result = await authenticate(parsed.data)

  if (!result.success) {
    return { error: result.error }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
```

---

## API Route Template

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { getUsers } from '@/modules/users/src/services/user.service'

/**
 * GET /api/users - Fetch all users.
 */
export async function GET() {
  try {
    const users = await getUsers()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
```

---

## Service Template

```typescript
// modules/users/src/services/user.service.ts
import { prisma } from '@/modules/cores/database/prisma'
import type { User, CreateUserInput } from '../interfaces/user.interface'

/**
 * Fetch all users from database.
 */
export async function getUsers(): Promise<User[]> {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true },
  })
}

/**
 * Create new user in database.
 */
export async function createUser(input: CreateUserInput): Promise<User> {
  return prisma.user.create({
    data: input,
  })
}
```

---

## Interface Template

```typescript
// modules/users/src/interfaces/user.interface.ts

/**
 * User entity from database.
 */
export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

/**
 * Input for creating a new user.
 */
export interface CreateUserInput {
  name: string
  email: string
  password: string
}

/**
 * Props for UserList component.
 */
export interface UserListProps {
  users: User[]
}
```

---

## Page Template (Orchestration Only)

```typescript
// app/(dashboard)/users/page.tsx
import { UserList } from '@/modules/users/components/UserList'
import { getUsers } from '@/modules/users/src/services/user.service'

export const metadata = {
  title: 'Users | Dashboard',
}

/**
 * Users page - Server Component orchestration.
 */
export default async function UsersPage() {
  const users = await getUsers()

  return (
    <main>
      <h1>Users</h1>
      <UserList users={users} />
    </main>
  )
}
```

---

## Execution Rules

```text
MUST:
[ ] Files < 100 lines (split at 90)
[ ] Interfaces in modules/[feature]/src/interfaces/
[ ] JSDoc on all exports
[ ] TypeScript strict (no any)
[ ] Server Components by default
[ ] 'use client' only when needed

MUST NOT:
[ ] Business logic in app/ pages
[ ] Database calls in components
[ ] useEffect for data fetching
[ ] Inline interfaces in components
[ ] Files > 100 lines
```

---

## Validation Checklist

```text
[ ] All planned tasks implemented
[ ] File sizes verified (<100 lines)
[ ] Interfaces properly separated
[ ] JSDoc on all functions
[ ] TypeScript passes (no errors)
[ ] Server/Client boundary correct
```

---

## Next Phase

Proceed to `04-validation.md`
