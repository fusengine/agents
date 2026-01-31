---
name: styling
description: CSS Modules, global CSS, Sass, and CSS-in-JS integration
when-to-use: styling components, scoped styles, global styles
keywords: CSS Modules, global CSS, Sass, CSS-in-JS, styled-components
priority: medium
related: fonts.md, third-party.md
---

# Styling

## When to Use

- CSS Modules
- Global CSS
- Sass integration
- CSS-in-JS (client)

## Why CSS Modules

| Feature | Benefit |
|---------|---------|
| Scoped | No class conflicts |
| Turbopack | Optimized loading |
| Co-located | Next to components |
| Type-safe | With typed-css-modules |

> **Note**: For Tailwind CSS, use the `tailwindcss` skill.

## CSS Modules
```css
/* modules/ui/components/Button.module.css */
.button { background: blue; color: white; }
.primary { background: #0070f3; }
```

```typescript
// modules/ui/components/Button.tsx
import styles from './Button.module.css'

export function Button({ primary }: { primary?: boolean }) {
  return (
    <button className={`${styles.button} ${primary ? styles.primary : ''}`}>
      Click
    </button>
  )
}
```

## Global CSS
```css
/* app/globals.css */
:root { --primary: #0070f3; }
body { font-family: system-ui; }
```

```typescript
// app/layout.tsx
import './globals.css'
export default function RootLayout({ children }) {
  return <html><body>{children}</body></html>
}
```

## CSS-in-JS (Client Only)
```typescript
'use client'
import styled from 'styled-components'

const StyledButton = styled.button`
  background: blue;
  color: white;
`
export function Button() {
  return <StyledButton>Click</StyledButton>
}
```

## Inline Styles
```typescript
export function Card() {
  return <div style={{ padding: '1rem', border: '1px solid #ccc' }}>Content</div>
}
```

## PostCSS Config
```js
// postcss.config.js
module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}
```

## Sass Support
```bash
bun add -D sass
```

```scss
// Import without ~ prefix (Turbopack)
@import 'bootstrap/dist/css/bootstrap.min.css';
```
