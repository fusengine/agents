---
name: fonts
description: Font optimization with next/font, Google Fonts, and local fonts
when-to-use: font loading, performance, custom fonts
keywords: next/font, Google Fonts, local fonts, optimization
priority: medium
requires: app-router.md
related: images.md
---

# Font Optimization

## When to Use

- Loading Google Fonts
- Using local custom fonts
- Optimizing font loading
- Tailwind CSS integration

## Why next/font

| Feature | Benefit |
|---------|---------|
| Self-hosted | No external requests |
| No layout shift | Size-adjusted fallback |
| Subset | Load only needed chars |
| CSS Variables | Easy theming |

## Google Fonts
```typescript
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto-mono',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

## Local Fonts
```typescript
import localFont from 'next/font/local'

const customFont = localFont({
  src: [
    { path: './fonts/Custom-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/Custom-Bold.woff2', weight: '700', style: 'normal' },
    { path: './fonts/Custom-Italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-custom',
  display: 'swap',
})
```

## Tailwind CSS Integration
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-inter: 'Inter', sans-serif;
  --font-mono: 'Roboto Mono', monospace;
}

body {
  font-family: var(--font-inter);
}

code {
  font-family: var(--font-mono);
}
```

## Font Options
```typescript
const font = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'swap',        // 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
})
```

## Usage in Components
```typescript
import { inter } from '@/app/fonts'

export default function Card() {
  return <div className={inter.className}>Content</div>
}
```
