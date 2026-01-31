---
name: use-effect-event-template
description: useEffectEvent hook patterns - non-reactive callbacks in effects
---

# useEffectEvent Hook Patterns

## Basic Pattern - Event Handler in Effect

```typescript
// modules/analytics/hooks/usePageTracker.ts
import { useEffect, useEffectEvent } from 'react'

interface PageTrackerProps {
  pageId: string
  userId: string
  trackingEnabled: boolean
}

/**
 * Track page views without re-running effect on user/settings changes.
 */
export function usePageTracker({
  pageId,
  userId,
  trackingEnabled
}: PageTrackerProps) {
  // Always has fresh userId and trackingEnabled
  const trackVisit = useEffectEvent(() => {
    if (trackingEnabled) {
      analytics.track('page_view', {
        page: pageId,
        user: userId,
        timestamp: Date.now()
      })
    }
  })

  useEffect(() => {
    // Only re-runs when pageId changes
    trackVisit()
  }, [pageId]) // userId and trackingEnabled NOT in deps
}
```

---

## WebSocket Event Handler

```typescript
// modules/chat/hooks/useChatSocket.ts
import { useEffect, useEffectEvent, useState } from 'react'
import type { Message, ConnectionState } from '../interfaces/chat.interface'

interface ChatSocketOptions {
  roomId: string
  userId: string
  onMessage: (message: Message) => void
}

/**
 * WebSocket connection with stable event handler.
 */
export function useChatSocket({
  roomId,
  userId,
  onMessage
}: ChatSocketOptions) {
  const [state, setState] = useState<ConnectionState>('connecting')

  // Stable handler - always has latest onMessage
  const handleMessage = useEffectEvent((event: MessageEvent) => {
    const message = JSON.parse(event.data) as Message
    onMessage(message) // Always calls latest onMessage
  })

  // Stable error handler
  const handleError = useEffectEvent((error: Event) => {
    console.error(`Socket error for user ${userId}:`, error)
    setState('error')
  })

  useEffect(() => {
    const ws = new WebSocket(`wss://chat.example.com/${roomId}`)

    ws.onopen = () => setState('connected')
    ws.onmessage = handleMessage
    ws.onerror = handleError
    ws.onclose = () => setState('disconnected')

    return () => ws.close()
  }, [roomId]) // Only reconnect when roomId changes

  return { state }
}
```

---

## Window Event Listener

```typescript
// modules/cores/hooks/useWindowResize.ts
import { useEffect, useEffectEvent, useState } from 'react'

interface WindowSize {
  width: number
  height: number
}

/**
 * Track window size with stable resize handler.
 */
export function useWindowResize(onResize?: (size: WindowSize) => void) {
  const [size, setSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight
  })

  // Stable handler - no re-subscription on callback change
  const handleResize = useEffectEvent(() => {
    const newSize = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    setSize(newSize)
    onResize?.(newSize) // Always calls latest onResize
  })

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty deps - never re-subscribes

  return size
}
```

---

## Keyboard Shortcuts

```typescript
// modules/cores/hooks/useKeyboardShortcut.ts
import { useEffect, useEffectEvent } from 'react'

interface ShortcutOptions {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  onTrigger: () => void
  enabled?: boolean
}

/**
 * Keyboard shortcut handler.
 */
export function useKeyboardShortcut({
  key,
  ctrlKey = false,
  shiftKey = false,
  onTrigger,
  enabled = true
}: ShortcutOptions) {
  // Stable handler with fresh enabled and onTrigger
  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (!enabled) return

    const matches =
      event.key.toLowerCase() === key.toLowerCase() &&
      event.ctrlKey === ctrlKey &&
      event.shiftKey === shiftKey

    if (matches) {
      event.preventDefault()
      onTrigger()
    }
  })

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, []) // Never re-subscribes
}

// Usage
function Editor() {
  const [content, setContent] = useState('')

  useKeyboardShortcut({
    key: 's',
    ctrlKey: true,
    onTrigger: () => saveDocument(content), // Always uses latest content
    enabled: true
  })

  return <textarea value={content} onChange={(e) => setContent(e.target.value)} />
}
```

---

## Interval with Fresh State

```typescript
// modules/timer/hooks/useAutoSave.ts
import { useEffect, useEffectEvent, useRef } from 'react'

interface AutoSaveOptions<T> {
  data: T
  onSave: (data: T) => Promise<void>
  interval: number
  enabled: boolean
}

/**
 * Auto-save with fresh data access.
 */
export function useAutoSave<T>({
  data,
  onSave,
  interval,
  enabled
}: AutoSaveOptions<T>) {
  const lastSavedRef = useRef<T>(data)

  // Always has fresh data and enabled state
  const save = useEffectEvent(async () => {
    if (!enabled) return
    if (JSON.stringify(data) === JSON.stringify(lastSavedRef.current)) return

    await onSave(data)
    lastSavedRef.current = data
  })

  useEffect(() => {
    const id = setInterval(save, interval)
    return () => clearInterval(id)
  }, [interval]) // Only restart on interval change
}

// Usage
function DocumentEditor({ documentId }: { documentId: string }) {
  const [content, setContent] = useState('')
  const [isDraft, setIsDraft] = useState(true)

  useAutoSave({
    data: { documentId, content },
    onSave: async (data) => {
      await api.saveDocument(data)
    },
    interval: 30000, // 30 seconds
    enabled: isDraft // Only save drafts
  })

  return <textarea value={content} onChange={(e) => setContent(e.target.value)} />
}
```

---

## Animation Frame

```typescript
// modules/cores/hooks/useAnimationLoop.ts
import { useEffect, useEffectEvent, useRef } from 'react'

/**
 * Animation loop with stable tick handler.
 */
export function useAnimationLoop(
  onTick: (deltaTime: number) => void,
  running: boolean
) {
  const lastTimeRef = useRef(0)

  // Stable handler - always has fresh onTick and running
  const tick = useEffectEvent((time: number) => {
    if (!running) return

    const deltaTime = lastTimeRef.current ? time - lastTimeRef.current : 0
    lastTimeRef.current = time

    onTick(deltaTime)
  })

  useEffect(() => {
    if (!running) return

    let animationId: number

    const loop = (time: number) => {
      tick(time)
      animationId = requestAnimationFrame(loop)
    }

    animationId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animationId)
      lastTimeRef.current = 0
    }
  }, [running]) // Only toggle based on running
}
```

---

## Rules

- **Call only from useEffect** - Never in render or event handlers
- **Never add to deps** - useEffectEvent is NOT a dependency
- **Always fresh values** - Has latest props/state without effect re-run
- **No conditional creation** - Create at top level of component
- **Purpose:** Stable identity with fresh values
