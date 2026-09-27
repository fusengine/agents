---
name: drawer
description: Animated slide-out panel for mobile and desktop
when-to-use: Mobile navigation, side panels, filters, modals on small screens
keywords: slide-out, bottom-sheet, side-panel, mobile-friendly, vaul
priority: medium
requires: button.md
related: dialog.md, popover.md
---

> **Base:** examples use **Base UI** (shadcn default since 2026-07) — Base UI `Drawer`, dependency `@base-ui/react`, no Vaul (React Aria projects ship the same Base UI drawer). Radix projects use a **Vaul** drawer — delta in "Radix variant (Vaul)" below. Sources: https://ui.shadcn.com/r/styles/base-nova/drawer.json, https://ui.shadcn.com/r/styles/radix-nova/drawer.json

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

/** Bottom drawer (default `swipeDirection="down"`) with a close button. */
export default function DrawerBasic() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>Open Drawer</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>This is a drawer component</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">Your content goes here</div>
        <DrawerClose render={<Button />}>Close</DrawerClose>
      </DrawerContent>
    </Drawer>
  )
}
```

## Components

### Drawer
Root (Base UI `Drawer.Root`). Props: `swipeDirection` (`"down"` default, `"up"`, `"left"`,
`"right"`), `showSwipeHandle`, `modal` (`true` | `false` | `"trap-focus"`), `snapPoints`,
`snapPoint` / `onSnapPointChange`, `disablePointerDismissal`, `open` / `onOpenChange`,
`onOpenChangeComplete`.

### DrawerTrigger / DrawerClose
Open / close buttons. Use `render` to compose another element (`render={<Button />}`).

### DrawerContent
Backdrop + viewport + popup. Style per side with `data-[swipe-direction=down]:`; descendants can
use `group-data-[swipe-axis=y]/drawer-popup:`. `initialFocus={false}` skips auto-focus.

### DrawerHeader / DrawerFooter / DrawerTitle / DrawerDescription
Layout and accessible labelling.

iOS Safari: add `body { position: relative; }` to `app/globals.css` so overlays cover the page.

## Mobile Navigation Drawer

```tsx
'use client'

import Link from 'next/link'
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

/** Left-side navigation drawer for small screens. */
export default function MobileNavigation() {
  return (
    <Drawer swipeDirection="left">
      <DrawerTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" />}
      >
        <Menu />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerClose
            render={<Button variant="ghost" size="icon-sm" className="absolute right-4 top-4" aria-label="Close" />}
          >
            <X />
          </DrawerClose>
        </DrawerHeader>
        <nav className="space-y-2 p-4">
          {navigationItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-base hover:bg-muted rounded-md"
            >
              {item.label}
            </Link>
          ))}
        </nav>
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

/** Filter panel with checkboxes and footer actions. */
export default function FilterDrawer() {
  const [selected, setSelected] = useState<string[]>([])

  const handleToggle = (value: string) => {
    setSelected(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    )
  }

  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>
        <Filter data-icon="inline-start" />
        Filters
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter Products</DrawerTitle>
          <DrawerDescription>Choose filters to narrow your results</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-6 max-h-96 overflow-y-auto">
          {Object.entries(filterOptions).map(([category, options]) => (
            <div key={category}>
              <h3 className="font-semibold text-sm mb-3 capitalize">{category}</h3>
              <div className="space-y-2">
                {options.map(option => (
                  <div key={option} className="flex items-center gap-2">
                    <Checkbox
                      id={option}
                      checked={selected.includes(option)}
                      onCheckedChange={() => handleToggle(option)}
                    />
                    <label htmlFor={option} className="text-sm cursor-pointer">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <DrawerFooter>
          <Button variant="outline" onClick={() => setSelected([])}>Clear</Button>
          <DrawerClose render={<Button />}>Apply</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
```

## Multi-step Drawer

```tsx
'use client'

import { useState } from 'react'
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

const steps = ['Confirm Details', 'Review Terms', 'Completion']

/** Wizard inside one drawer; the last step closes it. */
export default function MultiStepDrawer() {
  const [step, setStep] = useState(1)

  return (
    <Drawer>
      <DrawerTrigger render={<Button />}>Start Process</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Multi-step Workflow</DrawerTitle>
          <DrawerDescription>Step {step} of 3</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <h3 className="font-semibold">Step {step}: {steps[step - 1]}</h3>
        </div>
        <DrawerFooter>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>Previous</Button>
          )}
          {step < 3 && <Button onClick={() => setStep(step + 1)}>Next</Button>}
          {step === 3 && <DrawerClose render={<Button />}>Close</DrawerClose>}
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

/** Right-side settings panel with toggles. */
export default function SettingsDrawer() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <Drawer swipeDirection="right">
      <DrawerTrigger render={<Button variant="ghost" size="icon" aria-label="Settings" />}>
        <Settings />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>Manage your preferences</DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Notifications</span>
            <Toggle pressed={notifications} onPressedChange={setNotifications}>
              {notifications ? 'On' : 'Off'}
            </Toggle>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Dark Mode</span>
            <Toggle pressed={darkMode} onPressedChange={setDarkMode}>
              {darkMode ? 'On' : 'Off'}
            </Toggle>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button />}>Done</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
```

## Bottom Sheet with Snap Points

```tsx
'use client'

import { Button } from '@/modules/cores/shadcn/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/modules/cores/shadcn/components/ui/drawer'

// 0–1 = fraction of the viewport, >1 = pixels, strings accept px/rem (vertical drawers only)
const SNAP_POINTS = ['31rem', 1]

/** Peek-then-expand bottom sheet; `data-expanded` is set at the full snap point. */
export default function SnapPointDrawer() {
  return (
    <Drawer snapPoints={SNAP_POINTS} showSwipeHandle>
      <DrawerTrigger render={<Button />}>Open with Snap</DrawerTrigger>
      <DrawerContent className="px-4">
        <DrawerHeader>
          <DrawerTitle>Bottom Sheet</DrawerTitle>
        </DrawerHeader>
        <p className="pb-4">Drag to snap between a compact peek and full height.</p>
        <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
      </DrawerContent>
    </Drawer>
  )
}
```

Controlled snap point: `snapPoint={snapPoint}` + `onSnapPointChange={setSnapPoint}`.

## Radix variant (Vaul)

`style` `radix-*` installs a **Vaul** drawer (dependency `vaul`). Map every Base UI prop above:

| Base UI (default) | Radix / Vaul |
|---|---|
| `swipeDirection="down" \| "up"` (`left`/`right` same) | `direction="bottom" \| "top"` |
| `<DrawerTrigger render={<Button />}>Open</DrawerTrigger>` | `<DrawerTrigger asChild><Button>Open</Button></DrawerTrigger>` |
| `<DrawerClose render={<Button />}>` | `<DrawerClose asChild>` |
| `snapPoint` / `onSnapPointChange` / `snapToSequentialPoints` | `activeSnapPoint` / `setActiveSnapPoint` / `snapToSequentialPoint` |
| `disablePointerDismissal` | `dismissible={false}` |
| `onOpenChangeComplete` | `onAnimationEnd` |
| `DrawerContent initialFocus={false}` | `DrawerContent onOpenAutoFocus={(e) => e.preventDefault()}` |
| `data-[swipe-direction=down]:` | `data-[vaul-drawer-direction=bottom]:` |

`showSwipeHandle` and `modal="trap-focus"` are Base UI-only; Vaul-only props (`handleOnly`,
`repositionInputs`, `shouldScaleBackground`) have no Base UI equivalent.

## Best Practices

1. **Mobile-first**: Design for mobile, enhance on desktop
2. **Header required**: Always include DrawerHeader for context
3. **Close button**: Provide clear way to dismiss
4. **Gesture support**: Swipe to dismiss follows `swipeDirection`
5. **Content scrolling**: Keep long content in a scrollable region
6. **Footer actions**: Put action buttons in DrawerFooter
