---
name: context-menu
description: Right-click menu with keyboard support
when-to-use: Right-click actions, file operations, table row actions, element commands
keywords: right-click, context, menu, keyboard, actions
priority: medium
requires: button.md
related: dropdown-menu.md, popover.md
---

> **Base:** examples use **Base UI** (shadcn default since 2026-07); Radix delta in "Radix variant" below; React Aria: built on `MenuTrigger trigger="contextMenu"`, items take `isDisabled` — see `shadcn docs context-menu --base aria`. Sources: https://ui.shadcn.com/r/styles/base-nova/context-menu.json, https://ui.shadcn.com/r/styles/radix-nova/context-menu.json

## Installation

```bash
bunx --bun shadcn@latest add context-menu
```

## Basic Usage

```tsx
'use client'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/modules/cores/shadcn/components/ui/context-menu'

/** Minimal right-click menu on a dashed area. */
export default function ContextMenuBasic() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-40 w-40 items-center justify-center rounded-md border border-dashed text-sm">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuItem>Forward</ContextMenuItem>
        <ContextMenuItem>Reload</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

## Components

### ContextMenu
Root component wrapping trigger and content (Base UI `ContextMenu.Root`).

### ContextMenuTrigger
Element that shows menu on right-click. Use `render` to make another element the trigger.

### ContextMenuContent
Menu container with items (Portal + Positioner + Popup).

### ContextMenuItem
Menu action item (`onClick`).
- `inset`: Add left padding for icons
- `disabled`: Disable the item
- `variant="destructive"`: Destructive styling

### ContextMenuGroup / ContextMenuLabel
`ContextMenuLabel` is a Base UI `GroupLabel`: place it inside a `ContextMenuGroup`
(or a `ContextMenuRadioGroup`).

### ContextMenuSeparator
Visual divider between groups.

### ContextMenuCheckboxItem
Item with checkbox state (`checked`, `onCheckedChange(checked, eventDetails)`).

### ContextMenuRadioGroup / ContextMenuRadioItem
Radio button group items (`value`, `onValueChange(value, eventDetails)`).

### ContextMenuSub
Submenu with nested items (`ContextMenuSubTrigger`, `ContextMenuSubContent`).

## File Context Menu Pattern

```tsx
'use client'

import { Trash2, Copy, Edit, Download, Share2 } from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/modules/cores/shadcn/components/ui/context-menu'

interface FileItem {
  name: string
  id: string
  type: 'file' | 'folder'
}

/** File actions menu with a labelled group and a destructive item. */
const FileContextMenu = ({ file }: { file: FileItem }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(file.name)
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex items-center justify-center rounded-md border p-4 cursor-context-menu">
        {file.name}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuGroup>
          <ContextMenuLabel>{file.name}</ContextMenuLabel>
          <ContextMenuItem onClick={handleCopy}>
            <Copy />
            Copy
          </ContextMenuItem>
          <ContextMenuItem>
            <Edit />
            Rename
          </ContextMenuItem>
          <ContextMenuItem disabled={file.type === 'folder'}>
            <Download />
            Download
          </ContextMenuItem>
          <ContextMenuItem>
            <Share2 />
            Share
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <Trash2 />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default FileContextMenu
```

## Table Row Context Menu

```tsx
'use client'

import { Eye, Pencil, Copy, Trash2 } from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/modules/cores/shadcn/components/ui/context-menu'

interface TableRow {
  id: string
  name: string
  status: 'active' | 'inactive'
}

/** Uses the table row itself as the trigger via `render`. */
const TableRowMenu = ({ row }: { row: TableRow }) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={<tr className="border-b hover:bg-muted/50 cursor-context-menu" />}
      >
        <td className="p-4">{row.id}</td>
        <td className="p-4">{row.name}</td>
        <td className="p-4">
          <span className={row.status === 'active' ? 'text-green-500' : 'text-gray-500'}>
            {row.status}
          </span>
        </td>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Eye />
          View
        </ContextMenuItem>
        <ContextMenuItem>
          <Pencil />
          Edit
        </ContextMenuItem>
        <ContextMenuItem onClick={() => navigator.clipboard.writeText(row.id)}>
          <Copy />
          Copy ID
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <Trash2 />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default TableRowMenu
```

## Submenu Pattern

```tsx
'use client'

import { Copy, Link, Share2 } from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/modules/cores/shadcn/components/ui/context-menu'

/** Nested submenu for share actions. */
export default function ContextMenuWithSubmenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-40 w-40 items-center justify-center rounded-md border border-dashed">
        Right-click for menu
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Share2 />
            Share Link
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>
              <Link />
              Copy Link
            </ContextMenuItem>
            <ContextMenuItem>Copy Email Link</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Copy />
          Copy
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

## Checkbox and Radio Items

```tsx
'use client'

import { useState } from 'react'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/modules/cores/shadcn/components/ui/context-menu'

/** Checkbox settings plus a zoom radio group; labels live inside their group. */
export default function ContextMenuSettings() {
  const [showNotifications, setShowNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [zoom, setZoom] = useState('100')

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-40 w-40 items-center justify-center rounded-md border">
        Right-click
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>Settings</ContextMenuLabel>
          <ContextMenuCheckboxItem
            checked={showNotifications}
            onCheckedChange={setShowNotifications}
          >
            Show Notifications
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={darkMode} onCheckedChange={setDarkMode}>
            Dark Mode
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value={zoom} onValueChange={setZoom}>
          <ContextMenuLabel>Zoom</ContextMenuLabel>
          <ContextMenuRadioItem value="75">75%</ContextMenuRadioItem>
          <ContextMenuRadioItem value="100">100%</ContextMenuRadioItem>
          <ContextMenuRadioItem value="150">150%</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

## Image Context Menu

```tsx
'use client'

import { Download, Copy, Share2, Trash2 } from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/modules/cores/shadcn/components/ui/context-menu'

/** Right-click actions on an image. */
export default function ImageContextMenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <img
          src="https://via.placeholder.com/200"
          alt="Example"
          className="w-40 h-40 rounded cursor-context-menu"
        />
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem>
          <Copy />
          Copy Image
        </ContextMenuItem>
        <ContextMenuItem>
          <Download />
          Download Image
        </ContextMenuItem>
        <ContextMenuItem>
          <Share2 />
          Share Image
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <Trash2 />
          Delete Image
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

## Radix variant

`style` `radix-*`: same part names; a custom trigger element composes with `asChild`, and
`ContextMenuLabel` may sit directly in the content (no group required):

```tsx
<ContextMenuTrigger asChild>
  <tr className="border-b">{/* cells */}</tr>
</ContextMenuTrigger>
```

## Best Practices

1. **Keyboard accessible**: Arrow keys and Enter navigate items
2. **Icon with inset**: Use `inset` on icon-less items aligned with icon items
3. **Destructive last**: Put `variant="destructive"` actions at bottom
4. **Contextual items**: Show only relevant actions
5. **Disabled state**: Disable actions that don't apply
6. **Feedback**: Visual indication after action taken
