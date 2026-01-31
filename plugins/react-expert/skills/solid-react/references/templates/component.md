---
name: component-template
description: React functional component template (< 50 lines)
---

# React Component (< 50 lines)

## Basic Component

```typescript
// modules/users/components/UserCard.tsx
import type { UserCardProps } from '../src/interfaces/user.interface'
import { Button } from '@/modules/cores/components/Button'
import { cn } from '@/modules/cores/lib/utils'

/**
 * User card displaying user information.
 *
 * @param user - User data to display
 * @param onEdit - Callback when edit is clicked
 */
export function UserCard({ user, onEdit, className }: UserCardProps) {
  return (
    <div className={cn('rounded-lg border p-4', className)}>
      <div className="flex items-center gap-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="h-10 w-10 rounded-full"
        />
        <div>
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(user.id)}
        className="mt-3"
      >
        Edit
      </Button>
    </div>
  )
}
```

---

## Component with Children

```typescript
// modules/cores/components/Card.tsx
import type { CardProps } from '../src/interfaces/ui.interface'
import { cn } from '../lib/utils'

/**
 * Card container with optional header and footer.
 */
export function Card({ children, header, footer, className }: CardProps) {
  return (
    <div className={cn('rounded-lg border bg-card', className)}>
      {header && (
        <div className="border-b px-4 py-3">{header}</div>
      )}
      <div className="p-4">{children}</div>
      {footer && (
        <div className="border-t px-4 py-3">{footer}</div>
      )}
    </div>
  )
}
```

---

## Component with Render Props

```typescript
// modules/cores/components/DataList.tsx
import type { DataListProps } from '../src/interfaces/ui.interface'

/**
 * Generic data list with customizable rendering.
 */
export function DataList<T>({
  items,
  renderItem,
  renderEmpty,
  keyExtractor,
  className
}: DataListProps<T>) {
  if (items.length === 0) {
    return renderEmpty?.() ?? <p>No items found</p>
  }

  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  )
}
```

---

## Rules

- Max 50 lines
- Import types from `../src/interfaces/`
- Import shared components from `@/modules/cores/components/`
- JSDoc for all exports
- No business logic (use hooks/services)
