---
name: server-actions
description: Next.js 16 Server Actions with TanStack Form validation
when-to-use: Implementing form submission with server-side validation
keywords: createServerValidate, ServerValidateError, onServerValidate, useActionState
priority: high
requires: validation-zod.md
related: basic-usage.md
---

# Server Actions with TanStack Form

## createServerValidate

Define server-side validators for database checks and async validation:

```typescript
// modules/auth/src/actions/validateUser.ts
import { createServerValidate } from '@tanstack/react-form'
import { z } from 'zod'

export const validateUniqueEmail = createServerValidate({
  validator: z.string().email(),
  onValidate: async (value) => {
    const exists = await db.user.findUnique({ where: { email: value } })
    if (exists) throw new Error('Email already exists')
  },
})
```

## onServerValidate Callback

Handle server-side validation during form submission:

```typescript
// modules/auth/src/actions/signUp.ts
'use server'

export async function signUp(formData: FormData) {
  const email = formData.get('email')

  // Database check
  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    throw new ServerValidateError('email', 'Email already registered')
  }

  return await db.user.create({ data: { email } })
}
```

## ServerValidateError Handling

Catch and display validation errors from server actions:

```typescript
// modules/auth/src/components/SignUpForm.tsx
'use client'

import { useActionState } from 'react'
import { useForm } from '@tanstack/react-form'
import { signUp } from '../actions/signUp'

export function SignUpForm() {
  const [state, action] = useActionState(signUp, null)
  const form = useForm({
    defaultValues: { email: '' },
    onServerValidate: ({ fieldValue }) => {
      if (state?.errors?.email) return state.errors.email
    },
  })

  return (
    <form action={action}>
      <input
        name="email"
        onChange={(e) => form.setFieldValue('email', e.target.value)}
      />
      {state?.errors?.email && <span>{state.errors.email}</span>}
    </form>
  )
}
```

## useActionState with mergeForm

Combine server action state with form validation:

```typescript
const [state, action] = useActionState(signUp, null)

form.use(mergeForm({
  onServerValidate: ({ fieldValue }) => {
    const fieldErrors = state?.fieldErrors?.[fieldValue]
    return fieldErrors?.[0]
  },
}))
```

## SOLID Action Paths

Store server actions in `modules/[feature]/src/actions/`:

```
modules/
├── auth/
│   └── src/
│       ├── actions/
│       │   ├── signUp.ts
│       │   ├── signIn.ts
│       │   └── resetPassword.ts
│       ├── components/
│       └── interfaces/
```

**Best Practice**: Keep actions small, focused on one operation per file.
