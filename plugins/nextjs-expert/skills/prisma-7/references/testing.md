---
name: testing
description: Prisma 7 testing patterns with mocking and integration tests
when-to-use: Unit testing, integration testing, mocking Prisma Client
keywords: mock, test, vitest, jest, integration, unit, factory
priority: medium
requires: client.md
related: queries.md
---

# Testing

Testing patterns for Prisma 7.

## Unit Testing with Mock

```typescript
// modules/cores/db/interfaces/prisma.interface.ts
import type { PrismaClient } from '../../generated/prisma/client'
import type { DeepMockProxy } from 'vitest-mock-extended'

/**
 * Mock PrismaClient type for unit testing.
 * Use with vitest-mock-extended mockDeep<PrismaClient>()
 *
 * @see modules/cores/db/__mocks__/prisma.ts
 */
export type MockPrismaClient = DeepMockProxy<PrismaClient>
```

```typescript
// modules/cores/db/__mocks__/prisma.ts
import type { MockPrismaClient } from '../interfaces/prisma.interface'
import { mockDeep } from 'vitest-mock-extended'

/**
 * Mock PrismaClient instance for unit testing.
 * Automatically mocked in test environment.
 *
 * @see modules/cores/db/interfaces/prisma.interface.ts
 */
export const prismaMock: MockPrismaClient = mockDeep()

vi.mock('../prisma', () => ({
  prisma: prismaMock,
}))
```

```typescript
// modules/users/src/__tests__/user.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { MockPrismaClient } from '../../../cores/db/interfaces/prisma.interface'
import { prismaMock } from '../../../cores/db/__mocks__/prisma'
import { getUserById } from '../user.service'

describe('getUserById', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Tests that getUserById retrieves a user by ID from database.
   */
  it('returns user by id', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test' }
    ;(prismaMock.user.findUnique as any).mockResolvedValue(mockUser)

    const result = await getUserById('1')

    expect(result).toEqual(mockUser)
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    })
  })
})
```

---

## Integration Testing

```typescript
// test/setup.ts
import type { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

let prismaClient: PrismaClient

/**
 * Initialize PrismaClient for integration tests with test database.
 *
 * @see test/__tests__/user.integration.test.ts
 */
export async function getPrismaForTests(): Promise<PrismaClient> {
  if (prismaClient) return prismaClient

  const { PrismaClient: Client } = await import('../generated/prisma/client')
  const adapter = new PrismaPg({
    connectionString: process.env.TEST_DATABASE_URL!,
  })
  prismaClient = new Client({ adapter })
  return prismaClient
}

beforeAll(async () => {
  const prisma = await getPrismaForTests()
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`
})

afterAll(async () => {
  if (prismaClient) {
    await prismaClient.$disconnect()
  }
})
```

```typescript
// modules/users/src/__tests__/user.integration.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import type { Prisma } from '../../../generated/prisma/client'
import { getPrismaForTests } from '../../../test/setup'
import { createUser } from '../user.service'

describe('User Integration', () => {
  beforeEach(async () => {
    const prisma = await getPrismaForTests()
    await prisma.user.deleteMany()
  })

  /**
   * Tests that createUser successfully persists user to database.
   */
  it('creates user in database', async () => {
    const userData: Prisma.UserCreateInput = {
      email: 'test@example.com',
      name: 'Test User',
    }

    const user = await createUser(userData)

    expect(user.id).toBeDefined()
    expect(user.email).toBe('test@example.com')

    const prisma = await getPrismaForTests()
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    })
    expect(dbUser).not.toBeNull()
  })
})
```

---

## Test Factories

```typescript
// modules/users/src/__tests__/factories/user.factory.ts
import type { Prisma } from '../../../../generated/prisma/client'
import { getPrismaForTests } from '../../../../test/setup'

/**
 * Factory function to create a test user with optional custom data.
 *
 * @param data - Partial user create input to override defaults
 * @returns Created user record from database
 * @see modules/users/src/__tests__/user.integration.test.ts
 */
export async function createTestUser(
  data: Partial<Prisma.UserCreateInput> = {}
) {
  const prisma = await getPrismaForTests()
  return prisma.user.create({
    data: {
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      ...data,
    },
  })
}

/**
 * Factory function to create a test user with associated posts.
 *
 * @param postCount - Number of posts to create with user (default: 3)
 * @returns Created user with posts included
 * @see modules/users/src/__tests__/user.integration.test.ts
 */
export async function createTestUserWithPosts(postCount = 3) {
  const prisma = await getPrismaForTests()
  return prisma.user.create({
    data: {
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      posts: {
        create: Array.from({ length: postCount }, (_, i) => ({
          title: `Post ${i + 1}`,
        })),
      },
    },
    include: { posts: true },
  })
}
```

---

## Database Reset

```typescript
// test/helpers.ts
import type { PrismaClient } from '../generated/prisma/client'
import { getPrismaForTests } from './setup'

/**
 * Reset all database tables to clean state.
 * Skips Prisma migrations table.
 *
 * @throws Error if database query fails
 * @see test/setup.ts
 */
export async function resetDatabase(): Promise<void> {
  const prisma = await getPrismaForTests()

  const tables = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
  `

  for (const { tablename } of tables) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "${tablename}" CASCADE`
      )
    }
  }
}
```

---

## Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

/**
 * Vitest configuration for unit and integration tests.
 * Single-threaded to prevent concurrent database access.
 *
 * @see test/setup.ts for database setup
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    include: ['**/*.test.ts'],
    poolOptions: {
      threads: {
        singleThread: true, // Avoid parallel DB access
      },
    },
  },
})
```

---

## Best Practices

1. **Separate test DB** - Never test on production
2. **Clean between tests** - Reset data in beforeEach
3. **Use factories** - Consistent test data creation
4. **Mock for units** - Real DB for integration
5. **Single thread** - Avoid DB race conditions
