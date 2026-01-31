---
name: auth0-migration
description: Migrate from Auth0 to Better Auth
when-to-use: auth0 migration, switching from auth0, migration guide
keywords: Auth0, migration, switching, from Auth0, migration guide
priority: low
requires: migrations.md
related: migrations.md, guides/clerk-migration.md
---

# Better Auth Migration from Auth0

## When to Use

- Migrating from Auth0 to self-hosted
- Reducing authentication costs
- Need more customization control
- Eliminating vendor dependency

## Why Migrate

| Auth0 | Better Auth |
|-------|-------------|
| Usage-based pricing | Free/OSS |
| Vendor hosted | Self-hosted |
| Limited customization | Full control |
| Vendor lock-in | Portable |

## 1. Install Better Auth

```bash
bun add better-auth
```

## 2. Export Auth0 Users

```bash
# Using Auth0 CLI
auth0 users export -f users.json
```

## 3. Configure Better Auth

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }
  }
})
```

## 4. Update API Routes

```typescript
// Before (Auth0)
// app/api/auth/[auth0]/route.ts

// After (Better Auth)
// app/api/auth/[...all]/route.ts
import { toNextJsHandler } from "better-auth/next-js"
export const { GET, POST } = toNextJsHandler(auth)
```

## 5. Update Client

```typescript
// Before (Auth0)
import { useUser } from "@auth0/nextjs-auth0/client"

// After (Better Auth)
import { authClient } from "@/lib/auth-client"
const { data: session } = authClient.useSession()
```

## 6. Migrate Users

```typescript
import users from "./users.json"

async function migrateAuth0Users() {
  for (const user of users) {
    await auth.api.createUser({
      email: user.email,
      name: user.name,
      emailVerified: user.email_verified ? new Date() : null
    })

    // Link social accounts
    if (user.identities) {
      for (const identity of user.identities) {
        await auth.api.linkAccount({
          userId: newUser.id,
          provider: identity.provider,
          providerAccountId: identity.user_id
        })
      }
    }
  }
}
```

## 7. Update Environment Variables

```bash
# Remove
AUTH0_SECRET=
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=

# Add
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
```
