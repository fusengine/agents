---
name: navigation
description: Navigation patterns with Link, useNavigate, and redirects
when-to-use: Navigating between routes, handling redirects, programmatic navigation
keywords: navigation, link, navigate, redirect, router, programmatic
priority: high
requires: file-based-routing.md
related: route-params.md, search-params.md
template: templates/basic-setup.md
---

# Navigation

> **Full code**: See [templates/basic-setup.md](templates/basic-setup.md)

## Link Component

| Prop | Description |
|------|-------------|
| `to` | Target path (type-safe) |
| `params` | Route params (`$postId`) |
| `search` | Search params (object or updater function) |
| `hash` | URL hash |
| `preload` | `'intent'` \| `'render'` \| `false` |
| `replace` | Replace history |
| `activeProps` | Props when active |
| `activeOptions` | `{ exact, includeSearch, includeHash }` |

---

## useNavigate

Programmatic navigation with same options as Link.

| Pattern | Usage |
|---------|-------|
| `navigate({ to, params })` | Simple navigation |
| `navigate({ to: '.', search: (prev) => ... })` | Update search params |
| `navigate({ to, replace: true })` | Replace history |

---

## Redirects

| Method | Context |
|--------|---------|
| `throw redirect({ to })` | In `beforeLoad` (auth guards) |
| `<Navigate to replace />` | In component (declarative) |
| `router.navigate()` | Programmatic with useRouter |

---

## useRouter

| Method | Usage |
|--------|-------|
| `router.navigate()` | Programmatic navigation |
| `router.preloadRoute()` | Manual preload |
| `router.invalidate()` | Refetch loaders |

---

## Relative Navigation

| Pattern | Effect |
|---------|--------|
| `to="."` | Same route (update params/search) |
| `to=".."` | Parent route |

---

## Best Practices

| Do ✅ | Don't ❌ |
|-------|---------|
| `<Link>` for navigation | `<a href>` |
| `preload="intent"` | Skip preload |
| `replace` for filters | Push for each filter |
| Redirect in `beforeLoad` | Redirect in component |
