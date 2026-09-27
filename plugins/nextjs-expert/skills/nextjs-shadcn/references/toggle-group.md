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

> **Base:** examples use **Base UI** (shadcn default since 2026-07); Radix delta in "Radix variant" below; React Aria: `selectionMode="single" | "multiple"`, `selectedKeys` / `defaultSelectedKeys` / `onSelectionChange` (RAC `ToggleButtonGroup`, `shadcn docs toggle-group --base aria`). Sources: https://ui.shadcn.com/r/styles/base-nova/toggle-group.json, https://ui.shadcn.com/r/styles/radix-nova/toggle-group.json

On Base UI the value is **always a `string[]`** (single selection = one-element array) and
multi-select is the boolean `multiple` prop. Wrapper extras on every base: `spacing` (default `2`;
`spacing={0}` for connected items), `orientation="vertical"`, `variant="outline"`, `size`.

## Overview

The ToggleGroup component provides a set of toggle buttons where users can select one or multiple options. It's similar to radio groups or checkboxes but with toggle button styling.

## Installation

```bash
bunx --bun shadcn@latest add toggle-group
```

## Basic Usage

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/modules/cores/shadcn/components/ui/toggle-group"

/** Uncontrolled single-selection group. */
export function BasicToggleGroup() {
  return (
    <ToggleGroup defaultValue={["left"]}>
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

/** Controlled single selection that always keeps one item pressed. */
export function SingleSelectToggleGroup() {
  const [alignment, setAlignment] = useState("left")

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Text Alignment</p>
        <ToggleGroup
          value={[alignment]}
          // ignore the empty array emitted when the pressed item is clicked again
          onValueChange={(value) => value[0] && setAlignment(value[0])}
        >
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
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

/** Controlled multi-selection (`multiple`). */
export function MultipleSelectToggleGroup() {
  const [formats, setFormats] = useState<string[]>([])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Text Formatting</p>
        <ToggleGroup
          multiple
          value={formats}
          onValueChange={setFormats}
        >
          <ToggleGroupItem value="bold" aria-label="Bold">
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
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

/** Grid/list view switcher. */
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
          variant="outline"
          value={[view]}
          onValueChange={(value) => value[0] && setView(value[0] as "grid" | "list")}
        >
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
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

/** Multi-select category filter. */
export function FilterToggleGroup() {
  const [filters, setFilters] = useState<string[]>(["all"])

  const categories = ["all", "electronics", "clothing", "books", "home"]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Filter by Category</p>
        <ToggleGroup
          multiple
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

/** Default vs outline (connected) groups. */
export function ToggleGroupVariants() {
  return (
    <div className="space-y-6">
      {/* Default variant */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Default</p>
        <ToggleGroup defaultValue={["option-1"]}>
          <ToggleGroupItem value="option-1">Option 1</ToggleGroupItem>
          <ToggleGroupItem value="option-2">Option 2</ToggleGroupItem>
          <ToggleGroupItem value="option-3">Option 3</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Outline variant, connected items (set on the group, inherited by items) */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Outline</p>
        <ToggleGroup variant="outline" spacing={0} defaultValue={["option-1"]}>
          <ToggleGroupItem value="option-1">Option 1</ToggleGroupItem>
          <ToggleGroupItem value="option-2">Option 2</ToggleGroupItem>
          <ToggleGroupItem value="option-3">Option 3</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}
```

## Disabled Items

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/modules/cores/shadcn/components/ui/toggle-group"

/** Group with one disabled item. */
export function DisabledToggleGroupItems() {
  return (
    <ToggleGroup defaultValue={["available"]}>
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

/** Sort-order picker built from an options array. */
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
          value={[sortBy]}
          onValueChange={(value) => value[0] && setSortBy(value[0])}
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

## Radix variant

Radix selects the mode with `type` and uses a **string** value in single mode (`""` when the
pressed item is toggled off):

```tsx
<>
  <ToggleGroup type="single" value={alignment} onValueChange={(v) => v && setAlignment(v)}>
    <ToggleGroupItem value="left">Left</ToggleGroupItem>
    <ToggleGroupItem value="right">Right</ToggleGroupItem>
  </ToggleGroup>

  <ToggleGroup type="multiple" value={formats} onValueChange={setFormats}>
    <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
    <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
  </ToggleGroup>
</>
```

`defaultValue` follows the same rule (`"left"` for `type="single"`, `["bold"]` for `type="multiple"`).

## Props

### ToggleGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `multiple` | `boolean` | false | Allow several pressed items (Radix uses `type` instead — see Radix variant) |
| `value` | `string[]` | - | Pressed values (controlled) — Radix: `string` in single mode |
| `defaultValue` | `string[]` | - | Initial pressed values (uncontrolled) — Radix: `string` in single mode |
| `onValueChange` | `(value: string[], eventDetails) => void` | - | Callback when value changes |
| `variant` / `size` | toggle variants | - | Applied to every item |
| `spacing` | `number` | 2 | Gap between items; `0` = connected |
| `orientation` | `"horizontal" \| "vertical"` | "horizontal" | Layout + arrow-key direction |
| `disabled` | `boolean` | false | Disable entire group |
| `className` | `string` | - | Additional CSS classes |

### ToggleGroupItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Item value |
| `variant` | `"default" \| "outline"` | "default" | Visual variant (group value wins when set) |
| `size` | `"sm" \| "default" \| "lg"` | "default" | Button size (group value wins when set) |
| `disabled` | `boolean` | false | Disable this item |
| `className` | `string` | - | Additional CSS classes |
| `aria-label` | `string` | - | Required for icon-only items |

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
