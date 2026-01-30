# Admin Plugin

## Server Configuration

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { admin } from "better-auth/plugins/admin"

export const auth = betterAuth({
  plugins: [
    admin({
      adminRole: "admin",
      defaultRole: "user"
    })
  ]
})
```

## Client Configuration

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [adminClient()]
})
```

## List Users

```typescript
const { data } = await authClient.admin.listUsers({
  limit: 10,
  offset: 0,
  sortBy: "createdAt",
  sortOrder: "desc"
})

// data.users - Array of users
// data.total - Total count
```

## Search Users

```typescript
const { data } = await authClient.admin.listUsers({
  searchField: "email",
  searchValue: "john",
  searchOperator: "contains"
})
```

## Create User

```typescript
await authClient.admin.createUser({
  email: "user@example.com",
  password: "password123",
  name: "John Doe",
  role: "user"
})
```

## Update User

```typescript
await authClient.admin.setRole({
  userId: "user_xxx",
  role: "admin"
})
```

## Ban User

```typescript
// Ban user
await authClient.admin.banUser({
  userId: "user_xxx",
  reason: "Violation of terms"
})

// Unban user
await authClient.admin.unbanUser({
  userId: "user_xxx"
})
```

## Delete User

```typescript
await authClient.admin.removeUser({
  userId: "user_xxx"
})
```

## Impersonate User

```typescript
// Start impersonation
await authClient.admin.impersonateUser({
  userId: "user_xxx"
})

// Stop impersonation
await authClient.admin.stopImpersonation()
```

## Check Admin Role (Server)

```typescript
const session = await auth.api.getSession({ headers: await headers() })

if (session?.user.role !== "admin") {
  throw new Error("Unauthorized")
}
```
