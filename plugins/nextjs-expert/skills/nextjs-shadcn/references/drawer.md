---
name: drawer
description: Animated slide-out panel for mobile and desktop
when-to-use: Mobile navigation, side panels, filters, modals on small screens
keywords: slide-out, bottom-sheet, side-panel, mobile-friendly, vaul
priority: medium
requires: button.md
related: dialog.md, popover.md
---

## Installation

```bash
bunx --bun shadcn@latest add drawer
```

## Basic Usage

```tsx
'use client'

import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/modules/cores/shadcn/components/ui/drawer'

export default function DrawerBasic() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>
            This is a drawer component
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          Your content goes here
        </div>
        <DrawerClose asChild>
          <Button>Close</Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  )
}
```

## Components

### Drawer
Root component wrapping trigger and content.

### DrawerTrigger
Element that opens the drawer.
- `asChild`: Render as child component

### DrawerContent
Animated panel container.

### DrawerHeader / DrawerFooter
Header and footer sections.

### DrawerTitle / DrawerDescription
Title and description elements.

### DrawerClose
Button or element that closes drawer.

## Mobile Navigation Drawer

```tsx
'use client'

import { Menu, X } from 'lucide-react'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/modules/cores/shadcn/components/ui/drawer'

const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
]

export default function MobileNavigation() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerClose asChild>
            <button className="absolute right-4 top-4">
              <X className="h-6 w-6" />
            </button>
          </DrawerClose>
        </DrawerHeader>
        <div className="space-y-2 p-4">
          {navigationItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-base hover:bg-muted rounded-md"
            >
              {item.label}
            </a>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
```

## Filter Drawer

```tsx
'use client'

import { Filter } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { Checkbox } from '@/modules/cores/shadcn/components/ui/checkbox'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/modules/cores/shadcn/components/ui/drawer'

const filterOptions = {
  price: ['Under $50', '$50-$100', '$100-$500', 'Over $500'],
  category: ['Electronics', 'Clothing', 'Books', 'Home'],
  rating: ['5 Stars', '4+ Stars', '3+ Stars', '2+ Stars'],
}

export default function FilterDrawer() {
  const [selected, setSelected] = useState<string[]>([])

  const handleToggle = (value: string) => {
    setSelected(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    )
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter Products</DrawerTitle>
          <DrawerDescription>
            Choose filters to narrow your results
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-6 max-h-96 overflow-y-auto">
          {Object.entries(filterOptions).map(([category, options]) => (
            <div key={category}>
              <h3 className="font-semibold text-sm mb-3 capitalize">
                {category}
              </h3>
              <div className="space-y-2">
                {options.map(option => (
                  <div key={option} className="flex items-center gap-2">
                    <Checkbox
                      id={option}
                      checked={selected.includes(option)}
                      onCheckedChange={() => handleToggle(option)}
                    />
                    <label
                      htmlFor={option}
                      className="text-sm cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <DrawerFooter>
          <Button onClick={() => setSelected([])}>Clear</Button>
          <DrawerClose asChild>
            <Button>Apply</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
```

## Nested Drawer Pattern

```tsx
'use client'

import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/modules/cores/shadcn/components/ui/drawer'

export default function NestedDrawers() {
  const [step, setStep] = React.useState(1)

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Start Process</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Multi-step Workflow</DrawerTitle>
          <DrawerDescription>
            Step {step} of 3
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4">
          {step === 1 && (
            <div>
              <h3 className="font-semibold">Step 1: Confirm Details</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Verify your information
              </p>
            </div>
          )}
          {step === 2 && (
            <div>
              <h3 className="font-semibold">Step 2: Review Terms</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Accept the terms and conditions
              </p>
            </div>
          )}
          {step === 3 && (
            <div>
              <h3 className="font-semibold">Step 3: Completion</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your submission is complete
              </p>
            </div>
          )}
        </div>

        <DrawerFooter>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          )}
          {step < 3 && (
            <Button onClick={() => setStep(step + 1)}>
              Next
            </Button>
          )}
          {step === 3 && (
            <DrawerClose asChild>
              <Button>Close</Button>
            </DrawerClose>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
```

## Settings Drawer

```tsx
'use client'

import { Settings } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { Toggle } from '@/modules/cores/shadcn/components/ui/toggle'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/modules/cores/shadcn/components/ui/drawer'

export default function SettingsDrawer() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>
            Manage your preferences
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Notifications
            </label>
            <Toggle
              pressed={notifications}
              onPressedChange={setNotifications}
            >
              {notifications ? 'On' : 'Off'}
            </Toggle>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Dark Mode
            </label>
            <Toggle
              pressed={darkMode}
              onPressedChange={setDarkMode}
            >
              {darkMode ? 'On' : 'Off'}
            </Toggle>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
```

## Bottom Sheet with Snap Points

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/modules/cores/shadcn/components/ui/drawer'

export default function SnapPointDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Open with Snap</Button>
      </DrawerTrigger>
      <DrawerContent className="px-4">
        <DrawerHeader>
          <DrawerTitle>Bottom Sheet</DrawerTitle>
        </DrawerHeader>
        <div className="space-y-4 pb-4">
          <p>
            This drawer starts at a specific height and can snap to different positions
          </p>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
```

## Best Practices

1. **Mobile-first**: Design for mobile, enhance on desktop
2. **Header required**: Always include DrawerHeader for context
3. **Close button**: Provide clear way to dismiss
4. **Gesture support**: Supports swipe to dismiss on mobile
5. **Content scrolling**: Long content is automatically scrollable
6. **Footer actions**: Put action buttons in DrawerFooter
