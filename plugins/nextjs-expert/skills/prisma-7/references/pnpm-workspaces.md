---
name: pnpm-workspaces
description: pnpm workspace configuration with Prisma 7
when-to-use: Managing pnpm workspaces with shared Prisma database package
keywords: pnpm, workspaces, monorepo, package management, workspace protocols
priority: high
requires: /plugins/nextjs-expert/skills/prisma-7/references/client.md
related: /plugins/nextjs-expert/skills/prisma-7/references/turborepo.md
---

# pnpm Workspaces with Prisma

Configure pnpm workspaces for Prisma 7 multi-package applications.

## pnpm-workspace.yaml

```yaml
packages:
  - 'packages/**'
  - 'apps/**'

# Enable stricter dependency management
catalogs:
  default:
    prisma: ^7.10.0
    '@prisma/client': ^7.10.0
    '@prisma/adapter-pg': ^7.10.0
    typescript: ^6.0.3
```

---

## Project Structure

```
monorepo/
├── pnpm-workspace.yaml
├── package.json
├── .npmrc
├── packages/
│   ├── database/
│   │   ├── package.json
│   │   ├── prisma/schema.prisma
│   │   └── src/index.ts
│   ├── ui/
│   │   ├── package.json
│   │   └── src/components/
│   └── utils/
│       ├── package.json
│       └── src/helpers.ts
└── apps/
    ├── web/
    │   ├── package.json
    │   └── app/
    └── api/
        ├── package.json
        └── routes/
```

---

## Root package.json

```json
{
  "name": "root",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r --filter='./packages/**' build && pnpm -r --filter='./apps/**' build",
    "lint": "pnpm -r lint",
    "test": "pnpm -r test",
    "db:generate": "pnpm -F @repo/database generate",
    "db:migrate": "pnpm -F @repo/database migrate"
  },
  "devDependencies": {
    "@changesets/cli": "^2.26.0",
    "typescript": "^6.0.3"
  },
  "pnpm": {
    "overrides": {
      "typescript": "^6.0.3"
    }
  }
}
```

---

## Database Package

```json
{
  "name": "@repo/database",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "scripts": {
    "generate": "prisma generate",
    "migrate": "prisma migrate deploy",
    "dev:migrate": "prisma migrate dev",
    "studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "catalog:",
    "@prisma/adapter-pg": "catalog:",
    "pg": "^8.23.0",
    "dotenv": "^18.0.4"
  },
  "devDependencies": {
    "prisma": "catalog:"
  }
}
```

Generator in `packages/database/prisma/schema.prisma` (v7: `output` required):

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

---

## Prisma Client Export

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
    log: process.env.DATABASE_LOG ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export * from './generated/prisma/client'  // model types, enums, Prisma namespace
```

---

## App Package Configuration

```json
{
  "name": "@repo/web",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@repo/database": "workspace:*",
    "next": "^16.0.0",
    "react": "^19.0.0"
  }
}
```

---

## Using Workspace Protocol

```typescript
// apps/web/app/dashboard/page.tsx
import { prisma } from '@repo/database'

export default async function DashboardPage() {
  const stats = await prisma.user.groupBy({
    by: ['status'],
    _count: true,
  })

  return (
    <div className="container">
      <h1>Dashboard</h1>
      {stats.map((stat) => (
        <div key={stat.status}>
          {stat.status}: {stat._count}
        </div>
      ))}
    </div>
  )
}
```

---

## .npmrc Configuration

```
shamefully-hoist=true
strict-peer-dependencies=false
auto-install-peers=true
node-linker=hoisted
public-hoist-pattern[]=*prisma*
```

---

## Development Workflow

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Start all development servers
pnpm dev

# Build all packages
pnpm build

# Filter commands to specific workspace
pnpm -F @repo/database dev:migrate
pnpm -F @repo/web build
```

---

## Best Practices

1. **Use workspace:*** - Reference local packages with workspace protocol
2. **Hoist Prisma** - Set public-hoist-pattern for Prisma in .npmrc
3. **Filter by pattern** - Use -F flag to run scripts in specific workspaces
4. **Parallel execution** - Use pnpm -r --parallel for development
5. **Dependency consistency** - Use pnpm catalogs for version consistency
