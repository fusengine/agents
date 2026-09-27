---
name: toast
description: Toast notifications with Sonner integration for temporary messages
when-to-use: Success confirmations, error messages, loading states, user feedback
keywords: toast, notification, sonner, toast-error, toast-success, toast-action
priority: high
requires: null
related: dialog.md
---

# Toast Component

Temporary, non-blocking feedback. **Which component depends on the project's base**
(`components.json` `style`):

| Base | Component | Install | API |
|------|-----------|---------|-----|
| Base UI (`base-*`, default) | **Toast** (Base UI primitive, added July 2026) | `bunx --bun shadcn@latest add toast` | `toast.add({ title, description, type })` from `ui/toast` |
| Radix (`radix-*`, `new-york`) | **Sonner** | `bunx --bun shadcn@latest add sonner` | `toast("…")`, `toast.success(…)` from `sonner` |
| React Aria (`aria-*`) | **Sonner** | `bunx --bun shadcn@latest add sonner` | same as Radix |

> **Base:** examples below the Base UI section use Sonner. Verified 2026-09: `r/styles/base-nova/toast.json`
> exists (`@base-ui/react`), `radix-nova/toast.json` and `aria-nova/toast.json` return 404, and
> `/docs/components/{radix,aria}/toast` read "The toast component has been deprecated. Use the sonner
> component instead." `r/styles/base-nova/sonner.json` still exists (deps `sonner`, `next-themes`) but
> `/docs/components/base/sonner` redirects to Base UI Toast — Sonner is valid on Base UI, Toast is the
> documented default. Sources: https://ui.shadcn.com/docs/components/base/toast,
> https://ui.shadcn.com/docs/components/radix/sonner, https://ui.shadcn.com/docs/changelog/2026-07-toast.

## Base UI Toast

```typescript
// app/layout.tsx — mount once
import { Toaster } from '@/modules/cores/shadcn/components/ui/toast'

/** Root layout mounting the Base UI `Toaster` once. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
```

```typescript
'use client'

import { toast } from '@/modules/cores/shadcn/components/ui/toast'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

/**
 * Base UI toast: title/description, status type, action, promise.
 */
export function BaseToastExamples() {
  const create = () => {
    const id = toast.add({
      title: 'Event created',
      description: 'Sunday, December 3 at 9:00 AM',
      type: 'success', // success | info | warning | error | loading → status icon
      actionProps: {
        children: 'Undo',
        onClick() {
          toast.close(id)
        },
      },
    })
  }

  const save = () =>
    toast.promise(fetch('/api/settings', { method: 'POST' }), {
      // each state takes a string, an options object ({ title, description, … }) or, for
      // success/error, a function of the result/error returning either
      loading: 'Saving…',
      success: 'Saved',
      error: 'Could not save',
    })

  return (
    <div className="flex gap-2">
      <Button onClick={create}>Create</Button>
      <Button variant="outline" onClick={save}>Save</Button>
    </div>
  )
}
```

`ui/toast` also exports `createToastManager` / `useToastManager` (Base UI manager API) for
stacking, swipe dismissal and manager options — see https://base-ui.com/react/components/toast.

---

## Sonner (Radix / React Aria projects; optional on Base UI)

Everything below uses Sonner. Install through the CLI (it adds `sonner` and the themed
`ui/sonner.tsx` wrapper, which reads the theme via `next-themes`):

```bash
bunx --bun shadcn@latest add sonner
```

## Setup

Mount the Toaster wrapper once in the root layout.

```typescript
// app/layout.tsx
import { Toaster } from '@/modules/cores/shadcn/components/ui/sonner'

/** Root layout mounting the Sonner `Toaster` once. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
```

## Basic Toast

```typescript
// app/components/BasicToast.tsx
'use client'

import { toast } from 'sonner'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

/**
 * Basic toast notifications
 */
export function BasicToast() {
  return (
    <div className="space-y-2">
      <Button onClick={() => toast('Hello, World!')}>
        Show Toast
      </Button>
      <Button onClick={() => toast.error('Something went wrong!')}>
        Show Error
      </Button>
      <Button onClick={() => toast.success('Action completed!')}>
        Show Success
      </Button>
      <Button onClick={() => toast.loading('Loading...')}>
        Show Loading
      </Button>
    </div>
  )
}
```

## Toast with Description

```typescript
// app/components/ToastWithDescription.tsx
'use client'

import { toast } from 'sonner'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

/**
 * Toast with title and description text
 */
export function ToastWithDescription() {
  const showSuccess = () => {
    toast.success('Profile updated', {
      description: 'Your profile changes have been saved successfully.',
    })
  }

  const showError = () => {
    toast.error('Update failed', {
      description: 'There was an error updating your profile. Please try again.',
    })
  }

  const showInfo = () => {
    toast('New feature available', {
      description: 'Check out the new dashboard in settings.',
    })
  }

  return (
    <div className="space-y-2">
      <Button onClick={showSuccess} variant="outline">
        Success with Description
      </Button>
      <Button onClick={showError} variant="outline">
        Error with Description
      </Button>
      <Button onClick={showInfo} variant="outline">
        Info with Description
      </Button>
    </div>
  )
}
```

## Toast with Action Button

```typescript
// app/components/ToastWithAction.tsx
'use client'

import { toast } from 'sonner'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

/**
 * Toast with action button for undo or additional actions
 */
export function ToastWithAction() {
  const handleDelete = () => {
    toast.success('Item deleted', {
      description: 'Your item has been removed.',
      action: {
        label: 'Undo',
        onClick: () => {
          toast('Item restored', {
            description: 'Your item has been restored.',
          })
        },
      },
    })
  }

  const handleSave = () => {
    toast('Changes saved', {
      description: 'Your changes have been saved.',
      action: {
        label: 'View',
        onClick: () => {
          console.log('View action clicked')
        },
      },
    })
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleDelete} variant="outline">
        Delete with Undo
      </Button>
      <Button onClick={handleSave} variant="outline">
        Save with Action
      </Button>
    </div>
  )
}
```

## Toast in Form Submission

```typescript
// app/components/FormWithToast.tsx
'use client'

import { useForm } from '@tanstack/react-form'
import * as z from 'zod'  // TanStack Form v1: Standard Schema, no adapter
import { toast } from 'sonner'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { Input } from '@/modules/cores/shadcn/components/ui/input'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormValues = z.infer<typeof formSchema>

/**
 * Form with toast notifications on submit using TanStack Form
 */
export function FormWithToast() {
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading('Signing in...')

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))

        toast.dismiss(toastId)
        toast.success('Welcome back!', {
          description: `Signed in as ${value.email}`,
        })
        form.reset()
      } catch (error) {
        toast.dismiss(toastId)
        toast.error('Sign in failed', {
          description: 'Please check your credentials and try again.',
        })
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-8"
    >
      <form.Field
        name="email"
        validators={{
          onChange: formSchema.shape.email,
        }}
      >
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id={field.name}
              type="email"
              placeholder="user@example.com"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors[0] && (
              <p className="text-red-500 text-sm mt-1">
                {field.state.meta.errors[0]?.message}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onChange: formSchema.shape.password,
        }}
      >
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium mb-1">
              Password
            </label>
            <Input
              id={field.name}
              type="password"
              placeholder="••••••••"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors[0] && (
              <p className="text-red-500 text-sm mt-1">
                {field.state.meta.errors[0]?.message}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
```

## Toast with Custom Duration

```typescript
// app/components/ToastWithDuration.tsx
'use client'

import { toast } from 'sonner'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

/**
 * Toast with custom display duration
 */
export function ToastWithDuration() {
  const showQuickToast = () => {
    toast('Quick notification', {
      description: 'This will disappear in 2 seconds.',
      duration: 2000,
    })
  }

  const showLongToast = () => {
    toast('Important notification', {
      description: 'This will stay visible for 8 seconds.',
      duration: 8000,
    })
  }

  const showPersistentToast = () => {
    toast('Persistent notification', {
      description: 'This will stay until manually dismissed.',
      duration: Infinity,
    })
  }

  return (
    <div className="space-y-2">
      <Button onClick={showQuickToast} variant="outline">
        Quick Toast (2s)
      </Button>
      <Button onClick={showLongToast} variant="outline">
        Long Toast (8s)
      </Button>
      <Button onClick={showPersistentToast} variant="outline">
        Persistent Toast
      </Button>
    </div>
  )
}
```

## Toast Positions

```typescript
// app/components/ToastPositions.tsx
'use client'

import { toast } from 'sonner'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

/**
 * Toast notifications at different positions
 */
export function ToastPositions() {
  return (
    <div className="space-y-2">
      <Button
        onClick={() =>
          toast.success('Top left', {
            position: 'top-left',
          })
        }
        variant="outline"
      >
        Top Left
      </Button>
      <Button
        onClick={() =>
          toast.success('Top center', {
            position: 'top-center',
          })
        }
        variant="outline"
      >
        Top Center
      </Button>
      <Button
        onClick={() =>
          toast.success('Top right', {
            position: 'top-right',
          })
        }
        variant="outline"
      >
        Top Right
      </Button>
      <Button
        onClick={() =>
          toast.success('Bottom left', {
            position: 'bottom-left',
          })
        }
        variant="outline"
      >
        Bottom Left
      </Button>
      <Button
        onClick={() =>
          toast.success('Bottom center', {
            position: 'bottom-center',
          })
        }
        variant="outline"
      >
        Bottom Center
      </Button>
      <Button
        onClick={() =>
          toast.success('Bottom right', {
            position: 'bottom-right',
          })
        }
        variant="outline"
      >
        Bottom Right
      </Button>
    </div>
  )
}
```

## Promise Toast

Handle async operations with promise-based toast.

```typescript
// app/components/PromiseToast.tsx
'use client'

import { toast } from 'sonner'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

/**
 * Promise-based toast for async operations
 */
export function PromiseToast() {
  const handleAsyncOperation = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve('Success') : reject('Failed')
      }, 2000)
    })

    toast.promise(promise, {
      loading: 'Processing...',
      success: 'Operation completed successfully!',
      error: 'Operation failed. Please try again.',
    })
  }

  const handleUpload = () => {
    const promise = new Promise(resolve => {
      setTimeout(() => resolve('File uploaded'), 3000)
    })

    toast.promise(promise, {
      loading: 'Uploading file...',
      success: 'File uploaded successfully',
      error: 'Failed to upload file',
    })
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleAsyncOperation} variant="outline">
        Random Promise
      </Button>
      <Button onClick={handleUpload} variant="outline">
        Upload File
      </Button>
    </div>
  )
}
```

## Custom Toast Styling

The `ui/sonner` wrapper forwards all Sonner `ToasterProps`:

```typescript
// app/layout.tsx (inside <body>)
import { Toaster } from '@/modules/cores/shadcn/components/ui/sonner'

<Toaster position="bottom-right" richColors closeButton expand />
```

## Toast Type Reference

### Success Toast
```typescript
toast.success('Success title', {
  description: 'Optional description',
})
```

### Error Toast
```typescript
toast.error('Error title', {
  description: 'Optional description',
})
```

### Loading Toast
```typescript
const id = toast.loading('Loading...')
// Later: toast.dismiss(id) or update in place: toast.success('Done', { id })
```

### Default Toast
```typescript
toast('Message', {
  description: 'Optional description',
})
```

### Promise Toast
```typescript
toast.promise(
  async () => {
    // async operation
  },
  {
    loading: 'Loading...',
    success: 'Success!',
    error: 'Error occurred',
  }
)
```

## Best Practices

- Initialize **Toaster** component in root layout for global access
- Use appropriate toast type: `success`, `error`, `loading`, or default
- Keep messages concise and actionable
- Use descriptions for additional context only
- Provide action buttons for common operations (Undo, Retry, View)
- Set appropriate duration based on content importance
- Use `toast.promise()` for async operations
- Position toasts consistently (usually bottom-right)
- Dismiss loading toasts before showing result toasts
- Test on different screen sizes for mobile visibility
- Avoid showing multiple toasts simultaneously (use queue)
