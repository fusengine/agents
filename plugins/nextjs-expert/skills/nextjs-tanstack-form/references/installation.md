---
name: installation
description: TanStack Form v1 installation for Next.js 16 with Zod adapter
when-to-use: Setting up TanStack Form in a new or existing Next.js project
keywords: install, setup, bun, npm, zod-adapter, react-form-nextjs
priority: high
requires: null
related: basic-usage.md, client-form.md
---

# TanStack Form Installation

## Prerequisites

- **Node.js**: 18.17+ or 20+
- **Next.js**: 16.0.0+
- **React**: 19.0+
- **TypeScript**: 5.3+

## Installation Steps

### Step 1: Install Core Packages

```bash
bun add @tanstack/react-form @tanstack/react-form-nextjs zod
```

Or with npm:

```bash
npm install @tanstack/react-form @tanstack/react-form-nextjs zod
```

### Step 2: Install Zod Adapter (Optional)

For schema validation with Zod:

```bash
bun add @tanstack/zod-form-adapter
```

### Step 3: SOLID Module Structure

Create form module following SOLID principles:

```bash
mkdir -p src/modules/forms/src/{interfaces,services,hooks,components}
```

Structure:

```
src/
└── modules/
    └── forms/
        └── src/
            ├── interfaces/
            │   ├── form-config.interface.ts
            │   └── form-state.interface.ts
            ├── services/
            │   └── form-validator.ts
            ├── hooks/
            │   ├── useFormHandler.ts
            │   └── useFormValidation.ts
            └── components/
                └── FormField.tsx
```

### Step 4: Create Form Validator Service

`src/modules/forms/src/services/form-validator.ts`:

```typescript
import { z } from 'zod'

/**
 * Validates user input schemas with Zod
 */
export const userFormSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name required'),
  age: z.number().min(18, 'Must be 18+'),
})

export type UserFormInput = z.infer<typeof userFormSchema>
```

### Step 5: Create Form Hook

`src/modules/forms/src/hooks/useFormHandler.ts`:

```typescript
'use client'

import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { userFormSchema } from '../services/form-validator'

/**
 * Manages form state with TanStack Form
 */
export function useFormHandler(onSubmit: (data: any) => void) {
  const form = useForm({
    defaultValues: {
      email: '',
      name: '',
      age: 18,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    validatorAdapter: zodValidator(),
  })

  return form
}
```

### Step 6: Verify Installation

Create test component `app/form-test.tsx`:

```typescript
'use client'

import { useFormHandler } from '@/modules/forms/src/hooks/useFormHandler'

export default function FormTest() {
  const form = useFormHandler(async (data) => {
    console.log('Form submitted:', data)
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <input {...form.getFieldProps('name')} placeholder="Name" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

Run dev server:

```bash
bun dev
```

Visit `http://localhost:3000/form-test` and test the form.

## TypeScript Configuration

Ensure `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "lib": ["ES2020", "dom", "dom.iterable"],
    "strictNullChecks": true,
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Next Steps

- [Basic Usage Guide](basic-usage.md)
- [Client Form Examples](client-form.md)
- [Server-Side Validation](server-validation.md)
