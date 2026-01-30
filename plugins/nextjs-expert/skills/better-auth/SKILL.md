---
name: better-auth
description: Complete Better Auth for Next.js - sessions, OAuth 40+ providers, plugins, adapters. Use when implementing authentication, login, signup, OAuth, 2FA, magic links, SSO, or session management.
user-invocable: true
references: [references/installation.md, references/server-config.md, references/client.md, references/session.md, references/middleware.md, references/server-actions.md, references/hooks.md, references/email.md, references/rate-limiting.md, references/cli.md, references/security.md, references/api.md, references/migrations.md, references/adapters/prisma.md, references/adapters/drizzle.md, references/adapters/mongodb.md, references/adapters/sql-databases.md, references/providers/overview.md, references/providers/google.md, references/providers/github.md, references/providers/discord.md, references/providers/apple.md, references/providers/microsoft.md, references/providers/social-providers.md, references/providers/generic-oauth.md, references/plugins/overview.md, references/plugins/2fa.md, references/plugins/admin.md, references/plugins/organization.md, references/plugins/passkey.md, references/plugins/magic-link.md, references/plugins/email-otp.md, references/plugins/phone.md, references/plugins/anonymous.md, references/plugins/username.md, references/plugins/sso.md, references/plugins/jwt.md, references/plugins/bearer.md, references/plugins/multi-session.md, references/plugins/oidc-provider.md, references/integrations/nextjs.md, references/integrations/other-frameworks.md]
related-skills: [nextjs-16, prisma-7]
---

# Better Auth for Next.js

## Quick Start

```bash
bun add better-auth
```

## SOLID File Structure (Next.js 16)

```
proxy.ts                              # Auth protection
app/api/auth/[...all]/route.ts        # Auth handler
modules/
├── cores/database/prisma.ts
└── auth/src/
    ├── interfaces/session.interface.ts
    ├── services/auth.ts              # betterAuth config
    └── hooks/auth-client.ts          # createAuthClient
```

## Minimal Setup

### 1. Server
```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/modules/cores/database/prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true }
})
```

### 2. Client
```typescript
// modules/auth/src/hooks/auth-client.ts
import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient()
```

### 3. Route
```typescript
// app/api/auth/[...all]/route.ts
import { auth } from "@/modules/auth/src/services/auth"
import { toNextJsHandler } from "better-auth/next-js"
export const { GET, POST } = toNextJsHandler(auth)
```

## Key Features

- **40+ OAuth Providers**: Google, GitHub, Discord, Apple, Microsoft, etc.
- **15+ Plugins**: 2FA, Magic Link, SSO, Organization, Admin, JWT, etc.
- **4+ Adapters**: Prisma, Drizzle, MongoDB, SQL databases
- **Security**: Rate limiting, CSRF, secure cookies

## When to Use References

- **Setup**: installation.md, server-config.md, client.md
- **Providers**: providers/*.md for OAuth configuration
- **Plugins**: plugins/*.md for 2FA, magic-link, SSO, etc.
- **Database**: adapters/*.md for Prisma, Drizzle, MongoDB
- **Security**: security.md, rate-limiting.md
- **Migration**: migrations.md from Auth.js, Clerk, Supabase
