---
name: react-hooks
description: React hooks patterns - useState, useEffect, useCallback, useMemo, useRef, custom hooks. Use when implementing React hooks or creating custom hooks.
---

# React Hooks Guide

## Basic Hooks

### useState

```typescript
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  // Functional update for derived state
  const increment = () => setCount(prev => prev + 1)

  return <button onClick={increment}>{count}</button>
}
```

### useEffect

```typescript
import { useState, useEffect } from 'react'

function OnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, []) // Empty deps = mount only

  return <span>{isOnline ? '✅ Online' : '❌ Offline'}</span>
}
```

### useContext

```typescript
import { useContext, createContext } from 'react'

const UserContext = createContext<User | null>(null)

function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be within UserProvider')
  return context
}
```

---

## Performance Hooks

### useMemo

Memoize expensive computations.

```typescript
import { useMemo } from 'react'

function ExpensiveList({ items, filter }: Props) {
  const filteredItems = useMemo(
    () => items.filter(item => item.name.includes(filter)),
    [items, filter]
  )

  return <ul>{filteredItems.map(item => <li key={item.id}>{item.name}</li>)}</ul>
}
```

### useCallback

Memoize functions for stable references.

```typescript
import { useCallback } from 'react'

function TodoList({ todos, onToggle }: Props) {
  const handleToggle = useCallback(
    (id: string) => onToggle(id),
    [onToggle]
  )

  return todos.map(todo => (
    <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
  ))
}
```

### useRef

Persist values without re-renders.

```typescript
import { useRef, useEffect } from 'react'

function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return <input ref={inputRef} />
}
```

---

## Custom Hooks Patterns

### useFormInput

```typescript
import { useState, ChangeEvent } from 'react'

/**
 * Manage form input state.
 */
export function useFormInput(initialValue: string) {
  const [value, setValue] = useState(initialValue)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return { value, onChange: handleChange }
}

// Usage
function Form() {
  const firstName = useFormInput('')
  const lastName = useFormInput('')

  return (
    <form>
      <input {...firstName} placeholder="First name" />
      <input {...lastName} placeholder="Last name" />
    </form>
  )
}
```

### useLocalStorage

```typescript
import { useState, useEffect } from 'react'

/**
 * Sync state with localStorage.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
```

### useDebounce

```typescript
import { useState, useEffect } from 'react'

/**
 * Debounce a value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```

### useFetch

```typescript
import { useState, useEffect } from 'react'

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

/**
 * Fetch data from URL.
 */
export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(url)
      .then(res => res.json())
      .then(json => { if (!cancelled) setData(json) })
      .catch(err => { if (!cancelled) setError(err) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [url])

  return { data, loading, error }
}
```

---

## Rules of Hooks

1. **Only call at top level** - Not in loops, conditions, or nested functions
2. **Only call in React functions** - Components or custom hooks
3. **Name custom hooks with `use`** - `useUser`, `useFetch`, etc.
4. **Keep hooks focused** - One concern per hook
5. **Document with JSDoc** - Explain purpose and return value
