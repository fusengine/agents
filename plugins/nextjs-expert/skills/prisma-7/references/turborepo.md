---
name: turborepo
description: Turborepo monorepo setup with Prisma 7 and Next.js
when-to-use: Building monorepo applications with shared Prisma client across workspaces
keywords: Turborepo, monorepo, workspaces, shared packages, build optimization
priority: high
requires: /plugins/nextjs-expert/skills/prisma-7/references/client.md
related: /plugins/nextjs-expert/skills/prisma-7/references/pnpm-workspaces.md
---

# Turborepo with Prisma 7

Configure Turborepo monorepo with shared Prisma packages.

## Project Structure

```
my-monorepo/
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
└── packages/
    ├── database/              # Prisma package
    │   ├── package.json
    │   ├── prisma/
    │   │   └── schema.prisma
    │   ├── src/
    │   │   ├── index.ts
    │   │   ├── generated/
    │   │   └── seed.ts
    │   └── tsconfig.json
    ├── api/                   # Next.js API
    │   ├── app/
    │   ├── package.json
    │   └── tsconfig.json
    └── web/                   # Next.js UI
        ├── app/
        ├── package.json
        └── tsconfig.json
```

---

## turbo.json Configuration

```json
{
  "extends": ["//"],
  "globalDependencies": ["**/.env.local"],
  "pipeline": {
    "db#generate": {
      "outputs": ["src/generated/**"],
      "cache": false
    },
    "db#migrate": {
      "outputs": [],
      "inputs": ["prisma/**"],
      "cache": false
    },
    "build": {
      "dependsOn": ["^build", "db#generate"],
      "outputs": [".next/**"],
      "cache": true
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

## Database Package Setup

```json
{
  "name": "@repo/database",
  "version": "0.0.0",
  "private": true,
  "exports": {
    ".": "./src/index.ts",
    "./seed": "./src/seed.ts"
  },
  "scripts": {
    "generate": "prisma generate",
    "migrate": "prisma migrate deploy",
    "studio": "prisma studio"
  },
  "devDependencies": {
    "prisma": "^5.7.0",
    "typescript": "^5.3.0"
  },
  "dependencies": {
    "@prisma/client": "^5.7.0"
  }
}
```

---

## Shared Prisma Client

```typescript
// packages/database/src/index.ts
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export { Prisma } from '@prisma/client'
export type { User, Post } from '@prisma/client'
```

---

## Using in Workspace Apps

```typescript
// packages/web/app/dashboard/page.tsx
import { prisma } from '@repo/database'

export default async function DashboardPage() {
  const users = await prisma.user.findMany({
    take: 10,
  })

  return (
    <div>
      <h1>Users ({users.length})</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## Database Seeding

```typescript
// packages/database/src/seed.ts
import { prisma } from './index'

async function main() {
  console.log('Seeding database...')

  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  })

  console.log('Seed complete:', user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

---

## Root package.json

```json
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "db:generate": "turbo db#generate",
    "db:migrate": "turbo db#migrate",
    "db:seed": "node packages/database/src/seed.ts"
  },
  "devDependencies": {
    "turbo": "^1.10.0"
  }
}
```

---

## Best Practices

1. **Centralize database** - Keep Prisma in single @repo/database package
2. **Export types** - Re-export Prisma types from database package
3. **Use turbo.json** - Define dependencies between generate/migrate tasks
4. **Shared .env** - Use root-level environment variables
5. **Cache busting** - Add schema.prisma to globalDependencies
