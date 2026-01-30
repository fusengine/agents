# Better Auth Anonymous Plugin

## Overview
Allow users to use your app without creating an account, then link to a real account later.

## Installation

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"
import { anonymous } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [anonymous()]
})
```

## Client Setup

```typescript
import { createAuthClient } from "better-auth/react"
import { anonymousClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [anonymousClient()]
})
```

## Usage

### Sign In Anonymously
```typescript
const { signIn } = authClient

await signIn.anonymous()
```

### Check if Anonymous
```typescript
const session = await authClient.getSession()
if (session?.user.isAnonymous) {
  // Show "Create Account" prompt
}
```

### Link to Real Account
```typescript
// Link via email/password
await authClient.linkAccount({
  provider: "credential",
  email: "user@example.com",
  password: "password123"
})

// Link via OAuth
await authClient.linkAccount({
  provider: "google"
})
```

## Configuration

```typescript
anonymous({
  emailDomain: "anonymous.yourapp.com",  // Generated email domain
  onLinkAccount: async ({ anonymousUser, newUser }) => {
    // Migrate anonymous user data
    await migrateUserData(anonymousUser.id, newUser.id)
  }
})
```

## Data Migration

```typescript
anonymous({
  onLinkAccount: async ({ anonymousUser, newUser }) => {
    // Move cart items
    await db.cart.updateMany({
      where: { userId: anonymousUser.id },
      data: { userId: newUser.id }
    })
    // Move saved preferences
    await db.preferences.updateMany({
      where: { userId: anonymousUser.id },
      data: { userId: newUser.id }
    })
  }
})
```

## Use Cases
- Guest checkout in e-commerce
- Try before signup
- Progressive onboarding
