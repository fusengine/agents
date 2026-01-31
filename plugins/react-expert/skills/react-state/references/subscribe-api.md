---
name: subscribe-api
description: Zustand subscribe API for listening to state changes outside React
when-to-use: Syncing state with external systems, logging, analytics, or transient updates
keywords: subscribe, listener, transient, outside React, subscribeWithSelector
priority: medium
requires: store-patterns.md
related: middleware.md
---

# Subscribe API

Listen to state changes outside React components.

## Basic Subscribe

```typescript
import { useCounterStore } from '@/modules/cores/stores/counter.store'

// Subscribe to all state changes
const unsubscribe = useCounterStore.subscribe((state, prevState) => {
  console.log('State changed:', { prev: prevState, current: state })
})

// Later: cleanup
unsubscribe()
```

---

## Subscribe with Selector

Listen to specific state slices for better performance.

```typescript
import { useCounterStore } from '@/modules/cores/stores/counter.store'

// Only fires when count changes
const unsubscribe = useCounterStore.subscribe(
  (state) => state.count,
  (count, prevCount) => {
    console.log(`Count changed: ${prevCount} → ${count}`)
  }
)
```

---

## subscribeWithSelector Middleware

For more control over subscriptions.

```typescript
// modules/cores/stores/app.store.ts
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface AppState {
  theme: 'light' | 'dark'
  user: User | null
  setTheme: (theme: 'light' | 'dark') => void
  setUser: (user: User | null) => void
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector((set) => ({
    theme: 'light',
    user: null,
    setTheme: (theme) => set({ theme }),
    setUser: (user) => set({ user }),
  }))
)
```

```typescript
// Subscribe with equality function
useAppStore.subscribe(
  (state) => state.user,
  (user, prevUser) => {
    if (user && !prevUser) {
      console.log('User logged in:', user.name)
    } else if (!user && prevUser) {
      console.log('User logged out')
    }
  },
  {
    equalityFn: (a, b) => a?.id === b?.id,
    fireImmediately: true,
  }
)
```

---

## Transient Updates (No Re-render)

For frequent updates that shouldn't trigger re-renders.

```typescript
// modules/cores/stores/mouse.store.ts
import { create } from 'zustand'

interface MouseState {
  position: { x: number; y: number }
  // Transient: not reactive
  _transient: {
    lastMoveTime: number
  }
  setPosition: (x: number, y: number) => void
}

export const useMouseStore = create<MouseState>()((set, get) => ({
  position: { x: 0, y: 0 },
  _transient: { lastMoveTime: 0 },

  setPosition: (x, y) => {
    // Update transient without triggering re-render
    get()._transient.lastMoveTime = Date.now()

    // Only update reactive state occasionally
    set({ position: { x, y } })
  },
}))
```

```typescript
// Read transient state outside React
const lastMove = useMouseStore.getState()._transient.lastMoveTime
```

---

## Sync with External Systems

### localStorage Sync

```typescript
// modules/cores/stores/sync/local-storage.ts
import { useSettingsStore } from '../settings.store'

// Sync theme to localStorage (without persist middleware)
useSettingsStore.subscribe(
  (state) => state.theme,
  (theme) => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }
)
```

### Analytics Tracking

```typescript
// modules/cores/stores/sync/analytics.ts
import { useCartStore } from '@/modules/cart/src/stores/cart.store'

useCartStore.subscribe(
  (state) => state.items.length,
  (itemCount, prevCount) => {
    if (itemCount > prevCount) {
      // Track add to cart
      analytics.track('cart_item_added', { itemCount })
    } else if (itemCount < prevCount) {
      // Track remove from cart
      analytics.track('cart_item_removed', { itemCount })
    }
  }
)
```

### WebSocket Sync

```typescript
// modules/cores/stores/sync/websocket.ts
import { usePresenceStore } from '../presence.store'

const socket = new WebSocket('wss://api.example.com/presence')

// Send state changes to server
usePresenceStore.subscribe(
  (state) => state.status,
  (status) => {
    socket.send(JSON.stringify({ type: 'status_update', status }))
  }
)

// Receive updates from server
socket.onmessage = (event) => {
  const data = JSON.parse(event.data)
  if (data.type === 'status_update') {
    usePresenceStore.getState().setStatus(data.status)
  }
}
```

---

## Cleanup Pattern

```typescript
// modules/cores/hooks/use-store-subscription.ts


import { useEffect } from 'react'

export function useStoreSubscription<T, S>(
  store: { subscribe: (selector: (state: T) => S, listener: (state: S, prevState: S) => void) => () => void },
  selector: (state: T) => S,
  listener: (state: S, prevState: S) => void
) {
  useEffect(() => {
    const unsubscribe = store.subscribe(selector, listener)
    return unsubscribe
  }, [store, selector, listener])
}
```

```typescript
// Usage in component
useStoreSubscription(
  useAppStore,
  (state) => state.theme,
  (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
  }
)
```

---

## Best Practices

1. **Always unsubscribe** to prevent memory leaks
2. **Use selectors** to minimize callback invocations
3. **subscribeWithSelector** for complex equality checks
4. **Transient state** for high-frequency updates
5. **Initialize subscriptions** in app bootstrap, not components
