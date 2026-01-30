# Better Auth Installation

## Installation

```bash
bun add better-auth
```

## Project Structure

```
lib/
├── auth.ts              # Server config
├── auth-client.ts       # Client config
└── prisma.ts            # Prisma instance
app/api/auth/[...all]/
└── route.ts             # API handler
middleware.ts            # Route protection
```

## Environment Variables

```bash
# .env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
BETTER_AUTH_SECRET=openssl-rand-base64-32
BETTER_AUTH_URL=http://localhost:3000

# OAuth (optional)
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

## Generate DB Schema

```bash
bunx @better-auth/cli generate
bunx prisma migrate dev
```

## Route API Handler

```typescript
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
```

## Verify Installation

```typescript
import { auth } from "@/lib/auth"
console.log(auth.api) // Should display available methods
```

## Installation Order

1. `bun add better-auth`
2. Create `lib/auth.ts` (server)
3. Create `lib/auth-client.ts` (client)
4. Create `app/api/auth/[...all]/route.ts`
5. Generate DB schema
6. Configure middleware (optional)

## Recommended Dependencies

```bash
bun add @prisma/client prisma
# or for Drizzle
bun add drizzle-orm
```
