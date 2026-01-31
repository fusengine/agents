---
name: profiling-devtools
description: React DevTools Profiler usage - recording, analysis, Profiler component, metrics
when-to-use: performance debugging, render analysis, optimization verification
keywords: profiler, devtools, flamegraph, metrics, performance
priority: medium
related: ../profiling.md, ../react-compiler.md
---

# Profiling Examples

## Profiler Component API

```typescript
import { Profiler, ProfilerOnRenderCallback } from 'react'

const onRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
  })
}

export function App() {
  return (
    <Profiler id="App" onRender={onRender}>
      <Header />
      <Main />
      <Footer />
    </Profiler>
  )
}
```

---

## Nested Profilers

```typescript
import { Profiler, ProfilerOnRenderCallback } from 'react'

const logRender: ProfilerOnRenderCallback = (id, phase, actualDuration) => {
  if (actualDuration > 10) {
    console.warn(`Slow render: ${id} took ${actualDuration}ms`)
  }
}

export function Dashboard() {
  return (
    <Profiler id="Dashboard" onRender={logRender}>
      <Profiler id="Sidebar" onRender={logRender}>
        <Sidebar />
      </Profiler>

      <Profiler id="MainContent" onRender={logRender}>
        <MainContent />
      </Profiler>

      <Profiler id="ActivityFeed" onRender={logRender}>
        <ActivityFeed />
      </Profiler>
    </Profiler>
  )
}
```

---

## Performance Monitoring Hook

```typescript
import { Profiler, ProfilerOnRenderCallback, useCallback, useRef } from 'react'

interface RenderMetrics {
  id: string
  phase: 'mount' | 'update'
  actualDuration: number
  baseDuration: number
  timestamp: number
}

export function useRenderMetrics() {
  const metricsRef = useRef<RenderMetrics[]>([])

  const onRender: ProfilerOnRenderCallback = useCallback((
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime
  ) => {
    metricsRef.current.push({
      id,
      phase,
      actualDuration,
      baseDuration,
      timestamp: startTime,
    })

    // Keep only last 100 metrics
    if (metricsRef.current.length > 100) {
      metricsRef.current = metricsRef.current.slice(-100)
    }
  }, [])

  const getMetrics = useCallback(() => metricsRef.current, [])

  const getAverageRenderTime = useCallback((componentId: string) => {
    const componentMetrics = metricsRef.current.filter((m) => m.id === componentId)
    if (componentMetrics.length === 0) return 0

    const total = componentMetrics.reduce((sum, m) => sum + m.actualDuration, 0)
    return total / componentMetrics.length
  }, [])

  return { onRender, getMetrics, getAverageRenderTime }
}

// Usage
function App() {
  const { onRender, getAverageRenderTime } = useRenderMetrics()

  return (
    <Profiler id="App" onRender={onRender}>
      <Dashboard />
      <button onClick={() => console.log(getAverageRenderTime('App'))}>
        Log Average
      </button>
    </Profiler>
  )
}
```

---

## Send Metrics to Analytics

```typescript
import { Profiler, ProfilerOnRenderCallback } from 'react'

const sendToAnalytics = (metrics: Record<string, unknown>) => {
  // Send to your analytics service
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/metrics', JSON.stringify(metrics))
  }
}

const onRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration
) => {
  // Only report slow renders in production
  if (process.env.NODE_ENV === 'production' && actualDuration > 16) {
    sendToAnalytics({
      type: 'slow-render',
      component: id,
      phase,
      duration: actualDuration,
      baseline: baseDuration,
      timestamp: Date.now(),
    })
  }
}

export function MonitoredApp() {
  return (
    <Profiler id="App" onRender={onRender}>
      <App />
    </Profiler>
  )
}
```

---

## Development-Only Profiling

```typescript
import { Profiler, ProfilerOnRenderCallback, ReactNode } from 'react'

interface DevProfilerProps {
  id: string
  children: ReactNode
}

const devOnRender: ProfilerOnRenderCallback = (id, phase, actualDuration) => {
  const color = actualDuration > 16 ? 'red' : actualDuration > 5 ? 'orange' : 'green'
  console.log(`%c${id} (${phase}): ${actualDuration.toFixed(2)}ms`, `color: ${color}`)
}

export function DevProfiler({ id, children }: DevProfilerProps) {
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>
  }

  return (
    <Profiler id={id} onRender={devOnRender}>
      {children}
    </Profiler>
  )
}

// Usage
function Dashboard() {
  return (
    <DevProfiler id="Dashboard">
      <ExpensiveComponent />
    </DevProfiler>
  )
}
```

---

## React DevTools Usage Guide

### Recording a Profile

1. Open React DevTools → Profiler tab
2. Click "Start profiling" (record button)
3. Perform the interaction to measure
4. Click "Stop profiling"
5. Analyze the flamegraph

### Flamegraph Analysis

```text
┌─────────────────────────────────────────────┐
│ App (5ms)                                   │
├─────────────────────┬───────────────────────┤
│ Header (1ms)        │ Content (4ms)         │
│                     ├───────────┬───────────┤
│                     │ List (2ms)│ Form (2ms)│
└─────────────────────┴───────────┴───────────┘

- Width = render time
- Color = render frequency (gray = didn't render)
- Click component for details
```

### Settings to Enable

- "Record why each component rendered"
- "Highlight updates when components render"

---

## Why Did You Render (Development)

```typescript
// wdyr.ts - import at app entry BEFORE React
import React from 'react'

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  })
}

// In component file
function ExpensiveList({ items }: Props) {
  return items.map((item) => <Item key={item.id} item={item} />)
}

ExpensiveList.whyDidYouRender = true
```

```bash
npm install --save-dev @welldone-software/why-did-you-render
```
