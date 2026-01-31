---
name: typescript
description: Leverage type inference, custom fields, and plugin types for full TypeScript support
when-to-use: typescript projects, type-safe auth, extending user type, plugin typing, IDE autocomplete
keywords: type inference, session type, user type, custom fields, plugin types, generics, IDE support
priority: medium
requires: server-config.md, client.md
related: server-config.md
---

# Better Auth TypeScript

## When to Use

- Type-safe authentication in TypeScript projects
- Extend user model with custom fields
- Share types between server and client
- Plugin type inference

## Why Type Safety

| Feature | Benefit |
|---------|---------|
| Auto-inference | No manual type definitions |
| Custom fields | Extends User/Session types |
| Plugin types | Methods auto-typed |
| IDE support | Full autocomplete |

## Type Inference

```typescript
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  // Full type checking and autocomplete
})

// Inferred types
type Auth = typeof auth
type Session = Auth["$Infer"]["Session"]
type User = Auth["$Infer"]["User"]
```

## Extending User Type

```typescript
export const auth = betterAuth({
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "user" },
      organizationId: { type: "string", required: false }
    }
  }
})

// User type now includes role and organizationId
```

## Client Types

```typescript
import { createAuthClient } from "better-auth/react"
import type { auth } from "./auth"

export const authClient = createAuthClient<typeof auth>()

// Full type safety on client
const session = await authClient.getSession()
session.user.role  // TypeScript knows about custom fields
```

## Plugin Types

```typescript
import { twoFactor, organization } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [twoFactor(), organization()]
})

// Client gets plugin methods typed
const authClient = createAuthClient<typeof auth>()
await authClient.twoFactor.enable()  // Typed
await authClient.organization.create()  // Typed
```

## API Route Types

```typescript
import { auth } from "./auth"

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })

  if (session) {
    console.log(session.user.email)
    console.log(session.user.role)  // Custom field
  }
}
```

## Type Exports

```typescript
import type { Session, User, Account, BetterAuthOptions } from "better-auth"
```
