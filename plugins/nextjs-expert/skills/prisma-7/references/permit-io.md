---
name: permit-io
description: Permit.io RBAC integration with Prisma 7
when-to-use: Implementing role-based access control with Permit.io and Prisma
keywords: Permit.io, RBAC, authorization, roles, permissions
priority: medium
requires: client.md, nextjs-integration.md
related: clerk.md, authjs.md
---

# Permit.io RBAC with Prisma

Integrate Permit.io for role-based access control with Prisma 7.

## Schema Setup

```prisma
model User {
  id       String @id @default(cuid())
  email    String @unique
  name     String?

  roles UserRole[]
}

model Role {
  id   String @id @default(cuid())
  name String @unique

  users UserRole[]
}

model UserRole {
  userId String
  roleId String

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@id([userId, roleId])
  @@index([userId])
}

model Resource {
  id        String @id @default(cuid())
  key       String @unique
  name      String
  createdAt DateTime @default(now())
}
```

---

## Permit.io Client Setup

```typescript
// modules/rbac/src/interfaces/permit.interface.ts
/**
 * Permission check request
 */
export interface PermissionCheckRequest {
  user: string
  action: string
  resource: string
}

/**
 * User sync request
 */
export interface UserSyncRequest {
  userId: string
  email: string
  roles: string[]
}

/**
 * Permit API configuration
 */
export interface PermitConfig {
  token: string
  pdp: string
}
```

```typescript
// modules/rbac/src/services/permit.service.ts
import type { Permit as PermitAPI } from 'permitio'
import type { PermissionCheckRequest, UserSyncRequest } from '../interfaces/permit.interface'
import { Permit } from 'permitio'

const permit: PermitAPI = new Permit({
  token: process.env.PERMIT_API_KEY!,
  pdp: process.env.PERMIT_PDP_URL!,
})

/**
 * Check if user has permission for action on resource
 */
export async function checkPermission(request: PermissionCheckRequest): Promise<boolean> {
  return permit.check({
    user: request.user,
    action: request.action,
    resource: request.resource,
  })
}

/**
 * Sync user with Permit and assign roles
 */
export async function syncUserWithPermit(request: UserSyncRequest): Promise<void> {
  await permit.api.users.sync({
    key: request.userId,
    email: request.email,
    first_name: request.email.split('@')[0],
  })

  for (const role of request.roles) {
    await permit.api.users.assignRole({
      user: request.userId,
      role,
    })
  }
}

export { permit }
```

---

## Authorization Middleware

```typescript
// modules/rbac/src/services/rbac-middleware.service.ts
import type { PermissionCheckRequest } from '../interfaces/permit.interface'
import { checkPermission } from './permit.service'

/**
 * Verify user permission for middleware
 */
export async function verifyPermissionMiddleware(
  userId: string,
  action: string,
  resource: string
): Promise<boolean> {
  const request: PermissionCheckRequest = {
    user: userId,
    action,
    resource,
  }

  return checkPermission(request)
}
```

```typescript
// middleware.ts
import type { ExtendedSession } from '@/modules/auth/src/interfaces/auth.interface'
import { auth } from '@/auth'
import { verifyPermissionMiddleware } from '@/modules/rbac/src/services/rbac-middleware.service'
import { prisma } from '@/modules/cores/db/prisma'
import { NextResponse } from 'next/server'

/**
 * Middleware for authorization checks
 */
export async function middleware(request: Request) {
  const session = (await auth()) as ExtendedSession | null
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { roles: true },
  })

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const allowed = await verifyPermissionMiddleware(session.user.id, 'read', 'dashboard')

  if (!allowed) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
```

---

## Server Action with Authorization

```typescript
// modules/admin/src/interfaces/admin-actions.interface.ts
/**
 * Delete user request
 */
export interface DeleteUserRequest {
  userId: string
}

/**
 * Authorization error
 */
export class AuthorizationError extends Error {
  constructor(message: string = 'Forbidden') {
    super(message)
    this.name = 'AuthorizationError'
  }
}
```

```typescript
// modules/admin/src/services/admin.service.ts
import type { DeleteUserRequest } from '../interfaces/admin-actions.interface'
import { AuthorizationError } from '../interfaces/admin-actions.interface'
import { checkPermission } from '@/modules/rbac/src/services/permit.service'
import { prisma } from '@/modules/cores/db/prisma'
import type { PermissionCheckRequest } from '@/modules/rbac/src/interfaces/permit.interface'

/**
 * Delete user with authorization check
 * @throws {AuthorizationError} If user lacks permission
 */
export async function deleteUserWithAuth(
  requestingUserId: string,
  request: DeleteUserRequest
): Promise<void> {
  const permissionCheck: PermissionCheckRequest = {
    user: requestingUserId,
    action: 'delete',
    resource: 'user',
  }

  const allowed = await checkPermission(permissionCheck)
  if (!allowed) throw new AuthorizationError('Forbidden')

  await prisma.user.delete({
    where: { id: request.userId },
  })
}
```

```typescript
// app/admin/actions.ts
'use server'

import type { ExtendedSession } from '@/modules/auth/src/interfaces/auth.interface'
import type { DeleteUserRequest } from '@/modules/admin/src/interfaces/admin-actions.interface'
import { auth } from '@/auth'
import { deleteUserWithAuth } from '@/modules/admin/src/services/admin.service'

/**
 * Server action to delete user
 */
export async function deleteUserAction(userId: string) {
  const session = (await auth()) as ExtendedSession | null
  if (!session?.user?.id) throw new Error('Unauthorized')

  const request: DeleteUserRequest = { userId }
  await deleteUserWithAuth(session.user.id, request)
}
```

---

## Component with Permission Check

```typescript
// modules/admin/src/services/admin-panel.service.ts
import type { PermissionCheckRequest } from '@/modules/rbac/src/interfaces/permit.interface'
import { checkPermission } from '@/modules/rbac/src/services/permit.service'

interface AdminPanelPermissions {
  canManageUsers: boolean
  canViewAnalytics: boolean
}

/**
 * Get admin panel permissions for user
 */
export async function getAdminPanelPermissions(userId: string): Promise<AdminPanelPermissions> {
  const [canManageUsers, canViewAnalytics] = await Promise.all([
    checkPermission({
      user: userId,
      action: 'manage',
      resource: 'users',
    } as PermissionCheckRequest),
    checkPermission({
      user: userId,
      action: 'view',
      resource: 'analytics',
    } as PermissionCheckRequest),
  ])

  return { canManageUsers, canViewAnalytics }
}
```

```typescript
// app/admin/panel/page.tsx
import type { ExtendedSession } from '@/modules/auth/src/interfaces/auth.interface'
import { auth } from '@/auth'
import { getAdminPanelPermissions } from '@/modules/admin/src/services/admin-panel.service'
import { AdminPanelView } from '@/modules/admin/components/AdminPanelView'

/**
 * Admin panel page - checks user permissions
 */
export default async function AdminPanel() {
  const session = (await auth()) as ExtendedSession | null
  if (!session?.user?.id) return <div>Not authenticated</div>

  const permissions = await getAdminPanelPermissions(session.user.id)

  return <AdminPanelView permissions={permissions} />
}
```

---

## Best Practices

1. **Sync users on creation** - Update Permit when user created in Prisma
2. **Cache permissions** - Use Redis for frequently checked permissions
3. **Audit actions** - Log authorization checks for compliance
4. **Define policies** - Use Permit dashboard to create clear RBAC policies
5. **Handle failures** - Deny access if Permit check fails
