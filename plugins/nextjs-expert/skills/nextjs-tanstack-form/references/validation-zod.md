---
name: validation-zod
description: Zod schema validation with TanStack Form using zodValidator adapter
when-to-use: Adding schema-based validation with type inference
keywords: zodValidator, z.object, safeParse, schema, validation
priority: high
requires: installation.md
related: async-validation.md, server-actions.md
---

# Zod Schema Validation

## Installation

```bash
npm install @tanstack/zod-form-adapter zod
```

## Form-Level Schema

```typescript
// lib/schemas.ts
import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password at least 8 chars'),
  age: z.number().min(18).optional(),
})

export type UserFormData = z.infer<typeof userSchema>
```

## zodValidator Integration

```typescript
// components/UserForm.tsx
'use client'

import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { userSchema } from '@/lib/schemas'

export function UserForm() {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      age: undefined,
    },
    validators: {
      onChange: zodValidator({ schema: userSchema }),
    },
    onSubmit: async ({ value }) => {
      console.log('Valid:', value)
    },
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      form.handleSubmit()
    }}>
      <form.Field name="email" children={(field) => (
        <div>
          <input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
          {field.state.meta.errors[0] && (
            <span>{field.state.meta.errors[0]}</span>
          )}
        </div>
      )} />
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Field-Level Schema

```typescript
const form = useForm({
  defaultValues: { email: '', password: '' },
  validators: {
    onChange: zodValidator({
      schema: z.object({
        email: z.string().email(),
      }),
    }),
  },
})

form.Field({
  name: 'password',
  validators: {
    onChange: zodValidator({
      schema: z.string().min(8),
    }),
  },
})
```

## Type Inference

```typescript
// Automatically inferred types
type FormData = z.infer<typeof userSchema>

// Type-safe field access
form.Field<FormData, 'email'>({
  name: 'email',
})
```

## Custom Error Messages

```typescript
const schema = z.object({
  email: z.string()
    .email('Please enter valid email')
    .refine(
      (email) => !email.includes('+'),
      { message: 'Email cannot contain +' }
    ),
})
```

## Cross-Field Validation

```typescript
const schema = z.object({
  password: z.string().min(8),
  confirm: z.string(),
}).refine(
  (data) => data.password === data.confirm,
  {
    message: 'Passwords do not match',
    path: ['confirm'],
  }
)
```
