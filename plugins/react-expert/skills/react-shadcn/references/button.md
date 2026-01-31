---
name: button
description: Complete Button component with all variants, sizes, and patterns
when-to-use: Actions, form submission, navigation, interactive triggers
keywords: variant, size, asChild, Link, loading-state, icon-button
priority: high
requires: installation.md, configuration.md
related: input.md, card.md
---

# Button Component

## Installation

```bash
bunx shadcn-ui@latest add button
```

Creates: `@/modules/cores/shadcn/components/ui/button.tsx`

## Basic Usage

```typescript
import { Button } from '@/modules/cores/shadcn/components/ui/button'

export function BasicButton() {
  return <Button>Click me</Button>
}
```

## Variants

### Default (Primary)

```typescript
<Button>Default button</Button>
```

Styling: Solid background, white text, rounded corners

### Secondary

```typescript
<Button variant="secondary">Secondary button</Button>
```

Styling: Light gray background, dark text

### Destructive

```typescript
<Button variant="destructive">Delete item</Button>
```

Styling: Red background, white text (danger action)

### Outline

```typescript
<Button variant="outline">Outline button</Button>
```

Styling: Border only, transparent background

### Ghost

```typescript
<Button variant="ghost">Ghost button</Button>
```

Styling: No border or background, hover effect only

### Link

```typescript
<Button variant="link">Link button</Button>
```

Styling: Underlined text, no background (use for inline links)

## Sizes

### Small

```typescript
<Button size="sm">Small button</Button>
```

### Default

```typescript
<Button size="default">Default button</Button>
```

(Omit `size` prop for default)

### Large

```typescript
<Button size="lg">Large button</Button>
```

### Icon

```typescript
import { Plus } from '@/modules/cores/shadcn/components/icons'

<Button size="icon">
  <Plus className="w-4 h-4" />
</Button>
```

Square button for icons only

## Common Combinations

```typescript
// Primary action
<Button>Save changes</Button>

// Secondary action
<Button variant="secondary">Cancel</Button>

// Danger action
<Button variant="destructive">Delete</Button>

// Tertiary action
<Button variant="ghost">More options</Button>

// Link-like button
<Button variant="link">Learn more</Button>

// Icon button
<Button size="icon" variant="ghost">
  <Settings className="w-4 h-4" />
</Button>

// Small outline
<Button size="sm" variant="outline">Copy</Button>
```

## Advanced Patterns

### asChild Pattern (Compose with Link)

For React navigation, use `asChild` to render as Link:

```typescript
import { Link } from '@tanstack/react-router'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

export function NavButton() {
  return (
    <Button asChild>
      <Link href="/dashboard">Go to dashboard</Link>
    </Button>
  )
}
```

**What it does**: Button renders as `<a>` tag via Link component

**Use when**:
- Navigation between pages
- External links with button styling
- Want button accessibility + link semantics

```typescript
// Multiple children work too
<Button asChild>
  <a href="https://example.com">
    <span>Open external site</span>
    <ExternalLink className="w-4 h-4 ml-2" />
  </a>
</Button>
```

### Loading State Pattern

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { Loader } from '@/modules/cores/shadcn/components/icons'

export function LoadingButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      // Your async action
      await fetch('/api/submit', { method: 'POST' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      {isLoading && (
        <Loader className="w-4 h-4 mr-2 animate-spin" />
      )}
      {isLoading ? 'Submitting...' : 'Submit'}
    </Button>
  )
}
```

**Pattern breakdown**:
1. Track loading state with `useState`
2. Disable button while loading
3. Show spinner icon (animated)
4. Change text to show status

### Button Group Pattern

```typescript
export function ButtonGroup() {
  return (
    <div className="flex gap-2">
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </div>
  )
}
```

**CSS**:
- `flex gap-2` for spacing
- Use variant contrast (outline + solid)

### Button with Icon and Text

```typescript
import { Plus } from '@/modules/cores/shadcn/components/icons'

export function CreateButton() {
  return (
    <Button>
      <Plus className="w-4 h-4 mr-2" />
      Create new item
    </Button>
  )
}
```

### Conditional Rendering

```typescript
export function ContextualButton({ isEditing }: { isEditing: boolean }) {
  return (
    <Button
      variant={isEditing ? 'destructive' : 'default'}
      onClick={() => {
        // handle toggle
      }}
    >
      {isEditing ? 'Cancel edit' : 'Edit'}
    </Button>
  )
}
```

### Full Width Button

```typescript
<Button className="w-full">Full width button</Button>
```

Add `w-full` class for 100% width

### Button in Form Context

```typescript
import { Button } from '@/modules/cores/shadcn/components/ui/button'

export function SignUpForm() {
  return (
    <form>
      {/* form fields */}
      <Button type="submit" className="w-full">
        Sign up
      </Button>
      <Button type="reset" variant="outline" className="w-full">
        Clear
      </Button>
    </form>
  )
}
```

**Important**: Use `type="submit"` for form submission

## Accessibility

### ARIA Labels

For icon-only buttons, always add `aria-label`:

```typescript
<Button size="icon" aria-label="Delete item">
  <Trash2 className="w-4 h-4" />
</Button>
```

### Disabled State

```typescript
<Button disabled>Disabled button</Button>
```

Automatically:
- Shows gray styling
- Prevents click handlers
- Adds `aria-disabled="true"`

### Focus Management

Buttons automatically handle focus for keyboard navigation.

Test with Tab key: Button should show focus outline.

## Styling & Customization

### Tailwind Classes

Combine Button variants with Tailwind:

```typescript
// Larger button with padding
<Button className="px-6 py-3 text-lg">Large custom</Button>

// Full width with margin
<Button className="w-full mb-4">Spaced button</Button>

// Custom color (override variant)
<Button className="bg-purple-600 hover:bg-purple-700">
  Custom color
</Button>
```

### Component Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}
```

All standard HTML button attributes work:
- `onClick`
- `disabled`
- `type="submit" | "button" | "reset"`
- `className`
- `aria-*`

## Examples by Use Case

### Primary Action (Save)

```typescript
<Button>Save changes</Button>
```

### Secondary Action (Cancel)

```typescript
<Button variant="secondary">Cancel</Button>
```

### Dangerous Action (Delete)

```typescript
<Button variant="destructive" onClick={handleDelete}>
  Delete account
</Button>
```

### Navigation Link

```typescript
<Button asChild>
  <Link href="/profile">View profile</Link>
</Button>
```

### Form Submission with Loading

```typescript
<Button
  type="submit"
  disabled={isLoading}
  onClick={handleSubmit}
>
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

### Toggle Button

```typescript
<Button
  variant={isActive ? 'default' : 'outline'}
  onClick={() => setIsActive(!isActive)}
>
  {isActive ? 'Active' : 'Inactive'}
</Button>
```

### Icon + Text Action

```typescript
<Button>
  <Download className="w-4 h-4 mr-2" />
  Download report
</Button>
```

## Type Safety

Full TypeScript support:

```typescript
import type { ButtonHTMLAttributes } from 'react'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  icon?: React.ReactNode
}

export function CustomButton({
  loading,
  icon,
  children,
  ...props
}: CustomButtonProps) {
  return (
    <Button {...props} disabled={loading}>
      {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Button>
  )
}
```

## Related Components

- [Input](input.md) - Text input fields
- [Card](card.md) - Container layout
- [Form](https://ui.shadcn.com/docs/components/form) - Form management

## Related Patterns

- [Dialog](https://ui.shadcn.com/docs/components/dialog) - Modal with actions
- [Dropdown Menu](https://ui.shadcn.com/docs/components/dropdown-menu) - Button-triggered menu
- [Toast](https://ui.shadcn.com/docs/components/toast) - Feedback after button click
