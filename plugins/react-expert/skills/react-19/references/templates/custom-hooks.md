---
name: "Custom Hooks Template"
description: "Custom hooks implementations - useLocalStorage, useDebounce, useWindowSize, useMediaQuery, useOnClickOutside"
tags: ["react", "hooks", "custom-hook", "typescript"]
difficulty: "intermediate"
---

# Custom Hooks: Complete Implementations

## useLocalStorage

Generic hook for localStorage with type safety and tab synchronization:

```typescript
import { useState, useEffect } from 'react'

/**
 * Sync state with localStorage.
 * Location: modules/cores/hooks/useLocalStorage.ts
 *
 * @param key - localStorage key
 * @param initialValue - Default value if key doesn't exist
 * @returns Tuple of [value, setValue]
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}
```

---

## useDebounce

Debounce any value with configurable delay:

```typescript
import { useState, useEffect } from 'react'

/**
 * Debounce a value.
 * Location: modules/cores/hooks/useDebounce.ts
 *
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (default: 500)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
```

---

## usePrevious

Track previous value of any prop or state:

```typescript
import { useRef, useEffect } from 'react'

/**
 * Track previous value.
 * Location: modules/cores/hooks/usePrevious.ts
 *
 * @param value - Current value
 * @returns Previous value (undefined on first render)
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
```

---

## useWindowSize

Track window dimensions with useSyncExternalStore (React 18+):

```typescript
import { useSyncExternalStore } from 'react'

interface WindowSize {
  width: number
  height: number
}

/**
 * Track window size with SSR support.
 * Location: modules/cores/hooks/useWindowSize.ts
 *
 * @returns Current window dimensions
 */
export function useWindowSize(): WindowSize {
  const subscribe = (callback: () => void) => {
    window.addEventListener('resize', callback)
    return () => window.removeEventListener('resize', callback)
  }

  const getSnapshot = (): WindowSize => ({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const getServerSnapshot = (): WindowSize => ({
    width: 0,
    height: 0,
  })

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
```

---

## useMediaQuery

CSS media query hook with SSR support:

```typescript
import { useState, useEffect } from 'react'

/**
 * Evaluate CSS media query.
 * Location: modules/cores/hooks/useMediaQuery.ts
 *
 * @param query - CSS media query string
 * @returns true if query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handler)

    return () => {
      mediaQuery.removeEventListener('change', handler)
    }
  }, [query])

  return matches
}
```

---

## useOnClickOutside

Detect clicks outside an element:

```typescript
import { useEffect, RefObject } from 'react'

/**
 * Detect clicks outside element.
 * Location: modules/cores/hooks/useOnClickOutside.ts
 *
 * @param ref - Ref to element
 * @param handler - Callback when click outside occurs
 */
export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}
```

---

## useKeyPress

Detect keyboard shortcuts:

```typescript
import { useState, useEffect } from 'react'

/**
 * Detect key press.
 * Location: modules/cores/hooks/useKeyPress.ts
 *
 * @param targetKey - Key to detect (e.g., 'Escape', 'Enter')
 * @returns true when key is pressed
 */
export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false)

  useEffect(() => {
    const downHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(true)
      }
    }

    const upHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(false)
      }
    }

    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)

    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [targetKey])

  return keyPressed
}
```

---

## useToggle

Toggle boolean state with utility methods:

```typescript
import { useState, useCallback } from 'react'

/**
 * Toggle state hook.
 * Location: modules/cores/hooks/useToggle.ts
 *
 * @param initialValue - Initial boolean value
 * @returns Tuple of [value, toggle, setTrue, setFalse]
 */
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue((v) => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return [value, toggle, setTrue, setFalse] as const
}
```

---

## useCopyToClipboard

Copy text to clipboard with status:

```typescript
import { useState } from 'react'

type CopyStatus = 'idle' | 'copied' | 'error'

/**
 * Copy text to clipboard.
 * Location: modules/cores/hooks/useCopyToClipboard.ts
 *
 * @returns Tuple of [copyToClipboard function, status]
 */
export function useCopyToClipboard() {
  const [status, setStatus] = useState<CopyStatus>('idle')

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
      setTimeout(() => setStatus('idle'), 2000)
    } catch (error) {
      setStatus('error')
      console.error('Failed to copy:', error)
    }
  }

  return [copyToClipboard, status] as const
}
```

---

## useInterval

Declarative interval hook:

```typescript
import { useEffect, useRef } from 'react'

/**
 * Declarative interval.
 * Location: modules/cores/hooks/useInterval.ts
 *
 * @param callback - Function to call on interval
 * @param delay - Delay in milliseconds (null to pause)
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return

    const tick = () => savedCallback.current()
    const id = setInterval(tick, delay)

    return () => clearInterval(id)
  }, [delay])
}
```

---

## Best Practices

1. **Generic types** - Use `<T>` for reusable hooks
2. **SSR-safe** - Check `typeof window !== 'undefined'`
3. **Cleanup** - Always return cleanup function in useEffect
4. **Stable functions** - Use useCallback for returned functions
5. **Error handling** - Try/catch for localStorage, clipboard, etc.
6. **JSDoc** - Document parameters and return values
7. **Location comment** - Indicate where file should be created
8. **Max 30 lines** - Keep hooks focused and small
