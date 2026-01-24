---
name: react-performance
description: React performance optimization - memo, useMemo, useCallback, lazy loading, virtualization. Use when optimizing React app performance.
user-invocable: false
---

# React Performance Optimization

## React.memo

Prevent re-renders when props unchanged.

```typescript
import { memo } from 'react'

interface UserCardProps {
  user: User
  onSelect: (id: string) => void
}

export const UserCard = memo(function UserCard({ user, onSelect }: UserCardProps) {
  return (
    <div onClick={() => onSelect(user.id)}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
})

// With custom comparison
export const UserCard = memo(
  function UserCard({ user }: { user: User }) {
    return <div>{user.name}</div>
  },
  (prevProps, nextProps) => prevProps.user.id === nextProps.user.id
)
```

---

## useMemo & useCallback

### useMemo - Memoize Values

```typescript
import { useMemo } from 'react'

function UserList({ users, filter }: Props) {
  // Only recalculate when users or filter change
  const filteredUsers = useMemo(
    () => users.filter(u => u.name.includes(filter)),
    [users, filter]
  )

  return <ul>{filteredUsers.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

### useCallback - Memoize Functions

```typescript
import { useCallback } from 'react'

function TodoList({ todos }: Props) {
  // Stable function reference
  const handleDelete = useCallback((id: string) => {
    deleteTodo(id)
  }, [])

  return todos.map(todo => (
    <TodoItem key={todo.id} todo={todo} onDelete={handleDelete} />
  ))
}
```

---

## Lazy Loading

### Component Lazy Loading

```typescript
import { lazy, Suspense } from 'react'

// Lazy load heavy components
const Dashboard = lazy(() => import('./Dashboard'))
const Analytics = lazy(() => import('./Analytics'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  )
}
```

### Named Export Lazy Loading

```typescript
const Dashboard = lazy(() =>
  import('./Dashboard').then(module => ({ default: module.Dashboard }))
)
```

---

## Virtualization

For long lists, render only visible items.

```typescript
// Using @tanstack/react-virtual
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  })

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
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

## State Optimization

### Avoid Unnecessary State

```typescript
// ❌ BAD - Derived state in useState
const [items, setItems] = useState<Item[]>([])
const [filteredItems, setFilteredItems] = useState<Item[]>([])

// ✅ GOOD - Compute derived values
const [items, setItems] = useState<Item[]>([])
const [filter, setFilter] = useState('')

const filteredItems = useMemo(
  () => items.filter(i => i.name.includes(filter)),
  [items, filter]
)
```

### Colocate State

```typescript
// ❌ BAD - State too high in tree
function App() {
  const [inputValue, setInputValue] = useState('')
  return <DeepChild value={inputValue} onChange={setInputValue} />
}

// ✅ GOOD - State close to where it's used
function SearchInput() {
  const [inputValue, setInputValue] = useState('')
  return <input value={inputValue} onChange={e => setInputValue(e.target.value)} />
}
```

---

## Avoiding Re-renders

### Stable Object References

```typescript
// ❌ BAD - New object every render
<UserCard style={{ color: 'red' }} />

// ✅ GOOD - Stable reference
const cardStyle = useMemo(() => ({ color: 'red' }), [])
<UserCard style={cardStyle} />
```

### Children as Props

```typescript
// ❌ BAD - Children re-created
function Parent() {
  const [count, setCount] = useState(0)
  return (
    <Wrapper>
      <ExpensiveChild /> {/* Re-renders when count changes */}
    </Wrapper>
  )
}

// ✅ GOOD - Children passed from parent
function App() {
  return (
    <Parent>
      <ExpensiveChild /> {/* Doesn't re-render */}
    </Parent>
  )
}

function Parent({ children }) {
  const [count, setCount] = useState(0)
  return <Wrapper>{children}</Wrapper>
}
```

---

## Profiling

### React DevTools Profiler

1. Install React DevTools extension
2. Open Profiler tab
3. Record interactions
4. Analyze component renders

### Highlight Updates

```typescript
// In React DevTools settings
// Enable "Highlight updates when components render"
```

---

## Checklist

- [ ] Use React.memo for pure components
- [ ] Memoize expensive calculations with useMemo
- [ ] Stabilize callbacks with useCallback
- [ ] Lazy load routes and heavy components
- [ ] Virtualize long lists (1000+ items)
- [ ] Avoid inline object/array literals in props
- [ ] Keep state close to where it's used
- [ ] Profile before optimizing
