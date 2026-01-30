# Script Optimization

## Loading Strategies
```typescript
import Script from 'next/script'

export default function Page() {
  return (
    <>
      {/* Before hydration - blocking */}
      <Script src="/critical.js" strategy="beforeInteractive" />

      {/* After hydration - default */}
      <Script src="/analytics.js" strategy="afterInteractive" />

      {/* When browser is idle */}
      <Script src="/widget.js" strategy="lazyOnload" />
    </>
  )
}
```

## Event Handlers
```typescript
<Script
  src="https://analytics.com/script.js"
  strategy="afterInteractive"
  onLoad={() => console.log('Script loaded')}
  onReady={() => console.log('Script ready')}
  onError={(e) => console.error('Script error', e)}
/>
```

## Inline Scripts
```typescript
<Script id="analytics-init" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

## Google Analytics
```typescript
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_ID');
          `}
        </Script>
      </body>
    </html>
  )
}
```

## Third-Party Scripts Module
```typescript
// modules/cores/analytics/src/components/Analytics.tsx
import Script from 'next/script'

export function Analytics() {
  return (
    <>
      <Script src="https://analytics.example.com/script.js" strategy="lazyOnload" />
    </>
  )
}
```

## Attributes
```typescript
<Script
  src="/script.js"
  async
  defer
  crossOrigin="anonymous"
  nonce="UNIQUE_NONCE"
  data-custom="value"
/>
```
