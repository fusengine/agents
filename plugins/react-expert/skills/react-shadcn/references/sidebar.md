---
name: sidebar
description: Responsive collapsible sidebar navigation with toggle and mobile support
when-to-use: Application layouts with side navigation, collapsible sidebars, mobile-responsive navigation, dashboard layouts
keywords: sidebar, side navigation, collapsible sidebar, navigation sidebar, app layout
priority: high
requires: installation.md
related: navigation-menu.md, sheet.md, collapsible.md
---

# Sidebar

Responsive sidebar navigation component with collapse functionality, icons, and mobile support. Perfect for dashboard and application layouts.

## Installation

```bash
bunx --bun shadcn@latest add sidebar
```

## Basic Sidebar

```tsx
'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/modules/cores/shadcn/components/ui/sidebar'
import { LayoutDashboard, Users, Settings } from 'lucide-react'

export function BasicSidebar() {
  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/" className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/users" className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>Users</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/settings" className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <main className="flex-1">
        <header className="border-b p-4">
          <SidebarTrigger />
        </header>
        {/* Main content */}
      </main>
    </div>
  )
}
```

## Sidebar with Header and Footer

```tsx
'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/modules/cores/shadcn/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/modules/cores/shadcn/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  User,
  Zap,
} from 'lucide-react'

export function SidebarWithHeaderFooter() {
  const { state } = useSidebar()

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarHeader className="border-b p-4">
          <div className="flex items-center gap-2 font-semibold">
            <Zap className="h-5 w-5" />
            {state === 'expanded' && <span>MyApp</span>}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/" className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/users" className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>Users</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/settings" className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t p-4">
          <div className="flex items-center justify-between gap-2">
            {state === 'expanded' && (
              <div className="text-sm">
                <p className="font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">john@example.com</p>
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full p-2 hover:bg-accent">
                  <User className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1">
        <header className="border-b p-4">
          <SidebarTrigger />
        </header>
        {/* Main content */}
      </main>
    </div>
  )
}
```

## Collapsible Sidebar with Submenus

```tsx
'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from '@/modules/cores/shadcn/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/modules/cores/shadcn/components/ui/collapsible'
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
} from 'lucide-react'

export function CollapsibleSidebarWithSubmenus() {
  const { state } = useSidebar()

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarContent>
          <SidebarMenu>
            {/* Dashboard */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/" className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Documents with submenu */}
            <SidebarMenuItem>
              <Collapsible defaultOpen className="w-full">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <span>Documents</span>
                    </div>
                    <ChevronDown className="h-4 w-4 transition-transform" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href="/docs/recent">Recent</a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href="/docs/shared">Shared</a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href="/docs/archived">Archived</a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>

            {/* Reports with submenu */}
            <SidebarMenuItem>
              <Collapsible className="w-full">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Reports</span>
                    </div>
                    <ChevronDown className="h-4 w-4 transition-transform" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href="/reports/sales">Sales</a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href="/reports/analytics">Analytics</a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href="/reports/inventory">Inventory</a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>

            {/* Settings */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/settings" className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <main className="flex-1">
        <header className="border-b p-4">
          <SidebarTrigger />
        </header>
        {/* Main content */}
      </main>
    </div>
  )
}
```

## Mobile Responsive Sidebar

```tsx
'use client'

import { useEffect, useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/modules/cores/shadcn/components/ui/sidebar'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/modules/cores/shadcn/components/ui/sheet'
import { LayoutDashboard, Users, Settings, Menu } from 'lucide-react'

export function ResponsiveSidebar() {
  const { state, toggleSidebar } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile) {
    return (
      <div className="flex h-screen flex-col">
        <header className="border-b p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">MyApp</h1>
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-4 border-b font-semibold">MyApp</div>
              <SidebarMenu className="p-4 space-y-2">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/" className="flex items-center gap-2">
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Dashboard</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/users" className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <span>Users</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/settings" className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1">Content goes here</main>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/" className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5" />
                  {state === 'expanded' && <span>Dashboard</span>}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/users" className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {state === 'expanded' && <span>Users</span>}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/settings" className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {state === 'expanded' && <span>Settings</span>}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <main className="flex-1">
        <header className="border-b p-4">
          <SidebarTrigger />
        </header>
        {/* Main content */}
      </main>
    </div>
  )
}
```

## Sidebar with Navigation Context

```tsx
'use client'

import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/modules/cores/shadcn/components/ui/sidebar'
import { LayoutDashboard, Users, Settings, BarChart3 } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    href: '/users',
    label: 'Users',
    icon: <Users className="h-5 w-5" />,
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: <Settings className="h-5 w-5" />,
  },
]

export function SidebarWithNavContext() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className={
                  pathname === item.href
                    ? 'bg-accent text-accent-foreground'
                    : ''
                }
              >
                <a href={item.href} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
```

## Key Components

| Component | Purpose |
|-----------|---------|
| `Sidebar` | Root container for sidebar |
| `SidebarHeader` | Top section (logo, title) |
| `SidebarContent` | Main navigation content |
| `SidebarFooter` | Bottom section (user profile, actions) |
| `SidebarTrigger` | Button to toggle sidebar |
| `SidebarMenu` | Container for navigation items |
| `SidebarMenuItem` | Individual navigation item |
| `SidebarMenuButton` | Clickable item button |
| `SidebarMenuSub` | Submenu container |
| `SidebarMenuSubItem` | Submenu item |
| `SidebarMenuSubButton` | Submenu button |
| `useSidebar` | Hook to access sidebar state |

## Common Patterns

### Pattern: Application Layout
- Header with toggle button
- Collapsible sidebar with navigation
- Main content area
- Optional footer in sidebar

### Pattern: Nested Navigation
- Main menu items with icons
- Collapsible submenus for categories
- Active state styling
- Visual hierarchy

### Pattern: Mobile Responsive
- Desktop: Full sidebar
- Mobile: Sheet/modal sidebar
- Toggle button in header
- Conditional rendering based on screen size

### Pattern: User Section
- Profile info in footer
- Dropdown for user actions
- Logout button
- Settings access

## Accessibility

- Semantic HTML with nav elements
- Keyboard navigation support
- ARIA labels for toggle button
- Active state indicators
- High contrast for active items
- Focus indicators visible

## Best Practices

1. **Icons**: Use consistent icon library (Lucide)
2. **Active State**: Show current page with visual feedback
3. **Grouping**: Organize items logically with sections
4. **Responsive**: Provide mobile-friendly alternative
5. **Labels**: Show/hide labels based on collapse state
6. **Performance**: Use React Link for routing
7. **Accessibility**: Use semantic HTML and ARIA labels
8. **Simplicity**: Keep first level items limited (5-8 items)

## Styling Tips

- Use `hover:bg-accent` for interactive feedback
- Apply `bg-accent text-accent-foreground` for active state
- Keep consistent gap with flex gap utilities
- Use `rounded-md` for softer corners
- Apply `transition-all` for smooth animations
- Use `h-screen` for full height layout
