# Third-Party Integration

## @next/third-parties
```bash
bun add @next/third-parties
```

## Google Analytics
```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html><body>
      {children}
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </body></html>
  )
}
```

## Google Tag Manager
```typescript
import { GoogleTagManager } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <GoogleTagManager gtmId="GTM-XXXXXX" />
      <body>{children}</body>
    </html>
  )
}
```

## YouTube & Google Maps
```typescript
import { YouTubeEmbed, GoogleMapsEmbed } from '@next/third-parties/google'

export default function Page() {
  return (
    <>
      <YouTubeEmbed videoid="dQw4w9WgXcQ" height={400} />
      <GoogleMapsEmbed
        apiKey={process.env.GOOGLE_MAPS_KEY}
        height={400}
        mode="place"
        q="Eiffel+Tower"
      />
    </>
  )
}
```

## Custom Scripts
```typescript
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="lazyOnload" />
      <Script id="inline" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];`}
      </Script>
    </>
  )
}
```

## Vercel Analytics
```bash
bun add @vercel/analytics @vercel/speed-insights
```

```typescript
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html><body>
      {children}
      <Analytics />
      <SpeedInsights />
    </body></html>
  )
}
```
