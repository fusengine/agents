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
    "prisma": "^7.10.0",
    "typescript": "^6.0.3"
  },
  "dependencies": {
    "@prisma/client": "^7.10.0",
    "@prisma/adapter-pg": "^7.10.0",
    "pg": "^8.23.0",
    "dotenv": "^18.0.4"
  }
}
```

Generator in `packages/database/prisma/schema.prisma` (v7: `output` required, matches the `src/generated/**` turbo output):

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

---

## Shared Prisma Client

```typescript
// packages/database/src/index.ts
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client'  // v7: generated path

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export { Prisma } from './generated/prisma/client'
export type { User, Post } from './generated/prisma/client'
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
