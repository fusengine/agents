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

> **Base:** examples use **Base UI** (shadcn default since 2026-07); Radix delta in "Radix variant" below; React Aria: same layout parts, but composed children follow the Aria rules (`onPress`, trigger wrappers) — `shadcn docs sidebar --base aria`. Sources: https://ui.shadcn.com/r/styles/base-nova/sidebar.json, https://ui.shadcn.com/r/styles/radix-nova/sidebar.json

`SidebarMenuButton`, `SidebarMenuSubButton`, `SidebarGroupLabel`, `SidebarGroupAction` and
`SidebarMenuAction` compose with `render` (e.g. `render={<Link to="/" />}`).
`SidebarProvider` / `useSidebar` / `collapsible="offcanvas" | "icon" | "none"` /
`variant="sidebar" | "floating" | "inset"` are identical on every base; `Sidebar dir="rtl"` for
RTL. Theme tokens are `--sidebar*` in OKLCH ([theming.md](theming.md)).

Every example assumes a `SidebarProvider` higher in the tree (`useSidebar` throws without it);
`SidebarMenuButton tooltip` also needs a `TooltipProvider` at the app root ([tooltip.md](tooltip.md)).

## Installation

```bash
bunx --bun shadcn@latest add sidebar
```

## Basic Sidebar

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/modules/cores/shadcn/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { LayoutDashboard, Users, Settings } from 'lucide-react'

const items = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
]

/** Provider + sidebar + inset main area with a toggle. */
export function BasicSidebar() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarMenu>
            {items.map(({ to, label, icon: Icon }) => (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton render={<Link to={to} />} tooltip={label}>
                  <Icon />
                  <span>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="border-b p-4">
          <SidebarTrigger />
        </header>
        {/* Main content */}
      </SidebarInset>
    </SidebarProvider>
  )
}
```

## Sidebar with Header and Footer

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/modules/cores/shadcn/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/modules/cores/shadcn/components/ui/dropdown-menu'
import { Link } from '@tanstack/react-router'
import { LayoutDashboard, LogOut, User, Zap } from 'lucide-react'

/** Sidebar with a brand header and a user dropdown in the footer. */
export function SidebarWithHeaderFooter() {
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2 font-semibold">
          <Zap className="h-5 w-5" />
          {state === 'expanded' && <span>MyApp</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link to="/" />}>
              <LayoutDashboard />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                <User />
                <span>John Doe</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
```

## Collapsible Sidebar with Submenus

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/modules/cores/shadcn/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/modules/cores/shadcn/components/ui/collapsible'
import { Link } from '@tanstack/react-router'
import { FileText, BarChart3, ChevronDown } from 'lucide-react'

const sections = [
  {
    label: 'Documents',
    icon: FileText,
    defaultOpen: true,
    links: [
      { to: '/docs/recent', label: 'Recent' },
      { to: '/docs/shared', label: 'Shared' },
    ],
  },
  {
    label: 'Reports',
    icon: BarChart3,
    defaultOpen: false,
    links: [
      { to: '/reports/sales', label: 'Sales' },
      { to: '/reports/analytics', label: 'Analytics' },
    ],
  },
]

/** Menu items that expand into submenus via Collapsible. */
export function CollapsibleSidebarWithSubmenus() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {sections.map(({ label, icon: Icon, defaultOpen, links }) => (
            <Collapsible
              key={label}
              defaultOpen={defaultOpen}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger render={<SidebarMenuButton tooltip={label} />}>
                <Icon />
                <span>{label}</span>
                <ChevronDown className="ml-auto transition-transform group-data-open/collapsible:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {links.map((link) => (
                    <SidebarMenuSubItem key={link.to}>
                      <SidebarMenuSubButton render={<Link to={link.to} />}>
                        {link.label}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
```

## Mobile Behaviour

No separate mobile component is needed: below the `md` breakpoint `Sidebar` renders itself inside
a `Sheet` (`useSidebar()` exposes `isMobile`, `openMobile`, `setOpenMobile`), and
`SidebarTrigger` / `toggleSidebar()` toggle the sheet. Close it after navigation with
`setOpenMobile(false)` in the link `onClick` when needed.

## Sidebar with Navigation Context

```tsx
import { Link, useLocation } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/modules/cores/shadcn/components/ui/sidebar'
import { LayoutDashboard, Users, Settings, BarChart3 } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

/** Highlights the item matching the current TanStack Router pathname. */
export function SidebarWithNavContext() {
  const pathname = useLocation({ select: (location) => location.pathname })

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map(({ to, label, icon: Icon }) => (
            <SidebarMenuItem key={to}>
              <SidebarMenuButton render={<Link to={to} />} isActive={pathname === to}>
                <Icon />
                <span>{label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
```

## Radix variant

Same parts and props; only composition changes (`asChild` + child element):

```tsx
<SidebarMenuButton asChild isActive={pathname === '/'}>
  <Link to="/">
    <LayoutDashboard />
    <span>Dashboard</span>
  </Link>
</SidebarMenuButton>
```

`<Collapsible asChild><SidebarMenuItem>…</SidebarMenuItem></Collapsible>`,
`<CollapsibleTrigger asChild><SidebarMenuButton>…</SidebarMenuButton></CollapsibleTrigger>`,
`<DropdownMenuTrigger asChild><SidebarMenuButton size="lg">…</SidebarMenuButton></DropdownMenuTrigger>`,
and `<SidebarGroupLabel asChild><CollapsibleTrigger>…</CollapsibleTrigger></SidebarGroupLabel>`
follow the same rule.

## Key Components

| Component | Purpose |
|-----------|---------|
| `SidebarProvider` | State provider (required; `defaultOpen`, `open`, `onOpenChange`) |
| `Sidebar` | Root container (`side`, `variant`, `collapsible`) |
| `SidebarHeader` / `SidebarFooter` | Top / bottom sections |
| `SidebarContent` | Scrollable navigation content |
| `SidebarGroup` / `SidebarGroupLabel` / `SidebarGroupContent` | Sections |
| `SidebarTrigger` / `SidebarRail` | Toggle button / edge rail |
| `SidebarInset` | Main area next to an `inset` sidebar |
| `SidebarMenu` / `SidebarMenuItem` | Navigation list and items |
| `SidebarMenuButton` | Item button (`isActive`, `tooltip`, `size`, `render`) |
| `SidebarMenuSub` / `SidebarMenuSubItem` / `SidebarMenuSubButton` | Submenu |
| `useSidebar` | `state`, `open`, `setOpen`, `isMobile`, `openMobile`, `setOpenMobile`, `toggleSidebar` |

## Common Patterns

- **Application layout**: `SidebarProvider` > `Sidebar` + `SidebarInset` with a `SidebarTrigger` header
- **Nested navigation**: `Collapsible` per section, `SidebarMenuSub` for children, `isActive` for the current page
- **User section**: `SidebarFooter` with a `DropdownMenu` whose trigger renders a `SidebarMenuButton`
- **Icon rail**: `collapsible="icon"` + `tooltip` on `SidebarMenuButton`

## Best Practices

1. **Icons**: Use consistent icon library (Lucide)
2. **Active State**: Drive `isActive` from the router location
3. **Grouping**: Organize items logically with `SidebarGroup`
4. **Labels**: Provide `tooltip` so collapsed icon mode stays usable
5. **Routing**: Compose the router `Link` through `render`, never nest `<a>` inside the button
6. **Simplicity**: Keep first level items limited (5-8 items)
