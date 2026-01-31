---
name: alert-dialog
description: Modal dialog for confirming critical actions with title, description, and action buttons
when-to-use: Destructive operations, confirmation prompts, critical user decisions
keywords: confirmation, modal, dialog, destructive action, prompt, warning
priority: high
requires: button.md
related: alert.md
---

# AlertDialog Component

Import AlertDialog components from `@/modules/cores/shadcn/components/ui/alert-dialog`:

```typescript
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/modules/cores/shadcn/components/ui/alert-dialog"
```

## Installation

```bash
bunx --bun shadcn@latest add alert-dialog
```

## Basic Confirmation Dialog

Standard alert dialog for confirming actions:

```tsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/modules/cores/shadcn/components/ui/alert-dialog"
import { Button } from "@/modules/cores/shadcn/components/ui/button"

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## Destructive Action Dialog

Dialog with destructive action button for delete operations:

```tsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/modules/cores/shadcn/components/ui/alert-dialog"
import { Button } from "@/modules/cores/shadcn/components/ui/button"
import { Trash2 } from "lucide-react"

export function AlertDialogDestructive() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Chat</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete chat?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this chat conversation and all messages.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## Dialog with Custom Trigger

Custom element as trigger using `asChild`:

```tsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/modules/cores/shadcn/components/ui/alert-dialog"

export function AlertDialogCustomTrigger() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="cursor-pointer text-blue-600 hover:underline">
          Click here to confirm
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm action</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Yes, confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## Programmatic Dialog Control

Control dialog visibility with state:

```tsx
"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/modules/cores/shadcn/components/ui/alert-dialog"
import { Button } from "@/modules/cores/shadcn/components/ui/button"

export function AlertDialogControlled() {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    console.log("Confirmed")
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>Open Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm action</AlertDialogTitle>
          <AlertDialogDescription>
            This is a controlled dialog component.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## Components

### AlertDialog

Root wrapper that manages dialog state. Accepts `open` and `onOpenChange` for controlled behavior.

### AlertDialogTrigger

Trigger element that opens the dialog. Use `asChild` prop to apply dialog trigger to custom elements.

### AlertDialogContent

Modal content wrapper. Handles stacking, animation, and backdrop.

### AlertDialogHeader

Container for title and description. Typically styled with spacing.

### AlertDialogFooter

Container for action buttons, typically right-aligned.

### AlertDialogTitle

Semantic `h2` heading for dialog title.

### AlertDialogDescription

Descriptive text explaining the action being confirmed.

### AlertDialogAction

Primary action button. Can accept `variant="destructive"` for delete operations.

### AlertDialogCancel

Cancel button that closes dialog without action.

## Props

```typescript
// AlertDialog
interface AlertDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

// AlertDialogAction
interface AlertDialogActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive"
}
```

## Accessibility

- Dialog has `role="alertdialog"` for screen readers
- Keyboard navigation: Escape to cancel, Tab between buttons
- Focus management: Focuses first button on open, returns to trigger on close
- Title and description linked via `aria-labelledby` and `aria-describedby`

## Best Practices

- Use for irreversible or high-impact actions only
- Keep title and description concise
- Explicitly name actions ("Delete" not "OK")
- Use destructive variant for delete/remove actions
- Always provide cancel option
- Avoid dialog chains or multiple dialogs

## See Also

- [Alert](./alert.md) - Non-modal alert component
- [Button](./button.md) - Action buttons
