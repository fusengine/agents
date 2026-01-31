# Better Auth Users Concept

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
