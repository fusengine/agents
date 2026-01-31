---
name: alert
description: Display callout boxes with optional icons, titles, and descriptions
when-to-use: Error notifications, warnings, success messages, important information
keywords: notification, message, callout, banner, destructive, icon
priority: high
requires: button.md
related: alert-dialog.md
---

# Alert Component

Import the Alert components from `@/modules/cores/shadcn/components/ui/alert`:

```typescript
import { Alert, AlertTitle, AlertDescription } from "@/modules/cores/shadcn/components/ui/alert"
import { AlertCircle, Terminal } from "lucide-react"
```

## Installation

```bash
bunx --bun shadcn@latest add alert
```

## Basic Alert

Default variant with optional icon and title:

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/modules/cores/shadcn/components/ui/alert"
import { Terminal } from "lucide-react"

export function AlertDefault() {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components and dependencies to your app using the cli.
      </AlertDescription>
    </Alert>
  )
}
```

## Destructive Alert

Use the `destructive` variant for error or critical messages:

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/modules/cores/shadcn/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function AlertDestructive() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  )
}
```

## Alert with Icons

Combine with lucide-react icons for visual emphasis:

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/modules/cores/shadcn/components/ui/alert"
import { AlertTriangle, Check, Info } from "lucide-react"

export function AlertWithIcons() {
  return (
    <>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>New updates are available.</AlertDescription>
      </Alert>

      <Alert className="border-yellow-500/50 text-yellow-700">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Please review your settings.</AlertDescription>
      </Alert>

      <Alert className="border-green-500/50 text-green-700">
        <Check className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Your changes have been saved.</AlertDescription>
      </Alert>
    </>
  )
}
```

## Alert without Icon

Display alert without icon:

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/modules/cores/shadcn/components/ui/alert"

export function AlertNoIcon() {
  return (
    <Alert>
      <AlertTitle>Notification</AlertTitle>
      <AlertDescription>
        This is a simple alert without an icon.
      </AlertDescription>
    </Alert>
  )
}
```

## Props

### Alert

```typescript
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive"
}
```

- **variant**: `"default"` | `"destructive"` - Alert style variant
- Extends standard HTML div attributes

### AlertTitle

Semantic `h5` element for alert heading:

```typescript
interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
```

### AlertDescription

Wrapper for alert message content:

```typescript
interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
```

## Styling

Customize alert appearance with className:

```tsx
<Alert className="border-blue-500/50 bg-blue-50">
  <AlertTitle>Custom Styled Alert</AlertTitle>
  <AlertDescription>With custom colors and styling.</AlertDescription>
</Alert>
```

## Accessibility

- Alerts use `role="alert"` for screen reader announcement
- Icons are decorative; ensure title and description convey message
- Variant semantics automatically applied via CSS classes

## Best Practices

- Use `destructive` variant for errors only
- Keep descriptions concise and actionable
- Include icons that match message severity
- Avoid alert overload; use sparingly for important info
- Pair with appropriate color variants for clarity

## See Also

- [AlertDialog](./alert-dialog.md) - Confirmation dialogs
- [Button](./button.md) - Action buttons
