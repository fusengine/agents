---
name: typescript
description: TypeScript patterns with DeepKeys, DeepValue, and type inference
when-to-use: Understanding form type safety and generic patterns
keywords: DeepKeys, DeepValue, FormApi, FieldApi, z.infer, generics
priority: medium
requires: validation-zod.md
related: field-api.md
---

# TypeScript Patterns in TanStack Form

## Schema Type Inference

```typescript
import { z } from 'zod'

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  address: z.object({
    street: z.string(),
    city: z.string(),
  }),
})

type UserFormData = z.infer<typeof userSchema>
// Inferred type:
// {
//   name: string
//   email: string
//   address: { street: string; city: string }
// }
```

## DeepKeys for Path Autocompletion

```typescript
type DeepKeys<T, Prefix = ''> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? `${Prefix}${K}` | DeepKeys<T[K], `${Prefix}${K}.`>
        : never
    }[keyof T]
  : never

type UserKeys = DeepKeys<UserFormData>
// 'name' | 'email' | 'address' | 'address.street' | 'address.city'

const form = useForm<UserFormData>()
form.subscribe(userKeys) // Type-safe paths
```

## DeepValue for Value Extraction

```typescript
type DeepValue<T, K extends string> = K extends `${infer Head}.${infer Tail}`
  ? Head extends keyof T
    ? DeepValue<T[Head], Tail>
    : never
  : K extends keyof T
    ? T[K]
    : never

type StreetType = DeepValue<UserFormData, 'address.street'>
// string
```

## FormApi and FieldApi Types

```typescript
import { FormApi, FieldApi } from '@tanstack/react-form'

// FormApi<T> - entire form
const form: FormApi<UserFormData> = useForm<UserFormData>({
  defaultValues: {
    name: '',
    email: '',
    address: { street: '', city: '' },
  },
  onSubmit: async (values: UserFormData) => {
    await submitUser(values)
  },
})

// FieldApi<T, K> - individual field
const nameField: FieldApi<UserFormData, 'name'> = form.getFieldInstance('name')
nameField.getValue() // string
nameField.setValue('John')
```

## Type-Safe Form Options

```typescript
interface FormOptions<T> {
  defaultValues: T
  validators?: {
    onChange?: (value: T) => string | undefined
    onBlur?: (value: T) => string | undefined
  }
  onSubmit: (values: T) => Promise<void> | void
}

// Usage
const form = useForm<UserFormData>({
  defaultValues: {
    name: '',
    email: '',
    address: { street: '', city: '' },
  },
  validators: {
    onChange: (data) => {
      if (!data.email.includes('@')) return 'Invalid email'
    },
  },
  onSubmit: async (data) => {
    // data is typed as UserFormData
    console.log(data.address.street) // ✅ type-safe
  },
})
```

## Generic Form Components

```typescript
interface FieldProps<T, K extends DeepKeys<T>> {
  form: FormApi<T>
  name: K
  label: string
}

function TextField<T, K extends DeepKeys<T>>({
  form,
  name,
  label,
}: FieldProps<T, K>) {
  return (
    <form.Field name={name}>
      {(field) => (
        <div>
          <label>{label}</label>
          <input
            value={field.state.value as string}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        </div>
      )}
    </form.Field>
  )
}
```
