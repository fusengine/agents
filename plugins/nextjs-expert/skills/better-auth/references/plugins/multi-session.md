---
name: multi-session
description: Support multiple concurrent sessions per user
when-to-use: multiple devices, multi-session support, device management
keywords: multi-session, multiple sessions, device sessions, concurrent login
priority: low
requires: server-config.md, session.md
related: session.md, concepts/sessions.md
---

# Better Auth Multi-Session Plugin

## When to Use

- Users accessing from multiple devices
- Session management security features
- "Sign out of all devices" functionality
- Account security dashboards

## Why Multi-Session

| Single session | Multi-session |
|----------------|---------------|
| One device only | Any device |
| No visibility | Session list |
| No remote logout | Revoke anywhere |
| Shared credentials | Device isolation |

## Installation

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"
import { multiSession } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [multiSession({ maximumSessions: 5 })]
})
```

## Client Setup

```typescript
import { createAuthClient } from "better-auth/react"
import { multiSessionClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [multiSessionClient()]
})
```

## Usage

```typescript
const { multiSession } = authClient

// List all sessions
const sessions = await multiSession.listDeviceSessions()
// [{ id, userAgent, ipAddress, lastActiveAt, isCurrent }]

// Switch session
await multiSession.setActive({ sessionId: "session_123" })

// Revoke session
await multiSession.revoke({ sessionId: "session_123" })

// Revoke all except current
await multiSession.revokeOthers()

// Revoke all
await multiSession.revokeAll()
```

## Configuration

```typescript
multiSession({
  maximumSessions: 5,                  // Default: 5
  sessionTimeout: 30 * 24 * 60 * 60,   // 30 days
  revokeOldestOnMax: true              // Auto-revoke oldest
})
```

## Session UI Example

```typescript
function SessionsManager() {
  const { data: sessions } = authClient.useListDeviceSessions()
  return (
    <ul>
      {sessions?.map(s => (
        <li key={s.id}>
          {s.userAgent} {s.isCurrent && "(current)"}
          <button onClick={() => multiSession.revoke({ sessionId: s.id })}>Revoke</button>
        </li>
      ))}
    </ul>
  )
}
```
