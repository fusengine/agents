---
name: form-examples
description: Complete form examples with shadcn/ui components and TanStack Form validation
when-to-use: form implementation, profile forms, form validation, toast notifications, card layouts
keywords: form examples, TanStack Form, validation, toast notifications, shadcn cards, form submission
priority: high
requires: field-patterns.md
related: field-patterns.md
---

# Form Examples

Complete form examples with shadcn/ui and TanStack Form.

Follows https://ui.shadcn.com/docs/forms/tanstack-form and https://ui.shadcn.com/docs/forms/next.
The form markup (`Field`, `Input`, `Button`, `Card`) is identical on every base; only the toast
import changes — `sonner` on Radix/React Aria projects,
`@/modules/cores/shadcn/components/ui/toast` on Base UI projects (see [toast.md](toast.md)).

## Profile Form (Complete Example)

```typescript
// components/ProfileForm.tsx
'use client'

import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner' // Base UI project: import { toast } from '@/modules/cores/shadcn/components/ui/toast'
import { z } from 'zod'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/modules/cores/shadcn/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/modules/cores/shadcn/components/ui/field'
import { Input } from '@/modules/cores/shadcn/components/ui/input'

const formSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(10, 'Username must be at most 10 characters.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, underscores only.'),
})

/** TanStack Form profile form validated by a Zod schema. */
export function ProfileForm() {
  const form = useForm({
    defaultValues: { username: '' },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      toast('Saved!', { description: JSON.stringify(value) })
      // Base UI Toast: toast.add({ title: 'Saved!', description: JSON.stringify(value) })
    },
  })

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Update your profile information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="profile-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="username"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                      id="username"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="shadcn"
                    />
                    <FieldDescription>
                      Your public display name. 3-10 characters.
                    </FieldDescription>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="profile-form">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
```

---

## Server Action Form (useActionState + Field)

Alternative to TanStack Form when validation runs on the server
(https://ui.shadcn.com/docs/forms/next). Schema + state type live in a shared file so both
client and server import them.

```typescript
// app/bug-report/schema.ts
import { z } from 'zod'

export const formSchema = z.object({
  title: z.string().min(5, 'Bug title must be at least 5 characters.'),
})

export type FormState = {
  values: { title: string }
  errors: null | Partial<Record<keyof z.infer<typeof formSchema>, string[]>>
  success: boolean
}
```

```typescript
// app/bug-report/actions.ts
'use server'

import { formSchema, type FormState } from './schema'

/** Server Action validating the bug report and returning form state. */
export async function bugReportAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = { title: formData.get('title') as string }
  const result = formSchema.safeParse(values)

  if (!result.success) {
    // Return the values so the inputs keep the user's input.
    return { values, success: false, errors: result.error.flatten().fieldErrors }
  }

  // Persist here.
  return { values: { title: '' }, errors: null, success: true }
}
```

```typescript
// app/bug-report/form.tsx
'use client'

import * as React from 'react'
import Form from 'next/form'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/modules/cores/shadcn/components/ui/field'
import { Input } from '@/modules/cores/shadcn/components/ui/input'
import { Spinner } from '@/modules/cores/shadcn/components/ui/spinner'
import { bugReportAction } from './actions'
import type { FormState } from './schema'

/** Bug report form wired to the Server Action via `useActionState`. */
export function BugReportForm() {
  const [formState, formAction, pending] = React.useActionState<FormState, FormData>(
    bugReportAction,
    { values: { title: '' }, errors: null, success: false }
  )

  return (
    <Form action={formAction}>
      <FieldGroup>
        <Field data-invalid={!!formState.errors?.title?.length} data-disabled={pending}>
          <FieldLabel htmlFor="title">Bug Title</FieldLabel>
          <Input
            id="title"
            name="title"
            defaultValue={formState.values.title}
            disabled={pending}
            aria-invalid={!!formState.errors?.title?.length}
          />
          {formState.errors?.title && <FieldError>{formState.errors.title[0]}</FieldError>}
        </Field>
        <Button type="submit" disabled={pending}>
          {pending && <Spinner />} Submit
        </Button>
      </FieldGroup>
    </Form>
  )
}
```

---

## Server Component Display

```typescript
// app/users/page.tsx (Server Component)
import { Card, CardContent, CardHeader, CardTitle } from '@/modules/cores/shadcn/components/ui/card'
import { Badge } from '@/modules/cores/shadcn/components/ui/badge'

/** Server Component rendering users fetched on the server. */
export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {users.map((user) => (
        <Card key={user.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {user.name}
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                {user.role}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{user.email}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

---

## Toast Notifications Setup

### Radix / React Aria project — Sonner (`bunx --bun shadcn@latest add sonner`)

```typescript
// app/layout.tsx
import { Toaster } from '@/modules/cores/shadcn/components/ui/sonner'

/** Root layout mounting the `Toaster` once. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

// Usage in client components
import { toast } from 'sonner'

toast('Success!', { description: 'Your changes have been saved.' })
toast.error('Error', { description: 'Something went wrong.' })
```

### Base UI project — Toast (`bunx --bun shadcn@latest add toast`)

```typescript
// app/layout.tsx
import { Toaster } from '@/modules/cores/shadcn/components/ui/toast'
// ...same layout, render <Toaster /> after {children}

// Usage in client components
import { toast } from '@/modules/cores/shadcn/components/ui/toast'

toast.add({ title: 'Success!', description: 'Your changes have been saved.' })
toast.add({ title: 'Error', description: 'Something went wrong.', type: 'error' })
```
