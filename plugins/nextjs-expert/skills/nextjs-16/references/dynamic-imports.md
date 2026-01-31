---
name: dynamic-imports
description: Lazy loading and code splitting with next/dynamic and React.lazy
when-to-use: reducing bundle size, conditional loading, heavy components
keywords: dynamic imports, lazy loading, code splitting, ssr false
priority: medium
requires: app-router.md
related: styling.md
---

# Dynamic Imports & Lazy Loading

## When to Use

- Browser-only libraries (maps, editors)
- Heavy components (charts, PDFs)
- Conditional loading (admin panels)
- Reducing initial bundle size

## Why Lazy Loading

| Feature | Benefit |
|---------|---------|
| Code splitting | Smaller initial load |
| No SSR | Client-only libraries |
| On-demand | Load when needed |
| Auto-split | Route-based chunks |

## next/dynamic (No SSR)
```typescript
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('@/components/Chart'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
})

export default function Dashboard() {
  return <HeavyChart data={chartData} />
}
```

## Named Exports
```typescript
const Modal = dynamic(
  () => import('@/components/Modal').then(mod => mod.Modal),
  { ssr: false }
)
```

## React.lazy with Suspense
```typescript
'use client'
import { lazy, Suspense } from 'react'

const AdminPanel = lazy(() => import('./AdminPanel'))

export default function App({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div>
      {isAdmin && (
        <Suspense fallback={<div>Loading...</div>}>
          <AdminPanel />
        </Suspense>
      )}
    </div>
  )
}
```

## Conditional Loading
```typescript
'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const Editor = dynamic(() => import('./Editor'), { ssr: false })

export default function Page() {
  const [showEditor, setShowEditor] = useState(false)

  return (
    <div>
      <button onClick={() => setShowEditor(true)}>Open Editor</button>
      {showEditor && <Editor />}
    </div>
  )
}
```

## Loading External Libraries
```typescript
'use client'
import { useEffect, useState } from 'react'

export default function MapComponent() {
  const [Map, setMap] = useState<any>(null)

  useEffect(() => {
    import('leaflet').then(L => setMap(L))
  }, [])

  if (!Map) return <div>Loading map...</div>
  return <div id="map" />
}
```

## Auto Code Splitting
```
app/
├── dashboard/
│   ├── page.tsx      # Bundle A
│   └── settings/
│       └── page.tsx  # Bundle B (auto-split)
└── blog/
    └── page.tsx      # Bundle C (auto-split)
```
