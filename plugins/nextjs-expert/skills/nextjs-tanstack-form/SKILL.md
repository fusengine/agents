---
name: nextjs-tanstack-form
description: TanStack Form for Next.js App Router - Server Actions, server validation, useActionState, Zod integration. Use when building forms in Next.js.
user-invocable: false
---

# TanStack Form for Next.js

Type-safe forms with Server Actions and server-side validation.

## Installation

```bash
bun add @tanstack/react-form @tanstack/react-form-nextjs zod
```

---

## Shared Form Options

```typescript
// lib/forms/user-form.ts
import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email('Invalid email'),
  username: z.string().min(3, 'Min 3 characters'),
  age: z.number().min(18, 'Must be 18+'),
})

export const userFormOpts = formOptions({
  defaultValues: {
    email: '',
    username: '',
    age: 18,
  },
})
```

---

## Server Action with Validation

```typescript
// app/actions/user.ts
'use server'

import { ServerValidateError, createServerValidate } from '@tanstack/react-form-nextjs'
import { userFormOpts, userSchema } from '@/lib/forms/user-form'
import { prisma } from '@/lib/prisma'

const serverValidate = createServerValidate({
  ...userFormOpts,
  onServerValidate: async ({ value }) => {
    // Server-only validation (DB checks)
    const existing = await prisma.user.findUnique({
      where: { email: value.email },
    })

    if (existing) {
      return {
        fields: { email: 'Email already registered' },
      }
    }

    if (value.age < 18) {
      return 'You must be at least 18 to sign up'
    }

    return undefined
  },
})

export async function createUser(prev: unknown, formData: FormData) {
  try {
    const validatedData = await serverValidate(formData)

    await prisma.user.create({
      data: validatedData,
    })

    return { success: true }
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState
    }
    throw e
  }
}
```

---

## Client Form Component

```typescript
// app/signup/SignupForm.tsx
'use client'

import { useActionState } from 'react'
import {
  initialFormState,
  mergeForm,
  useForm,
  useStore,
  useTransform,
} from '@tanstack/react-form-nextjs'
import { z } from 'zod'
import { createUser } from '@/app/actions/user'
import { userFormOpts } from '@/lib/forms/user-form'

export function SignupForm() {
  const [state, action] = useActionState(createUser, initialFormState)

  const form = useForm({
    ...userFormOpts,
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, state!),
      [state]
    ),
  })

  const formErrors = useStore(form.store, (s) => s.errors)

  return (
    <form action={action as never} onSubmit={() => form.handleSubmit()}>
      {formErrors.map((error) => (
        <p key={error as string} className="text-red-500">{error}</p>
      ))}

      <form.Field
        name="email"
        validators={{
          onChange: z.string().email('Invalid email'),
        }}
      >
        {(field) => (
          <div>
            <label htmlFor={field.name}>Email</label>
            <input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors[0] && (
              <span className="text-red-500">{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="username"
        validators={{
          onChange: z.string().min(3, 'Min 3 characters'),
        }}
      >
        {(field) => (
          <div>
            <label htmlFor={field.name}>Username</label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors[0] && (
              <span className="text-red-500">{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(s) => [s.canSubmit, s.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? 'Submitting...' : 'Sign Up'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}
```

---

## Page Integration

```typescript
// app/signup/page.tsx
import { SignupForm } from './SignupForm'

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <SignupForm />
    </div>
  )
}
```

---

## Key Imports

```typescript
// Server (actions)
import { ServerValidateError, createServerValidate } from '@tanstack/react-form-nextjs'

// Client (components)
import {
  initialFormState,
  mergeForm,
  useForm,
  useStore,
  useTransform,
} from '@tanstack/react-form-nextjs'
```

---

## Best Practices

1. **Shared form options** - Define once, use in client and server
2. **Server validation** - DB checks in `onServerValidate`
3. **Client validation** - Zod schemas for instant feedback
4. **useActionState** - React 19 hook for server actions
5. **mergeForm** - Combine server errors with client state
