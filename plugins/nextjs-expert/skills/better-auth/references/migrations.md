# Better Auth Migrations

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

// Client: import { authClient } from "@/lib/auth-client"
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
