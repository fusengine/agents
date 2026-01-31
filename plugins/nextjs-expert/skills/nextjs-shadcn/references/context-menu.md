---
name: context-menu
description: Right-click menu with keyboard support
when-to-use: Right-click actions, file operations, table row actions, element commands
keywords: right-click, context, menu, keyboard, actions
priority: medium
requires: button.md
related: dropdown-menu.md, popover.md
---

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
Root component wrapping trigger and content.

### ContextMenuTrigger
Element that shows menu on right-click.

### ContextMenuContent
Menu container with items.

### ContextMenuItem
Menu action item.
- `inset`: Add left padding for icons
- `disabled`: Disable the item

### ContextMenuSeparator
Visual divider between groups.

### ContextMenuLabel
Non-interactive label for grouping items.

### ContextMenuCheckboxItem
Item with checkbox state.

### ContextMenuRadioGroup / ContextMenuRadioItem
Radio button group items.

### ContextMenuSub
Submenu with nested items.

## File Context Menu Pattern

```tsx
'use client'

import { Trash2, Copy, Edit, Download, Share2 } from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
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
        <ContextMenuLabel>{file.name}</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem inset onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </ContextMenuItem>
        <ContextMenuItem inset>
          <Edit className="mr-2 h-4 w-4" />
          Rename
        </ContextMenuItem>
        <ContextMenuItem inset disabled={file.type === 'folder'}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </ContextMenuItem>
        <ContextMenuItem inset>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset className="text-red-500">
          <Trash2 className="mr-2 h-4 w-4" />
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

const TableRowMenu = ({ row }: { row: TableRow }) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <tr className="border-b hover:bg-muted/50 cursor-context-menu">
          <td className="p-4">{row.id}</td>
          <td className="p-4">{row.name}</td>
          <td className="p-4">
            <span className={row.status === 'active' ? 'text-green-500' : 'text-gray-500'}>
              {row.status}
            </span>
          </td>
        </tr>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem inset>
          <Eye className="mr-2 h-4 w-4" />
          View
        </ContextMenuItem>
        <ContextMenuItem inset>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </ContextMenuItem>
        <ContextMenuItem inset onClick={() => navigator.clipboard.writeText(row.id)}>
          <Copy className="mr-2 h-4 w-4" />
          Copy ID
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset className="text-red-500">
          <Trash2 className="mr-2 h-4 w-4" />
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
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/modules/cores/shadcn/components/ui/context-menu'

export default function ContextMenuWithSubmenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-40 w-40 items-center justify-center rounded-md border border-dashed">
        Right-click for menu
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuLabel>Share</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>
            <Share2 className="mr-2 h-4 w-4" />
            Share Link
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>
              <Link className="mr-2 h-4 w-4" />
              Copy Link
            </ContextMenuItem>
            <ContextMenuItem>
              Copy Email Link
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem inset>
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

## Checkbox Items

```tsx
'use client'

import { useState } from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuCheckboxItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/modules/cores/shadcn/components/ui/context-menu'

export default function ContextMenuCheckbox() {
  const [showNotifications, setShowNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-40 w-40 items-center justify-center rounded-md border">
        Right-click
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Settings</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem
          checked={showNotifications}
          onCheckedChange={setShowNotifications}
        >
          Show Notifications
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={darkMode}
          onCheckedChange={setDarkMode}
        >
          Dark Mode
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

## Radio Items

```tsx
'use client'

import { useState } from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/modules/cores/shadcn/components/ui/context-menu'

export default function ContextMenuRadio() {
  const [zoom, setZoom] = useState('100')

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-40 w-40 items-center justify-center rounded-md border">
        Right-click
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Zoom</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value={zoom} onValueChange={setZoom}>
          <ContextMenuRadioItem value="75">75%</ContextMenuRadioItem>
          <ContextMenuRadioItem value="100">100%</ContextMenuRadioItem>
          <ContextMenuRadioItem value="150">150%</ContextMenuRadioItem>
          <ContextMenuRadioItem value="200">200%</ContextMenuRadioItem>
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
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/modules/cores/shadcn/components/ui/context-menu'

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
        <ContextMenuLabel>Image</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem inset>
          <Copy className="mr-2 h-4 w-4" />
          Copy Image
        </ContextMenuItem>
        <ContextMenuItem inset>
          <Download className="mr-2 h-4 w-4" />
          Download Image
        </ContextMenuItem>
        <ContextMenuItem inset>
          <Share2 className="mr-2 h-4 w-4" />
          Share Image
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset className="text-red-500">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Image
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

## Best Practices

1. **Keyboard accessible**: Use Tab and Enter to navigate
2. **Icon with inset**: Always use `inset` prop with icons
3. **Destructive last**: Put delete actions at bottom
4. **Contextual items**: Show only relevant actions
5. **Disabled state**: Disable actions that don't apply
6. **Feedback**: Visual indication after action taken
