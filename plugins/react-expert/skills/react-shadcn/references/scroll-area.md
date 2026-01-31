---
name: scroll-area
description: Customizable scrollable container with styled scrollbars
when-to-use: Use when you need to create scrollable regions with custom scrollbar styling, horizontal scrolling galleries, or overflow content containers. Supports both vertical and horizontal scrolling.
keywords: scrollbar, overflow, scroll container, horizontal scroll, custom scrolling
priority: medium
requires: null
related: carousel.md
---

# ScrollArea Component

The ScrollArea component provides a customizable scrolling experience with styled scrollbars. It's built on Radix UI and supports both vertical and horizontal scrolling directions.

## Installation

Install the ScrollArea component using the shadcn/ui CLI:

```bash
bunx --bun shadcn@latest add scroll-area
```

## Basic Usage

### Vertical Scroll Area

Create a vertical scrollable container:

```tsx
import { ScrollArea } from "@/modules/cores/shadcn/components/ui/scroll-area"

export function ScrollAreaExample() {
  return (
    <ScrollArea className="h-48 w-48 rounded-md border p-4">
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="text-sm">
            <h3 className="font-semibold">Item {i + 1}</h3>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
```

## Horizontal Scrolling

### Image Gallery with Horizontal Scroll

Create a horizontal scrolling gallery for artwork or images:

```tsx
"use client"

import * as React from "react"
import Image from "next/image"
import { ScrollArea, ScrollBar } from "@/modules/cores/shadcn/components/ui/scroll-area"

export interface Artwork {
  artist: string
  art: string
}

export const works: Artwork[] = [
  {
    artist: "Ornella Binni",
    art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80"
  },
  {
    artist: "Tom Byrom",
    art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80"
  },
  {
    artist: "Vladimir Malyavko",
    art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80"
  }
]

export function ScrollAreaHorizontalExample() {
  return (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {works.map((artwork) => (
          <figure key={artwork.artist} className="shrink-0">
            <div className="overflow-hidden rounded-md">
              <Image
                src={artwork.art}
                alt={`Photo by ${artwork.artist}`}
                className="h-48 w-48 object-cover"
                width={300}
                height={300}
              />
            </div>
            <figcaption className="pt-2 text-xs text-muted-foreground">
              Photo by <span className="font-semibold text-foreground">{artwork.artist}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
```

## Custom Scrollbar Styling

### Styled Scroll Area

Customize scrollbar appearance:

```tsx
import { ScrollArea, ScrollBar } from "@/modules/cores/shadcn/components/ui/scroll-area"

export function StyledScrollAreaExample() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h3 className="mb-4 text-sm font-semibold">Contents</h3>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="mb-3 text-sm">
            Section {i + 1}
          </div>
        ))}
      </div>
      <ScrollBar className="bg-blue-200" />
    </ScrollArea>
  )
}
```

## Components

### ScrollArea

Main container component for scrollable content.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to scroll |
| `className` | `string` | - | Container CSS classes |
| `dir` | `"ltr" \| "rtl"` | - | Text direction |

### ScrollBar

Styled scrollbar component for both directions.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Scrollbar direction |
| `className` | `string` | - | Scrollbar CSS classes |

## Advanced Patterns

### Responsive Scroll Area

Handle different screen sizes:

```tsx
import { ScrollArea, ScrollBar } from "@/modules/cores/shadcn/components/ui/scroll-area"

export function ResponsiveScrollExample() {
  return (
    <ScrollArea className="h-64 w-full rounded-md border md:h-96">
      <div className="flex w-max gap-4 p-4 md:gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="w-32 flex-shrink-0 rounded-lg bg-muted p-4">
            Item {i + 1}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
```

### Data Table with Scroll

Scrollable table with headers:

```tsx
import { ScrollArea } from "@/modules/cores/shadcn/components/ui/scroll-area"

export function ScrollableTableExample() {
  return (
    <ScrollArea className="h-80 w-full rounded-md border">
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-2 text-left">Column 1</th>
            <th className="p-2 text-left">Column 2</th>
            <th className="p-2 text-left">Column 3</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 20 }).map((_, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">Data {i + 1}</td>
              <td className="p-2">Value {i + 1}</td>
              <td className="p-2">Item {i + 1}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  )
}
```

## Styling

### Custom Scrollbar Styles

```tsx
// Hide scrollbar until hover
<ScrollArea className="hover:[&>div>div]:block">
  {/* content */}
</ScrollArea>

// Larger scrollbar
<ScrollBar className="w-4" />

// Custom colors
<ScrollBar className="bg-gradient-to-b from-blue-500 to-purple-500" />
```

## Best Practices

1. **Set container dimensions** - Always specify height/width on ScrollArea
2. **Use ScrollBar explicitly** - Declare ScrollBar for each needed direction
3. **Horizontal content** - Use `w-max` on flex containers for horizontal scroll
4. **Accessibility** - ScrollArea maintains keyboard navigation
5. **Performance** - Virtual scrolling for large lists (consider Virtualized library)
6. **Mobile** - Test horizontal scroll on touch devices

## Accessibility

The ScrollArea component:
- Maintains keyboard focus management
- Supports arrow key navigation
- Announces scroll state to screen readers
- Preserves semantic HTML structure
