---
name: resource-loading-template
description: Resource Preloading APIs - preload, preinit, prefetchDNS, preconnect
---

# Resource Preloading Patterns

## Font Preloading

```typescript
// modules/cores/components/FontLoader.tsx
import { preload } from 'react-dom'

export function FontLoader() {
  // Preload critical fonts
  preload('/fonts/inter-regular.woff2', {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous'
  })

  preload('/fonts/inter-bold.woff2', {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous'
  })

  return null
}
```

---

## API Connection Hints

```typescript
// modules/cores/components/ConnectionHints.tsx
import { prefetchDNS, preconnect } from 'react-dom'

export function ConnectionHints() {
  // DNS prefetch for third-party domains
  prefetchDNS('https://analytics.example.com')
  prefetchDNS('https://cdn.example.com')

  // Full connection for API
  preconnect('https://api.example.com', {
    crossOrigin: 'anonymous'
  })

  return null
}
```

---

## Critical CSS Preinit

```typescript
// modules/cores/components/CriticalResources.tsx
import { preinit, preload } from 'react-dom'

export function CriticalResources() {
  // Load and execute critical CSS immediately
  preinit('/styles/critical.css', { as: 'style' })

  // Load and execute essential scripts
  preinit('/scripts/polyfills.js', { as: 'script' })

  // Preload (but don't execute) deferred resources
  preload('/styles/components.css', { as: 'style' })
  preload('/scripts/analytics.js', { as: 'script' })

  return null
}
```

---

## Module Preloading

```typescript
// modules/dashboard/components/DashboardLoader.tsx
import { preloadModule, preinitModule } from 'react-dom'

export function DashboardLoader() {
  // Preload ESM modules for later use
  preloadModule('/modules/charts.js')
  preloadModule('/modules/data-grid.js')

  // Load and execute critical module immediately
  preinitModule('/modules/dashboard-core.js')

  return null
}
```

---

## Image Preloading

```typescript
// modules/products/components/ProductPreloader.tsx
import { preload } from 'react-dom'

interface ProductPreloaderProps {
  products: Product[]
}

export function ProductPreloader({ products }: ProductPreloaderProps) {
  // Preload hero images
  products.slice(0, 4).forEach((product) => {
    preload(product.heroImage, {
      as: 'image',
      fetchPriority: 'high'
    })
  })

  // Preload thumbnails with lower priority
  products.slice(4).forEach((product) => {
    preload(product.thumbnail, {
      as: 'image',
      fetchPriority: 'low'
    })
  })

  return null
}
```

---

## Route-based Preloading

```typescript
// modules/cores/hooks/useRoutePreload.ts
import { preload, preloadModule } from 'react-dom'
import { useEffect } from 'react'

const routeAssets: Record<string, string[]> = {
  '/dashboard': ['/modules/dashboard.js', '/styles/dashboard.css'],
  '/settings': ['/modules/settings.js', '/styles/settings.css'],
  '/profile': ['/modules/profile.js', '/styles/profile.css']
}

export function useRoutePreload(hoveredRoute: string | null) {
  useEffect(() => {
    if (!hoveredRoute || !routeAssets[hoveredRoute]) return

    routeAssets[hoveredRoute].forEach((asset) => {
      if (asset.endsWith('.js')) {
        preloadModule(asset)
      } else if (asset.endsWith('.css')) {
        preload(asset, { as: 'style' })
      }
    })
  }, [hoveredRoute])
}

// Usage in navigation
function NavLink({ href, children }: NavLinkProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  useRoutePreload(hovered)

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(href)}
      onMouseLeave={() => setHovered(null)}
    >
      {children}
    </a>
  )
}
```

---

## SSR Resource Hints

```typescript
// modules/app/components/AppShell.tsx
import { prefetchDNS, preconnect, preinit } from 'react-dom'

export function AppShell({ children }: { children: ReactNode }) {
  // These inject <link> tags during SSR
  prefetchDNS('https://fonts.googleapis.com')
  preconnect('https://fonts.gstatic.com', { crossOrigin: 'anonymous' })

  // Critical resources
  preinit('/styles/app.css', { as: 'style' })

  return (
    <html>
      <head>
        {/* React injects resource hints here during SSR */}
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

## Rules

- Call preload functions early in component lifecycle
- Use `fetchPriority` to control loading order
- `preinit` executes immediately, `preload` just downloads
- All functions are deduplicated (safe to call multiple times)
- Works with SSR - injects hints in initial HTML
