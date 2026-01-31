---
name: user-accounts
description: Manage user profiles, custom fields, OAuth account linking, and user lifecycle
when-to-use: user management, custom user fields, account linking, profile updates, user deletion
keywords: user model, account linking, custom fields, updateUser, linkSocial, user lifecycle
priority: medium
requires: server-config.md, concepts/users.md
related: concepts/users.md, concepts/oauth.md
---

# Better Auth User & Accounts

## When to Use

- Managing user profiles and custom fields
- Linking multiple OAuth providers to one user
- User lifecycle hooks (welcome emails, sync)
- Admin user management

## Why User & Account Models

| Model | Purpose |
|-------|---------|
| User | Core identity (email, name, image) |
| Account | OAuth provider connections |
| Custom fields | Business logic (role, plan) |
| Hooks | Side effects on CRUD |

## User Model

```typescript
interface User {
  id: string; email: string; emailVerified: boolean
  name: string; image?: string; createdAt: Date; updatedAt: Date
}
```

## Custom Fields

```typescript
export const auth = betterAuth({
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "user" },
      plan: { type: "string", defaultValue: "free" }
    }
  }
})
```

## Update User

```typescript
// Client
await authClient.updateUser({ name: "New Name", image: "https://..." })

// Server
await auth.api.updateUser({ userId: "user_123", data: { name: "New", role: "admin" } })
```

## Account Model (OAuth)

```typescript
interface Account {
  id: string; userId: string; provider: string
  providerAccountId: string; accessToken?: string; refreshToken?: string
}
```

## Link/Unlink Accounts

```typescript
await authClient.linkSocial({ provider: "github" })
const accounts = await authClient.listAccounts()
await authClient.unlinkAccount({ provider: "github", providerAccountId: "123" })
```

## Delete User

```typescript
await authClient.deleteUser()  // Self-delete
await auth.api.deleteUser({ userId: "user_123" })  // Admin
```

## User Hooks

```typescript
user: {
  hooks: {
    onCreate: async (user) => { await sendWelcomeEmail(user.email) },
    onUpdate: async (user) => { await syncToExternalSystem(user) }
  }
}
```
