---
name: file-based-routing
description: File-based routing conventions and patterns for TanStack Router
when-to-use: Creating new routes, understanding naming conventions, organizing route files
keywords: file-based, routes, conventions, naming, structure, layout, pathless
priority: high
requires: installation.md
related: route-params.md, nested-routes.md
template: templates/basic-setup.md
---

# File-Based Routing

> **Full code**: See [templates/basic-setup.md](templates/basic-setup.md)

## Naming Conventions

| Pattern | URL | Description |
|---------|-----|-------------|
| `index.tsx` | `/` | Index route |
| `about.tsx` | `/about` | Static route |
| `posts/index.tsx` | `/posts` | Nested index |
| `$postId.tsx` | `/:postId` | Dynamic param |
| `$.tsx` | `/*` | Catch-all (splat) |
| `_layout.tsx` | N/A | Pathless layout |
| `(group)/` | N/A | Route group (no URL) |
| `__root.tsx` | N/A | Root layout |

---

## Route File Structure

A route file exports a `Route` object created with `createFileRoute`.

**Main options**:
- `validateSearch`: Search params validation (Zod)
- `beforeLoad`: Pre-load logic (auth, redirects)
- `loader`: Data loading
- `component`: Component to render
- `errorComponent`: Error handling
- `pendingComponent`: Loading state

---

## Root Route

The root route (`__root.tsx`) wraps all other routes.

**Created with** `createRootRouteWithContext<RouterContext>()` to type the context.

**Contains**: Navigation, footer, DevTools, `<Outlet />`.

> **Full example**: [templates/basic-setup.md](templates/basic-setup.md#root-route)

---

## Pathless Layouts `_name/`

Pathless layouts wrap child routes without adding a URL segment.

**Usage**:
- Authentication protection (`_authenticated/`)
- Shared layouts (sidebar, header)
- Logical grouping

> **Example**: [templates/auth-protected-routes.md](templates/auth-protected-routes.md)

---

## Route Groups `(name)/`

Organize files without affecting URLs.

```text
(marketing)/
├── about.tsx    # /about (not /(marketing)/about)
└── pricing.tsx  # /pricing
```

---

## Generated File

The plugin generates `routeTree.gen.ts` with:
- Types for all routes
- Params/search inference
- RouteTree export

**Important**: Add to `.gitignore`.

---

## Best Practices

| Do ✅ | Don't ❌ |
|-------|---------|
| Use file-based routing | Manual routes |
| `__root.tsx` for global layout | Layout in each route |
| Pathless layouts for auth | Check auth per route |
| Groups for organization | Unnecessary deep folders |
