# Better Auth API Reference

## Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sign-up/email` | POST | Create account |
| `/sign-in/email` | POST | Email sign-in |
| `/sign-in/social` | POST | OAuth sign-in |
| `/sign-out` | POST | Sign out |
| `/get-session` | GET | Get session |
| `/update-user` | PATCH | Update profile |
| `/change-password` | POST | Change password |
| `/forgot-password` | POST | Request reset |
| `/reset-password` | POST | Reset password |

## Server API

```typescript
import { auth } from "@/modules/auth/src/services/auth"

const session = await auth.api.getSession({ headers })
const user = await auth.api.createUser({ email, password, name })
const sessions = await auth.api.listSessions({ userId })
await auth.api.revokeSession({ sessionId })
await auth.api.updateUser({ userId, data: { name: "New" } })
```

## Client API

```typescript
const { signIn, signUp, signOut, useSession } = authClient

await signUp.email({ email, password, name })
await signIn.email({ email, password })
await signIn.social({ provider: "google" })
await signOut()

const { data: session, isPending } = useSession()
await authClient.updateUser({ name: "New" })
await authClient.changePassword({ currentPassword, newPassword })
```

## Response Types

```typescript
interface Session {
  user: { id: string; email: string; name: string; emailVerified: boolean }
  session: { id: string; expiresAt: Date }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `USER_NOT_FOUND` | User doesn't exist |
| `INVALID_PASSWORD` | Wrong password |
| `EMAIL_NOT_VERIFIED` | Not verified |
| `SESSION_EXPIRED` | Session expired |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
