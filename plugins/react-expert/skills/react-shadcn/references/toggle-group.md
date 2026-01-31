---
name: toggle-group
description: Set of toggle buttons that can be used for single or multiple selection
when-to-use: View options, layout choices, filter selection, grouped toggle controls
keywords: toggle-button-group, button-group, multi-select-toggle, selection-group, grouped-toggles
priority: medium
requires: toggle.md
related: toggle.md, radio-group.md
---

# Toggle Group Component

## Overview

The ToggleGroup component provides a set of toggle buttons where users can select one or multiple options. It's similar to radio groups or checkboxes but with toggle button styling.

## Installation

```bash
bunx --bun shadcn@latest add toggle-group
```

## Basic Usage

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/modules/cores/shadcn/components/ui/toggle-group"

export function BasicToggleGroup() {
  return (
    <ToggleGroup type="single" defaultValue="left">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  )
}
```

## Single Selection

```tsx
"use client"

import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/modules/cores/shadcn/components/ui/toggle-group"
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react"

export function SingleSelectToggleGroup() {
  const [alignment, setAlignment] = useState("left")

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Text Alignment</p>
        <ToggleGroup
          type="single"
          value={alignment}
          onValueChange={setAlignment}
        >
          <ToggleGroupItem value="left" title="Align left">
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" title="Align center">
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" title="Align right">
            <AlignRight className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <p className="text-sm text-muted-foreground">
        Selected: <strong>{alignment}</strong>
      </p>
    </div>
  )
}
```

## Multiple Selection

```tsx
"use client"

import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/modules/cores/shadcn/components/ui/toggle-group"
import { Bold, Italic, Underline } from "lucide-react"

export function MultipleSelectToggleGroup() {
  const [formats, setFormats] = useState<string[]>([])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Text Formatting</p>
        <ToggleGroup
          type="multiple"
          value={formats}
          onValueChange={setFormats}
        >
          <ToggleGroupItem value="bold" title="Bold">
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" title="Italic">
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" title="Underline">
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <p className="text-sm text-muted-foreground">
        Selected: <strong>{formats.length > 0 ? formats.join(", ") : "None"}</strong>
      </p>
    </div>
  )
}
```

## View Options

```tsx
"use client"

import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/modules/cores/shadcn/components/ui/toggle-group"
import { LayoutGrid, List } from "lucide-react"

interface Item {
  id: string
  name: string
}

export function ViewToggleGroup() {
  const [view, setView] = useState<"grid" | "list">("grid")

  const items: Item[] = [
    { id: "1", name: "Item 1" },
    { id: "2", name: "Item 2" },
    { id: "3", name: "Item 3" },
    { id: "4", name: "Item 4" }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Items</h2>
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(value) => setView(value as "grid" | "list")}
        >
          <ToggleGroupItem value="grid" title="Grid view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" title="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-lg flex items-center justify-center"
            >
              {item.name}
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="p-3 border rounded-lg"
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

## Filter Selection

```tsx
"use client"

import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/modules/cores/shadcn/components/ui/toggle-group"

export function FilterToggleGroup() {
  const [filters, setFilters] = useState<string[]>(["all"])

  const categories = ["all", "electronics", "clothing", "books", "home"]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Filter by Category</p>
        <ToggleGroup
          type="multiple"
          value={filters}
          onValueChange={setFilters}
        >
          {categories.map((category) => (
            <ToggleGroupItem
              key={category}
              value={category}
              className="capitalize"
            >
              {category}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          <strong>Selected filters:</strong> {filters.join(", ")}
        </p>
      </div>
    </div>
  )
}
```

## Button Variants

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/modules/cores/shadcn/components/ui/toggle-group"

export function ToggleGroupVariants() {
  return (
    <div className="space-y-6">
      {/* Default variant */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Default</p>
        <ToggleGroup type="single" defaultValue="option-1">
          <ToggleGroupItem value="option-1">Option 1</ToggleGroupItem>
          <ToggleGroupItem value="option-2">Option 2</ToggleGroupItem>
          <ToggleGroupItem value="option-3">Option 3</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Outline variant */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Outline</p>
        <ToggleGroup type="single" defaultValue="option-1">
          <ToggleGroupItem variant="outline" value="option-1">
            Option 1
          </ToggleGroupItem>
          <ToggleGroupItem variant="outline" value="option-2">
            Option 2
          </ToggleGroupItem>
          <ToggleGroupItem variant="outline" value="option-3">
            Option 3
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}
```

## Disabled Items

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/modules/cores/shadcn/components/ui/toggle-group"

export function DisabledToggleGroupItems() {
  return (
    <ToggleGroup type="single" defaultValue="available">
      <ToggleGroupItem value="available">Available</ToggleGroupItem>
      <ToggleGroupItem value="unavailable" disabled>
        Unavailable
      </ToggleGroupItem>
      <ToggleGroupItem value="pending">Pending</ToggleGroupItem>
    </ToggleGroup>
  )
}
```

## Sorting Options

```tsx
"use client"

import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/modules/cores/shadcn/components/ui/toggle-group"
import { ArrowUp, ArrowDown } from "lucide-react"

interface SortOption {
  value: string
  label: string
  icon?: React.ReactNode
}

export function SortToggleGroup() {
  const [sortBy, setSortBy] = useState("newest")

  const sortOptions: SortOption[] = [
    { value: "newest", label: "Newest", icon: <ArrowDown className="h-4 w-4" /> },
    { value: "oldest", label: "Oldest", icon: <ArrowUp className="h-4 w-4" /> },
    { value: "name", label: "Name" },
    { value: "popularity", label: "Popular" }
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Sort By</p>
        <ToggleGroup
          type="single"
          value={sortBy}
          onValueChange={setSortBy}
        >
          {sortOptions.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className="gap-2"
            >
              {option.icon}
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <p className="text-sm text-muted-foreground">
        Sorting by: <strong>{sortOptions.find((o) => o.value === sortBy)?.label}</strong>
      </p>
    </div>
  )
}
```

## Props

### ToggleGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"single" \| "multiple"` | "single" | Selection mode |
| `value` | `string \| string[]` | - | Current value(s) (controlled) |
| `defaultValue` | `string \| string[]` | - | Initial value(s) (uncontrolled) |
| `onValueChange` | `function` | - | Callback when value changes |
| `disabled` | `boolean` | false | Disable entire group |
| `className` | `string` | - | Additional CSS classes |

### ToggleGroupItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Item value |
| `variant` | `"default" \| "outline"` | "default" | Visual variant |
| `size` | `"sm" \| "default" \| "lg"` | "default" | Button size |
| `disabled` | `boolean` | false | Disable this item |
| `className` | `string` | - | Additional CSS classes |
| `title` | `string` | - | Tooltip title |

## Import Paths

- **Component**: `@/modules/cores/shadcn/components/ui/toggle-group`
- **Re-export**: Use barrel export at `@/modules/cores/shadcn/components/ui`

## Accessibility

- Keyboard navigation with arrow keys
- ARIA attributes for screen readers
- Focus management
- Clear visual feedback for selected state

## Related Components

- [Toggle Component](./toggle.md) - Single toggle button
- [Radio Group](./radio-group.md) - Single selection with labels
- [Checkbox](./checkbox.md) - Multiple selection
