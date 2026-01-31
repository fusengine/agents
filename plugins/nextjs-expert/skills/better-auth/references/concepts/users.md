---
name: users
description: Understand user data model, lifecycle, custom fields, account linking, and user operations
when-to-use: understanding user model, extending user type, user lifecycle, multiple accounts
keywords: users, user model, account linking, custom fields, user lifecycle, authentication
priority: medium
requires: server-config.md
related: user-accounts.md, concepts/oauth.md
---

# Better Auth Users Concept

## When to Use

- Understanding user data model
- Extending user fields
- Implementing user management
- Account linking strategies

## Why User-Centric Model

| Session-only | User model |
|--------------|------------|
| No profile | Rich data |
| Anonymous | Identifiable |
| No linking | Multi-provider |
| Stateless | Full history |

## User Lifecycle

```
1. Sign Up → User created → Account linked → Session created
2. Sign In → Credentials verified → Session created
3. OAuth → Provider validates → User created/linked → Session created
4. Sign Out → Session deleted
5. Delete → User + Accounts + Sessions removed
```

## User Model

```typescript
interface User {
  id: string                  // Unique identifier
  email: string               // Primary identifier
  emailVerified: boolean      // Email confirmation status
  name: string                // Display name
  image?: string              // Avatar URL
  createdAt: Date
  updatedAt: Date
}
```

## Extending Users

```typescript
export const auth = betterAuth({
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "user" },
      plan: { type: "string", defaultValue: "free" },
      stripeCustomerId: { type: "string", required: false }
    }
  }
})
```

## User vs Account

```typescript
// ONE User can have MANY Accounts
User (id: "u1", email: "john@example.com")
  ├── Account (provider: "credentials", password hash)
  ├── Account (provider: "google", providerAccountId: "g123")
  └── Account (provider: "github", providerAccountId: "gh456")
```

## User Operations

```typescript
// Update
await authClient.updateUser({ name: "New Name" })

// Delete
await authClient.deleteUser()

// Admin operations
await auth.api.updateUser({ userId: "u1", data: { role: "admin" } })
await auth.api.deleteUser({ userId: "u1" })
```
