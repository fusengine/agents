---
name: admin
description: Admin dashboard for managing users, sessions, and authentication
when-to-use: user management, admin dashboard, user moderation, account deletion
keywords: admin, dashboard, user management, moderation, delete users, manage sessions
priority: low
requires: server-config.md
related: plugins/overview.md, user-accounts.md
---

# Admin Plugin

## When to Use

- Building admin dashboards
- User management interfaces
- Support team impersonation
- Compliance user actions (ban, delete)

## Why Admin Plugin

| Manual | With Plugin |
|--------|-------------|
| Custom queries | `listUsers` API |
| Build CRUD | Ready-to-use |
| Risky impersonation | Secure, logged |
| No audit trail | Action history |

## Server Configuration

```typescript
import { betterAuth } from "better-auth"
import { admin } from "better-auth/plugins/admin"

export const auth = betterAuth({
  plugins: [admin({ adminRole: "admin", defaultRole: "user" })]
})
```

## Client Configuration

```typescript
import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [adminClient()]
})
```

## List & Search Users

```typescript
const { data } = await authClient.admin.listUsers({
  limit: 10,
  offset: 0,
  sortBy: "createdAt",
  sortOrder: "desc",
  searchField: "email",
  searchValue: "john",
  searchOperator: "contains"
})
```

## User Management

```typescript
// Create user
await authClient.admin.createUser({
  email: "user@example.com",
  password: "password123",
  name: "John Doe",
  role: "user"
})

// Set role
await authClient.admin.setRole({ userId: "user_xxx", role: "admin" })

// Ban/unban
await authClient.admin.banUser({ userId: "user_xxx", reason: "Violation" })
await authClient.admin.unbanUser({ userId: "user_xxx" })

// Delete
await authClient.admin.removeUser({ userId: "user_xxx" })
```

## Impersonate

```typescript
await authClient.admin.impersonateUser({ userId: "user_xxx" })
await authClient.admin.stopImpersonation()
```
