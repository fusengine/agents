---
name: nested-routes
description: Nested routes, layouts, and Outlet component patterns
when-to-use: Creating layouts, nested navigation, shared UI components
keywords: nested, layout, outlet, children, wrapper, pathless
priority: medium
requires: file-based-routing.md
related: route-context.md, auth-guards.md
template: templates/dashboard-layout.md
---

# Nested Routes & Layouts

> **Full code**: See [templates/dashboard-layout.md](templates/dashboard-layout.md)

## Outlet Component

Renders child routes in a parent layout.

```typescript
<main><Outlet /></main>
```

---

## Layout Types

| Type | Syntax | Usage |
|------|--------|-------|
| Root Layout | `__root.tsx` | Navigation, footer |
| Folder Layout | `posts/index.tsx` | Layout for sub-routes |
| Pathless Layout | `_dashboard/` | Layout without URL segment |
| Route Group | `(marketing)/` | File organization |

---

## Pathless Layout `_name/`

Wraps child routes without affecting the URL.

```text
_dashboard/
├── _dashboard.tsx    # Layout
├── index.tsx         # /dashboard
└── settings.tsx      # /settings
```

**Usages**:
- Authentication protection
- Shared sidebar
- Specific header

> **Example**: [templates/auth-protected-routes.md](templates/auth-protected-routes.md)

---

## Route Groups `(name)/`

File organization without URL impact.

```text
(marketing)/about.tsx → /about
```

---

## Layout with Loader

The layout can load shared data:

```typescript
loader: async ({ context }) => ({
  user: await fetchUser(),
  notifications: await fetchNotifications(),
})
```

---

## Nested Layouts

```text
_authenticated/
└── _admin/
    ├── _admin.tsx    # Admin layout
    └── users.tsx     # /users (admin only)
```

> **Full example**: [templates/dashboard-layout.md](templates/dashboard-layout.md)

---

## Best Practices

| Do ✅ | Don't ❌ |
|-------|---------|
| `<Outlet />` in layouts | Forget Outlet |
| Pathless layouts for auth | Check auth per route |
| Loader in layout | Fetch in each child |
| Groups for organization | Deep folders |
