---
name: tooltip
description: Lightweight contextual hint displayed on hover
when-to-use: Help text, icon hints, abbreviation explanations, keyboard shortcuts
keywords: hint, help, popover, floating-ui, hover-trigger
priority: high
requires: button.md
related: popover.md, hover-card.md
---

> **Base:** examples use **Base UI** (shadcn default since 2026-07); Radix delta in "Radix variant" below; React Aria: no provider — `<TooltipTrigger><Button /><Tooltip>…</Tooltip></TooltipTrigger>` (`Tooltip` is the content), `placement`/`offset` (`shadcn docs tooltip --base aria`). Sources: https://ui.shadcn.com/r/styles/base-nova/tooltip.json, https://ui.shadcn.com/r/styles/radix-nova/tooltip.json

Mount one `TooltipProvider` at the app root (docs install step). To show a tooltip on a
disabled button, wrap the button in a `span`.

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

/** Tooltip on a Button trigger composed with `render`. */
export default function TooltipBasic() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Hover me
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
Wraps your entire app or section; shares delays between tooltips.
- `delay`: Hover delay in ms (shadcn wrapper default: 0)
- `closeDelay`: Delay before closing in ms
- `timeout`: Window in which the next tooltip opens instantly (default: 400)

### Tooltip
Container for trigger and content (`open`, `defaultOpen`, `onOpenChange`).

### TooltipTrigger
Element that shows the tooltip on hover/focus (renders a `<button>` by default).
- `render`: compose with your own element, e.g. `render={<Button variant="ghost" />}`
- `delay` / `closeDelay`: per-trigger override (Base UI default 600 / 0 without provider)

### TooltipContent
Floating hint text (Base UI `Positioner` + `Popup`, portalled).
- `side`: "top" | "bottom" | "left" | "right" (default "top")
- `align`: "start" | "center" | "end"
- `sideOffset`: Distance from trigger (default: 4)
- `alignOffset`: Alignment offset (default: 0)

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

/** Icon-only triggers labelled with `aria-label`. */
export default function IconTooltips() {
  return (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger aria-label="Field information" className="cursor-help">
            <Info className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>
            Information about this field
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger aria-label="Warning" className="cursor-help">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </TooltipTrigger>
          <TooltipContent>
            Warning: This action cannot be undone
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger aria-label="Help" className="cursor-help">
            <HelpCircle className="h-4 w-4" />
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

/** Provider-level delay with a per-trigger override. */
export default function TooltipDelays() {
  return (
    <TooltipProvider delay={100}>
      <div className="space-y-2">
        <Tooltip>
          <TooltipTrigger>Fast tooltip</TooltipTrigger>
          <TooltipContent>Shows after the provider delay (100ms)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger delay={500}>Slow tooltip</TooltipTrigger>
          <TooltipContent>Per-trigger override (500ms)</TooltipContent>
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

/** Tooltip with structured content (title, kbd, hint). */
export default function RichTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger aria-label="Command palette shortcut" className="cursor-help">
          <Code className="h-4 w-4" />
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
      <TooltipTrigger render={<Button variant="ghost" />}>
        {label}
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">Shortcut: {shortcut}</p>
      </TooltipContent>
    </Tooltip>
  )
}

/** Toolbar whose buttons show their keyboard shortcut. */
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

/** Root layout mounting the shared TooltipProvider once. */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
```

## Radix variant

Trigger composition and delay prop names change; `TooltipProvider` is **required** (Radix
throws without it), `TooltipContent` defaults to `sideOffset={0}`.

```tsx
<TooltipProvider delayDuration={100} skipDelayDuration={300}>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>This is helpful information</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

Per-tooltip delay is `<Tooltip delayDuration={500}>` (on the root, not the trigger).

## Best Practices

1. **Provider at app root**: Wrap entire app in `TooltipProvider`
2. **Short text**: Keep tooltips concise (1-2 sentences)
3. **Never critical info**: Tooltips hide on touch devices — use a Popover with `openOnHover` for infotips
4. **Use for hints**: Help text, not essential information
5. **Keyboard shortcuts**: Show common shortcuts in tooltips
6. **Accessible icons**: Always add `aria-label` to icon triggers
