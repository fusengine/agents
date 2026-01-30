# Gestion des Sessions

## Configuration Session

```typescript
// lib/auth.ts
export const auth = betterAuth({
  session: {
    expiresIn: 60 * 60 * 24 * 7,  // 7 jours (secondes)
    updateAge: 60 * 60 * 24,       // Refresh après 24h
    freshAge: 60 * 10,             // Session "fraîche" 10 min
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5               // Cache cookie 5 min
    }
  }
})
```

## Structure Session

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

## Cookie Session

Better Auth stocke le token de session dans un cookie HTTP-only:

```
better-auth.session_token=xxx
```

Options cookie:
- `httpOnly: true`
- `secure: true` (production)
- `sameSite: "lax"`

## Vérifier Session (Client)

```typescript
"use client"
import { authClient } from "@/lib/auth-client"

// Hook React
const { data: session } = authClient.useSession()

// Sans hook
const session = await authClient.getSession()
```

## Vérifier Session (Serveur)

```typescript
// Server Component / Server Action
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

const session = await auth.api.getSession({
  headers: await headers()
})
```

## Lister Sessions Actives

```typescript
// Toutes les sessions de l'utilisateur
const sessions = await authClient.listSessions()

// Révoquer une session
await authClient.revokeSession({ token: sessionToken })

// Révoquer toutes sauf courante
await authClient.revokeOtherSessions()
```

## Désactiver Cookie Cache

```typescript
session: {
  cookieCache: {
    enabled: false
  }
}
```
