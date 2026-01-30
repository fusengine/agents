---
name: better-auth
description: Authentication with Better Auth - sessions, OAuth, plugins. Use when implementing login, signup, OAuth providers, session management, or user authentication in Next.js.
version: 2.0.0
user-invocable: true
references:
  - path: references/installation.md
  - path: references/server-config.md
  - path: references/client.md
  - path: references/session.md
  - path: references/middleware.md
  - path: references/server-actions.md
  - path: references/providers/
  - path: references/adapters/
  - path: references/plugins/
---

# Better Auth for Next.js

## Quick Start

```bash
bun add better-auth
```

## SOLID File Structure (Next.js 16)

```
proxy.ts                              # Same level as app/
app/api/auth/[...all]/route.ts
modules/
├── cores/database/prisma.ts
└── auth/src/
    ├── interfaces/session.interface.ts
    ├── services/auth.ts              # betterAuth
    └── hooks/auth-client.ts          # createAuthClient
```

## Minimal Setup

### 1. Server (`modules/auth/src/services/auth.ts`)
```typescript
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/modules/cores/database/prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true }
})
```

### 2. Client (`modules/auth/src/hooks/auth-client.ts`)
```typescript
import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient()
```

### 3. Route (`app/api/auth/[...all]/route.ts`)
```typescript
import { auth } from "@/modules/auth/src/services/auth"
import { toNextJsHandler } from "better-auth/next-js"
export const { GET, POST } = toNextJsHandler(auth)
```

## Environment Variables

```bash
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
```

## Key Features

- Session-based authentication with cookies
- OAuth providers (Google, GitHub, Discord, etc.)
- Prisma/Drizzle adapters
- Plugin system (2FA, Organizations, Admin, etc.)
- proxy.ts protection (Next.js 16)

## Documentation

- Official: https://www.better-auth.com/docs
