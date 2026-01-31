---
name: dialog
description: Accessible modal dialog with header, footer, content, and form integration
when-to-use: Modals, confirmation dialogs, forms, user interactions, alerts
keywords: dialog-trigger, dialog-content, dialog-header, dialog-footer, alert-dialog, modal
priority: high
requires: null
related: select.md, checkbox.md
---

# Dialog Component

Accessible modal dialog built on Radix UI. Supports basic dialogs, alert dialogs, dialogs with forms, and custom layouts using DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, and DialogDescription.

## Installation

```bash
bunx --bun shadcn-ui@latest add dialog
bunx --bun shadcn-ui@latest add alert-dialog
```

## Basic Dialog

```typescript
// app/components/BasicDialog.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/modules/cores/shadcn/components/ui/dialog'

/**
 * Basic dialog with trigger button
 */
export function BasicDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description of the dialog content.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            Add your content here. This could be text, forms, images, or any
            other component.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

## Dialog with Close Button

```typescript
// app/components/DialogWithClose.tsx
'use client'

import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/modules/cores/shadcn/components/ui/dialog'

/**
 * Dialog with explicit close button in footer
 */
export function DialogWithClose() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Settings</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your application settings here
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Theme</h4>
            <p className="text-sm text-gray-500">Choose your preferred theme</p>
          </div>
          <div>
            <h4 className="font-medium">Notifications</h4>
            <p className="text-sm text-gray-500">
              Configure notification preferences
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

## Dialog with Form

```typescript
// app/components/DialogWithForm.tsx
'use client'

import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import * as z from 'zod'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/modules/cores/shadcn/components/ui/dialog'
import { Input } from '@/modules/cores/shadcn/components/ui/input'
import { Label } from '@/modules/cores/shadcn/components/ui/label'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

type FormValues = z.infer<typeof formSchema>

/**
 * Dialog containing a form with validation using TanStack Form
 */
export function DialogWithForm() {
  const [open, setOpen] = useState(false)

  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      name: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value)
      setOpen(false)
    },
    validators: {
      onSubmit: zodValidator(formSchema),
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Invite User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite New User</DialogTitle>
          <DialogDescription>
            Send an invitation to a new team member
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field
            name="name"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />
          <form.Field
            name="email"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Send Invitation</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

## Alert Dialog

Confirmation dialog for destructive actions.

```typescript
// app/components/AlertDialogExample.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/modules/cores/shadcn/components/ui/alert-dialog'

/**
 * Alert dialog for confirming destructive actions
 */
export function AlertDialogExample() {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      // Perform delete operation
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Item deleted')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## Nested Dialog

Dialog with independent open state.

```typescript
// app/components/DialogControlled.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/modules/cores/shadcn/components/ui/dialog'

/**
 * Controlled dialog with managed open state
 */
export function DialogControlled() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)

  const handleNext = () => setStep(step + 1)
  const handleBack = () => setStep(step - 1)
  const handleClose = () => {
    setOpen(false)
    setStep(1)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Multi-Step Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Setup Wizard</DialogTitle>
          <DialogDescription>
            Step {step} of 3: {step === 1 && 'Basic Information'}
            {step === 2 && 'Preferences'}
            {step === 3 && 'Confirmation'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {step === 1 && <div>Step 1 content</div>}
          {step === 2 && <div>Step 2 content</div>}
          {step === 3 && <div>Step 3 content</div>}
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button
            onClick={step === 3 ? handleClose : handleNext}
            disabled={step === 3}
          >
            {step === 3 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

## Dialog with Tabs

Dialog containing tabbed content.

```typescript
// app/components/DialogWithTabs.tsx
'use client'

import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/modules/cores/shadcn/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/modules/cores/shadcn/components/ui/tabs'

/**
 * Dialog with tabbed content
 */
export function DialogWithTabs() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Preferences</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
          <DialogDescription>
            Configure your application preferences
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="space-y-4">
            <div>
              <h4 className="font-medium">Username</h4>
              <p className="text-sm text-gray-500">Your account username</p>
            </div>
            <div>
              <h4 className="font-medium">Email</h4>
              <p className="text-sm text-gray-500">Your account email</p>
            </div>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-gray-500">
                Receive emails about account activity
              </p>
            </div>
            <div>
              <h4 className="font-medium">Push Notifications</h4>
              <p className="text-sm text-gray-500">
                Receive push notifications
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
```

## Dialog Header and Footer

```typescript
// app/components/DialogWithFooter.tsx
'use client'

import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/modules/cores/shadcn/components/ui/dialog'
import { Input } from '@/modules/cores/shadcn/components/ui/input'
import { Label } from '@/modules/cores/shadcn/components/ui/label'

/**
 * Dialog with structured header and footer
 */
export function DialogWithFooter() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="Pedro" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

## Best Practices

- Always include **DialogHeader** with title and description
- Use **AlertDialog** for destructive or critical confirmations
- Manage dialog state with `open` and `onOpenChange` props
- Provide clear action buttons (Save, Cancel, Delete)
- Use **DialogClose** or `onOpenChange` for dismiss functionality
- Reset form state when dialog closes
- Use consistent sizing with `sm:max-w-[425px]` or similar
- Test keyboard navigation (Escape to close, Tab to navigate)
- Provide appropriate ARIA labels and descriptions
- Show loading states during async operations
- Prevent background scroll when dialog is open (automatic with Radix UI)
