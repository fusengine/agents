---
name: tooltip
description: Lightweight contextual hint displayed on hover
when-to-use: Help text, icon hints, abbreviation explanations, keyboard shortcuts
keywords: hint, help, popover, floating-ui, hover-trigger
priority: high
requires: button.md
related: popover.md, hover-card.md
---

## Installation

```bash
bunx --bun shadcn@latest add tooltip
```

## Basic Usage

```tsx
'use client'

import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/modules/cores/shadcn/components/ui/tooltip'

export default function TooltipBasic() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This is helpful information</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

## Components

### TooltipProvider
Wraps your entire app or section. Sets default delays and options.
- `delayDuration`: Hover delay in milliseconds (default: 200)
- `skipDelayDuration`: Duration before delay applies again (default: 300)

### Tooltip
Container for trigger and content.

### TooltipTrigger
Element that shows tooltip on hover.
- `asChild`: Render as child component

### TooltipContent
Floating hint text.
- `side`: "top" | "bottom" | "left" | "right"
- `align`: "start" | "center" | "end"
- `sideOffset`: Distance from trigger

## Icon Tooltip Pattern

```tsx
'use client'

import { Info, AlertCircle, HelpCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/modules/cores/shadcn/components/ui/tooltip'

export default function IconTooltips() {
  return (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            Information about this field
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <AlertCircle className="h-4 w-4 cursor-help text-yellow-500" />
          </TooltipTrigger>
          <TooltipContent>
            Warning: This action cannot be undone
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-4 w-4 cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            Click here for more help
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
```

## Delay Configuration

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/modules/cores/shadcn/components/ui/tooltip'

export default function TooltipDelays() {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="space-y-2">
        <Tooltip>
          <TooltipTrigger>Fast tooltip</TooltipTrigger>
          <TooltipContent>Shows quickly on hover</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>Normal tooltip</TooltipTrigger>
          <TooltipContent>200ms delay (default)</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
```

## Rich Content Tooltip

```tsx
'use client'

import { Code } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/modules/cores/shadcn/components/ui/tooltip'

export default function RichTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Code className="h-4 w-4 cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">Keyboard Shortcut</p>
            <kbd className="rounded bg-muted px-2 py-1 text-xs">
              Ctrl + K
            </kbd>
            <p className="text-xs text-muted-foreground">
              Use this shortcut to open the command palette
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

## Keyboard Shortcut Tooltips

```tsx
'use client'

import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/modules/cores/shadcn/components/ui/tooltip'

const ActionButton = ({
  label,
  shortcut
}: {
  label: string
  shortcut: string
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost">{label}</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">Shortcut: {shortcut}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default function ToolbarWithTooltips() {
  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <ActionButton label="Save" shortcut="Ctrl+S" />
        <ActionButton label="Search" shortcut="Ctrl+F" />
        <ActionButton label="Undo" shortcut="Ctrl+Z" />
      </div>
    </TooltipProvider>
  )
}
```

## Positioning Variants

```tsx
<TooltipProvider>
  <div className="space-y-2">
    <Tooltip>
      <TooltipTrigger>Top</TooltipTrigger>
      <TooltipContent side="top">
        Tooltip on top
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger>Right</TooltipTrigger>
      <TooltipContent side="right">
        Tooltip on right
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger>Bottom</TooltipTrigger>
      <TooltipContent side="bottom">
        Tooltip on bottom
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger>Left</TooltipTrigger>
      <TooltipContent side="left">
        Tooltip on left
      </TooltipContent>
    </Tooltip>
  </div>
</TooltipProvider>
```

## Setup with Provider Wrapping

```tsx
// app/layout.tsx
import { TooltipProvider } from '@/modules/cores/shadcn/components/ui/tooltip'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TooltipProvider>
      {children}
    </TooltipProvider>
  )
}
```

## Best Practices

1. **Provider at app root**: Wrap entire app in `TooltipProvider`
2. **Short text**: Keep tooltips concise (1-2 sentences)
3. **Never critical info**: Tooltips hide on touch devices
4. **Use for hints**: Help text, not essential information
5. **Keyboard shortcuts**: Show common shortcuts in tooltips
6. **Accessible icons**: Always add aria-labels to icon triggers
