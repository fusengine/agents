---
name: lazy-loading
description: Load components on demand - React.lazy, Suspense, code splitting, route-based loading
when-to-use: large bundles, route splitting, heavy components, initial load optimization
keywords: lazy, suspense, code splitting, dynamic import, bundle
priority: high
related: templates/lazy-components.md, suspense-patterns.md
---

# Lazy Loading

## Purpose

**Load code only when needed.**

### Why Lazy Load
- Smaller initial bundle
- Faster first paint
- Load on demand
- Better user experience

### When to Use
- Route-based splitting
- Heavy components
- Modals and dialogs
- Admin/authenticated sections

### Key Points
- `React.lazy()` for components
- Dynamic `import()` syntax
- Suspense for loading states
- Webpack/Vite automatic splitting

---

## React.lazy

**Create lazy-loaded component.**

### Purpose
- Defer component loading
- Automatic code splitting
- Works with Suspense

### Key Points
- Takes dynamic import function
- Returns lazy component
- Must be default export
- Wrapper for named exports

---

## Suspense Boundary

**Show fallback while loading.**

### Purpose
- Declarative loading states
- Nested boundaries possible
- Error boundary companion

### When to Use
- Wrap lazy components
- Data fetching (with use())
- Streaming SSR

### Key Points
- `fallback` prop required
- Can wrap multiple lazy components
- Closest boundary catches
- Nested for granular loading

---

## Loading Strategies

| Strategy | Use Case |
|----------|----------|
| Route-based | Load per page/route |
| Component-based | Heavy individual components |
| Interaction-based | Load on user action |
| Viewport-based | Load when scrolled into view |

---

## Preloading

**Load before user needs it.**

### Purpose
- Anticipate user actions
- Hover/focus preload
- Prefetch on idle

### When to Use
- Likely next navigation
- Hover over link/button
- Background during idle

### Key Points
- Call import() early
- Browser caches module
- No visual loading needed
- Link prefetch attribute

---

## Named Export Handling

**Lazy load non-default exports.**

### Purpose
- Library components
- Selective imports
- Tree shaking compatible

### Key Points
- Wrap import with then()
- Return object with default
- Same Suspense handling

---

## Bundle Analysis

| Tool | Purpose |
|------|---------|
| webpack-bundle-analyzer | Visualize chunks |
| vite-bundle-visualizer | Vite equivalent |
| source-map-explorer | Size breakdown |

---

→ See `templates/lazy-components.md` for code examples
