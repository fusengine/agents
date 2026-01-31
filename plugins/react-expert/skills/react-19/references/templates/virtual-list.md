---
name: virtual-list
description: TanStack Virtual implementation - vertical list, horizontal, grid, variable height
when-to-use: long lists, large tables, infinite scroll, performance optimization
keywords: virtual, tanstack, list, windowing, scroll
priority: medium
related: ../virtualization.md
---

# Virtual List Examples

## Basic Vertical List

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

interface Item {
  id: string
  name: string
}

interface VirtualListProps {
  items: Item[]
}

export function VirtualList({ items }: VirtualListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  })

  return (
    <div
      ref={parentRef}
      className="h-96 overflow-auto"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Variable Height Items

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

interface Message {
  id: string
  content: string
}

export function ChatMessages({ messages }: { messages: Message[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 3,
  })

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            ref={virtualizer.measureElement}
            data-index={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <div className="p-4 border-b">
              {messages[virtualRow.index].content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Horizontal List

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

export function HorizontalCarousel({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    horizontal: true,
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 2,
  })

  return (
    <div ref={parentRef} className="overflow-x-auto whitespace-nowrap">
      <div
        style={{
          width: `${virtualizer.getTotalSize()}px`,
          height: '200px',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualCol) => (
          <div
            key={virtualCol.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${virtualCol.size}px`,
              transform: `translateX(${virtualCol.start}px)`,
            }}
          >
            <img src={items[virtualCol.index]} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Virtual Grid

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

const COLUMNS = 4

export function VirtualGrid({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  const rowCount = Math.ceil(items.length / COLUMNS)

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,
    overscan: 2,
  })

  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * COLUMNS
          const rowItems = items.slice(startIndex, startIndex + COLUMNS)

          return (
            <div
              key={virtualRow.key}
              className="grid grid-cols-4 gap-2"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {rowItems.map((item, i) => (
                <div key={startIndex + i} className="bg-muted rounded p-2">
                  {item}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

---

## With Infinite Scroll

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

export function InfiniteList() {
  const parentRef = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['items'],
    queryFn: ({ pageParam }) => fetchItems(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const allItems = data?.pages.flatMap((page) => page.items) ?? []

  const virtualizer = useVirtualizer({
    count: hasNextPage ? allItems.length + 1 : allItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  })

  const virtualItems = virtualizer.getVirtualItems()

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1]
    if (!lastItem) return

    if (lastItem.index >= allItems.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [virtualItems, hasNextPage, isFetchingNextPage, allItems.length, fetchNextPage])

  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualRow) => {
          const isLoader = virtualRow.index >= allItems.length

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {isLoader ? 'Loading more...' : allItems[virtualRow.index].name}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

---

## Installation

```bash
npm install @tanstack/react-virtual
```
