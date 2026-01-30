---
name: nextjs-tanstack-form
description: This skill should be used when the user asks about "forms", "form validation", "TanStack Form", "Server Actions forms", "useActionState", or "Zod validation". Covers TanStack Form for Next.js App Router with server-side validation.
version: 1.0.0
user-invocable: false
references:
  - path: references/server-validation.md
    title: Server Validation
  - path: references/client-form.md
    title: Client Form Patterns
---

# TanStack Form for Next.js

Type-safe forms with Server Actions and server-side validation.

## Installation

```bash
bun add @tanstack/react-form @tanstack/react-form-nextjs zod
```

---

## Quick Start: Shared Form Options

```typescript
// lib/forms/user-form.ts
import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email('Invalid email'),
  username: z.string().min(3, 'Min 3 characters'),
})

export const userFormOpts = formOptions({
  defaultValues: { email: '', username: '' },
})
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

## Best Practices

1. **Shared form options** - Define once, use in client and server
2. **Server validation** - DB checks in `onServerValidate`
3. **Client validation** - Zod schemas for instant feedback
4. **useActionState** - React 19 hook for server actions
5. **mergeForm** - Combine server errors with client state

See [Server Validation](references/server-validation.md) and [Client Form](references/client-form.md) for complete patterns.
