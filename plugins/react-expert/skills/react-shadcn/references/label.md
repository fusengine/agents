---
name: label
description: Renders an accessible label element with built-in styling
when-to-use: Form fields, input associations, required indicators, accessibility
keywords: form-label, label-element, htmlFor, required-indicator, accessibility
priority: high
requires: []
related: input.md, textarea.md, radio-group.md, switch.md
---

# Label Component

## Overview

The Label component renders a semantic HTML `<label>` element with built-in Tailwind styling. It's designed to work with form inputs and provides proper accessibility through `htmlFor` association.

## Installation

```bash
bunx --bun shadcn@latest add label
```

## Basic Usage

```tsx
import { Label } from "@/modules/cores/shadcn/components/ui/label"

export function BasicLabel() {
  return <Label htmlFor="email">Email</Label>
}
```

## With Input Field

```tsx
import { Input } from "@/modules/cores/shadcn/components/ui/input"
import { Label } from "@/modules/cores/shadcn/components/ui/label"

export function LabelWithInput() {
  return (
    <div className="grid w-full gap-2">
      <Label htmlFor="email">Email Address</Label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  )
}
```

## Required Indicator Pattern

```tsx
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { Input } from "@/modules/cores/shadcn/components/ui/input"

export function LabelWithRequired() {
  return (
    <div className="grid w-full gap-2">
      <Label htmlFor="username">
        Username
        <span className="ml-1 text-red-500" aria-label="required">
          *
        </span>
      </Label>
      <Input id="username" type="text" placeholder="Choose a username" required />
    </div>
  )
}
```

## Label Variants

The Label component supports different text styling through class composition:

```tsx
import { Label } from "@/modules/cores/shadcn/components/ui/label"

export function LabelVariants() {
  return (
    <div className="space-y-4">
      {/* Default */}
      <Label htmlFor="field1">Default Label</Label>

      {/* Muted */}
      <Label htmlFor="field2" className="text-muted-foreground">
        Muted Label
      </Label>

      {/* Destructive */}
      <Label htmlFor="field3" className="text-destructive">
        Error Label
      </Label>

      {/* Small */}
      <Label htmlFor="field4" className="text-sm">
        Small Label
      </Label>
    </div>
  )
}
```

## Accessibility Features

- **htmlFor Association**: Links the label to its input using the `htmlFor` prop
- **Semantic HTML**: Renders as a proper `<label>` element
- **Required Indicator**: Use aria-label for screen readers when showing required indicators
- **Focus Management**: Clicking the label focuses the associated input

```tsx
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { Input } from "@/modules/cores/shadcn/components/ui/input"

export function AccessibleLabel() {
  return (
    <div className="grid w-full gap-2">
      <Label htmlFor="password">
        Password
        <span className="ml-1 text-red-500" aria-label="required">*</span>
      </Label>
      <Input
        id="password"
        type="password"
        placeholder="Enter password"
        required
        aria-required="true"
        aria-describedby="password-hint"
      />
      <p id="password-hint" className="text-sm text-muted-foreground">
        Must be at least 8 characters
      </p>
    </div>
  )
}
```

## Multiple Inputs with Group Label

```tsx
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { Input } from "@/modules/cores/shadcn/components/ui/input"

export function GroupLabels() {
  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-medium">Address Information</legend>

      <div className="grid w-full gap-2">
        <Label htmlFor="street">Street Address</Label>
        <Input id="street" type="text" placeholder="Street" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid w-full gap-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" type="text" placeholder="City" />
        </div>
        <div className="grid w-full gap-2">
          <Label htmlFor="zip">Zip Code</Label>
          <Input id="zip" type="text" placeholder="Zip" />
        </div>
      </div>
    </fieldset>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `htmlFor` | `string` | - | ID of the input element the label is associated with |
| `className` | `string` | - | Additional CSS classes for styling |
| `children` | `ReactNode` | - | Label text or content |

## Import Paths

- **Component**: `@/modules/cores/shadcn/components/ui/label`
- **Re-export**: Use barrel export at `@/modules/cores/shadcn/components/ui`

## Related Components

- [Input Component](./input.md) - Text input field
- [Textarea Component](./textarea.md) - Multi-line text field
- [Radio Group](./radio-group.md) - Radio button groups with labels
- [Switch Component](./switch.md) - Toggle switch with label
