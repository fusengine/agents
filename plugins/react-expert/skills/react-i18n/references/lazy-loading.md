---
name: lazy-loading
description: Load translations on-demand - route-based loading, preloading, performance optimization
when-to-use: large apps, performance optimization, route-based loading, reducing bundle size
keywords: lazy loading, code splitting, performance, preload, on-demand
priority: medium
related: namespaces.md, templates/lazy-loading-routes.md
---

# Lazy Loading Translations

## On-Demand Loading

**Load namespaces only when needed.**

### Purpose
- Reduce initial bundle size
- Faster first contentful paint
- Load translations per route

### When to Use
- Large translation files
- Many namespaces
- Route-based apps
- Performance-critical apps

### Key Points
- Only `common` in initial load
- Route triggers namespace load
- Suspense handles loading state
- No wasted bandwidth

---

## Backend Configuration

**Configure HTTP backend for lazy loading.**

### Purpose
- Fetch translations from server
- Cache translation responses
- Handle loading errors

### When to Use
- All apps with lazy loading
- CDN-hosted translations
- Versioned translation files

### Key Points
- `loadPath` pattern with `{{lng}}` `{{ns}}`
- HTTP caching recommended
- Version query string for cache busting
- Error handling for offline

---

## Route Integration

**Load namespaces with route navigation.**

### Purpose
- Sync translation loading with routing
- Preload before render
- Smooth user experience

### When to Use
- React Router apps
- TanStack Router apps
- Any route-based navigation

### Key Points
- Load in route loader/beforeLoad
- Lazy import component after load
- Combine with React.lazy()
- Suspense boundary per route

---

## Preloading Strategies

**Anticipate and preload translations.**

### Purpose
- Instant navigation feel
- Reduce perceived latency
- Better user experience

### When to Use
- Predictable navigation paths
- Hover/focus interactions
- Background idle time

### Key Points
- Preload on link hover
- Preload on link focus (a11y)
- Use `i18n.loadNamespaces()`
- Non-blocking background load

---

## Loading State Handling

| Method | Blocking | Use Case |
|--------|----------|----------|
| Suspense | Yes | Clean loading UI |
| `ready` flag | No | Custom loading logic |
| Preloading | No | Anticipated navigation |
| Initial `ns` | Yes | Critical translations |

---

→ See `templates/lazy-loading-routes.md` for route integration examples
