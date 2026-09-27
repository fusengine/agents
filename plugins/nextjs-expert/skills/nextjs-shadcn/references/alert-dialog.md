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

> **Base:** examples use **Base UI** (shadcn default since 2026-07); Radix delta in "Radix variant" below; React Aria: the trigger wraps the button and the content (see there). Sources: https://ui.shadcn.com/r/styles/base-nova/alert-dialog.json, https://ui.shadcn.com/r/styles/radix-nova/alert-dialog.json

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

/** Confirmation dialog opened from an outline button. */
export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Show Dialog
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

/** Destructive confirmation with a destructive action button. */
export function AlertDialogDestructive() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Delete Chat
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

Custom element as trigger using `render` (add `nativeButton={false}` when the rendered element is not a `<button>`):

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

/** Non-button trigger via `render` + `nativeButton={false}`. */
export function AlertDialogCustomTrigger() {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        nativeButton={false}
        render={<div className="cursor-pointer text-blue-600 hover:underline" />}
      >
        Click here to confirm
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

/** Controlled dialog; the action closes it explicitly. */
export function AlertDialogControlled() {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    console.log("Confirmed")
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button />}>Open Dialog</AlertDialogTrigger>
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

Trigger element that opens the dialog. Use the `render` prop to apply the trigger to another element (`nativeButton={false}` if it is not a `<button>`).

### AlertDialogContent

Modal content wrapper (Base UI `AlertDialog.Popup` + `Backdrop` in a portal). Handles stacking, animation, and backdrop. Takes `size="default" | "sm"`.

### AlertDialogMedia

Optional icon/image slot inside `AlertDialogHeader`.

### AlertDialogHeader

Container for title and description. Typically styled with spacing.

### AlertDialogFooter

Container for action buttons, typically right-aligned.

### AlertDialogTitle

Semantic `h2` heading for dialog title.

### AlertDialogDescription

Descriptive text explaining the action being confirmed.

### AlertDialogAction

Primary action button. Can accept `variant="destructive"` for delete operations. On Base UI it is a plain shadcn `Button` — it does **not** close the dialog by itself: control `open` (see "Programmatic Dialog Control") or close in your handler.

### AlertDialogCancel

Cancel button that closes dialog without action (Base UI `AlertDialog.Close` rendering a `Button`).

## Props

```typescript
// AlertDialog (Base UI AlertDialog.Root)
interface AlertDialogProps {
  open?: boolean
  onOpenChange?: (
    open: boolean,
    eventDetails: AlertDialogPrimitive.Root.ChangeEventDetails,
  ) => void
}

// AlertDialogAction — all shadcn Button props
type AlertDialogActionProps = React.ComponentProps<typeof Button>
```

## Radix variant

Only the trigger composition and the action behaviour change (`style` `radix-*`):

```tsx
<AlertDialogTrigger asChild>
  <Button variant="outline">Show Dialog</Button>
</AlertDialogTrigger>
// AlertDialogAction wraps AlertDialogPrimitive.Action: it closes the dialog on click.
```

React Aria (`aria-*`): no Trigger `render`/`asChild` — `<AlertDialogTrigger>` wraps the `<Button>` **and** the `<AlertDialog>` content; `AlertDialogAction` closes via `slot="close"`. See `shadcn docs alert-dialog --base aria`.

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
