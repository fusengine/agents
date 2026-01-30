# Configuration Serveur Better Auth

## Configuration de Base

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,  // 7 jours
    updateAge: 60 * 60 * 24,       // Refresh 24h
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5               // Cache 5 min
    }
  }
})

export type Session = typeof auth.$Infer.Session
```

## Options Principales

| Option | Type | Description |
|--------|------|-------------|
| `database` | Adapter | Prisma, Drizzle, ou config directe |
| `emailAndPassword` | object | Auth email/password |
| `socialProviders` | object | OAuth providers |
| `session` | object | Config sessions |
| `plugins` | array | Plugins à activer |
| `hooks` | object | Before/after hooks |

## Social Providers

```typescript
socialProviders: {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!
  }
}
```

## Hooks Personnalisés

```typescript
hooks: {
  before: createAuthMiddleware(async (ctx) => {
    // Validation avant action
    if (ctx.path === "/sign-up/email") {
      // Logique custom
    }
  }),
  after: createAuthMiddleware(async (ctx) => {
    // Actions après auth
  })
}
```

## Avec Plugins

```typescript
import { twoFactor } from "better-auth/plugins/two-factor"
import { organization } from "better-auth/plugins/organization"

export const auth = betterAuth({
  // ... config de base
  plugins: [
    twoFactor(),
    organization()
  ]
})
```

## Type Export

```typescript
// Pour typage dans l'app
export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
```
