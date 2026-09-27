---
name: popover
description: Floating content container with trigger and positioning control
when-to-use: Form inputs in dropdowns, action menus, edit panels, profile dropdowns
keywords: dropdown, menu, floating-ui, positioning, anchor
priority: high
requires: button.md
related: tooltip.md, hover-card.md, context-menu.md
---

> **Base:** examples use **Base UI** (shadcn default since 2026-07); Radix delta in "Radix variant" below; React Aria: `PopoverTrigger` wraps `<Button>` + `<Popover>` (no `PopoverContent`), `placement`/`offset`, `isOpen`/`onOpenChange`. Sources: https://ui.shadcn.com/r/styles/base-nova/popover.json, https://ui.shadcn.com/r/styles/radix-nova/popover.json

## Installation

```bash
bunx --bun shadcn@latest add popover
```

## Basic Usage

```tsx
'use client'

import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/modules/cores/shadcn/components/ui/popover'

/** Popover with a Button trigger and structured header content. */
export default function PopoverBasic() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Open Popover
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Title</PopoverTitle>
          <PopoverDescription>Description text here.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}
```

## Components

### Popover
Root component that wraps trigger and content (`open`, `defaultOpen`, `onOpenChange`).

### PopoverTrigger
Button that opens/closes the popover.
- `render`: compose with your own element, e.g. `render={<Button variant="outline" />}`
- `openOnHover`: open on hover (Base UI "infotip" pattern)

### PopoverContent
Floating content container (Base UI `Positioner` + `Popup`, portalled).
- `side`: "top" | "bottom" | "left" | "right" (default "bottom")
- `align`: "start" | "center" | "end" (default "center")
- `sideOffset`: Distance from trigger (default: 4)
- `alignOffset`: Alignment offset in pixels (default: 0)

### PopoverHeader / PopoverTitle / PopoverDescription
Structured content inside `PopoverContent`.

## Form in Popover Pattern

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { Input } from '@/modules/cores/shadcn/components/ui/input'
import { Label } from '@/modules/cores/shadcn/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/cores/shadcn/components/ui/popover'

/** Controlled popover hosting a small edit form, closed on save. */
export default function PopoverForm() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="outline" />}>
        Edit Profile
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Edit profile</h4>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" />
          </div>
          <Button
            onClick={() => setOpen(false)}
            className="w-full"
          >
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

## Positioning Options

```tsx
/** One popover per `side` value. */
export default function PopoverPositioning() {
  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger render={<Button />}>Top</PopoverTrigger>
        <PopoverContent side="top">Content</PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button />}>Right</PopoverTrigger>
        <PopoverContent side="right">Content</PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button />}>Bottom</PopoverTrigger>
        <PopoverContent side="bottom">Content</PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button />}>Left</PopoverTrigger>
        <PopoverContent side="left">Content</PopoverContent>
      </Popover>
    </div>
  )
}
```

## Controlled State

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/cores/shadcn/components/ui/popover'

/** Popover whose open state is owned by the parent. */
export default function PopoverControlled() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button />}>
        {open ? 'Close' : 'Open'} Popover
      </PopoverTrigger>
      <PopoverContent>
        <Button
          variant="outline"
          onClick={() => setOpen(false)}
        >
          Close from content
        </Button>
      </PopoverContent>
    </Popover>
  )
}
```

## Share Actions Popover

```tsx
'use client'

import { Share2 } from 'lucide-react'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/cores/shadcn/components/ui/popover'

/** Icon button opening share actions for `url`. */
const ShareButton = ({ url, title }: { url: string; title: string }) => {
  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="ghost" size="icon" aria-label={`Share ${title}`} />}
      >
        <Share2 className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Share</h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(url)
              }}
            >
              Copy Link
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ShareButton
```

## Popover Offset

```tsx
<Popover>
  <PopoverTrigger render={<Button />}>Spaced Popover</PopoverTrigger>
  <PopoverContent sideOffset={12} alignOffset={-4}>
    Content with custom spacing
  </PopoverContent>
</Popover>
```

## Radix variant

Only the trigger changes; `PopoverContent` takes `align`/`sideOffset` (and `side`/`alignOffset`
through Radix `Content` props). Radix also exports `PopoverAnchor`.

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>Place your content here.</PopoverContent>
</Popover>
```

## Best Practices

1. **Compose the trigger with Button**: `render={<Button />}` (Radix: see Radix variant) — never nest a `<Button>` inside the trigger
2. **Set width on PopoverContent**: Use `className="w-80"` for consistency
3. **Close on action**: Set `open={false}` when user confirms
4. **Accessible labels**: Use `Label` component for form inputs, `aria-label` on icon triggers
5. **Responsive positioning**: Use `align="start"` on mobile
