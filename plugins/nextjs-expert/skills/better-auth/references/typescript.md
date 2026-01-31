# Better Auth TypeScript

## Type Inference

Better Auth provides full TypeScript support with automatic type inference.

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
import { betterAuth } from "better-auth"

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
    // session.user is fully typed
    console.log(session.user.email)
    console.log(session.user.role)  // Custom field
  }
}
```

## Type Exports

```typescript
import type {
  Session,
  User,
  Account,
  BetterAuthOptions
} from "better-auth"
```
