---
name: dropdown
description: Dropdown menu component with trigger, items, separators, and nested menus
when-to-use: User action menus, settings dropdowns, context menus, nested menu hierarchies
keywords: menu, select, dropdown-menu, action menu, context menu
priority: medium
requires: installation.md
related: sheet.md, breadcrumb.md
---

# Dropdown Menu

> **Base:** examples use **Base UI** (shadcn default since 2026-07) — wraps Base UI `Menu`; Radix delta in "Radix variant" below; React Aria: `<DropdownMenuTrigger>` wraps the `Button` **and** the `<DropdownMenu>` content, no `render`/`asChild`. Sources: https://ui.shadcn.com/r/styles/base-nova/dropdown-menu.json, https://ui.shadcn.com/r/styles/radix-nova/dropdown-menu.json

Dropdown menus provide a list of actions or navigation links that appear when triggered.

## Basic Dropdown

```tsx
'use client'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/modules/cores/shadcn/components/ui/dropdown-menu'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

/** Action menu with a destructive last item. */
export function BasicDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Actions</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => console.log('edit')}>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Dropdown with Icons

```tsx
'use client'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/modules/cores/shadcn/components/ui/dropdown-menu'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { MoreHorizontal, Edit, Copy, Trash2 } from 'lucide-react'

/** Icon-only trigger; item icons are sized by the wrapper. */
export function DropdownWithIcons() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label="More actions" />}
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Edit />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Dropdown with Grouped Items

`DropdownMenuLabel` is a Base UI `GroupLabel`: keep it inside a `DropdownMenuGroup`.

```tsx
'use client'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/modules/cores/shadcn/components/ui/dropdown-menu'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { Settings, LogOut, User } from 'lucide-react'

/** Account menu with a labelled group. */
export function DropdownWithGroups() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Profile</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            <User />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Nested Dropdown (Sub-Menu)

```tsx
'use client'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/modules/cores/shadcn/components/ui/dropdown-menu'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { Share2, Mail, MessageSquare } from 'lucide-react'

/** Share menu with a nested submenu. */
export function NestedDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Share</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Share2 />
            Share via
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <Mail />
              Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare />
              Message
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Copy link</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Dropdown with Checkboxes

```tsx
'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from '@/modules/cores/shadcn/components/ui/dropdown-menu'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

/** Checkbox items; `onCheckedChange(checked: boolean, eventDetails)`. */
export function DropdownWithCheckboxes() {
  const [showNotifications, setShowNotifications] = useState(true)
  const [showEmails, setShowEmails] = useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Settings</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={showNotifications}
            onCheckedChange={setShowNotifications}
          >
            Push Notifications
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showEmails} onCheckedChange={setShowEmails}>
            Email Updates
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Positioning and Alignment

```tsx
<DropdownMenuContent
  align="start" // start, center, or end (default: start)
  side="bottom" // top, right, bottom, or left (default: bottom)
  sideOffset={8} // distance from trigger (default: 4)
>
  {/* items */}
</DropdownMenuContent>
```

## Key Props

| Prop | Type | Description |
|------|------|-------------|
| `align` / `alignOffset` | `'start' \| 'center' \| 'end'` / `number` | Alignment relative to trigger (Positioner) |
| `side` / `sideOffset` | `'top' \| 'right' \| 'bottom' \| 'left'` / `number` | Menu position relative to trigger |
| `render` | `ReactElement` | Trigger/item rendered as another element |
| `variant` | `'default' \| 'destructive'` | Item style |
| `disabled` | `boolean` | Disable menu item |
| `inset` | `boolean` | Indent menu item (for sub-items) |

## Radix variant

`style` `radix-*`: same parts and props; the trigger composes with `asChild`, and
`DropdownMenuLabel` may sit directly in the content:

```tsx
<DropdownMenuTrigger asChild>
  <Button variant="outline">Actions</Button>
</DropdownMenuTrigger>
// Items: onSelect (Radix) as well as onClick
```

## Best Practices

1. **Icon Usage**: Use lucide-react icons consistently (the wrapper sizes them)
2. **Grouping**: Use `DropdownMenuGroup` and `DropdownMenuLabel` for organization
3. **Separators**: Use `DropdownMenuSeparator` to visually group related items
4. **Nesting**: Keep nesting to 2 levels maximum for usability
5. **Keyboard Navigation**: Items are keyboard-accessible out of the box
6. **Mobile**: Consider touch targets are minimum 44x44px

## Accessibility

- Keyboard navigation with arrow keys
- Enter/Space to select items
- Escape to close menu
- Focus management automatic
