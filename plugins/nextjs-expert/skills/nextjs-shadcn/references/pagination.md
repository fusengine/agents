---
name: pagination
description: Pagination control component with numbered pages, ellipsis, and previous/next buttons
when-to-use: Table pagination, list pagination, search results navigation, multi-page content
keywords: pagination, page navigation, numbered pages, prev next, page controls
priority: high
requires: installation.md
related: table.md, command.md
---

# Pagination

Implements paginated content navigation with support for previous/next buttons, numbered pages, and ellipsis for long page ranges.

## Installation

```bash
bunx --bun shadcn@latest add pagination
```

## Basic Pagination

```tsx
'use client'

import { useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/modules/cores/shadcn/components/ui/pagination'

export function BasicPagination() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 5

  return (
    <div className="space-y-8">
      {/* Content for current page */}
      <div className="rounded-lg border p-8 text-center">
        <p className="text-lg font-semibold">Page {currentPage}</p>
        <p className="text-muted-foreground">
          Showing content for page {currentPage}
        </p>
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() =>
                setCurrentPage((p) => Math.max(1, p - 1))
              }
              className={
                currentPage === 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
```

## Pagination with Ellipsis

```tsx
'use client'

import { useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/modules/cores/shadcn/components/ui/pagination'

export function PaginationWithEllipsis() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 20

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const delta = 2

    pages.push(1)

    if (currentPage - delta > 2) {
      pages.push('ellipsis-start')
    }

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i)
    }

    if (currentPage + delta < totalPages - 1) {
      pages.push('ellipsis-end')
    }

    pages.push(totalPages)

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="space-y-8">
      <div className="rounded-lg border p-8 text-center">
        <p className="text-lg font-semibold">Page {currentPage}</p>
        <p className="text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() =>
                setCurrentPage((p) => Math.max(1, p - 1))
              }
              className={
                currentPage === 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {pageNumbers.map((page, idx) =>
            typeof page === 'string' ? (
              <PaginationItem key={`${page}-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
```

## Pagination with Data Display

```tsx
'use client'

import { useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/modules/cores/shadcn/components/ui/pagination'

interface Item {
  id: number
  title: string
  description: string
  date: string
}

const allItems: Item[] = Array.from({ length: 47 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`,
  date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
}))

export function PaginationWithData() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(allItems.length / itemsPerPage)

  const startIdx = (currentPage - 1) * itemsPerPage
  const endIdx = startIdx + itemsPerPage
  const currentItems = allItems.slice(startIdx, endIdx)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const delta = 2

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)

    if (currentPage - delta > 2) {
      pages.push('ellipsis')
    }

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      pages.push(i)
    }

    if (currentPage + delta < totalPages - 1) {
      pages.push('ellipsis')
    }

    pages.push(totalPages)
    return pages
  }

  return (
    <div className="space-y-8">
      {/* Items List */}
      <div className="space-y-4">
        {currentItems.map((item) => (
          <div key={item.id} className="rounded-lg border p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <time className="text-sm text-muted-foreground">
                {item.date}
              </time>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {startIdx + 1} to {Math.min(endIdx, allItems.length)} of{' '}
        {allItems.length} items
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() =>
                setCurrentPage((p) => Math.max(1, p - 1))
              }
              className={
                currentPage === 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {getPageNumbers().map((page, idx) =>
            page === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(page as number)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
```

## Pagination with URL Search Params

```tsx
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/modules/cores/shadcn/components/ui/pagination'

interface PaginationUrlProps {
  totalPages: number
  currentPage: number
}

export function PaginationWithUrl({
  totalPages,
  currentPage,
}: PaginationUrlProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const delta = 2

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)

    if (currentPage - delta > 2) {
      pages.push('ellipsis')
    }

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      pages.push(i)
    }

    if (currentPage + delta < totalPages - 1) {
      pages.push('ellipsis')
    }

    pages.push(totalPages)
    return pages
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={
              currentPage > 1
                ? `?page=${currentPage - 1}`
                : '#'
            }
            className={
              currentPage === 1
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>

        {getPageNumbers().map((page, idx) =>
          page === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href={`?page=${page}`}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href={
              currentPage < totalPages
                ? `?page=${currentPage + 1}`
                : '#'
            }
            className={
              currentPage === totalPages
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
```

## Pagination with Items Per Page Selector

```tsx
'use client'

import { useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/modules/cores/shadcn/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/cores/shadcn/components/ui/select'

const allItems = Array.from({ length: 47 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
}))

export function PaginationWithItemsPerPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const totalPages = Math.ceil(allItems.length / itemsPerPage)

  const startIdx = (currentPage - 1) * itemsPerPage
  const currentItems = allItems.slice(startIdx, startIdx + itemsPerPage)

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value))
    setCurrentPage(1)
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const delta = 2

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)

    if (currentPage - delta > 2) {
      pages.push('ellipsis')
    }

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      pages.push(i)
    }

    if (currentPage + delta < totalPages - 1) {
      pages.push('ellipsis')
    }

    pages.push(totalPages)
    return pages
  }

  return (
    <div className="space-y-8">
      {/* Items Per Page Selector */}
      <div className="flex items-center gap-4">
        <label htmlFor="items-per-page" className="text-sm font-medium">
          Items per page:
        </label>
        <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="rounded border p-3 text-sm hover:bg-accent"
          >
            {item.title}
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {startIdx + 1} to {Math.min(startIdx + itemsPerPage, allItems.length)} of{' '}
        {allItems.length} items
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={
                currentPage === 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {getPageNumbers().map((page, idx) =>
            page === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(page as number)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
```

## Key Components

| Component | Purpose |
|-----------|---------|
| `Pagination` | Root container |
| `PaginationContent` | Flex container for items |
| `PaginationItem` | Individual pagination item |
| `PaginationLink` | Numbered page link |
| `PaginationPrevious` | Previous page button |
| `PaginationNext` | Next page button |
| `PaginationEllipsis` | Ellipsis indicator (...) |

## Common Patterns

### Pattern: Basic Pagination
- Previous button
- Numbered pages (1-5)
- Next button
- Disabled state for edges

### Pattern: Long Page Lists
- First page
- Ellipsis if gap
- Current page ± 2
- Ellipsis if gap
- Last page

### Pattern: Data Display
- Show current items
- Display pagination controls
- Show item count info
- Handle page changes

### Pattern: URL-Based
- Page in URL search params
- Bookmarkable pagination
- Works with server-side filtering
- Preserves other query params

## Accessibility

- Semantic HTML with nav
- Buttons properly labeled
- Active state announced
- Keyboard navigation
- Focus indicators visible
- Disabled buttons not focusable

## Best Practices

1. **Ellipsis for Long Lists**: Use when > 7 pages
2. **Show Context**: Display "Page X of Y" info
3. **Disabled State**: Disable prev/next at edges
4. **Active State**: Highlight current page clearly
5. **URL Integration**: Use search params for bookmarkable pages
6. **Items Per Page**: Provide options (5, 10, 20, 50)
7. **Mobile**: Ensure buttons are touch-friendly (min 44px)
8. **Performance**: Lazy load content when possible

## Styling Tips

- Use `isActive` prop for current page styling
- Apply `pointer-events-none opacity-50` for disabled state
- Use `cursor-pointer` for interactive items
- Add `hover:` utilities for visual feedback
- Keep consistent spacing with `gap-1` in PaginationContent
