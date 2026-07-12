---
name: route-protection
description: UX-layer route protection with _authed layout, beforeLoad, redirect, RBAC
when-to-use: Keeping unauthenticated/unauthorized users out of screens
keywords: beforeLoad, redirect, _authed, layout-route, RBAC, useRouteContext
priority: high
requires: data-boundary.md
related: sessions-cookies.md
source: https://tanstack.com/start/latest/docs/framework/react/guide/authentication
---

# Route Protection (UX Layer)

## Overview

Use a pathless layout route (`_authed`) whose `beforeLoad` checks the current user and `redirect`s to `/login` when absent. Child routes render only for authenticated users and read the user from route context. Remember: this is UX — the data boundary lives in server-fn middleware ([data-boundary.md](data-boundary.md)).

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **`_authed` layout** | Pathless route (`routes/_authed.tsx`) wrapping all protected routes |
| **`beforeLoad`** | Runs before loaders; throws `redirect` when unauthenticated |
| **Context passthrough** | `beforeLoad` returns `{ user }`, children read `Route.useRouteContext()` |
| **RBAC** | Nested `beforeLoad` checks a role, redirects to `/unauthorized` |

---

## Decision Guide

```
Need to gate a group of routes?
├── Any authenticated user → routes/_authed.tsx beforeLoad → redirect to /login
└── Specific role          → nested beforeLoad checks context.user.role → redirect /unauthorized
```

---

## Core Pattern

```tsx
export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUserFn() // server fn reading the session
    if (!user) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
    return { user } // available to children via useRouteContext()
  },
})
```

→ See [authed-middleware.md](templates/authed-middleware.md) for the full layout + RBAC + protected fn

---

## Best Practices

### DO
- Preserve the target in `search: { redirect: location.href }` for post-login return
- Resolve the user through a server function (session lives server-side)
- Pair EVERY protected screen's action with an authorized server fn

### DON'T
- Store auth state only in client context/localStorage as the source of truth
- Treat a passing `beforeLoad` as authorization for the data it displays

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| User info read from client state | Fetch from session via a server fn in `beforeLoad` |
| Role check only in `beforeLoad` | Repeat the check in the server-fn handler |
| Redirect loses target page | Pass `location.href` in `search.redirect` |

---

## Related References

- [data-boundary.md](data-boundary.md) — why this layer alone is insufficient
- [sessions-cookies.md](sessions-cookies.md) — the session `getCurrentUserFn` reads
