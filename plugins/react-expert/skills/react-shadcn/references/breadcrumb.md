---
name: breadcrumb
description: Navigation breadcrumb component showing hierarchy path with separators
when-to-use: Site navigation hierarchy, current location breadcrumbs, navigation trails
keywords: breadcrumb navigation, breadcrumbs, page hierarchy, navigation path
priority: medium
requires: installation.md
related: dropdown.md, navigation.md
---

# Breadcrumb

Breadcrumbs display the navigation hierarchy and current location within a site structure.

## Basic Breadcrumb

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/modules/cores/shadcn/components/ui/breadcrumb'

export function BasicBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Laptops</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

## Breadcrumb with Custom Separator

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/modules/cores/shadcn/components/ui/breadcrumb'
import { ChevronRight, Slash } from 'lucide-react'

export function BreadcrumbCustomSeparator() {
  return (
    <div className="space-y-4">
      {/* Chevron Separator */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumbs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Slash Separator */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumbs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
```

## Breadcrumb with Dropdown Menu

```tsx
'use client'

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/modules/cores/shadcn/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/modules/cores/shadcn/components/ui/dropdown-menu'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { ChevronDown } from 'lucide-react'

export function BreadcrumbWithDropdown() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 px-2 gap-1">
                Components
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <a href="/components/alerts">Alerts</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/components/buttons">Buttons</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/components/cards">Cards</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/components/dropdowns">Dropdowns</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumbs</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

## Breadcrumb with Icons

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/modules/cores/shadcn/components/ui/breadcrumb'
import { Home, FileText, Code } from 'lucide-react'

export function BreadcrumbWithIcons() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentation
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Code Examples
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

## Dynamic Breadcrumb from Route

```tsx
'use client'

import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/modules/cores/shadcn/components/ui/breadcrumb'

interface BreadcrumbItem {
  href: string
  label: string
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = [
    { href: '/', label: 'Home' },
  ]

  let path = ''
  segments.forEach((segment) => {
    path += `/${segment}`
    breadcrumbs.push({
      href: path,
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
    })
  })

  return breadcrumbs
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)
  const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <div key={item.href} className="flex items-center gap-1">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item === lastBreadcrumb ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

## Collapsible Breadcrumb (for long paths)

```tsx
'use client'

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/modules/cores/shadcn/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/modules/cores/shadcn/components/ui/breadcrumb'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { MoreHorizontal } from 'lucide-react'

export function CollapsibleBreadcrumb() {
  const breadcrumbs = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/projects/acme', label: 'Acme Corp' },
    { href: '/projects/acme/dashboard', label: 'Dashboard' },
    { href: '/projects/acme/dashboard/analytics', label: 'Analytics' },
    { href: '/projects/acme/dashboard/analytics/reports', label: 'Reports' },
  ]

  const hiddenItems = breadcrumbs.slice(2, -2)
  const visibleItems = [
    ...breadcrumbs.slice(0, 2),
    ...breadcrumbs.slice(-2),
  ]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {visibleItems.map((item, index, array) => {
          const isFirst = index === 0
          const isBeforeEllipsis = index === 1
          const showEllipsis = hiddenItems.length > 0 && isBeforeEllipsis
          const isLast = item === array[array.length - 1]

          return (
            <div key={item.href}>
              {!isFirst && <BreadcrumbSeparator />}
              {showEllipsis && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {hiddenItems.map((hiddenItem) => (
                        <DropdownMenuItem key={hiddenItem.href} asChild>
                          <a href={hiddenItem.href}>
                            {hiddenItem.label}
                          </a>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

## Breadcrumb with JSON Schema

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/modules/cores/shadcn/components/ui/breadcrumb'

export function BreadcrumbWithSchema() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://example.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Products',
                item: 'https://example.com/products',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'Laptops',
                item: 'https://example.com/products/laptops',
              },
            ],
          }),
        }}
      />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Laptops</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  )
}
```

## Key Components

| Component | Purpose |
|-----------|---------|
| `Breadcrumb` | Root container |
| `BreadcrumbList` | Container for breadcrumb items |
| `BreadcrumbItem` | Individual breadcrumb entry |
| `BreadcrumbLink` | Clickable navigation link |
| `BreadcrumbSeparator` | Visual divider between items |
| `BreadcrumbPage` | Current/last page (not clickable) |

## Common Patterns

### Pattern: Basic Navigation
- Home → Category → Subcategory → Current Page
- Each level is a link except the last

### Pattern: With Dropdown
- Use dropdown for long hierarchies
- Show first level and current page normally
- Hidden levels in dropdown

### Pattern: Dynamic from Route
- Parse pathname to generate breadcrumbs
- Auto-capitalize segment names
- Last segment as BreadcrumbPage

### Pattern: Schema Markup
- Add JSON-LD for SEO
- BreadcrumbList with itemListElement
- Improves search engine understanding

## Accessibility

- Semantic HTML with nav element
- Links have proper href attributes
- Current page indicated (not clickable)
- Screen reader friendly
- Keyboard navigation support

## Best Practices

1. **Current Page**: Last item should be current page (BreadcrumbPage, not link)
2. **Hierarchy**: Display actual site hierarchy, not browsing history
3. **Clarity**: Use clear, concise labels
4. **Separators**: Keep consistent separator style throughout
5. **Mobile**: Consider collapsible breadcrumbs on small screens
6. **SEO**: Add schema.org markup for structured data
