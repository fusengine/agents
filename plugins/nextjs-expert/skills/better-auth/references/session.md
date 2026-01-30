# Session Management

## Session Configuration

```typescript
// lib/auth.ts
export const auth = betterAuth({
  session: {
    expiresIn: 60 * 60 * 24 * 7,  // 7 days (seconds)
    updateAge: 60 * 60 * 24,       // Refresh after 24h
    freshAge: 60 * 10,             // "Fresh" session 10 min
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5               // Cookie cache 5 min
    }
  }
})
```

## Session Structure

```typescript
interface Session {
  id: string
  userId: string
  token: string
  expiresAt: Date
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
}

interface User {
  id: string
  email: string
  name?: string
  image?: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}
```

## Session Cookie

Better Auth stores session token in HTTP-only cookie:

```
better-auth.session_token=xxx
```

Cookie options:
- `httpOnly: true`
- `secure: true` (production)
- `sameSite: "lax"`

## Verify Session (Client)

```typescript
"use client"
import { authClient } from "@/lib/auth-client"

// React hook
const { data: session } = authClient.useSession()

// Without hook
const session = await authClient.getSession()
```

## Verify Session (Server)

```typescript
// Server Component / Server Action
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

const session = await auth.api.getSession({
  headers: await headers()
})
```

## List Active Sessions

```typescript
// All user sessions
const sessions = await authClient.listSessions()

// Revoke a session
await authClient.revokeSession({ token: sessionToken })

// Revoke all except current
await authClient.revokeOtherSessions()
```

## Disable Cookie Cache

```typescript
session: {
  cookieCache: {
    enabled: false
  }
}
```
