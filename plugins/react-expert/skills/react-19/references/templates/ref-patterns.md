---
name: "Ref Patterns Template"
description: "useRef patterns - DOM access, mutable values, previous value, timer refs with TypeScript"
tags: ["react", "hooks", "useRef", "DOM", "typescript"]
difficulty: "beginner"
---

# Ref Patterns: Complete Examples

## DOM Focus

Focus input on mount:

```typescript
import { useRef, useEffect } from 'react'

/**
 * Auto-focus input component.
 * Location: modules/cores/components/AutoFocusInput.tsx
 */
export function AutoFocusInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return <input ref={inputRef} type="text" placeholder="Auto-focused" />
}
```

---

## DOM Measurement

Measure element dimensions:

```typescript
import { useRef, useState, useLayoutEffect } from 'react'

/**
 * Component that measures its own dimensions.
 * Location: modules/cores/components/MeasuredBox.tsx
 */
export function MeasuredBox() {
  const divRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (divRef.current) {
      const { width, height } = divRef.current.getBoundingClientRect()
      setDimensions({ width, height })
    }
  }, [])

  return (
    <div ref={divRef} className="p-4 border">
      <p>Width: {dimensions.width}px</p>
      <p>Height: {dimensions.height}px</p>
    </div>
  )
}
```

---

## Previous Value Hook

Track previous value of a prop or state:

```typescript
import { useRef, useEffect } from 'react'

/**
 * Custom hook to track previous value.
 * Location: modules/cores/hooks/usePrevious.ts
 *
 * @param value - Current value to track
 * @returns Previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

// Usage example
function Counter({ count }: { count: number }) {
  const prevCount = usePrevious(count)

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount ?? 'none'}</p>
    </div>
  )
}
```

---

## Timer Reference

Clear interval on unmount:

```typescript
import { useRef, useEffect, useState } from 'react'

/**
 * Timer component with cleanup.
 * Location: modules/cores/components/Timer.tsx
 */
export function Timer() {
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const handleReset = () => {
    setSeconds(0)
  }

  return (
    <div>
      <p>Elapsed: {seconds}s</p>
      <button onClick={handleReset}>Reset</button>
    </div>
  )
}
```

---

## Mutable Value

Store value without triggering re-render:

```typescript
import { useRef, useState } from 'react'

/**
 * Click tracker that doesn't trigger re-renders.
 * Location: modules/cores/components/ClickTracker.tsx
 */
export function ClickTracker() {
  const clickCountRef = useRef(0)
  const [renderCount, setRenderCount] = useState(0)

  const handleClick = () => {
    // Increment without re-render
    clickCountRef.current += 1
    console.log(`Total clicks: ${clickCountRef.current}`)
  }

  const handleForceRender = () => {
    setRenderCount((c) => c + 1)
  }

  return (
    <div>
      <p>Renders: {renderCount}</p>
      <p>Clicks: {clickCountRef.current} (check console)</p>
      <button onClick={handleClick}>Click (no re-render)</button>
      <button onClick={handleForceRender}>Force re-render</button>
    </div>
  )
}
```

---

## Callback Ref Pattern

Dynamic ref for conditional rendering:

```typescript
import { useState, useCallback } from 'react'

/**
 * Dynamic height measurement with callback ref.
 * Location: modules/cores/components/DynamicHeight.tsx
 */
export function DynamicHeight() {
  const [height, setHeight] = useState(0)

  const measureRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height)
    }
  }, [])

  return (
    <div>
      <div ref={measureRef} className="p-4 border">
        Content with dynamic height
      </div>
      <p>Measured height: {height}px</p>
    </div>
  )
}
```

---

## Best Practices

1. **DOM access only** - Use refs for DOM nodes, not state
2. **No re-renders** - Refs don't trigger re-renders when mutated
3. **Cleanup timers** - Always clear intervals/timeouts in useEffect cleanup
4. **Null checks** - Always check `ref.current` before accessing
5. **useLayoutEffect for measurements** - Synchronous DOM reads before paint
6. **Callback refs for conditional rendering** - Dynamic elements
