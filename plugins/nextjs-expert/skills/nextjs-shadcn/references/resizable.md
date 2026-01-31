---
name: resizable
description: Draggable resize handles for creating resizable panel layouts
when-to-use: Use when you need split-pane layouts, adjustable panel widths, or flexible dashboard layouts. Supports horizontal and vertical resizing with collapsible panels.
keywords: resize, split pane, draggable, panel layout, flexible layout
priority: low
requires: null
related: scroll-area.md
---

# Resizable Component

The Resizable component provides drag-to-resize functionality for creating flexible panel layouts. Built on top of react-resizable-panels library, it enables split-pane interfaces.

## Installation

Install the Resizable component using the shadcn/ui CLI:

```bash
bunx --bun shadcn@latest add resizable
```

## Basic Usage

### Horizontal Resizable Layout

Create a basic three-panel horizontal layout:

```tsx
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/modules/cores/shadcn/components/ui/resizable"

export function HorizontalResizableExample() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[200px] max-w-md rounded-lg border"
    >
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          One
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center p-6">
          Two
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          Three
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
```

### Vertical Resizable Layout

Stack panels vertically with resize handles:

```tsx
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/modules/cores/shadcn/components/ui/resizable"

export function VerticalResizableExample() {
  return (
    <ResizablePanelGroup
      direction="vertical"
      className="min-h-[200px] max-w-md rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          Header
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          Content
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
```

## Components

### ResizablePanelGroup

Container for resizable panels.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `"horizontal" \| "vertical"` | - | Layout direction |
| `className` | `string` | - | Container CSS classes |
| `autoSave` | `boolean` | - | Auto-save panel sizes to localStorage |
| `id` | `string` | - | Unique ID for auto-saving state |

### ResizablePanel

Individual panel within the group.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultSize` | `number` | - | Initial size percentage (0-100) |
| `minSize` | `number` | - | Minimum size percentage |
| `maxSize` | `number` | - | Maximum size percentage |
| `collapsible` | `boolean` | `false` | Allow collapsing panel |
| `collapsedSize` | `number` | - | Size when collapsed |
| `onResize` | `(size: number) => void` | - | Callback on resize |

### ResizableHandle

Draggable divider between panels.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `withHandle` | `boolean` | `false` | Show visual handle indicator |
| `className` | `string` | - | Handle CSS classes |

## Advanced Patterns

### Sidebar Layout with Visible Handle

Create a sidebar with a draggable handle:

```tsx
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/modules/cores/shadcn/components/ui/resizable"

export function SidebarLayoutExample() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen w-full rounded-lg border"
    >
      <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
        <div className="flex flex-col h-full p-4">
          <h2 className="font-bold mb-4">Sidebar</h2>
          <nav className="space-y-2 flex-1">
            <div className="px-3 py-2 rounded hover:bg-muted">Dashboard</div>
            <div className="px-3 py-2 rounded hover:bg-muted">Settings</div>
            <div className="px-3 py-2 rounded hover:bg-muted">Profile</div>
          </nav>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={80}>
        <div className="flex items-center justify-center h-full p-6">
          Main Content Area
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
```

### Multi-Panel Dashboard

Create a complex dashboard with multiple resize sections:

```tsx
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/modules/cores/shadcn/components/ui/resizable"

export function DashboardLayoutExample() {
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full min-h-screen border">
      {/* Left Sidebar */}
      <ResizablePanel defaultSize={20} minSize={15}>
        <div className="p-4 border-r">
          <h3 className="font-bold mb-4">Navigation</h3>
          <div className="space-y-2">
            <div>Menu Item 1</div>
            <div>Menu Item 2</div>
            <div>Menu Item 3</div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />

      {/* Main Content Area */}
      <ResizablePanel defaultSize={80}>
        <ResizablePanelGroup direction="vertical">
          {/* Header Section */}
          <ResizablePanel defaultSize={30} minSize={20}>
            <div className="p-4 border-b flex items-center justify-center">
              <h2 className="font-bold text-lg">Header</h2>
            </div>
          </ResizablePanel>
          <ResizableHandle />

          {/* Content Section */}
          <ResizablePanel defaultSize={70}>
            <div className="p-4 flex items-center justify-center">
              <div>Main Content Area</div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
```

### Collapsible Sidebar

Create a collapsible sidebar panel:

```tsx
"use client"

import { useState } from "react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/modules/cores/shadcn/components/ui/resizable"
import { Button } from "@/modules/cores/shadcn/components/ui/button"

export function CollapsibleSidebarExample() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <ResizablePanelGroup direction="horizontal" className="w-full min-h-screen">
      <ResizablePanel
        defaultSize={20}
        minSize={0}
        maxSize={30}
        collapsible
        onResize={(size) => setIsCollapsed(size < 5)}
      >
        {!isCollapsed && (
          <div className="p-4 space-y-4">
            <h3 className="font-bold">Sidebar</h3>
            <nav className="space-y-2">
              <div className="p-2 rounded hover:bg-muted cursor-pointer">Item 1</div>
              <div className="p-2 rounded hover:bg-muted cursor-pointer">Item 2</div>
              <div className="p-2 rounded hover:bg-muted cursor-pointer">Item 3</div>
            </nav>
          </div>
        )}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={80}>
        <div className="p-6">
          <Button onClick={() => setIsCollapsed(!isCollapsed)}>
            Toggle Sidebar
          </Button>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
```

### Horizontal Split with Min/Max

Define constraints on panel sizes:

```tsx
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/modules/cores/shadcn/components/ui/resizable"

export function ConstrainedResizableExample() {
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full h-96 border rounded-lg">
      <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="font-semibold">Left Panel</p>
            <p className="text-sm text-muted-foreground">20% - 50%</p>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70} minSize={50} maxSize={80}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="font-semibold">Right Panel</p>
            <p className="text-sm text-muted-foreground">50% - 80%</p>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
```

## State Management

### Auto-Save Panel Sizes

Persist panel sizes to localStorage:

```tsx
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/modules/cores/shadcn/components/ui/resizable"

export function PersistentResizableExample() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full min-h-screen"
      id="dashboard-layout"
      autoSave={true}
    >
      <ResizablePanel defaultSize={20}>
        <div className="p-4">Sidebar (auto-saved)</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={80}>
        <div className="p-4">Main Content (size persisted)</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
```

## Best Practices

1. **Set min/max sizes** - Prevent panels from becoming too small
2. **Use IDs for persistence** - Enable auto-save with unique IDs
3. **Responsive defaults** - Use sensible defaultSize values
4. **Nested groups** - Combine horizontal and vertical for complex layouts
5. **Visual handles** - Use `withHandle` for better UX
6. **Keyboard support** - ResizableHandle supports keyboard navigation

## Accessibility

- Keyboard navigation via arrow keys
- Focus management for resize handles
- Semantic ARIA labels supported
- Respects `prefers-reduced-motion`
