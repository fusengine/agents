---
name: components
description: TanStack Router components API reference
when-to-use: Using Link, Outlet, Navigate, RouterProvider components
keywords: components, Link, Outlet, Navigate, RouterProvider
priority: high
requires: file-based-routing.md
related: hooks.md, navigation.md
template: templates/basic-setup.md
---

# Components API

> **Full code**: See [templates/basic-setup.md](templates/basic-setup.md)

## Main Components

| Component | Usage |
|-----------|-------|
| `RouterProvider` | Root component, injects the router |
| `Link` | Type-safe declarative navigation |
| `Outlet` | Renders child routes (layouts) |
| `Navigate` | Declarative redirect |

---

## Link Props

| Prop | Type | Description |
|------|------|-------------|
| `to` | `string` | Target path (type-safe) |
| `params` | `object` | Route params (`$postId`) |
| `search` | `object \| function` | Search params or updater |
| `hash` | `string` | URL hash |
| `replace` | `boolean` | Replace history entry |
| `resetScroll` | `boolean` | Scroll to top |
| `preload` | `'intent' \| 'render' \| false` | Preload strategy |
| `activeProps` | `object` | Props when active |
| `inactiveProps` | `object` | Props when inactive |
| `activeOptions` | `{ exact, includeSearch, includeHash }` | Matching options |

---

## Outlet

Renders child routes in layouts.

**Usage**: Place in layouts to define where children display.

**Pattern**: Header/Footer in layout, `<Outlet />` for variable content.

---

## Navigate

Declarative redirect (component vs hook).

| Prop | Description |
|------|-------------|
| `to` | Target path |
| `replace` | Replace history (recommended for redirects) |
| `params` | Route params |
| `search` | Search params |

**When to use**: Conditional redirects in render.

---

## Custom Link (createLink)

Create custom links with `createLink` to integrate UI libraries.

```typescript
const ButtonLink = createLink(Button)
```

**Usage**: shadcn/ui, Radix, or custom component integration.

---

## Error Boundaries

| Component | Usage |
|-----------|-------|
| `CatchBoundary` | Error boundary for route errors |
| `CatchNotFound` | Global 404 handler |

---

## Best Practices

| Do ✅ | Don't ❌ |
|-------|---------|
| `<Link to>` for navigation | `<a href>` (not type-safe) |
| `<Outlet />` in layouts | Forget Outlet (invisible child routes) |
| `<Navigate>` for redirect | `navigate()` in render |
| `preload="intent"` for UX | Skip preload |
| `createLink(Button)` for UI lib | Link with inline styles |
| `activeProps` for styling | Manual active logic |
