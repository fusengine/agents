---
name: code-splitting
description: Lazy loading routes and code splitting patterns
when-to-use: Optimizing bundle size, lazy loading components, reducing initial load
keywords: lazy, code-splitting, bundle, dynamic, import, performance
priority: medium
requires: file-based-routing.md
related: preloading.md, loaders.md
template: templates/feature-module.md
---

# Code Splitting

> **Full code**: See [templates/feature-module.md](templates/feature-module.md)

## Lazy Route Component

```typescript
component: lazyRouteComponent(() => import('./PostPage'))
```

**Alternative with React.lazy**:

```typescript
const PostPage = lazy(() => import('./PostPage'))
```

---

## Plugin Code Splitting

Enable automatic code splitting:

```typescript
TanStackRouterVite({
  experimental: { enableCodeSplitting: true },
})
```

**Result**: One chunk per route automatically.

---

## .lazy.tsx File

Separate loader (critical path) and component (lazy):

```text
dashboard.tsx       # Loader only
dashboard.lazy.tsx  # Component only
```

```typescript
// dashboard.lazy.tsx
export const Route = createLazyFileRoute('/dashboard')({
  component: DashboardPage,
})
```

---

## Preload with Lazy

Combine lazy loading and preload:

```typescript
<Link to="/dashboard" preload="intent">
```

Lazy component is preloaded on hover.

---

## Generated Chunks

```text
dist/
├── index-abc123.js      # Main bundle
├── dashboard-def456.js  # Dashboard route
├── posts-ghi789.js      # Posts route
```

---

## Best Practices

| Do ✅ | Don't ❌ |
|-------|---------|
| Lazy large routes | Lazy small components |
| Plugin code splitting | Manual split everywhere |
| `preload="intent"` with lazy | Skip preload |
| Loader in main bundle | Lazy loader (slow) |
