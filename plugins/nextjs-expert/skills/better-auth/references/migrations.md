---
name: migrations
description: Migrate from NextAuth, Clerk, Supabase to Better Auth with database schema setup
when-to-use: migrating auth, switching providers, changing frameworks, data migration, schema setup
keywords: migration, NextAuth, Clerk, Supabase, Auth0, database migration, schema, switch auth
priority: medium
related: concepts/database.md, adapters/prisma.md, guides/authjs-migration.md, guides/clerk-migration.md
---

# Better Auth Migrations

## When to Use

- Migrating from NextAuth/Auth.js
- Migrating from Clerk
- Migrating from Supabase Auth
- Setting up database schema

## Why Migrate

| From | Benefit |
|------|---------|
| NextAuth | Better types, more plugins |
| Clerk | Self-hosted, no vendor lock |
| Supabase | Full control, custom DB |

## From Auth.js (NextAuth)

```bash
bun remove next-auth && bun add better-auth
```

```typescript
// Before: NextAuth({ providers: [Google({ clientId, clientSecret })] })
// After:
export const auth = betterAuth({
  database: prismaAdapter(prisma),
  socialProviders: { google: { clientId, clientSecret } }
})

// Route: app/api/auth/[...all]/route.ts
import { toNextJsHandler } from "better-auth/next-js"
export const { GET, POST } = toNextJsHandler(auth)
```

## From Clerk

```bash
bun remove @clerk/nextjs && bun add better-auth
```

Remove ClerkProvider, use proxy.ts for auth protection.

## From Supabase Auth

```typescript
// Before: supabase.auth.signInWithPassword({ email, password })
// After: authClient.signIn.email({ email, password })
```

## Database Schema (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  sessions      Session[]
  accounts      Account[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id])
}

model Account {
  id           String  @id @default(cuid())
  userId       String
  provider     String
  providerId   String
  accessToken  String?
  refreshToken String?
  user         User    @relation(fields: [userId], references: [id])
}
```

```bash
bunx prisma migrate dev
```

## Data Migration

```typescript
async function migrateUsers() {
  const oldUsers = await oldDb.user.findMany()
  for (const user of oldUsers) {
    await auth.api.createUser({ email: user.email, name: user.name })
  }
}
```
