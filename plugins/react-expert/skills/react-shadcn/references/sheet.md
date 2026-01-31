---
name: sheet
description: Side panel/drawer component that slides in from edges with various positions
when-to-use: Sidebars, navigation drawers, detail panels, modals on mobile, form panels
keywords: drawer, sidebar, panel, slide-out, side panel, modal drawer
priority: medium
requires: installation.md
related: dialog.md, dropdown.md
---

# Sheet

Sheet is a side panel that slides in from the edge of the screen, useful for navigation, filters, or detailed content.

## Basic Sheet

```tsx
'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/modules/cores/shadcn/components/ui/sheet'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

export function BasicSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>
            This is a description for the sheet content
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          {/* Content goes here */}
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

## Sheet with Side Variants

```tsx
'use client'

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/modules/cores/shadcn/components/ui/sheet'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

export function SheetVariants() {
  return (
    <div className="flex gap-4">
      {/* Top Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">From Top</Button>
        </SheetTrigger>
        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle>Top Sheet</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      {/* Right Sheet (Default) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">From Right</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Right Sheet</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      {/* Bottom Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">From Bottom</Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Bottom Sheet</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      {/* Left Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">From Left</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Left Sheet</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  )
}
```

## Navigation Sidebar Sheet

```tsx
'use client'

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from '@/modules/cores/shadcn/components/ui/sheet'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { Menu, Home, Settings, LogOut } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function NavigationSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="flex flex-col gap-2 mt-8">
          <SheetClose asChild>
            <Link href="/">
              <div className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded">
                <Home className="h-5 w-5" />
                Home
              </div>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/settings">
              <div className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded">
                <Settings className="h-5 w-5" />
                Settings
              </div>
            </Link>
          </SheetClose>
          <div className="border-t my-4" />
          <SheetClose asChild>
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded text-red-600">
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
```

## Sheet with Form

```tsx
'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/modules/cores/shadcn/components/ui/sheet'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { Input } from '@/modules/cores/shadcn/components/ui/input'
import { Label } from '@/modules/cores/shadcn/components/ui/label'

export function SheetWithForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>New User</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New User</SheetTitle>
          <SheetDescription>
            Fill in the details below to create a new user account.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <SheetFooter>
            <Button type="submit">Create User</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
```

## Filter Panel Sheet

```tsx
'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/modules/cores/shadcn/components/ui/sheet'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { Checkbox } from '@/modules/cores/shadcn/components/ui/checkbox'
import { Slider } from '@/modules/cores/shadcn/components/ui/slider'
import { Filter } from 'lucide-react'

export function FilterSheet() {
  const [priceRange, setPriceRange] = useState([50, 500])
  const [categories, setCategories] = useState({
    electronics: false,
    clothing: false,
    books: false,
  })

  const toggleCategory = (key: keyof typeof categories) => {
    setCategories({
      ...categories,
      [key]: !categories[key],
    })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Price Range */}
          <div className="space-y-3">
            <h3 className="font-semibold">Price Range</h3>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={0}
              max={1000}
              step={10}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground">
              ${priceRange[0]} - ${priceRange[1]}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h3 className="font-semibold">Categories</h3>
            <div className="space-y-2">
              {Object.entries(categories).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={() =>
                      toggleCategory(key as keyof typeof categories)
                    }
                  />
                  <label htmlFor={key} className="capitalize cursor-pointer">
                    {key}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <SheetClose asChild>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </SheetClose>
            <Button className="flex-1">Apply Filters</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

## Managed Sheet with State

```tsx
'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/modules/cores/shadcn/components/ui/sheet'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

export function ManagedSheet() {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Controlled Sheet</Button>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Controlled Sheet</SheetTitle>
            <SheetDescription>
              This sheet is controlled by external state
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <p>Sheet content here</p>
          </div>
          <SheetClose asChild>
            <Button
              onClick={() => setOpen(false)}
              className="w-full"
            >
              Close Sheet
            </Button>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </>
  )
}
```

## Key Components

| Component | Purpose |
|-----------|---------|
| `Sheet` | Root container |
| `SheetTrigger` | Button that opens the sheet |
| `SheetContent` | Main content area |
| `SheetHeader` | Top section with title/description |
| `SheetTitle` | Heading |
| `SheetDescription` | Subtitle or description |
| `SheetFooter` | Bottom section for actions |
| `SheetClose` | Closes the sheet (can wrap any element) |

## Side Variants

```tsx
side="top"    // Slides down from top
side="right"  // Slides in from right (default)
side="bottom" // Slides up from bottom
side="left"   // Slides in from left
```

## Common Patterns

### Pattern: Navigation Drawer
- Place navigation links in SheetContent
- Wrap links with SheetClose for auto-close
- Use MenuIcon as trigger

### Pattern: Filter Panel
- Use checkboxes and sliders for filtering
- Apply/Reset button pattern
- Keep filters grouped logically

### Pattern: Form Sheet
- SheetHeader with title
- Form inputs in middle
- SheetFooter with submit button

### Pattern: Detail Panel
- Read-only information display
- Related actions in SheetFooter
- Close button for dismissal

## Accessibility

- Keyboard: Escape closes sheet
- Focus trap within sheet
- Backdrop click closes (customizable)
- Smooth animations
- Screen reader support for modality

## Best Practices

1. **Mobile-First**: Sheets work better on mobile than modals
2. **Scrollable Content**: Content inside SheetContent scrolls
3. **Trigger Clarity**: Make trigger button purpose clear
4. **Close Options**: Provide multiple ways to close (button, escape, backdrop)
5. **Side Consistency**: Stick to one side for predictable UX
