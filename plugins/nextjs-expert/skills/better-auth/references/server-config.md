# Better Auth Server Configuration

## Basic Configuration

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
    expiresIn: 60 * 60 * 24 * 7,  // 7 days
    updateAge: 60 * 60 * 24,       // Refresh 24h
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5               // Cache 5 min
    }
  }
})

export type Session = typeof auth.$Infer.Session
```

## Main Options

| Option | Type | Description |
|--------|------|-------------|
| `database` | Adapter | Prisma, Drizzle, or direct config |
| `emailAndPassword` | object | Email/password auth |
| `socialProviders` | object | OAuth providers |
| `session` | object | Session config |
| `plugins` | array | Plugins to enable |
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

## Custom Hooks

```typescript
hooks: {
  before: createAuthMiddleware(async (ctx) => {
    // Validation before action
    if (ctx.path === "/sign-up/email") {
      // Custom logic
    }
  }),
  after: createAuthMiddleware(async (ctx) => {
    // Actions after auth
  })
}
```

## With Plugins

```typescript
import { twoFactor } from "better-auth/plugins/two-factor"
import { organization } from "better-auth/plugins/organization"

export const auth = betterAuth({
  // ... base config
  plugins: [
    twoFactor(),
    organization()
  ]
})
```

## Type Export

```typescript
// For typing in the app
export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
```
