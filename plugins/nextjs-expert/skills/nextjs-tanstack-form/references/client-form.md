---
name: client-form
description: Client form patterns with TanStack Form and React 19 useActionState
when-to-use: client-side form handling, form state management, field validation, form submission
keywords: TanStack Form, client forms, useActionState, form validation, form submission, React 19
priority: high
requires: server-validation.md
related: server-validation.md
---

# Client Form Patterns

Client form patterns with TanStack Form and React 19.

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

## Key Client Imports

```typescript
import {
  initialFormState,
  mergeForm,
  useForm,
  useStore,
  useTransform,
} from '@tanstack/react-form-nextjs'
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
