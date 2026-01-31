---
name: betterauth
description: Better Auth integration with Prisma 7
when-to-use: Building authentication with Better Auth and managing users with Prisma
keywords: Better Auth, authentication, OAuth, MFA, sessions
priority: high
requires: client.md, nextjs-integration.md
related: clerk.md, authjs.md
---

# Better Auth with Prisma

Integrate Better Auth with Prisma 7 for modern authentication.

## Schema Setup

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts       Account[]
  sessions       Session[]
  twoFactors     TwoFactor[]
}

model Account {
  id       String @id @default(cuid())
  userId   String
  provider String
  providerId String

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerId])
  @@index([userId])
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model TwoFactor {
  id     String @id @default(cuid())
  userId String
  secret String

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

---

## Better Auth Server Setup

```typescript
// modules/auth/src/interfaces/better-auth.interface.ts
/**
 * Social provider configuration for Better Auth
 */
export interface SocialProvider {
  clientId: string
  clientSecret: string
}

/**
 * Better Auth options
 */
export interface BetterAuthOptions {
  emailAndPassword: {
    enabled: boolean
  }
  socialProviders: {
    github?: SocialProvider
    google?: SocialProvider
  }
  plugins: Array<any>
}
```

```typescript
// modules/auth/src/config/better-auth.config.ts
import type { BetterAuthOptions, SocialProvider } from '../interfaces/better-auth.interface'

/**
 * Get Better Auth configuration with environment variables
 */
export function createBetterAuthConfig(): BetterAuthOptions {
  const githubProvider: SocialProvider = {
    clientId: process.env.GITHUB_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
  }

  const googleProvider: SocialProvider = {
    clientId: process.env.GOOGLE_ID!,
    clientSecret: process.env.GOOGLE_SECRET!,
  }

  return {
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      github: githubProvider,
      google: googleProvider,
    },
    plugins: [
      require('better-auth/plugins/two-factor').twoFactor({
        issuer: 'MyApp',
      }),
    ],
  }
}
```

```typescript
// modules/auth/src/services/better-auth.service.ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '@/modules/cores/db/prisma'
import { createBetterAuthConfig } from '../config/better-auth.config'

/**
 * Initialize Better Auth with Prisma adapter
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma),
  ...createBetterAuthConfig(),
})
```

---

## API Routes

```typescript
// app/api/auth/[...auth]/route.ts
import { auth } from '@/lib/auth'

export const { GET, POST } = auth.toNextJsHandler()
```

---

## Client Hook

```typescript
// app/dashboard/page.tsx
'use client'

import { useSession } from '@/lib/auth-client'

export function DashboardClient() {
  const { data: session } = useSession()

  if (!session) return <div>Not logged in</div>

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
    </div>
  )
}
```

---

## Server Components with Auth

```typescript
// modules/profile/src/services/profile-better-auth.service.ts
import { auth } from '@/modules/auth/src/services/better-auth.service'
import { prisma } from '@/modules/cores/db/prisma'
import type { User, Account } from '@prisma/client'

interface ProfileData {
  user: User
  accounts: Account[]
}

/**
 * Get user profile with connected accounts
 */
export async function getUserProfile(userId: string): Promise<ProfileData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { accounts: true },
  })

  if (!user) return null

  return {
    user,
    accounts: user.accounts,
  }
}
```

```typescript
// app/profile/page.tsx
import { auth } from '@/modules/auth/src/services/better-auth.service'
import { getUserProfile } from '@/modules/profile/src/services/profile-better-auth.service'
import { ProfileView } from '@/modules/profile/components/ProfileView'
import { headers } from 'next/headers'

/**
 * Profile page - Server Component with Better Auth
 */
export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) return <div>Not authenticated</div>

  const profile = await getUserProfile(session.user.id)
  if (!profile) return <div>Profile not found</div>

  return <ProfileView profile={profile} />
}
```

---

## Server Actions

```typescript
// modules/auth/src/interfaces/auth-actions.interface.ts
/**
 * Sign up request
 */
export interface SignUpRequest {
  email: string
  password: string
}

/**
 * Sign up response
 */
export interface SignUpResponse {
  user: {
    id: string
    email: string
  }
  token?: string
}

/**
 * Update profile request
 */
export interface UpdateProfileRequest {
  name: string
}
```

```typescript
// modules/auth/src/services/auth-actions.service.ts
import { auth } from './better-auth.service'
import { prisma } from '@/modules/cores/db/prisma'
import type { SignUpRequest, SignUpResponse, UpdateProfileRequest } from '../interfaces/auth-actions.interface'

/**
 * Create new user account
 */
export async function signUpUser(request: SignUpRequest): Promise<SignUpResponse> {
  return auth.api.signUpEmail({
    email: request.email,
    password: request.password,
  })
}

/**
 * Update user profile by ID
 */
export async function updateUserProfileService(userId: string, request: UpdateProfileRequest) {
  return prisma.user.update({
    where: { id: userId },
    data: { name: request.name },
  })
}
```

```typescript
// app/auth/actions.ts
'use server'

import { signUpUser, updateUserProfileService } from '@/modules/auth/src/services/auth-actions.service'
import type { SignUpRequest, UpdateProfileRequest } from '@/modules/auth/src/interfaces/auth-actions.interface'

/**
 * Server action to sign up new user
 */
export async function signUpUserAction(email: string, password: string) {
  const request: SignUpRequest = { email, password }
  return signUpUser(request)
}

/**
 * Server action to update user profile
 */
export async function updateUserProfileAction(userId: string, name: string) {
  const request: UpdateProfileRequest = { name }
  return updateUserProfileService(userId, request)
}
```

---

## Best Practices

1. **Use prismaAdapter** - Native Prisma integration
2. **Enable MFA plugin** - Add two-factor authentication
3. **Index foreign keys** - Add @@index for userId fields
4. **Cascade deletes** - Remove sessions when user deleted
5. **Separate concerns** - Keep auth logic in lib/auth.ts
