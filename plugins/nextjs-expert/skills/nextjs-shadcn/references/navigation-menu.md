---
name: navigation-menu
description: Accessible navigation menu with multi-level dropdown support and mega menu pattern
when-to-use: Primary site navigation, main menu bars, multi-level navigation structures, mega menus with rich content
keywords: navigation menu, mega menu, submenu, dropdown navigation, primary navigation, navbar
priority: medium
requires: installation.md
related: menubar.md, sidebar.md, dropdown.md
---

# NavigationMenu

> **Base:** examples use **Base UI** (shadcn default since 2026-07); Radix delta in "Radix variant" below; React Aria: no NavigationMenu (`aria-nova/navigation-menu.json` → 404). Sources: https://ui.shadcn.com/r/styles/base-nova/navigation-menu.json, https://ui.shadcn.com/r/styles/radix-nova/navigation-menu.json

Builds accessible navigation menus on Base UI `NavigationMenu` (Radix projects: Radix
`NavigationMenu`). Supports keyboard navigation, mega menus, and complex hierarchies. `next/link`
is composed with `render={<Link href="…" />}` on `NavigationMenuLink`.

## Installation

```bash
bunx --bun shadcn@latest add navigation-menu
```

## Basic Navigation Menu

```tsx
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/modules/cores/shadcn/components/ui/navigation-menu'
import Link from 'next/link'

const products = [
  { href: '/products/electronics', title: 'Electronics', description: 'Browse all electronics and gadgets' },
  { href: '/products/software', title: 'Software', description: 'Download and manage software' },
]

/** Menu with a dropdown of rich links and a top-level link. */
export function BasicNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {products.map((item) => (
                <li key={item.href}>
                  <NavigationMenuLink render={<Link href={item.href} />} className="flex-col items-start">
                    <div className="text-sm font-medium leading-none">{item.title}</div>
                    <p className="text-sm leading-snug text-muted-foreground">{item.description}</p>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink render={<Link href="/services" />} className={navigationMenuTriggerStyle()}>
            Services
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
```

## Mega Menu Pattern

```tsx
'use client'

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/modules/cores/shadcn/components/ui/navigation-menu'
import Link from 'next/link'

const columns = [
  {
    heading: 'By Industry',
    links: [
      { href: '/solutions/retail', label: 'Retail' },
      { href: '/solutions/finance', label: 'Finance' },
      { href: '/solutions/healthcare', label: 'Healthcare' },
    ],
  },
  {
    heading: 'By Use Case',
    links: [
      { href: '/use-cases/data-analytics', label: 'Data Analytics' },
      { href: '/use-cases/automation', label: 'Automation' },
    ],
  },
]

/** Wide dropdown with link columns and a featured card. */
export function MegaMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[900px] grid-cols-3 gap-8 p-6">
              {columns.map((column) => (
                <div key={column.heading}>
                  <h3 className="font-semibold mb-4">{column.heading}</h3>
                  <ul className="space-y-3">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <NavigationMenuLink render={<Link href={link.href} />} className="text-sm hover:underline">
                          {link.label}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="rounded-lg bg-muted p-3">
                <h4 className="font-medium text-sm mb-1">New: AI Assistant</h4>
                <p className="text-xs text-muted-foreground">Automate workflows with AI</p>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink render={<Link href="/pricing" />} className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
```

## Navigation Menu with Icons

```tsx
'use client'

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/modules/cores/shadcn/components/ui/navigation-menu'
import Link from 'next/link'
import { Code, Zap, Lock } from 'lucide-react'

const features = [
  { href: '/features/development', icon: Code, title: 'Development', description: 'Build faster with our tools' },
  { href: '/features/performance', icon: Zap, title: 'Performance', description: 'Lightning fast infrastructure' },
  { href: '/features/security', icon: Lock, title: 'Security', description: 'Enterprise grade protection' },
]

/** Dropdown of links paired with icons and descriptions. */
export function NavigationMenuWithIcons() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
              {features.map(({ href, icon: Icon, title, description }) => (
                <li key={href}>
                  <NavigationMenuLink render={<Link href={href} />} className="items-start gap-3">
                    <Icon className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">{title}</div>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
```

## Responsive Navigation Menu

```tsx
'use client'

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/modules/cores/shadcn/components/ui/navigation-menu'
import Link from 'next/link'

const productLinks = [
  { href: '/products/app', label: 'Mobile App' },
  { href: '/products/web', label: 'Web Platform' },
  { href: '/products/api', label: 'REST API' },
  { href: '/products/sdk', label: 'SDK' },
]

/** Full-width navbar whose dropdown grid widens with the viewport. */
export function ResponsiveNavigationMenu() {
  return (
    <nav className="w-full border-b">
      <div className="container mx-auto px-4 py-4">
        <NavigationMenu className="w-full max-w-none justify-start">
          <NavigationMenuList className="flex-wrap gap-1">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base">Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-3 sm:w-[300px] md:w-[400px] md:grid-cols-2">
                  {productLinks.map((link) => (
                    <li key={link.href}>
                      <NavigationMenuLink render={<Link href={link.href} />} className="text-sm hover:underline">
                        {link.label}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink render={<Link href="/docs" />} className="text-base">
                Docs
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  )
}
```

## Radix variant

Links compose with `asChild` + a child `<Link>`; the root takes `viewport` (default `true`,
renders `NavigationMenuViewport`) instead of Base UI's `align` + `NavigationMenuPositioner`.

```tsx
<NavigationMenu viewport={false}>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
        <Link href="/docs">Docs</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

## Key Components

| Component | Purpose |
|-----------|---------|
| `NavigationMenu` | Root container (`align`, default `"start"`) |
| `NavigationMenuList` | Container for all menu items |
| `NavigationMenuItem` | Individual menu item wrapper |
| `NavigationMenuTrigger` | Button to open submenu (shows chevron automatically) |
| `NavigationMenuContent` | Container for submenu content |
| `NavigationMenuLink` | Semantic link within menu (`render={<Link href="…" />}` for `next/link`) |
| `NavigationMenuPositioner` / `NavigationMenuIndicator` | Popup positioning (`side`, `sideOffset`, `align`) and active indicator |
| `navigationMenuTriggerStyle()` | Trigger styling for top-level links |

## Common Patterns

- **Main navigation bar**: primary items visible, secondary items in dropdowns
- **Mega menu**: wide grid dropdown, several categories, featured content
- **Icon-based navigation**: icons + short descriptions for discoverability
- **Responsive collapse**: one column on mobile, grid on tablet/desktop

## Accessibility

- Built on Base UI `NavigationMenu` (Radix `NavigationMenu` on Radix projects)
- Full keyboard navigation (arrow keys)
- Screen reader friendly
- ARIA labels and roles automatically applied
- Focus management handled automatically

## Best Practices

1. **Group Logically**: Organize menu items by category or function
2. **Limit Depth**: Keep hierarchy 2-3 levels maximum
3. **Clear Labels**: Use concise, descriptive item names
4. **Icons Optional**: Add when they improve clarity
5. **Content Width**: Keep mega menu content scannable
6. **Mobile First**: Design mobile experience first, then enhance
7. **Link Structure**: Compose `next/link` through `NavigationMenuLink` (`render`) so active/focus styles apply
