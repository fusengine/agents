---
name: prisma-template
description: Prisma client singleton and repository pattern
when-to-use: database setup, prisma singleton, repository pattern
keywords: prisma, singleton, database, repository, CRUD
priority: high
related: query.md, service.md
---

# Prisma Singleton

```typescript
// modules/cores/database/prisma.ts
import { PrismaClient } from '@prisma/client'

/**
 * Prisma client singleton for database access
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : []
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

# Repository Pattern

```typescript
// modules/users/src/repositories/user.repository.ts
import { prisma } from '@/modules/cores/database/prisma'
import type { User, CreateUserInput, UpdateUserInput } from '../interfaces/user.interface'

/**
 * User repository for database operations
 */
export class UserRepository {
  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  /**
   * Create user
   */
  static async create(data: CreateUserInput): Promise<User> {
    return prisma.user.create({ data })
  }

  /**
   * Update user
   */
  static async update(id: string, data: UpdateUserInput): Promise<User> {
    return prisma.user.update({ where: { id }, data })
  }

  /**
   * Delete user
   */
  static async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } })
  }

  /**
   * Find all with pagination
   */
  static async findAll(options: { page: number; limit: number }) {
    const { page, limit } = options
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      prisma.user.findMany({ skip, take: limit }),
      prisma.user.count()
    ])

    return {
      data: users,
      meta: { page, limit, total, pages: Math.ceil(total / limit) }
    }
  }
}
```
