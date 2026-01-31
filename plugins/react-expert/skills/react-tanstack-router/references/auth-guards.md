---
name: auth-guards
description: Authentication guards and protected routes patterns
when-to-use: Implementing login, protecting routes, role-based access
keywords: auth, authentication, guard, protected, login, redirect, rbac
priority: high
requires: route-context.md
related: nested-routes.md, loaders.md
template: templates/auth-protected-routes.md
---

# Authentication Guards

> **Full code**: See [templates/auth-protected-routes.md](templates/auth-protected-routes.md)

## Main Pattern

Use `beforeLoad` with `redirect`:

```typescript
beforeLoad: ({ context, location }) => {
  if (!context.user) {
    throw redirect({ to: '/login', search: { redirect: location.href } })
  }
}
```

---

## Protected Pathless Layout

Recommended structure:

```text
_authenticated/
├── _authenticated.tsx  # Guard
├── dashboard.tsx       # /dashboard (protected)
└── settings.tsx        # /settings (protected)
```

---

## Reusable Guards

```typescript
// guards.ts
export const requireAuth = ({ context, location }) => {
  if (!context.user) throw redirect({ to: '/login' })
}

export const requireAdmin = ({ context }) => {
  if (context.user?.role !== 'admin') throw redirect({ to: '/dashboard' })
}
```

**Usage**:

```typescript
beforeLoad: requireAuth
```

---

## Login with Redirect

```typescript
// Login route
validateSearch: z.object({ redirect: z.string().optional() })

// After login
navigate({ to: search.redirect || '/dashboard' })
```

---

## RBAC (Role-Based Access)

```typescript
beforeLoad: ({ context }) => {
  if (!context.user.permissions.includes('admin:read')) {
    throw redirect({ to: '/unauthorized' })
  }
}
```

---

## Best Practices

| Do ✅ | Don't ❌ |
|-------|---------|
| Pathless layout for auth | Check in each route |
| `beforeLoad` for auth | Check in component |
| Save redirect URL | Fixed redirect |
| Reusable guards | Duplicated code |
| RBAC via permissions | Hardcode roles |
