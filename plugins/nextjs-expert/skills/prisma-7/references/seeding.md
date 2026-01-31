---
name: seeding
description: Prisma 7 database seeding patterns
when-to-use: Populating database with initial or test data
keywords: seed, db seed, initial data, test data, faker
priority: medium
requires: migrations.md
related: testing.md
---

# Database Seeding

Seed patterns for Prisma 7. Type definitions in `/references/interfaces/migrations.types.md`.

## Basic Seed Script

```typescript
/**
 * Basic seed script with upsert pattern.
 * Idempotent - safe to run multiple times.
 * Path: prisma/seed.ts
 * See SeedFn in /interfaces/migrations.types.md
 */
import { prisma } from '../src/modules/cores/db/prisma'

/**
 * Main seed execution.
 * Creates or updates admin user.
 * @returns {Promise<void>}
 */
async function main() {
  console.log('Seeding database...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      role: 'ADMIN',
    },
  })

  console.log('Created admin:', admin.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

---

## package.json Configuration

```json
{
  "prisma": {
    "seed": "bun run prisma/seed.ts"
  }
}
```

```bash
# Run seed
bunx prisma db seed

# Auto-runs after migrate reset
bunx prisma migrate reset
```

---

## Seed with Faker

```typescript
/**
 * Development seed with realistic fake data.
 * Uses @faker-js/faker for random generation.
 * Path: prisma/seed.ts
 * See EnvironmentSeedStrategy in /interfaces/migrations.types.md
 */
import { prisma } from '../src/modules/cores/db/prisma'
import { faker } from '@faker-js/faker'

/**
 * Generate realistic development data.
 * Creates 10 users with 3 posts each.
 * @returns {Promise<void>}
 */
async function main() {
  // Clean existing data
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  // Create users with posts
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        posts: {
          create: Array.from({ length: 3 }, () => ({
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(3),
            published: faker.datatype.boolean(),
          })),
        },
      },
    })
  }

  console.log('Seeded 10 users with posts')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

---

## Seed with Transactions

```typescript
/**
 * Transactional seed for data consistency.
 * Atomic cleanup and creation.
 * @param {unknown[]} userData - User records to seed
 * @returns {Promise<void>}
 */
async function main() {
  await prisma.$transaction(async (tx) => {
    // Delete in order (respect foreign keys)
    await tx.post.deleteMany()
    await tx.user.deleteMany()

    // Create in transaction
    const users = await Promise.all(
      userData.map((data) =>
        tx.user.create({ data })
      )
    )

    console.log(`Created ${users.length} users`)
  })
}
```

---

## Environment-Specific Seeds

```typescript
/**
 * Environment-aware seeding strategy.
 * Path: prisma/seed.ts
 * See EnvironmentSeedStrategy in /interfaces/migrations.types.md
 * @returns {Promise<void>}
 */
async function main() {
  const env = process.env.NODE_ENV || 'development'

  // Always create admin
  await seedAdmin()

  if (env === 'development') {
    await seedDevData()
  }

  if (env === 'test') {
    await seedTestData()
  }
}

/**
 * Create essential admin user.
 * Runs in all environments.
 * @returns {Promise<void>}
 */
async function seedAdmin() {
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      role: 'ADMIN',
    },
  })
}

/**
 * Development seed data.
 * Realistic data for feature development.
 * @returns {Promise<void>}
 */
async function seedDevData() {
  // Fake data for development
}

/**
 * Test seed data.
 * Minimal data for test execution.
 * @returns {Promise<void>}
 */
async function seedTestData() {
  // Minimal data for tests
}
```

---

## Seed from JSON

```typescript
/**
 * Static seed data from JSON file.
 * Import reference data (countries, categories, etc.).
 * Path: prisma/seed.ts
 * Data file: prisma/data/users.json (format: [{ "email": "...", "name": "..." }])
 * @returns {Promise<void>}
 */
import users from './data/users.json'

/**
 * Load static reference data.
 * Skip duplicates for idempotent runs.
 * @returns {Promise<void>}
 */
async function main() {
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  })
}
```

---

## Upsert Pattern

```typescript
/**
 * Idempotent seeding with upsert.
 * Safe to run multiple times without errors.
 * See UpsertConfig in /interfaces/model-attributes.types.md
 * @returns {Promise<void>}
 */
async function main() {
  const users = [
    { email: 'admin@example.com', name: 'Admin', role: 'ADMIN' },
    { email: 'user@example.com', name: 'User', role: 'USER' },
  ]

  for (const user of users) {
    /**
     * Upsert: update if exists by email, create if not.
     * @param {object} where - Unique identifier
     * @param {object} update - Update fields if exists
     * @param {object} create - Create data if not exists
     */
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role },
      create: user,
    })
  }
}
```

---

## Best Practices

1. **Use upsert** - Idempotent seeding
2. **Transaction for cleanup** - Atomic reset + seed
3. **Faker for dev** - Realistic test data
4. **JSON for static** - Reference data
5. **Environment check** - Different data per env
