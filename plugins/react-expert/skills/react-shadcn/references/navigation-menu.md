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

Builds accessible navigation menus with Radix UI's NavigationMenu primitive. Supports keyboard navigation, mega menus, and complex hierarchies.

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
} from '@/modules/cores/shadcn/components/ui/navigation-menu'
import { Link } from '@tanstack/react-router'

export function BasicNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/products/electronics">
                    <div className="text-sm font-medium leading-none">Electronics</div>
                    <p className="text-sm leading-snug text-muted-foreground">
                      Browse all electronics and gadgets
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/products/software">
                    <div className="text-sm font-medium leading-none">Software</div>
                    <p className="text-sm leading-snug text-muted-foreground">
                      Download and manage software
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/services">Services</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/docs">Documentation</Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/guides">Guides</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
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
} from '@/modules/cores/shadcn/components/ui/navigation-menu'
import { Link } from '@tanstack/react-router'

export function MegaMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[900px] p-6">
              <div className="grid grid-cols-3 gap-8">
                {/* Column 1: By Industry */}
                <div>
                  <h3 className="font-semibold mb-4">By Industry</h3>
                  <ul className="space-y-3">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/solutions/retail" className="text-sm hover:underline">
                          Retail
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/solutions/finance" className="text-sm hover:underline">
                          Finance
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/solutions/healthcare" className="text-sm hover:underline">
                          Healthcare
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/solutions/manufacturing" className="text-sm hover:underline">
                          Manufacturing
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </div>

                {/* Column 2: By Use Case */}
                <div>
                  <h3 className="font-semibold mb-4">By Use Case</h3>
                  <ul className="space-y-3">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/use-cases/data-analytics" className="text-sm hover:underline">
                          Data Analytics
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/use-cases/automation" className="text-sm hover:underline">
                          Automation
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/use-cases/integration" className="text-sm hover:underline">
                          Integration
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Featured */}
                <div>
                  <h3 className="font-semibold mb-4">Featured</h3>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-muted p-3">
                      <h4 className="font-medium text-sm mb-1">New: AI Assistant</h4>
                      <p className="text-xs text-muted-foreground">
                        Automate workflows with AI
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <h4 className="font-medium text-sm mb-1">Case Study</h4>
                      <p className="text-xs text-muted-foreground">
                        See how customers benefit
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Company</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[400px] p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">About</h3>
                  <ul className="space-y-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/about" className="text-sm hover:underline">
                          About Us
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/careers" className="text-sm hover:underline">
                          Careers
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/blog" className="text-sm hover:underline">
                          Blog
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Support</h3>
                  <ul className="space-y-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/support" className="text-sm hover:underline">
                          Help Center
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/contact" className="text-sm hover:underline">
                          Contact Us
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/pricing">Pricing</Link>
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
import { Link } from '@tanstack/react-router'
import {
  Code,
  Zap,
  Globe,
  Database,
  Lock,
  Cloud,
} from 'lucide-react'

export function NavigationMenuWithIcons() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/features/development" className="flex items-start gap-3">
                    <Code className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">Development</div>
                      <p className="text-sm text-muted-foreground">
                        Build faster with our tools
                      </p>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/features/performance" className="flex items-start gap-3">
                    <Zap className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">Performance</div>
                      <p className="text-sm text-muted-foreground">
                        Lightning fast infrastructure
                      </p>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/features/global" className="flex items-start gap-3">
                    <Globe className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">Global Network</div>
                      <p className="text-sm text-muted-foreground">
                        Deployed worldwide
                      </p>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/features/data" className="flex items-start gap-3">
                    <Database className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">Data Management</div>
                      <p className="text-sm text-muted-foreground">
                        Secure data handling
                      </p>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/features/security" className="flex items-start gap-3">
                    <Lock className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">Security</div>
                      <p className="text-sm text-muted-foreground">
                        Enterprise grade protection
                      </p>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/features/cloud" className="flex items-start gap-3">
                    <Cloud className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">Cloud Ready</div>
                      <p className="text-sm text-muted-foreground">
                        Native cloud integration
                      </p>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/docs">Documentation</Link>
          </NavigationMenuLink>
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
import { Link } from '@tanstack/react-router'

export function ResponsiveNavigationMenu() {
  return (
    <nav className="w-full border-b">
      <div className="container mx-auto px-4 py-4">
        <NavigationMenu className="w-full max-w-none justify-start">
          <NavigationMenuList className="flex-wrap gap-1">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base">
                Products
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-3 sm:w-[300px] md:w-[400px] md:grid-cols-2">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/products/app" className="text-sm hover:underline">
                        Mobile App
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/products/web" className="text-sm hover:underline">
                        Web Platform
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/products/api" className="text-sm hover:underline">
                        REST API
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/products/sdk" className="text-sm hover:underline">
                        SDK
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/pricing" className="text-base">
                  Pricing
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/docs" className="text-base">
                  Docs
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base">
                Company
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-3">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/about" className="text-sm hover:underline">
                        About
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/blog" className="text-sm hover:underline">
                        Blog
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/careers" className="text-sm hover:underline">
                        Careers
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  )
}
```

## Key Components

| Component | Purpose |
|-----------|---------|
| `NavigationMenu` | Root container for the entire menu |
| `NavigationMenuList` | Container for all menu items |
| `NavigationMenuItem` | Individual menu item wrapper |
| `NavigationMenuTrigger` | Button to open submenu (shows chevron automatically) |
| `NavigationMenuContent` | Container for submenu content |
| `NavigationMenuLink` | Semantic link within menu (use asChild with TanStack Router Link) |

## Common Patterns

### Pattern: Main Navigation Bar
- Primary items directly visible
- Secondary items in dropdowns
- "Company" section for company links
- Responsive layout

### Pattern: Mega Menu
- Wide dropdown with grid layout
- Multiple columns with different categories
- Featured/promotional content
- Rich visual hierarchy

### Pattern: Icon-Based Navigation
- Icons paired with text descriptions
- Helpful for feature discoverability
- Hover shows description
- Improves visual scanning

### Pattern: Responsive Collapse
- Mobile: Single column dropdowns
- Tablet: Two column grid
- Desktop: Full width with multiple columns
- Adapts to screen size

## Accessibility

- Built on Radix UI's NavigationMenu
- Full keyboard navigation (arrow keys)
- Screen reader friendly
- ARIA labels and roles automatically applied
- Semantic HTML structure
- Focus management handled automatically

## Best Practices

1. **Group Logically**: Organize menu items by category or function
2. **Limit Depth**: Keep hierarchy 2-3 levels maximum
3. **Clear Labels**: Use concise, descriptive item names
4. **Icons Optional**: Add when they improve clarity
5. **Content Width**: Keep mega menu content scannable
6. **Mobile First**: Design mobile experience first, then enhance
7. **Link Structure**: Use React Link with asChild for proper routing

## Styling Tips

- Use `hover:` utilities for visual feedback
- Apply `text-muted-foreground` to descriptions
- Use `bg-muted` for featured content cards
- Add `rounded-lg` for softer appearances
- Keep padding consistent across columns
