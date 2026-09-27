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

Follows https://ui.shadcn.com/docs/forms/tanstack-form. The form markup (`Field`, `Input`,
`Button`, `Card`) is identical on every base; only the toast import changes — `sonner` on
Radix/React Aria projects, `@/modules/cores/shadcn/components/ui/toast` on Base UI projects
(see [toast.md](toast.md)).

## Profile Form (Complete Example)

```typescript
// src/modules/profile/components/ProfileForm.tsx
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

## Data Display (no form state)

```typescript
// src/modules/users/components/UserList.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/modules/cores/shadcn/components/ui/card'
import { Badge } from '@/modules/cores/shadcn/components/ui/badge'
import type { User } from '@/modules/users/interfaces/user'

/**
 * Renders users as cards; data comes from the caller (e.g. a TanStack Query hook).
 */
export function UserList({ users }: { users: User[] }) {
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

Mount the toaster once, next to `<App />` in `src/main.tsx`.

### Radix / React Aria project — Sonner (`bunx --bun shadcn@latest add sonner`)

```typescript
// src/main.tsx
import { Toaster } from '@/modules/cores/shadcn/components/ui/sonner'
// ...
root.render(
  <StrictMode>
    <App />
    <Toaster />
  </StrictMode>
)

// Usage in components
import { toast } from 'sonner'

toast('Success!', { description: 'Your changes have been saved.' })
toast.error('Error', { description: 'Something went wrong.' })
```

The registry `sonner.tsx` reads the theme through `next-themes` (added as a dependency); in a
Vite app without its provider it falls back to `"system"`.

### Base UI project — Toast (`bunx --bun shadcn@latest add toast`)

```typescript
// src/main.tsx
import { Toaster } from '@/modules/cores/shadcn/components/ui/toast'
// ...
root.render(
  <StrictMode>
    <App />
    <Toaster />
  </StrictMode>
)

// Usage in components
import { toast } from '@/modules/cores/shadcn/components/ui/toast'

toast.add({ title: 'Success!', description: 'Your changes have been saved.' })
toast.add({ title: 'Error', description: 'Something went wrong.', type: 'error' })
```
