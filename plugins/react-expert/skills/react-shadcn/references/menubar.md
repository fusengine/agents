---
name: menubar
description: Desktop application menu bar with keyboard shortcuts and nested menu items
when-to-use: Desktop-style application menus, menu bars with shortcuts, desktop app patterns, rich context menus
keywords: menubar, menu bar, application menu, keyboard shortcuts, file menu, edit menu
priority: medium
requires: installation.md
related: navigation-menu.md, dropdown.md, context-menu.md
---

# Menubar

Implements desktop application menu bars with keyboard shortcuts, proper menu hierarchy, and accessibility features. Built on Radix UI's Menu primitive.

## Installation

```bash
bunx --bun shadcn@latest add menubar
```

## Basic Menubar

```tsx
'use client'

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from '@/modules/cores/shadcn/components/ui/menubar'

export function BasicMenubar() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Open <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Exit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⌘⇧Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Cut <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Copy <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Paste <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>
            Show Sidebar
          </MenubarCheckboxItem>
          <MenubarCheckboxItem>
            Show Status Bar
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem>
            Zoom In <MenubarShortcut>⌘+</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Zoom Out <MenubarShortcut>⌘−</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Reset Zoom <MenubarShortcut>⌘0</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>About</MenubarItem>
          <MenubarItem>Documentation</MenubarItem>
          <MenubarItem>Report Issue</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
```

## Menubar with Submenus

```tsx
'use client'

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from '@/modules/cores/shadcn/components/ui/menubar'

export function MenubarWithSubmenus() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>New</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Document</MenubarItem>
              <MenubarItem>Folder</MenubarItem>
              <MenubarItem>Project</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>

          <MenubarSub>
            <MenubarSubTrigger>Open Recent</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Project A</MenubarItem>
              <MenubarItem>Project B</MenubarItem>
              <MenubarItem>Project C</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Clear Recent</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>

          <MenubarSeparator />
          <MenubarItem>
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Save As <MenubarShortcut>⌘⇧S</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Exit <MenubarShortcut>⌘Q</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Format</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Text</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>
                Bold <MenubarShortcut>⌘B</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Italic <MenubarShortcut>⌘I</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Underline <MenubarShortcut>⌘U</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Strikethrough <MenubarShortcut>⌘⇧X</MenubarShortcut>
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>

          <MenubarSub>
            <MenubarSubTrigger>Alignment</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Left</MenubarItem>
              <MenubarItem>Center</MenubarItem>
              <MenubarItem>Right</MenubarItem>
              <MenubarItem>Justify</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
```

## Menubar with Checkboxes and Radio Groups

```tsx
'use client'

import { useState } from 'react'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarShortcut,
} from '@/modules/cores/shadcn/components/ui/menubar'

export function MenubarWithCheckboxesAndRadios() {
  const [showSidebar, setShowSidebar] = useState(true)
  const [showStatusBar, setShowStatusBar] = useState(true)
  const [theme, setTheme] = useState('light')

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem
            checked={showSidebar}
            onCheckedChange={setShowSidebar}
          >
            Show Sidebar
          </MenubarCheckboxItem>
          <MenubarCheckboxItem
            checked={showStatusBar}
            onCheckedChange={setShowStatusBar}
          >
            Show Status Bar
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem>
            Fullscreen <MenubarShortcut>⌘⇧F</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Preferences</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Settings</MenubarItem>
          <MenubarSeparator />
          <MenubarRadioGroup value={theme} onValueChange={setTheme}>
            <MenubarRadioItem value="light">Light</MenubarRadioItem>
            <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
            <MenubarRadioItem value="auto">Auto</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
```

## Complete Application Menubar

```tsx
'use client'

import { useState } from 'react'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from '@/modules/cores/shadcn/components/ui/menubar'

export function ApplicationMenubar() {
  const [showGrid, setShowGrid] = useState(false)
  const [showRulers, setShowRulers] = useState(true)
  const [zoom, setZoom] = useState(100)

  return (
    <div className="border-b">
      <Menubar className="rounded-none border-b border-r-0 px-2 lg:px-4">
        {/* File Menu */}
        <MenubarMenu>
          <MenubarTrigger className="font-medium">File</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>New</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Project</MenubarItem>
                <MenubarItem>Document</MenubarItem>
                <MenubarItem>Design</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarItem>
              Open <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Open Recent <MenubarShortcut>⌘⇧O</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Save <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Save As <MenubarShortcut>⌘⇧S</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Export <MenubarShortcut>⌘E</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Exit <MenubarShortcut>⌘Q</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Edit Menu */}
        <MenubarMenu>
          <MenubarTrigger className="font-medium">Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Redo <MenubarShortcut>⌘⇧Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Cut <MenubarShortcut>⌘X</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Copy <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Paste <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Select All <MenubarShortcut>⌘A</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* View Menu */}
        <MenubarMenu>
          <MenubarTrigger className="font-medium">View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem
              checked={showGrid}
              onCheckedChange={setShowGrid}
            >
              Show Grid
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={showRulers}
              onCheckedChange={setShowRulers}
            >
              Show Rulers
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Zoom</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem onClick={() => setZoom(50)}>
                  50% {zoom === 50 && '✓'}
                </MenubarItem>
                <MenubarItem onClick={() => setZoom(75)}>
                  75% {zoom === 75 && '✓'}
                </MenubarItem>
                <MenubarItem onClick={() => setZoom(100)}>
                  100% {zoom === 100 && '✓'}
                </MenubarItem>
                <MenubarItem onClick={() => setZoom(150)}>
                  150% {zoom === 150 && '✓'}
                </MenubarItem>
                <MenubarItem onClick={() => setZoom(200)}>
                  200% {zoom === 200 && '✓'}
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  Zoom to Fit <MenubarShortcut>⌘1</MenubarShortcut>
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>
              Full Screen <MenubarShortcut>F11</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Tools Menu */}
        <MenubarMenu>
          <MenubarTrigger className="font-medium">Tools</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Color Picker</MenubarItem>
            <MenubarItem>Typography</MenubarItem>
            <MenubarItem>Spacing Guide</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Preferences <MenubarShortcut>⌘,</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Help Menu */}
        <MenubarMenu>
          <MenubarTrigger className="font-medium">Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Getting Started</MenubarItem>
            <MenubarItem>Documentation</MenubarItem>
            <MenubarItem>Keyboard Shortcuts</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>About</MenubarItem>
            <MenubarItem>Check for Updates</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}
```

## Key Components

| Component | Purpose |
|-----------|---------|
| `Menubar` | Root container for all menus |
| `MenubarMenu` | Container for each menu group |
| `MenubarTrigger` | Button to open menu dropdown |
| `MenubarContent` | Container for menu items |
| `MenubarItem` | Individual menu action |
| `MenubarCheckboxItem` | Toggleable menu item with checkbox |
| `MenubarRadioGroup` | Radio button group in menu |
| `MenubarRadioItem` | Radio button option |
| `MenubarSub` | Submenu container |
| `MenubarSubTrigger` | Button to open submenu |
| `MenubarSubContent` | Container for submenu items |
| `MenubarSeparator` | Visual divider between items |
| `MenubarShortcut` | Display keyboard shortcut |

## Common Patterns

### Pattern: Standard Application Menu
- File (New, Open, Save, Exit)
- Edit (Undo, Redo, Cut, Copy, Paste)
- View (Show/hide panels, Zoom)
- Tools (Settings, Preferences)
- Help (Documentation, About)

### Pattern: Checkbox Items
- Toggle features on/off
- Show/hide panels or grids
- Display preferences
- Use with state management

### Pattern: Radio Groups
- Single selection from multiple options
- Theme selection (light/dark/auto)
- Layout modes
- Display options

### Pattern: Nested Submenus
- Group related actions
- Recent files/projects
- Font or color options
- Complex workflows

## Accessibility

- Built on Radix UI's Menu primitive
- Full keyboard navigation (arrow keys)
- Arrow keys move between menu items
- Enter/Space to activate items
- Escape to close menus
- Screen reader friendly
- ARIA labels automatically applied
- Focus indicators visible

## Best Practices

1. **Standard Order**: Follow File, Edit, View, Tools, Help pattern
2. **Keyboard Shortcuts**: Show shortcuts in MenubarShortcut
3. **Grouping**: Use MenubarSeparator to group related items
4. **Submenus**: Use for logical grouping (New > Document, Project)
5. **Checkbox Items**: For toggleable features
6. **Radio Groups**: For single-selection options
7. **Consistent Icons**: Match system conventions
8. **Mnemonics**: Use underlined access keys (standard practice)

## Styling Tips

- Use `font-medium` on triggers for emphasis
- Keep items consistent in height
- Use `text-sm` for shortcuts
- Apply `rounded-none` for desktop app look
- Use `px-2 lg:px-4` for responsive padding
- Add `border-b` for visual separation
