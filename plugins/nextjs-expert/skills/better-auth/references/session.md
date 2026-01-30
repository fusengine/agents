# Session Management

## Session Configuration

```typescript
// modules/auth/src/services/auth.ts
export const auth = betterAuth({
  session: {
    expiresIn: 60 * 60 * 24 * 7,  // 7 days
    updateAge: 60 * 60 * 24,       // Refresh 24h
    freshAge: 60 * 10,             // Fresh 10 min
    cookieCache: { enabled: true, maxAge: 60 * 5 }
  }
})
```

## Session Structure

```typescript
// modules/auth/src/interfaces/session.interface.ts
export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: Date
  ipAddress?: string
  userAgent?: string
}
```

## Session Cookie

Better Auth stores session token in HTTP-only cookie:
- `httpOnly: true`
- `secure: true` (production)
- `sameSite: "lax"`

## Verify Session (Client)

```typescript
"use client"
import { authClient } from "@/modules/auth/src/hooks/auth-client"

const { data: session } = authClient.useSession()
// or without hook
const session = await authClient.getSession()
```

## Verify Session (Server)

```typescript
import { auth } from "@/modules/auth/src/services/auth"
import { headers } from "next/headers"

const session = await auth.api.getSession({ headers: await headers() })
```

## List Active Sessions

```typescript
const sessions = await authClient.listSessions()
await authClient.revokeSession({ token: sessionToken })
await authClient.revokeOtherSessions()
```
