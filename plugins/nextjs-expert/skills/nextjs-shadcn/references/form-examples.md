# Form Examples

Complete form examples with shadcn/ui and TanStack Form.

## Profile Form (Complete Example)

```typescript
// components/ProfileForm.tsx
'use client'

import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
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

export function ProfileForm() {
  const form = useForm({
    defaultValues: { username: '' },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      toast('Saved!', { description: JSON.stringify(value) })
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

## Server Component Display

```typescript
// app/users/page.tsx (Server Component)
import { Card, CardContent, CardHeader, CardTitle } from '@/modules/cores/shadcn/components/ui/card'
import { Badge } from '@/modules/cores/shadcn/components/ui/badge'

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

```typescript
// app/layout.tsx
import { Toaster } from '@/modules/cores/shadcn/components/ui/sonner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

// Usage in components
import { toast } from 'sonner'

toast('Success!', { description: 'Your changes have been saved.' })
toast.error('Error', { description: 'Something went wrong.' })
```
