---
name: supabase-migration
description: Migrate from Supabase Auth to Better Auth
when-to-use: supabase migration, switching from supabase, migration guide
keywords: Supabase, migration, switching, from Supabase, migration guide
priority: low
requires: migrations.md
related: migrations.md
---

# Better Auth Supabase Auth Migration Guide

## When to Use

- Keep Supabase DB, replace auth
- Need auth features not in Supabase
- Want 2FA, organizations, SSO
- Separating auth from database

## Why Migrate

| Supabase Auth | Better Auth |
|---------------|-------------|
| Supabase-only | Any database |
| Limited plugins | 50+ plugins |
| RLS-based | Middleware/proxy |
| Basic 2FA | Full 2FA + passkeys |

## Key Differences

| Supabase Auth | Better Auth |
|---------------|-------------|
| `@supabase/supabase-js` | `better-auth` |
| `supabase.auth.signIn()` | `authClient.signIn.email()` |
| `supabase.auth.getUser()` | `auth.api.getSession()` |
| Hosted by Supabase | Self-hosted |
| RLS policies | Middleware/proxy.ts |

## 1. Install Better Auth

```bash
bun add better-auth
```

## 2. Keep Supabase for Database Only

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma),  // Prisma pointing to Supabase PostgreSQL
  emailAndPassword: { enabled: true },
  socialProviders: { google: {...} }
})
```

## 3. Replace Auth Calls

```typescript
// Before (Supabase)
const { data, error } = await supabase.auth.signInWithPassword({ email, password })
const { data: { user } } = await supabase.auth.getUser()

// After (Better Auth)
await authClient.signIn.email({ email, password })
const { data: session } = await authClient.getSession()
const user = session?.user
```

## 4. Migrate Users

```sql
-- Export from Supabase auth.users
-- Import to Better Auth users table
INSERT INTO users (id, email, email_verified, created_at)
SELECT id, email, email_confirmed_at IS NOT NULL, created_at
FROM auth.users;
```

## 5. Replace RLS with Proxy

```typescript
// proxy.ts
export default async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (request.nextUrl.pathname.startsWith("/api/protected") && !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
```

## 6. Update OAuth Callbacks

Change callback URLs in Google/GitHub console:
`https://your-domain.com/api/auth/callback/{provider}`
