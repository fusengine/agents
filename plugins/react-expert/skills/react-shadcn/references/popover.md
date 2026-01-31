---
name: popover
description: Floating content container with trigger and positioning control
when-to-use: Form inputs in dropdowns, action menus, edit panels, profile dropdowns
keywords: dropdown, menu, floating-ui, positioning, anchor
priority: high
requires: button.md
related: tooltip.md, hover-card.md, context-menu.md
---

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
  PopoverTrigger,
} from '@/modules/cores/shadcn/components/ui/popover'

export default function PopoverBasic() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        Place your content here.
      </PopoverContent>
    </Popover>
  )
}
```

## Components

### Popover
Root component that wraps trigger and content.

### PopoverTrigger
Button or element that opens/closes the popover.
- `asChild`: Render as child component (recommended for Button)

### PopoverContent
Floating content container.
- `side`: "top" | "bottom" | "left" | "right"
- `align`: "start" | "center" | "end"
- `sideOffset`: Distance from trigger (default: 4)
- `alignOffset`: Alignment offset in pixels

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

export default function PopoverForm() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
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
export default function PopoverPositioning() {
  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button>Top</Button>
        </PopoverTrigger>
        <PopoverContent side="top">Content</PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button>Right</Button>
        </PopoverTrigger>
        <PopoverContent side="right">Content</PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button>Bottom</Button>
        </PopoverTrigger>
        <PopoverContent side="bottom">Content</PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button>Left</Button>
        </PopoverTrigger>
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

export default function PopoverControlled() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>
          {open ? 'Close' : 'Open'} Popover
        </Button>
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

const ShareButton = ({ url, title }: { url: string; title: string }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
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
  <PopoverTrigger asChild>
    <Button>Spaced Popover</Button>
  </PopoverTrigger>
  <PopoverContent sideOffset={12} alignOffset={-4}>
    Content with custom spacing
  </PopoverContent>
</Popover>
```

## Best Practices

1. **Use `asChild` with Button**: Prevents double buttons wrapping
2. **Set width on PopoverContent**: Use `className="w-80"` for consistency
3. **Close on action**: Set `open={false}` when user confirms
4. **Accessible labels**: Use `Label` component for form inputs
5. **Responsive positioning**: Use `align="start"` on mobile
