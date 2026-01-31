---
name: toggle
description: Button that can be toggled on and off with icon or text support
when-to-use: Text formatting, feature toggles, button-style switches, toolbar buttons
keywords: toggle-button, text-formatting, toolbar-button, button-toggle, toggle-state
priority: medium
requires: []
related: toggle-group.md, switch.md, button.md
---

# Toggle Component

## Overview

The Toggle component is a button that can be pressed and released with visual feedback. It supports both text and icon content and can be used standalone or in groups.

## Installation

```bash
bunx --bun shadcn@latest add toggle
```

## Basic Usage

```tsx
import { Toggle } from "@/modules/cores/shadcn/components/ui/toggle"

export function BasicToggle() {
  return <Toggle>Click me</Toggle>
}
```

## With Icon

```tsx
import { Toggle } from "@/modules/cores/shadcn/components/ui/toggle"
import { Bold } from "lucide-react"

export function ToggleWithIcon() {
  return (
    <Toggle>
      <Bold className="h-4 w-4" />
    </Toggle>
  )
}
```

## Controlled Toggle

```tsx
"use client"

import { useState } from "react"
import { Toggle } from "@/modules/cores/shadcn/components/ui/toggle"
import { Bold } from "lucide-react"

export function ControlledToggle() {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <div className="space-y-4">
      <Toggle
        pressed={isPressed}
        onPressedChange={setIsPressed}
      >
        <Bold className="h-4 w-4 mr-2" />
        Bold {isPressed ? "(on)" : "(off)"}
      </Toggle>

      <p className="text-sm">
        State: <strong>{isPressed ? "Pressed" : "Not pressed"}</strong>
      </p>
    </div>
  )
}
```

## Toggle Variants

```tsx
import { Toggle } from "@/modules/cores/shadcn/components/ui/toggle"
import { Bold, Italic, Underline } from "lucide-react"

export function ToggleVariants() {
  return (
    <div className="space-y-4">
      {/* Default variant */}
      <div className="space-y-2">
        <p className="text-sm font-semibold">Default</p>
        <div className="flex gap-2">
          <Toggle variant="default">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle variant="default">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle variant="default">
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>
      </div>

      {/* Outline variant */}
      <div className="space-y-2">
        <p className="text-sm font-semibold">Outline</p>
        <div className="flex gap-2">
          <Toggle variant="outline">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle variant="outline">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle variant="outline">
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>
      </div>
    </div>
  )
}
```

## Toggle Sizes

```tsx
import { Toggle } from "@/modules/cores/shadcn/components/ui/toggle"
import { Bold } from "lucide-react"

export function ToggleSizes() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Toggle size="sm">
          <Bold className="h-3 w-3" />
        </Toggle>
        <span className="text-xs">Small</span>
      </div>

      <div className="flex gap-2 items-center">
        <Toggle size="default">
          <Bold className="h-4 w-4" />
        </Toggle>
        <span className="text-xs">Default</span>
      </div>

      <div className="flex gap-2 items-center">
        <Toggle size="lg">
          <Bold className="h-5 w-5" />
        </Toggle>
        <span className="text-xs">Large</span>
      </div>
    </div>
  )
}
```

## Text Formatting Toolbar

```tsx
"use client"

import { useState } from "react"
import { Toggle } from "@/modules/cores/shadcn/components/ui/toggle"
import { Bold, Italic, Underline, Strikethrough } from "lucide-react"

interface FormatState {
  bold: boolean
  italic: boolean
  underline: boolean
  strikethrough: boolean
}

export function TextFormattingToolbar() {
  const [format, setFormat] = useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false
  })

  const updateFormat = (key: keyof FormatState) => {
    setFormat((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1 border rounded-lg p-1 bg-gray-50">
        <Toggle
          variant="outline"
          size="sm"
          pressed={format.bold}
          onPressedChange={() => updateFormat("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          variant="outline"
          size="sm"
          pressed={format.italic}
          onPressedChange={() => updateFormat("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          variant="outline"
          size="sm"
          pressed={format.underline}
          onPressedChange={() => updateFormat("underline")}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Toggle>
        <Toggle
          variant="outline"
          size="sm"
          pressed={format.strikethrough}
          onPressedChange={() => updateFormat("strikethrough")}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>
      </div>

      <div className="p-3 border rounded-lg">
        <p
          style={{
            fontWeight: format.bold ? "bold" : "normal",
            fontStyle: format.italic ? "italic" : "normal",
            textDecoration: [
              format.underline ? "underline" : "",
              format.strikethrough ? "line-through" : ""
            ]
              .filter(Boolean)
              .join(" ")
          }}
        >
          Preview text with applied formatting
        </p>
      </div>
    </div>
  )
}
```

## Disabled State

```tsx
import { Toggle } from "@/modules/cores/shadcn/components/ui/toggle"
import { Bold } from "lucide-react"

export function DisabledToggle() {
  return (
    <div className="space-y-4">
      <Toggle>
        <Bold className="h-4 w-4 mr-2" />
        Enabled
      </Toggle>

      <Toggle disabled>
        <Bold className="h-4 w-4 mr-2" />
        Disabled
      </Toggle>
    </div>
  )
}
```

## Toggle with Text and Icon

```tsx
"use client"

import { useState } from "react"
import { Toggle } from "@/modules/cores/shadcn/components/ui/toggle"
import { Heart } from "lucide-react"

export function ToggleFavorite() {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <Toggle
      pressed={isFavorite}
      onPressedChange={setIsFavorite}
      variant="outline"
    >
      <Heart
        className={`h-4 w-4 mr-2 ${
          isFavorite ? "fill-current text-red-500" : ""
        }`}
      />
      {isFavorite ? "Favorited" : "Add to Favorites"}
    </Toggle>
  )
}
```

## Dark/Light Mode Toggle

```tsx
"use client"

import { useState } from "react"
import { Toggle } from "@/modules/cores/shadcn/components/ui/toggle"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  return (
    <Toggle
      pressed={isDark}
      onPressedChange={setIsDark}
      variant="outline"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Toggle>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pressed` | `boolean` | false | Current pressed state (controlled) |
| `defaultPressed` | `boolean` | false | Initial pressed state (uncontrolled) |
| `onPressedChange` | `function` | - | Callback when pressed state changes |
| `variant` | `"default" \| "outline"` | "default" | Visual variant |
| `size` | `"sm" \| "default" \| "lg"` | "default" | Toggle size |
| `disabled` | `boolean` | false | Disable the toggle |
| `asChild` | `boolean` | false | Use as child element |
| `className` | `string` | - | Additional CSS classes |
| `aria-label` | `string` | - | Accessible label for screen readers |

## Import Paths

- **Component**: `@/modules/cores/shadcn/components/ui/toggle`
- **Re-export**: Use barrel export at `@/modules/cores/shadcn/components/ui`

## Accessibility

- Keyboard support (Space/Enter to toggle)
- ARIA attributes (aria-pressed)
- Screen reader support
- Clear focus states

## Related Components

- [Toggle Group](./toggle-group.md) - Multiple toggle buttons
- [Switch Component](./switch.md) - Boolean toggle
- [Button Component](./button.md) - Regular button
