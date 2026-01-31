---
name: "Effect Patterns Template"
description: "useEffect patterns - event listeners, timers, subscriptions, cleanup with TypeScript"
tags: ["react", "hooks", "useEffect", "cleanup", "typescript"]
difficulty: "intermediate"
---

# Effect Patterns: Complete Examples

All examples use React 19 with TypeScript and follow SOLID principles. Every effect includes proper cleanup to prevent memory leaks.

---

## Event Listener

Window resize listener with cleanup.

```typescript
// Location: modules/features/components/WindowSize.tsx
import { useState, useEffect } from 'react'

interface WindowSizeProps {
  onResize?: (width: number, height: number) => void
}

/**
 * Display and track window size with resize listener.
 *
 * @param onResize - Optional callback fired on resize
 */
export function WindowSize({ onResize }: WindowSizeProps) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      setWindowSize({ width, height })
      onResize?.(width, height)
    }

    // Add listener
    window.addEventListener('resize', handleResize)

    // Cleanup: remove listener
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [onResize])

  return (
    <div className="p-4 border rounded">
      <p className="font-medium">Window Size:</p>
      <p>{windowSize.width} x {windowSize.height}</p>
    </div>
  )
}
```

---

## Timer/Interval

setInterval with cleanup for countdown timer.

```typescript
// Location: modules/features/components/Countdown.tsx
import { useState, useEffect } from 'react'

interface CountdownProps {
  initialSeconds: number
  onComplete?: () => void
}

/**
 * Countdown timer with interval cleanup.
 *
 * @param initialSeconds - Starting countdown value
 * @param onComplete - Callback when countdown reaches 0
 */
export function Countdown({ initialSeconds, onComplete }: CountdownProps) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning || seconds <= 0) return

    const intervalId = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          setIsRunning(false)
          onComplete?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Cleanup: clear interval
    return () => {
      clearInterval(intervalId)
    }
  }, [isRunning, seconds, onComplete])

  const start = () => setIsRunning(true)
  const pause = () => setIsRunning(false)
  const reset = () => {
    setSeconds(initialSeconds)
    setIsRunning(false)
  }

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
      <div className="text-4xl font-mono font-bold">
        {formatTime(seconds)}
      </div>

      <div className="flex gap-2">
        {!isRunning ? (
          <button onClick={start} className="px-4 py-2 bg-green-500 text-white rounded">
            Start
          </button>
        ) : (
          <button onClick={pause} className="px-4 py-2 bg-yellow-500 text-white rounded">
            Pause
          </button>
        )}
        <button onClick={reset} className="px-4 py-2 bg-gray-500 text-white rounded">
          Reset
        </button>
      </div>

      {seconds === 0 && (
        <p className="text-green-600 font-semibold">Time's up!</p>
      )}
    </div>
  )
}
```

---

## Subscription

WebSocket connection with cleanup.

```typescript
// Location: modules/features/components/ChatRoom.tsx
import { useState, useEffect } from 'react'

interface Message {
  id: string
  text: string
  timestamp: number
}

interface ChatRoomProps {
  roomId: string
  serverUrl: string
}

/**
 * Chat room with WebSocket subscription and cleanup.
 *
 * @param roomId - Chat room identifier
 * @param serverUrl - WebSocket server URL
 */
export function ChatRoom({ roomId, serverUrl }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')

  useEffect(() => {
    setConnectionStatus('connecting')

    // Create WebSocket connection
    const ws = new WebSocket(`${serverUrl}?room=${roomId}`)

    ws.onopen = () => {
      setConnectionStatus('connected')
      console.log(`Connected to room: ${roomId}`)
    }

    ws.onmessage = (event) => {
      try {
        const message: Message = JSON.parse(event.data)
        setMessages(prev => [...prev, message])
      } catch (error) {
        console.error('Failed to parse message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setConnectionStatus('disconnected')
    }

    ws.onclose = () => {
      setConnectionStatus('disconnected')
      console.log(`Disconnected from room: ${roomId}`)
    }

    // Cleanup: close WebSocket connection
    return () => {
      ws.close()
    }
  }, [roomId, serverUrl])

  const sendMessage = (text: string) => {
    // Send logic would go here
    console.log('Sending:', text)
  }

  return (
    <div className="flex flex-col h-96 border rounded-lg">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-bold">Room: {roomId}</h2>
        <span className={`px-2 py-1 rounded text-sm ${
          connectionStatus === 'connected' ? 'bg-green-100 text-green-700' :
          connectionStatus === 'connecting' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {connectionStatus}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(message => (
          <div key={message.id} className="p-2 bg-gray-100 rounded">
            <p>{message.text}</p>
            <span className="text-xs text-gray-500">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Keyboard Shortcuts

Global keydown listener with cleanup.

```typescript
// Location: modules/features/components/KeyboardShortcuts.tsx
import { useEffect } from 'react'

interface Shortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: () => void
  description: string
}

interface KeyboardShortcutsProps {
  shortcuts: Shortcut[]
  enabled?: boolean
}

/**
 * Global keyboard shortcuts handler with cleanup.
 *
 * @param shortcuts - Array of keyboard shortcuts
 * @param enabled - Enable/disable shortcuts (default: true)
 */
export function KeyboardShortcuts({ shortcuts, enabled = true }: KeyboardShortcutsProps) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey
        const altMatch = shortcut.altKey ? event.altKey : !event.altKey

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault()
          shortcut.action()
          break
        }
      }
    }

    // Add listener
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup: remove listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [shortcuts, enabled])

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold mb-2">Keyboard Shortcuts</h3>
      <ul className="space-y-1">
        {shortcuts.map((shortcut, index) => (
          <li key={index} className="flex justify-between text-sm">
            <span>{shortcut.description}</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded font-mono">
              {shortcut.ctrlKey && 'Ctrl+'}
              {shortcut.shiftKey && 'Shift+'}
              {shortcut.altKey && 'Alt+'}
              {shortcut.key.toUpperCase()}
            </kbd>
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-500 mt-2">
        Status: {enabled ? 'Enabled' : 'Disabled'}
      </p>
    </div>
  )
}

/**
 * Example usage component.
 */
export function ShortcutsExample() {
  const shortcuts: Shortcut[] = [
    {
      key: 's',
      ctrlKey: true,
      action: () => console.log('Save triggered'),
      description: 'Save',
    },
    {
      key: 'n',
      ctrlKey: true,
      action: () => console.log('New triggered'),
      description: 'New',
    },
    {
      key: '/',
      action: () => console.log('Search triggered'),
      description: 'Search',
    },
  ]

  return <KeyboardShortcuts shortcuts={shortcuts} enabled />
}
```

---

## AbortController Pattern

Fetch with cancellation on unmount or dependency change.

```typescript
// Location: modules/features/components/UserData.tsx
import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface UserDataProps {
  userId: string
}

/**
 * Fetch user data with AbortController cleanup.
 * NOTE: For data fetching, prefer React 19's `use()` hook or TanStack Query.
 * This pattern is useful when you need manual control over fetch cancellation.
 *
 * @param userId - User ID to fetch
 */
export function UserData({ userId }: UserDataProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Create AbortController for this effect
    const controller = new AbortController()
    const signal = controller.signal

    setLoading(true)
    setError(null)

    fetch(`/api/users/${userId}`, { signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: User) => {
        // Only update state if not aborted
        if (!signal.aborted) {
          setUser(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        // Ignore abort errors
        if (err.name === 'AbortError') return

        if (!signal.aborted) {
          setError(err.message)
          setLoading(false)
        }
      })

    // Cleanup: abort fetch on unmount or userId change
    return () => {
      controller.abort()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="p-4 border rounded">
        <p className="text-gray-500">Loading user...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border rounded bg-red-50">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-4 border rounded">
        <p className="text-gray-500">No user found</p>
      </div>
    )
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold text-lg">{user.name}</h3>
      <p className="text-gray-600">{user.email}</p>
      <p className="text-xs text-gray-400 mt-2">ID: {user.id}</p>
    </div>
  )
}
```

---

## Document Title Sync

Sync document title with component state.

```typescript
// Location: modules/features/components/NotificationCounter.tsx
import { useState, useEffect } from 'react'

interface NotificationCounterProps {
  appName?: string
}

/**
 * Notification counter that syncs unread count to document title.
 *
 * @param appName - Application name for title prefix (default: 'App')
 */
export function NotificationCounter({ appName = 'App' }: NotificationCounterProps) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Save original title
    const originalTitle = document.title

    // Update title with unread count
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) ${appName}`
    } else {
      document.title = appName
    }

    // Cleanup: restore original title
    return () => {
      document.title = originalTitle
    }
  }, [unreadCount, appName])

  const addNotification = () => setUnreadCount(prev => prev + 1)
  const clearNotifications = () => setUnreadCount(0)

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Notifications</h3>
        {unreadCount > 0 && (
          <span className="px-2 py-1 bg-red-500 text-white rounded-full text-sm">
            {unreadCount}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={addNotification}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Notification
        </button>
        <button
          onClick={clearNotifications}
          className="px-4 py-2 bg-gray-500 text-white rounded"
          disabled={unreadCount === 0}
        >
          Clear All
        </button>
      </div>

      <p className="text-sm text-gray-600">
        Check your browser tab to see the title change!
      </p>
    </div>
  )
}
```

---

## Online/Offline Detection

Network status listener with cleanup.

```typescript
// Location: modules/features/components/OnlineStatus.tsx
import { useState, useEffect } from 'react'

interface OnlineStatusProps {
  onStatusChange?: (isOnline: boolean) => void
}

/**
 * Display and track network online/offline status.
 *
 * @param onStatusChange - Callback fired when status changes
 */
export function OnlineStatus({ onStatusChange }: OnlineStatusProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [lastChange, setLastChange] = useState<Date | null>(null)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setLastChange(new Date())
      onStatusChange?.(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setLastChange(new Date())
      onStatusChange?.(false)
    }

    // Add listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup: remove listeners
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [onStatusChange])

  return (
    <div className={`p-4 border rounded-lg ${isOnline ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="font-semibold">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {lastChange && (
        <p className="text-sm text-gray-600 mt-2">
          Last change: {lastChange.toLocaleTimeString()}
        </p>
      )}

      {!isOnline && (
        <p className="text-sm text-red-600 mt-2">
          You are currently offline. Some features may be unavailable.
        </p>
      )}
    </div>
  )
}
```

---

## Best Practices

1. **Always cleanup** - Return cleanup function from every effect with side effects
2. **Dependency array** - Include all values used inside effect
3. **AbortController for fetch** - Cancel in-flight requests on unmount
4. **Event listeners** - Remove on cleanup to prevent memory leaks
5. **Timers** - Clear intervals/timeouts on cleanup
6. **WebSocket/subscriptions** - Close connections on cleanup
7. **Document for complex effects** - Use JSDoc to explain intent
8. **Prefer React 19's use()** - For data fetching, use `use()` hook instead of useEffect

---

## When NOT to use useEffect

```typescript
// ❌ BAD - Data fetching with useEffect (use React 19's use() or TanStack Query)
useEffect(() => {
  fetch('/api/users').then(res => res.json()).then(setUsers)
}, [])

// ✅ GOOD - Use React 19's use() hook
const users = use(fetchUsers())

// ❌ BAD - Derived state in useEffect
useEffect(() => {
  setFilteredItems(items.filter(i => i.active))
}, [items])

// ✅ GOOD - Compute directly
const filteredItems = useMemo(() => items.filter(i => i.active), [items])
```
