---
name: command
description: Command palette and searchable command menu with keyboard shortcut support
when-to-use: Command palette, quick search, global shortcuts (Cmd+K), command execution interface
keywords: command palette, search menu, cmdk, keyboard shortcuts, quick actions
priority: medium
requires: installation.md
related: dropdown.md, dialog.md
---

# Command

Command menu provides a searchable interface for executing commands with keyboard shortcuts.

## Basic Command Menu

```tsx
'use client'

import { useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/modules/cores/shadcn/components/ui/command'

export function BasicCommand() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)}>
        Open Command Menu (Cmd+K)
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => setOpen(false)}>
              Calendar
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              Search Emoji
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              Calculator
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
```

## Command Palette with Keyboard Shortcut

```tsx
'use client'

import { useEffect, useState } from 'react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/modules/cores/shadcn/components/ui/command'

export function CommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search commands..." />
      <CommandList>
        <CommandEmpty>No commands found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => setOpen(false)}>
            Create New Project
          </CommandItem>
          <CommandItem onSelect={() => setOpen(false)}>
            Open Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

## Command Menu with Icons and Groups

```tsx
'use client'

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/modules/cores/shadcn/components/ui/command'
import {
  FileText,
  Settings,
  LogOut,
  Bell,
  Plus,
  Search,
} from 'lucide-react'

export function CommandWithIcons() {
  return (
    <Command>
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Search className="mr-2 h-4 w-4" />
            Search
          </CommandItem>
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            New Document
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Account">
          <CommandItem>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </CommandItem>
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </CommandItem>
          <CommandItem>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
```

## Command with Action Callbacks

```tsx
'use client'

import { useState } from 'react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/modules/cores/shadcn/components/ui/command'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { useRouter } from 'next/navigation'

interface Command {
  id: string
  label: string
  description: string
  action: () => void
  group: string
}

export function ActionCommand() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const commands: Command[] = [
    {
      id: '1',
      label: 'Go to Dashboard',
      description: 'Navigate to dashboard',
      group: 'Navigation',
      action: () => router.push('/dashboard'),
    },
    {
      id: '2',
      label: 'Go to Settings',
      description: 'Navigate to settings',
      group: 'Navigation',
      action: () => router.push('/settings'),
    },
    {
      id: '3',
      label: 'Create Project',
      description: 'Start a new project',
      group: 'Actions',
      action: () => {
        setOpen(false)
        // Handle create project
      },
    },
  ]

  const handleSelect = (command: Command) => {
    command.action()
    setOpen(false)
  }

  const groups = Array.from(new Set(commands.map((c) => c.group)))

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Commands
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search commands..." />
        <CommandList>
          <CommandEmpty>No commands found.</CommandEmpty>
          {groups.map((group) => (
            <CommandGroup key={group} heading={group}>
              {commands
                .filter((cmd) => cmd.group === group)
                .map((command) => (
                  <CommandItem
                    key={command.id}
                    onSelect={() => handleSelect(command)}
                  >
                    <div className="flex flex-col">
                      <span>{command.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {command.description}
                      </span>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
```

## Command Combobox Pattern

```tsx
'use client'

import { useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/modules/cores/shadcn/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/cores/shadcn/components/ui/popover'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '@/modules/cores/lib/utils'

interface Option {
  value: string
  label: string
}

const OPTIONS: Option[] = [
  { value: 'next', label: 'React' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'astro', label: 'Astro' },
  { value: 'nuxt', label: 'Nuxt.js' },
]

export function CommandCombobox() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? OPTIONS.find((option) => option.value === value)?.label
            : 'Select framework...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search frameworks..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {OPTIONS.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

## Keyboard Shortcuts Display

```tsx
'use client'

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from '@/modules/cores/shadcn/components/ui/command'
import { useState } from 'react'

interface CommandWithShortcut {
  id: string
  label: string
  shortcut: string
  action: () => void
}

const COMMANDS: CommandWithShortcut[] = [
  {
    id: '1',
    label: 'New',
    shortcut: 'Cmd+N',
    action: () => console.log('new'),
  },
  {
    id: '2',
    label: 'Open',
    shortcut: 'Cmd+O',
    action: () => console.log('open'),
  },
  {
    id: '3',
    label: 'Save',
    shortcut: 'Cmd+S',
    action: () => console.log('save'),
  },
]

export function CommandWithShortcuts() {
  const [open, setOpen] = useState(false)

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search commands..." />
      <CommandList>
        <CommandGroup heading="Commands">
          {COMMANDS.map((command) => (
            <CommandItem
              key={command.id}
              onSelect={() => {
                command.action()
                setOpen(false)
              }}
              className="flex justify-between"
            >
              <span>{command.label}</span>
              <span className="text-xs text-muted-foreground">
                {command.shortcut}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

## Key Components

| Component | Purpose |
|-----------|---------|
| `Command` | Root container |
| `CommandDialog` | Modal wrapper for command palette |
| `CommandInput` | Search input field |
| `CommandList` | Scrollable container for items |
| `CommandEmpty` | Shown when no results match |
| `CommandGroup` | Groups related commands with heading |
| `CommandItem` | Individual command entry |
| `CommandSeparator` | Visual divider between groups |

## Common Patterns

### Pattern: Global Command Palette
- Listen for Cmd+K / Ctrl+K globally
- Open CommandDialog on keyboard event
- Group commands by category (Actions, Navigation, Settings)

### Pattern: Search Integration
- Use CommandInput to filter items
- Implement fuzzy search with cmdk library
- Show relevant descriptions

### Pattern: Action Execution
- Trigger `onSelect` callbacks
- Close dialog after action
- Provide feedback (toast, navigation)

## Accessibility

- Arrow keys to navigate items
- Enter to select
- Escape to close
- Tab support with proper focus management
- Screen reader announcements for groups

## cmdk Library Integration

The Command component is built on top of `cmdk` library, which provides:

- Fast, unstyled command menu primitive
- Keyboard navigation out of the box
- Filtering and search
- Group management
- Accessibility features

Install: `npm install cmdk`
