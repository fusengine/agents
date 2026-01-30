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
npm install better-auth
```

## File Structure

```
lib/
├── auth.ts              # Server config (betterAuth)
└── auth-client.ts       # Client config (createAuthClient)
app/api/auth/[...all]/
└── route.ts             # API handler
```

## Minimal Setup

### 1. Server (`lib/auth.ts`)
```typescript
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true }
})
```

### 2. Client (`lib/auth-client.ts`)
```typescript
import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient()
```

### 3. Route (`app/api/auth/[...all]/route.ts`)
```typescript
import { auth } from "@/lib/auth"
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
- Middleware protection

## Documentation

- Official: https://www.better-auth.com/docs
- See `references/` for detailed guides
