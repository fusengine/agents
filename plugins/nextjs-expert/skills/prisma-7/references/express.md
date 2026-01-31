---
name: express
description: Prisma 7 integration with Express.js framework
when-to-use: Building Express.js REST APIs with Prisma database
keywords: Express, REST API, middleware, routes, Node.js
priority: high
requires: client.md
related: hono.md, deployment.md
---

# Express.js Integration

Prisma 7 with Express.js for building REST APIs and server applications.

## Setup

```typescript
// src/interfaces/db.ts
/**
 * Global Prisma singleton type definition
 * @see /src/db.ts
 */
export interface PrismaGlobal {
  prisma: PrismaClient | undefined
}

// src/db.ts
import { PrismaClient } from '@prisma/client'
import type { PrismaGlobal } from './interfaces/db'

/**
 * Singleton Prisma client instance
 * Prevents multiple connections in development
 */
const globalForPrisma = globalThis as unknown as PrismaGlobal

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

---

## Basic Routes

```typescript
// src/index.ts
import express from 'express'
import { prisma } from './db'

const app = express()

app.use(express.json())

app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' })
  }
})

app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body

    if (!name || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
      })
    }

    const user = await prisma.user.create({
      data: { name, email },
    })

    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Creation failed' })
  }
})

app.listen(3000, () => {
  console.log('Server on http://localhost:3000')
})
```

---

## Parameterized Routes

```typescript
app.get('/users/:id', async (req, res) => {
  const { id } = req.params

  const user = await prisma.user.findUnique({
    where: { id },
    include: { posts: true },
  })

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
    })
  }

  res.json(user)
})

app.patch('/users/:id', async (req, res) => {
  const { id } = req.params
  const data = req.body

  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    })

    res.json(user)
  } catch (error) {
    res.status(500).json({
      error: 'Update failed',
    })
  }
})

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params

  try {
    await prisma.user.delete({
      where: { id },
    })

    res.status(204).send()
  } catch (error) {
    res.status(500).json({
      error: 'Delete failed',
    })
  }
})
```

---

## Middleware

```typescript
// src/interfaces/auth.ts
/**
 * Authenticated user from token
 * @see /src/middleware/auth.ts
 */
export interface AuthenticatedUser {
  id: string
  email: string
  token: string
  name?: string
}

/**
 * Extended Express request with user
 */
export interface AuthRequest extends Request {
  user?: AuthenticatedUser
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  error: string
}

// src/middleware/auth.ts
import type { Request, Response, NextFunction } from 'express'
import type { AuthenticatedUser, AuthRequest, ApiErrorResponse } from '../interfaces/auth'
import { prisma } from '../db'

/**
 * Authentication middleware for Express
 * Validates Bearer token and attaches user to request
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Next middleware
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.replace(
    'Bearer ',
    ''
  )

  if (!token) {
    return res.status(401).json<ApiErrorResponse>({
      error: 'Unauthorized',
    })
  }

  const user = await prisma.user.findFirst({
    where: { token },
  })

  if (!user) {
    return res.status(401).json<ApiErrorResponse>({
      error: 'Invalid token',
    })
  }

  ;(req as AuthRequest).user = user as AuthenticatedUser
  next()
}

// Usage
app.use('/api/protected', authMiddleware)

app.get(
  '/api/protected/profile',
  async (req: AuthRequest, res) => {
    const user = req.user
    res.json(user)
  }
)
```

---

## Error Handling Middleware

```typescript
// src/interfaces/errors.ts
/**
 * API error with HTTP status
 * @see /src/middleware/errorHandler.ts
 */
export interface ApiError extends Error {
  status?: number
}

/**
 * Error response format
 */
export interface ErrorResponse {
  error: string
}

// src/middleware/errorHandler.ts
import type {
  Request,
  Response,
  NextFunction,
} from 'express'
import type { ApiError, ErrorResponse } from '../interfaces/errors'

/**
 * Centralized error handler for Express
 * Logs errors and returns consistent error responses
 * @param {ApiError} err - Error instance
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Next middleware
 */
export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500
  const message = err.message || 'Internal server error'

  if (err.message.includes('Unique constraint')) {
    return res.status(409).json<ErrorResponse>({
      error: 'Resource already exists',
    })
  }

  if (err.message.includes('Record to delete')) {
    return res.status(404).json<ErrorResponse>({
      error: 'Record not found',
    })
  }

  res.status(status).json<ErrorResponse>({
    error: message,
  })
}

app.use(errorHandler)
```

---

## Transactions

```typescript
app.post('/orders/checkout', async (req, res) => {
  const { userId, itemId, quantity } = req.body

  try {
    const order = await prisma.$transaction(
      async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            userId,
            status: 'pending',
          },
        })

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            itemId,
            quantity,
          },
        })

        await tx.inventory.update({
          where: { id: itemId },
          data: { stock: { decrement: quantity } },
        })

        return newOrder
      }
    )

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({
      error: 'Checkout failed',
    })
  }
})
```

---

## Pagination

```typescript
app.get('/posts', async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.post.count(),
  ])

  res.json({
    posts,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  })
})
```

---

## Best Practices

1. **Use middleware** - Separate concerns with middleware
2. **Error handling** - Custom error handler for consistency
3. **Validate input** - Check required fields
4. **Transactions** - Multi-step operations atomically
5. **Connection pooling** - Configure DATABASE_URL with pool
