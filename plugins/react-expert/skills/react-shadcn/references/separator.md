---
name: separator
description: Visual divider component for separating content sections
when-to-use: Use when you need to visually separate groups of content, create visual hierarchy in lists, or divide menu sections. Both horizontal and vertical orientations supported.
keywords: divider, visual separator, section break, menu separator, content divider
priority: high
requires: null
related: null
---

# Separator Component

The Separator component is a simple yet effective visual divider that separates content into logical groups. It supports both horizontal and vertical orientations with customizable styling.

## Installation

Install the Separator component using the shadcn/ui CLI:

```bash
bunx --bun shadcn@latest add separator
```

## Basic Usage

### Horizontal Separator

The default separator is horizontal and works well for dividing content sections:

```tsx
import { Separator } from "@/modules/cores/shadcn/components/ui/separator"

export function HorizontalSeparatorExample() {
  return (
    <div className="flex max-w-sm flex-col gap-4 text-sm">
      <div className="flex flex-col gap-1.5">
        <div className="leading-none font-medium">shadcn/ui</div>
        <div className="text-muted-foreground">
          The Foundation for your Design System
        </div>
      </div>
      <Separator />
      <div>
        A set of beautifully designed components that you can customize, extend,
        and build on.
      </div>
    </div>
  )
}
```

### Vertical Separator

Use vertical separators to divide inline elements like navigation links:

```tsx
import { Separator } from "@/modules/cores/shadcn/components/ui/separator"

export function VerticalSeparatorExample() {
  return (
    <div className="flex h-5 items-center gap-4 text-sm">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  )
}
```

## List Separator Pattern

Create visual separation between list items using horizontal separators:

```tsx
import { Separator } from "@/modules/cores/shadcn/components/ui/separator"

export function SeparatorListExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2 text-sm">
      <dl className="flex items-center justify-between">
        <dt>Item 1</dt>
        <dd className="text-muted-foreground">Value 1</dd>
      </dl>
      <Separator />
      <dl className="flex items-center justify-between">
        <dt>Item 2</dt>
        <dd className="text-muted-foreground">Value 2</dd>
      </dl>
      <Separator />
      <dl className="flex items-center justify-between">
        <dt>Item 3</dt>
        <dd className="text-muted-foreground">Value 3</dd>
      </dl>
    </div>
  )
}
```

## Menu Separator Pattern

Separate menu sections with vertical separators and responsive hiding:

```tsx
import { Separator } from "@/modules/cores/shadcn/components/ui/separator"

export function MenuSeparatorExample() {
  return (
    <div className="flex items-center gap-2 text-sm md:gap-4">
      <div className="flex flex-col gap-1">
        <span className="font-medium">Settings</span>
        <span className="text-muted-foreground text-xs">
          Manage preferences
        </span>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-col gap-1">
        <span className="font-medium">Account</span>
        <span className="text-muted-foreground text-xs">
          Profile & security
        </span>
      </div>
      <Separator orientation="vertical" className="hidden md:block" />
      <div className="hidden flex-col gap-1 md:flex">
        <span className="font-medium">Help</span>
        <span className="text-muted-foreground text-xs">Support & docs</span>
      </div>
    </div>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Direction of the separator |
| `className` | `string` | - | Additional CSS classes for styling |
| `decorative` | `boolean` | `true` | Whether separator is decorative (accessibility) |

## Styling

Customize separator appearance using Tailwind classes:

```tsx
// Thicker separator
<Separator className="h-1" />

// Custom color
<Separator className="bg-blue-500" />

// Vertical with custom height
<Separator orientation="vertical" className="h-8" />

// Dashed separator
<Separator className="border-dashed" />
```

## Best Practices

1. **Use for visual grouping** - Separate related content blocks
2. **Vertical separators for inline content** - Navigation links, menu items
3. **Horizontal separators for block content** - Form sections, list items
4. **Responsive hiding** - Hide separators on smaller screens when needed
5. **Color consistency** - Use theme colors for separators matching your design system
6. **Spacing** - Combine with gap/margin utilities for proper spacing around separators

## Accessibility

The Separator component is marked as `decorative` by default, meaning screen readers ignore it. For semantic separators, set `decorative={false}`.
