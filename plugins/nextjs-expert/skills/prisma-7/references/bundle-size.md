---
title: Bundle Size Optimization
description: Client bundle optimization and tree-shaking in Prisma 7
keywords: [bundle, size, optimization, tree-shake, client]
---

# Bundle Size Optimization

Bundle optimization with SOLID Next.js principles.

## The Bundle Size Problem

```typescript
// lib/examples/bundle-antipattern.tsx - PROBLEM

/**
 * @deprecated Demonstrates bundling Prisma in client code
 * @description This imports Prisma in client component (~5MB!)
 */
'use client'
import { PrismaClient } from '@prisma/client' // ❌ ~5MB in bundle!

/**
 * @returns Promise<User[]>
 */
export async function getData() {
  // This bundles Prisma in client code - VERY BAD!
  const prisma = new PrismaClient()
  return await prisma.user.findMany()
}
```

---

## Solution 1: Server Actions

```typescript
// app/actions.ts
'use server'

import { prisma } from '@/lib/db/client'
import type { User } from '@prisma/client'

/**
 * @description Server action fetches users (stays on server)
 * @returns Promise<User[]> Array of users
 * @example
 * const users = await getUsers()
 */
export async function getUsers(): Promise<User[]> {
  // ✅ GOOD: Prisma stays on server (not bundled)
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
  })
}

/**
 * @description Server action creates user
 * @param data User creation data
 * @returns Promise<User> Created user
 */
export async function createUser(data: {
  email: string
  name: string
}): Promise<User> {
  // ✅ GOOD: All DB logic server-side
  return prisma.user.create({
    data,
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  })
}

// app/page.tsx (Server Component)
import { getUsers } from '@/app/actions'

/**
 * @description Page fetches users at render time
 * @returns React Component
 */
export default async function UsersPage() {
  const users = await getUsers()

  // ✅ GOOD: Data sent directly to server component
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## Solution 2: API Routes (REST Endpoints)

```typescript
// app/api/users/route.ts
import { prisma } from '@/lib/db/client'
import type { User } from '@prisma/client'

/**
 * @description GET /api/users - Fetches all users
 * @returns Response JSON array of users
 */
export async function GET(): Promise<Response> {
  // ✅ GOOD: Prisma isolated on server
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
  })

  return Response.json(users)
}

/**
 * @description POST /api/users - Creates user
 * @param request HTTP request with user data
 * @returns Response Created user
 */
export async function POST(request: Request): Promise<Response> {
  const data = await request.json()

  try {
    // ✅ GOOD: Server-side only database operation
    const user = await prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    return Response.json(user, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to create user' }, { status: 400 })
  }
}

// app/users/page.tsx (Client Component)
'use client'

import { useEffect, useState } from 'react'
import type { User } from '@prisma/client'

/**
 * @description Client component fetches from API endpoint
 * @returns React Component
 */
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ✅ GOOD: Client fetches from clean API
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## Solution 3: Next.js Edge Runtime

```typescript
// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/edge-client'

export const config = {
  matcher: ['/api/auth/*'],
}

/**
 * @description Middleware validates request via database (edge runtime)
 * @param request HTTP request
 * @returns Promise<NextResponse> Modified response or passthrough
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const token = request.headers.get('authorization')?.split(' ')[1]

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // ✅ GOOD: Edge-compatible database check
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Continue with request
    return NextResponse.next()
  } catch (error) {
    return NextResponse.json(
      { error: 'Auth check failed' },
      { status: 500 }
    )
  }
}
```

---

## Bundle Analysis & Monitoring

```bash
# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // Other Next.js config
})

# Commands
ANALYZE=true npm run build  # Generate bundle analysis
npm run build               # Normal build with size output
```

```typescript
// lib/bundle-monitor.ts

/**
 * @description Checks that Prisma is not in client bundle
 * @returns void
 */
export function monitorBundleSize(): void {
  if (typeof window !== 'undefined') {
    // Running in browser
    console.warn('[BUNDLE] Check: Prisma should not be bundled!')

    // @ts-ignore - Check for Prisma in window
    if (window.PrismaClient) {
      throw new Error('[BUNDLE ERROR] Prisma found in client bundle!')
    }
  }
}

// Call this in entry point or layout
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  monitorBundleSize()
}
```

---

## Code Splitting Best Practices

### Correct Pattern: Prisma on Server

```typescript
// app/actions.ts - ✅ GOOD
'use server'

import { prisma } from '@/lib/db/client'

export async function fetchUserData(userId: string) {
  // ✅ Server-only code
  return prisma.user.findUnique({ where: { id: userId } })
}

// components/UserCard.tsx - ✅ GOOD
import { fetchUserData } from '@/app/actions'

/**
 * @description Server component - Prisma never bundled
 */
export async function UserCard({ userId }: { userId: string }) {
  const user = await fetchUserData(userId)
  return <div>{user?.name}</div>
}
```

### Incorrect Pattern: Prisma in Client

```typescript
// ❌ BAD: Never do this!
'use client'

import { prisma } from '@/lib/db/client' // ❌ Bundles Prisma!

export function UserCard({ userId }: { userId: string }) {
  // ❌ This code runs in browser - Prisma bundled!
  useEffect(() => {
    prisma.user.findUnique({ where: { id: userId } })
  }, [])
}
```

---

## Size Comparison

| Approach | Bundle Impact | Performance | Recommendation |
|----------|--------------|-------------|-----------------|
| **Server Actions** | 0 bytes | Excellent | Preferred |
| **API Routes** | 0 bytes | Good | Fallback |
| **Edge Runtime** | ~2-3KB | Very Good | Specialized |
| **Client Import** | ~5MB | Terrible | NEVER |

### SOLID Compliance
- **S**: Separate server actions, API routes, components
- **O**: Add monitoring without changing patterns
- **L**: Server action and API route results interchangeable
- **I**: Focused action and API endpoint interfaces
- **D**: Components depend on abstractions (actions/APIs)
