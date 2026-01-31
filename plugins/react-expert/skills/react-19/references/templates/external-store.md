---
name: "External Store Template"
description: "useSyncExternalStore patterns - browser APIs, localStorage, matchMedia, online status"
tags: ["react", "hooks", "useSyncExternalStore", "browser", "typescript"]
difficulty: "advanced"
---

# External Store: Complete Examples

## Overview

`useSyncExternalStore` synchronizes React with external mutable stores (browser APIs, global state, third-party libraries).

**Location:** React core hook (`react` package)

---

## Pattern 1: Online Status Store

Track network connectivity with `navigator.onLine`.

```typescript
import { useSyncExternalStore } from 'react'

/**
 * Subscribe to online/offline events.
 *
 * @param callback - Listener called when connection status changes
 * @returns Cleanup function
 */
function subscribeToOnlineStatus(callback: () => void) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

/**
 * Get current online status snapshot.
 *
 * @returns Current online status
 */
function getOnlineStatusSnapshot(): boolean {
  return navigator.onLine
}

/**
 * Get server-side snapshot (always true for SSR).
 *
 * @returns Server online status (true)
 */
function getOnlineStatusServerSnapshot(): boolean {
  return true
}

/**
 * Hook to track online/offline status.
 *
 * @returns Current online status
 * @example
 * function StatusIndicator() {
 *   const isOnline = useOnlineStatus()
 *   return <div>{isOnline ? '✅ Online' : '❌ Offline'}</div>
 * }
 */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribeToOnlineStatus,
    getOnlineStatusSnapshot,
    getOnlineStatusServerSnapshot
  )
}
```

---

## Pattern 2: LocalStorage Sync

Synchronize state with `localStorage` and sync across tabs.

```typescript
import { useSyncExternalStore } from 'react'

/**
 * Subscribe to localStorage changes.
 *
 * @param key - LocalStorage key to watch
 * @param callback - Listener called when key changes
 * @returns Cleanup function
 */
function subscribeToLocalStorage(key: string, callback: () => void) {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === key) callback()
  }

  window.addEventListener('storage', handleStorageChange)
  return () => window.removeEventListener('storage', handleStorageChange)
}

/**
 * Get localStorage value snapshot.
 *
 * @param key - LocalStorage key
 * @returns Parsed value or null
 */
function getLocalStorageSnapshot<T>(key: string): T | null {
  const item = localStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

/**
 * Hook to sync state with localStorage.
 *
 * @param key - LocalStorage key
 * @param initialValue - Default value if key doesn't exist
 * @returns Current value and setter function
 * @example
 * function ThemeToggle() {
 *   const [theme, setTheme] = useLocalStorageSync('theme', 'light')
 *   return (
 *     <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
 *       {theme}
 *     </button>
 *   )
 * }
 */
export function useLocalStorageSync<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const value = useSyncExternalStore(
    (callback) => subscribeToLocalStorage(key, callback),
    () => getLocalStorageSnapshot<T>(key) ?? initialValue,
    () => initialValue
  )

  const setValue = (newValue: T) => {
    localStorage.setItem(key, JSON.stringify(newValue))
    window.dispatchEvent(new StorageEvent('storage', { key }))
  }

  return [value, setValue]
}
```

---

## Pattern 3: Match Media (Responsive Breakpoints)

Detect CSS media query changes.

```typescript
import { useSyncExternalStore } from 'react'

/**
 * Subscribe to media query changes.
 *
 * @param query - CSS media query string
 * @param callback - Listener called when query match changes
 * @returns Cleanup function
 */
function subscribeToMediaQuery(query: string, callback: () => void) {
  const mediaQueryList = window.matchMedia(query)
  mediaQueryList.addEventListener('change', callback)
  return () => mediaQueryList.removeEventListener('change', callback)
}

/**
 * Get current media query match snapshot.
 *
 * @param query - CSS media query string
 * @returns Whether query matches
 */
function getMediaQuerySnapshot(query: string): boolean {
  return window.matchMedia(query).matches
}

/**
 * Hook to track media query matches.
 *
 * @param query - CSS media query string
 * @returns Whether query matches
 * @example
 * function ResponsiveComponent() {
 *   const isMobile = useMediaQuery('(max-width: 768px)')
 *   const isDark = useMediaQuery('(prefers-color-scheme: dark)')
 *   return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>
 * }
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => subscribeToMediaQuery(query, callback),
    () => getMediaQuerySnapshot(query),
    () => false // SSR fallback
  )
}
```

---

## Pattern 4: Window Size Store

Track window dimensions with `resize` events.

```typescript
import { useSyncExternalStore } from 'react'

interface WindowSize {
  width: number
  height: number
}

/**
 * Subscribe to window resize events.
 *
 * @param callback - Listener called on window resize
 * @returns Cleanup function
 */
function subscribeToWindowSize(callback: () => void) {
  window.addEventListener('resize', callback)
  return () => window.removeEventListener('resize', callback)
}

/**
 * Get current window size snapshot.
 *
 * @returns Current window dimensions
 */
function getWindowSizeSnapshot(): WindowSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

/**
 * Get server-side window size snapshot.
 *
 * @returns Default dimensions for SSR
 */
function getWindowSizeServerSnapshot(): WindowSize {
  return { width: 0, height: 0 }
}

/**
 * Hook to track window dimensions.
 *
 * @returns Current window width and height
 * @example
 * function ResponsiveLayout() {
 *   const { width, height } = useWindowSize()
 *   return <div>Window: {width}x{height}</div>
 * }
 */
export function useWindowSize(): WindowSize {
  return useSyncExternalStore(
    subscribeToWindowSize,
    getWindowSizeSnapshot,
    getWindowSizeServerSnapshot
  )
}
```

---

## Pattern 5: Generic External Store

Reusable pattern for any external store.

```typescript
import { useSyncExternalStore } from 'react'

/**
 * Generic external store interface.
 *
 * @template T - State type
 */
interface ExternalStore<T> {
  subscribe: (callback: () => void) => () => void
  getSnapshot: () => T
  getServerSnapshot?: () => T
}

/**
 * Create a custom external store.
 *
 * @template T - State type
 * @param initialState - Initial state value
 * @returns Store object with subscribe, get, and set methods
 * @example
 * const counterStore = createExternalStore(0)
 * counterStore.set(10)
 * console.log(counterStore.getSnapshot()) // 10
 */
export function createExternalStore<T>(initialState: T): ExternalStore<T> & {
  set: (value: T) => void
} {
  let state = initialState
  const listeners = new Set<() => void>()

  return {
    subscribe: (callback) => {
      listeners.add(callback)
      return () => listeners.delete(callback)
    },
    getSnapshot: () => state,
    getServerSnapshot: () => initialState,
    set: (value: T) => {
      state = value
      listeners.forEach((listener) => listener())
    },
  }
}

/**
 * Hook to use a generic external store.
 *
 * @template T - State type
 * @param store - External store object
 * @returns Current store state
 * @example
 * const counterStore = createExternalStore(0)
 *
 * function Counter() {
 *   const count = useExternalStore(counterStore)
 *   return <button onClick={() => counterStore.set(count + 1)}>{count}</button>
 * }
 */
export function useExternalStore<T>(store: ExternalStore<T>): T {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  )
}
```

---

## Best Practices

1. **Always provide getServerSnapshot** - For SSR compatibility
2. **Stable subscribe function** - Don't recreate on every render
3. **Memoize getSnapshot** - Avoid unnecessary re-renders
4. **Cleanup listeners** - Return cleanup function from subscribe
5. **Use for browser APIs only** - Not for React state

---

## When to Use

✅ **Use useSyncExternalStore for:**
- Browser APIs (navigator, matchMedia, window)
- Third-party global state libraries
- Cross-tab synchronization
- Real-time external data sources

❌ **Don't use for:**
- React state (use `useState` instead)
- Server state (use TanStack Query)
- Derived values (use `useMemo`)

---

## SSR Safety

Always provide `getServerSnapshot` to avoid hydration mismatches:

```typescript
useSyncExternalStore(
  subscribe,
  getSnapshot,
  () => defaultValue // SSR fallback
)
```

---

## Performance Tips

1. **Memoize subscribe** - Use `useCallback` if subscribe depends on props
2. **Batch updates** - Debounce rapid external changes
3. **Selective subscriptions** - Only subscribe to needed data
4. **Avoid expensive snapshots** - Keep `getSnapshot` fast
