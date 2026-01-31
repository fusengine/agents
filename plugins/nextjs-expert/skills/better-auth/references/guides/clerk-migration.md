---
name: clerk-migration
description: Migrate from Clerk to Better Auth
when-to-use: clerk migration, switching from clerk, migration guide
keywords: Clerk, migration, switching, from Clerk, migration guide
priority: low
requires: migrations.md
related: migrations.md, guides/authjs-migration.md
---

# Better Auth Clerk Migration Guide

## When to Use

- Migrating from Clerk to self-hosted
- Eliminating per-MAU pricing
- Need full customization control
- Avoiding vendor lock-in

## Why Migrate

| Clerk | Better Auth |
|-------|-------------|
| Paid per MAU | Free/OSS |
| Pre-built UI | Custom components |
| Vendor hosted | Self-hosted |
| Limited control | Full control |

## Key Differences

| Clerk | Better Auth |
|-------|-------------|
| `@clerk/nextjs` | `better-auth` |
| `ClerkProvider` | No provider needed |
| `useUser()` | `useSession()` |
| `SignIn/SignUp` components | Custom components |
| Hosted auth pages | Self-hosted |

## 1. Install Better Auth

```bash
bun remove @clerk/nextjs
bun add better-auth
```

## 2. Replace Auth Configuration

```typescript
// Before (Clerk)
// middleware.ts with clerkMiddleware()

// After (Better Auth)
// modules/auth/src/services/auth.ts
export const auth = betterAuth({
  database: prismaAdapter(prisma),
  emailAndPassword: { enabled: true },
  socialProviders: { google: {...}, github: {...} }
})
```

## 3. Replace Hooks

```typescript
// Before (Clerk)
import { useUser, useAuth } from "@clerk/nextjs"
const { user } = useUser()
const { signOut } = useAuth()

// After (Better Auth)
import { useSession, signOut } from "@/modules/auth/src/hooks/auth-client"
const { data: session } = useSession()
const user = session?.user
```

## 4. Replace Components

```typescript
// Before: <SignIn /> <SignUp /> <UserButton />
// After: Build custom components with authClient methods

await authClient.signIn.email({ email, password })
await authClient.signUp.email({ email, password, name })
await authClient.signOut()
```

## 5. Migrate User Data

```sql
INSERT INTO users (id, email, name, image)
SELECT id, email_addresses[0], first_name || ' ' || last_name, image_url
FROM clerk_users;
```

## 6. Update Environment

```env
# Remove CLERK_* variables
# Add Better Auth config
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=https://your-domain.com
```
