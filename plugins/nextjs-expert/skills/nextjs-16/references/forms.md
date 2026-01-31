---
name: forms
description: Form handling with Server Actions, validation, optimistic updates
when-to-use: building forms, handling submissions, validation, optimistic UI
keywords: Server Actions, useActionState, useFormStatus, useOptimistic
priority: high
requires: server-components.md, directives.md
related: data-fetching.md
---

# Forms & Server Actions

## When to Use

- Form submissions with validation
- Server-side mutations
- Optimistic UI updates
- Pending states

## Why Server Actions

| Feature | Benefit |
|---------|---------|
| No API route | Direct function call |
| Type-safe | End-to-end types |
| Progressive | Works without JS |
| Revalidation | Automatic cache update |

## Server Action
```typescript
// modules/auth/users/src/services/actions.ts
'use server'
import { z } from 'zod'
import { prisma } from '@/modules/cores/database/prisma'
import { revalidatePath } from 'next/cache'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

export async function createUser(prevState: any, formData: FormData) {
  const validation = schema.safeParse(Object.fromEntries(formData))

  if (!validation.success) {
    return { errors: validation.error.flatten().fieldErrors }
  }

  await prisma.user.create({ data: validation.data })
  revalidatePath('/users')
  return { message: 'User created!' }
}
```

## useActionState
```typescript
// modules/auth/users/src/components/UserForm.tsx
'use client'
import { useActionState } from 'react'
import { createUser } from '../services/actions'

export function UserForm() {
  const [state, formAction] = useActionState(createUser, { message: '' })

  return (
    <form action={formAction}>
      <input name="name" required />
      {state?.errors?.name && <p className="error">{state.errors.name}</p>}

      <input name="email" type="email" required />
      {state?.errors?.email && <p className="error">{state.errors.email}</p>}

      <SubmitButton />
      {state?.message && <p>{state.message}</p>}
    </form>
  )
}
```

## useFormStatus
```typescript
// modules/ui/components/SubmitButton.tsx
'use client'
import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending} type="submit">
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}
```

## useOptimistic
```typescript
'use client'
import { useOptimistic } from 'react'

export function TodoList({ todos, addTodo }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, { ...newTodo, pending: true }]
  )

  async function handleSubmit(formData: FormData) {
    const title = formData.get('title') as string
    addOptimisticTodo({ title, id: Date.now() })
    await addTodo(formData)
  }

  return (
    <form action={handleSubmit}>
      <input name="title" />
      <button type="submit">Add</button>
    </form>
  )
}
```
