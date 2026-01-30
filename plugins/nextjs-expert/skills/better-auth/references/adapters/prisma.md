# Prisma Adapter

## Installation

```bash
npm install @prisma/client prisma
```

## Configuration

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql" // or "mysql", "sqlite"
  })
})
```

## Generate Schema

```bash
npx @better-auth/cli generate
npx prisma migrate dev --name init
```

## Required Tables

Better Auth creates these tables automatically:

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
}

model Account {
  id           String  @id @default(cuid())
  userId       String
  providerId   String
  accountId    String
  accessToken  String?
  refreshToken String?
  expiresAt    DateTime?
  user         User    @relation(fields: [userId], references: [id])

  @@unique([providerId, accountId])
}
```

## Prisma Client Singleton

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
```

## With Plugins

Some plugins require additional tables. Run generate after adding plugins:

```bash
npx @better-auth/cli generate
npx prisma migrate dev
```
