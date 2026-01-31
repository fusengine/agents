---
name: json-fields
description: Prisma 7 JSON field operations and filtering
when-to-use: Working with JSON columns, filtering JSON data
keywords: Json, jsonb, path, filter, array_contains, object
priority: medium
requires: schema.md
related: queries.md
---

# JSON Fields

Working with JSON columns in Prisma 7.

## Schema Definition

```prisma
model User {
  id       String @id @default(cuid())
  settings Json   // JSON column
  metadata Json?  // Optional JSON
  tags     Json   @default("[]") // Default empty array
}
```

---

## Create with JSON

```typescript
// modules/cores/db/interfaces/user-settings.ts
/**
 * User settings JSON structure
 */
export interface UserSettings {
  theme: 'light' | 'dark'
  notifications: boolean
  language: string
}

/**
 * Extended user settings with preferences
 */
export interface UserSettingsExtended extends UserSettings {
  preferences?: {
    fontSize: number
    sidebar: boolean
  }
}
```

```typescript
// modules/cores/db/repositories/user-repository.ts
import type { UserSettings, UserSettingsExtended } from '../interfaces/user-settings'

/**
 * Create user with settings object
 * @param prisma - Prisma Client instance
 * @param settings - User settings configuration
 * @returns Created user
 */
export async function createUserWithSettings(
  prisma: PrismaClient,
  settings: UserSettings
) {
  return await prisma.user.create({
    data: {
      settings,
    },
  })
}

/**
 * Create user with tags array
 * @param prisma - Prisma Client instance
 * @param tags - User tags
 * @returns Created user
 */
export async function createUserWithTags(
  prisma: PrismaClient,
  tags: string[]
) {
  return await prisma.user.create({
    data: {
      tags,
    },
  })
}

/**
 * Create user with nested settings
 * @param prisma - Prisma Client instance
 * @param settings - Extended settings configuration
 * @returns Created user
 */
export async function createUserWithExtendedSettings(
  prisma: PrismaClient,
  settings: UserSettingsExtended
) {
  return await prisma.user.create({
    data: {
      settings,
    },
  })
}
```

---

## Update JSON

```typescript
// modules/cores/db/repositories/user-repository.ts
import type { UserSettings } from '../interfaces/user-settings'

/**
 * Replace entire user settings
 * @param prisma - Prisma Client instance
 * @param userId - User ID
 * @param settings - New settings
 * @returns Updated user
 */
export async function replaceUserSettings(
  prisma: PrismaClient,
  userId: string,
  settings: UserSettings
) {
  return await prisma.user.update({
    where: { id: userId },
    data: { settings },
  })
}

/**
 * Merge partial settings with existing settings
 * @param prisma - Prisma Client instance
 * @param userId - User ID
 * @param partialSettings - Partial settings to merge
 * @returns Updated user
 */
export async function mergeUserSettings(
  prisma: PrismaClient,
  userId: string,
  partialSettings: Partial<UserSettings>
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return await prisma.user.update({
    where: { id: userId },
    data: {
      settings: {
        ...(user.settings as UserSettings),
        ...partialSettings,
      },
    },
  })
}
```

---

## Filter by JSON Path (PostgreSQL)

```typescript
// modules/cores/db/repositories/user-repository.ts
/**
 * Find users by theme preference
 * @param prisma - Prisma Client instance
 * @param theme - Theme value to filter
 * @returns Users with matching theme
 */
export async function findUsersByTheme(
  prisma: PrismaClient,
  theme: 'light' | 'dark'
) {
  return await prisma.user.findMany({
    where: {
      settings: {
        path: ['theme'],
        equals: theme,
      },
    },
  })
}

/**
 * Find users with multiple setting filters
 * @param prisma - Prisma Client instance
 * @param theme - Theme preference
 * @param notificationsEnabled - Notifications setting
 * @returns Users matching all criteria
 */
export async function findUsersByMultipleSettings(
  prisma: PrismaClient,
  theme: 'light' | 'dark',
  notificationsEnabled: boolean
) {
  return await prisma.user.findMany({
    where: {
      AND: [
        {
          settings: {
            path: ['theme'],
            equals: theme,
          },
        },
        {
          settings: {
            path: ['notifications'],
            equals: notificationsEnabled,
          },
        },
      ],
    },
  })
}
```

---

## Array Operations

```typescript
// modules/cores/db/repositories/user-repository.ts
/**
 * Find users with specific tag
 * @param prisma - Prisma Client instance
 * @param tags - Tags to search for
 * @returns Users with matching tags
 */
export async function findUsersByTags(
  prisma: PrismaClient,
  tags: string[]
) {
  return await prisma.user.findMany({
    where: {
      tags: {
        array_contains: tags,
      },
    },
  })
}

/**
 * Find users whose tags start with value
 * @param prisma - Prisma Client instance
 * @param tagStart - Tag prefix to match
 * @returns Users matching tag start condition
 */
export async function findUsersByTagStart(
  prisma: PrismaClient,
  tagStart: string
) {
  return await prisma.user.findMany({
    where: {
      tags: {
        array_starts_with: tagStart,
      },
    },
  })
}

/**
 * Find users whose tags end with value
 * @param prisma - Prisma Client instance
 * @param tagEnd - Tag suffix to match
 * @returns Users matching tag end condition
 */
export async function findUsersByTagEnd(
  prisma: PrismaClient,
  tagEnd: string
) {
  return await prisma.user.findMany({
    where: {
      tags: {
        array_ends_with: tagEnd,
      },
    },
  })
}
```

---

## String Operations on JSON

```typescript
// modules/cores/db/repositories/user-repository.ts
/**
 * Find users by email domain in settings
 * @param prisma - Prisma Client instance
 * @param domain - Email domain to match
 * @returns Users with matching email domain
 */
export async function findUsersByEmailDomain(
  prisma: PrismaClient,
  domain: string
) {
  return await prisma.user.findMany({
    where: {
      settings: {
        path: ['email'],
        string_contains: domain,
      },
    },
  })
}

/**
 * Find users by name prefix in settings
 * @param prisma - Prisma Client instance
 * @param namePrefix - Name prefix to match
 * @returns Users with matching name prefix
 */
export async function findUsersByNamePrefix(
  prisma: PrismaClient,
  namePrefix: string
) {
  return await prisma.user.findMany({
    where: {
      settings: {
        path: ['name'],
        string_starts_with: namePrefix,
      },
    },
  })
}
```

---

## TypeScript Typing

```typescript
// modules/cores/db/interfaces/user-settings.ts (already defined above)

// modules/cores/db/repositories/user-repository.ts
import { z } from 'zod'
import type { UserSettings } from '../interfaces/user-settings'

/**
 * Zod schema for user settings validation
 */
const SettingsSchema = z.object({
  theme: z.enum(['light', 'dark']),
  notifications: z.boolean(),
  language: z.string(),
}) as z.ZodType<UserSettings>

/**
 * Get and type-safely validate user settings
 * @param prisma - Prisma Client instance
 * @param userId - User ID
 * @returns Validated user settings
 * @throws Error if settings invalid
 */
export async function getUserSettingsTypeSafe(
  prisma: PrismaClient,
  userId: string
): Promise<UserSettings> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user?.settings) {
    throw new Error('User or settings not found')
  }

  return SettingsSchema.parse(user.settings)
}

/**
 * Safely get settings with type assertion fallback
 * @param prisma - Prisma Client instance
 * @param userId - User ID
 * @returns Typed user settings
 */
export async function getUserSettings(
  prisma: PrismaClient,
  userId: string
): Promise<UserSettings | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  return user?.settings as UserSettings | null
}
```

---

## Best Practices

1. **Use for flexibility** - When schema varies
2. **Don't over-use** - Prefer typed columns
3. **Validate with Zod** - Type safety at runtime
4. **Index with GIN** - For frequent filtering
5. **Avoid deep nesting** - Keep structure flat
