---
name: session
description: Manage sessions with cookies, expiration, renewal, and multi-session support
when-to-use: session configuration, session duration, token refresh, cookie settings, session validation
keywords: session, cookie, expiration, updateAge, cookieCache, token refresh, http-only
priority: high
requires: basic-usage.md, server-config.md
related: security.md, concepts/sessions.md, concepts/cookies.md
---

# Session Management

## When to Use

- Check if user is authenticated
- Get current user data
- Manage multiple sessions (list, revoke)
- Configure session duration and refresh

## Why HTTP-only Cookies

| Security | Explanation |
|----------|-------------|
| **XSS Protection** | Token not accessible via JavaScript |
| **CSRF Protection** | SameSite=Lax prevents cross-site requests |
| **Auto-send** | Browser automatically includes cookie |
| **Secure flag** | HTTPS only in production |

## Session Configuration

```typescript
// modules/auth/src/services/auth.ts
export const auth = betterAuth({
  session: {
    expiresIn: 60 * 60 * 24 * 7,  // 7 days
    updateAge: 60 * 60 * 24,       // Refresh after 24h
    freshAge: 60 * 10,             // Fresh for 10 min
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

## Cookie Settings

Better Auth stores session token in HTTP-only cookie:
- `httpOnly: true` - Not accessible via JS
- `secure: true` - HTTPS only (production)
- `sameSite: "lax"` - CSRF protection

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

## Manage Sessions

```typescript
// List all active sessions
const sessions = await authClient.listSessions()

// Revoke specific session
await authClient.revokeSession({ token: sessionToken })

// Revoke all other sessions (keep current)
await authClient.revokeOtherSessions()
```

## Session Options

| Option | Default | Description |
|--------|---------|-------------|
| `expiresIn` | 7 days | Total session lifetime |
| `updateAge` | 24h | Refresh token after this time |
| `freshAge` | 10 min | Session considered "fresh" |
| `cookieCache` | disabled | Cache session in cookie |
