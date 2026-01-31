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

export function BasicDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Delete</DropdownMenuItem>
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

export function DropdownWithIcons() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Dropdown with Grouped Items

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

export function DropdownWithGroups() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Profile</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
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

export function NestedDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Share</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Share2 className="mr-2 h-4 w-4" />
            Share via
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="mr-2 h-4 w-4" />
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/modules/cores/shadcn/components/ui/dropdown-menu'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

export function DropdownWithCheckboxes() {
  const [showNotifications, setShowNotifications] = useState(true)
  const [showEmails, setShowEmails] = useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Settings</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showNotifications}
          onCheckedChange={setShowNotifications}
        >
          Push Notifications
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showEmails}
          onCheckedChange={setShowEmails}
        >
          Email Updates
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Positioning and Alignment

```tsx
<DropdownMenuContent
  align="start" // left, center, or end (default: end)
  side="bottom" // top, right, bottom, or left (default: bottom)
  sideOffset={8} // distance from trigger
>
  {/* items */}
</DropdownMenuContent>
```

## Key Props

| Prop | Type | Description |
|------|------|-------------|
| `align` | `'start' \| 'center' \| 'end'` | Horizontal alignment relative to trigger |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | Menu position relative to trigger |
| `sideOffset` | `number` | Distance between menu and trigger |
| `asChild` | `boolean` | Render trigger as child component |
| `disabled` | `boolean` | Disable menu item |
| `inset` | `boolean` | Indent menu item (for sub-items) |

## Best Practices

1. **Icon Usage**: Use lucide-react icons consistently (16x16 size)
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
