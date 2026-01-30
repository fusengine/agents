# Server Validation Patterns

Server validation with TanStack Form and Server Actions.

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

## Key Server Imports

```typescript
import { ServerValidateError, createServerValidate } from '@tanstack/react-form-nextjs'
```

---

## Validation Return Types

### Field-specific errors

```typescript
return {
  fields: {
    email: 'Email already registered',
    username: 'Username taken'
  },
}
```

### Form-level error

```typescript
return 'You must be at least 18 to sign up'
```

### No errors

```typescript
return undefined
```
