# Analytics & Web Vitals

## useReportWebVitals
```typescript
// app/layout.tsx
import { WebVitals } from '@/modules/cores/analytics/src/components/WebVitals'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
```

```typescript
// modules/cores/analytics/src/components/WebVitals.tsx
'use client'
import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
    // Send to analytics
    sendToAnalytics(metric)
  })
  return null
}
```

## Web Vitals Metrics
```typescript
interface Metric {
  id: string           // Unique ID
  name: string         // LCP, FID, CLS, FCP, TTFB, INP
  value: number        // Metric value
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number        // Change since last report
  navigationType: 'navigate' | 'reload' | 'back-forward' | 'prerender'
}
```

## Send to Analytics Service
```typescript
function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    id: metric.id,
  })

  // Use sendBeacon for reliability
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', body)
  } else {
    fetch('/api/analytics', { body, method: 'POST', keepalive: true })
  }
}
```

## Google Analytics Integration
```typescript
function sendToGA(metric: Metric) {
  window.gtag?.('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.id,
    non_interaction: true,
  })
}
```

## Vercel Analytics
```bash
bun add @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```
