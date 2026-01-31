---
name: authjs
description: Auth.js (NextAuth v5) integration with Prisma adapter
when-to-use: Building authentication with Auth.js and using Prisma as the database adapter
keywords: Auth.js, NextAuth, adapter, credentials, OAuth, sessions
priority: high
requires: client.md, nextjs-integration.md
related: clerk.md, betterauth.md
---

# Auth.js with Prisma Adapter

Integrate Auth.js (NextAuth v5) with Prisma 7 for authentication.

## Schema Setup

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?

  accounts Account[]
  sessions Session[]
}

model Account {
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([provider, providerAccountId])
  @@index([userId])
}

model Session {
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@id([identifier, token])
}
```

---

## Auth Configuration

```typescript
// modules/auth/src/interfaces/auth.interface.ts
import type { Session, User } from 'next-auth'

/**
 * Extended session with user ID
 */
export interface ExtendedSession extends Session {
  user: Session['user'] & {
    id: string
  }
}

/**
 * OAuth provider configuration
 */
export interface OAuthProviderConfig {
  clientId: string
  clientSecret: string
}
```

```typescript
// modules/auth/src/config/auth.config.ts
import type { NextAuthConfig } from 'next-auth'
import type { ExtendedSession } from '../interfaces/auth.interface'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GitHubProvider from 'next-auth/providers/github'
import { prisma } from '@/modules/cores/db/prisma'

/**
 * NextAuth configuration
 */
export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }): Promise<ExtendedSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      }
    },
  },
} satisfies NextAuthConfig
```

```typescript
// auth.ts
import NextAuth from 'next-auth'
import { authConfig } from '@/modules/auth/src/config/auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
```

---

## API Route Handlers

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth'

export const { GET, POST } = handlers
```

---

## Using in Server Components

```typescript
// modules/dashboard/src/services/auth-dashboard.service.ts
import { prisma } from '@/modules/cores/db/prisma'
import type { User, Account } from '@prisma/client'

interface AuthDashboardData {
  user: User
  accountCount: number
}

/**
 * Fetch authenticated user dashboard data
 */
export async function getAuthDashboard(userId: string): Promise<AuthDashboardData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { accounts: true },
  })

  if (!user) return null

  return {
    user,
    accountCount: user.accounts.length,
  }
}
```

```typescript
// app/dashboard/page.tsx
import { auth } from '@/auth'
import { getAuthDashboard } from '@/modules/dashboard/src/services/auth-dashboard.service'
import { AuthDashboardView } from '@/modules/dashboard/components/AuthDashboardView'
import type { ExtendedSession } from '@/modules/auth/src/interfaces/auth.interface'

/**
 * Dashboard page - Server Component
 */
export default async function DashboardPage() {
  const session = (await auth()) as ExtendedSession | null
  if (!session?.user?.id) return <div>Not authenticated</div>

  const dashboard = await getAuthDashboard(session.user.id)
  if (!dashboard) return <div>User not found</div>

  return <AuthDashboardView dashboard={dashboard} />
}
```

---

## Server Actions

```typescript
// modules/profile/src/interfaces/profile.interface.ts
/**
 * Profile update request
 */
export interface UpdateProfileRequest {
  name: string
}

/**
 * Profile update response
 */
export interface UpdateProfileResponse {
  success: boolean
  message?: string
}
```

```typescript
// modules/profile/src/services/profile.service.ts
import { prisma } from '@/modules/cores/db/prisma'
import type { UpdateProfileRequest } from '../interfaces/profile.interface'

/**
 * Update user profile
 * @throws {Error} If user not found
 */
export async function updateUserProfile(userId: string, request: UpdateProfileRequest) {
  return prisma.user.update({
    where: { id: userId },
    data: { name: request.name },
  })
}
```

```typescript
// app/profile/actions.ts
'use server'

import { auth } from '@/auth'
import { updateUserProfile } from '@/modules/profile/src/services/profile.service'
import type { ExtendedSession } from '@/modules/auth/src/interfaces/auth.interface'
import type { UpdateProfileRequest } from '@/modules/profile/src/interfaces/profile.interface'

/**
 * Server action to update user profile
 */
export async function updateProfileAction(name: string) {
  const session = (await auth()) as ExtendedSession | null
  if (!session?.user?.id) throw new Error('Unauthorized')

  const request: UpdateProfileRequest = { name }
  await updateUserProfile(session.user.id, request)
}
```

---

## Best Practices

1. **Use PrismaAdapter** - Handles all session/account management
2. **Index userId** - Add @@index for faster lookups
3. **Session callbacks** - Add user ID to session for easy access
4. **Cascade deletes** - Automatically remove sessions/accounts when user deleted
5. **Store provider info** - Keep OAuth account details in Account model
