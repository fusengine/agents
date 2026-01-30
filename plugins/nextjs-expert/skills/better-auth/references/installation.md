# Better Auth Installation

## Installation

```bash
bun add better-auth
```

## SOLID Project Structure (Next.js 16)

```
# With src/ directory
src/
├── proxy.ts                           # Same level as app/
├── app/
│   └── api/auth/[...all]/route.ts
└── modules/
    ├── cores/database/prisma.ts
    └── auth/src/
        ├── interfaces/session.interface.ts
        ├── services/auth.ts
        └── hooks/auth-client.ts

# Without src/ directory
proxy.ts                               # Project root
app/
└── api/auth/[...all]/route.ts
modules/
└── ...
```

## Environment Variables

```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/db
BETTER_AUTH_SECRET=openssl-rand-base64-32
BETTER_AUTH_URL=http://localhost:3000

# OAuth (optional)
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
```

## Generate DB Schema

```bash
bunx @better-auth/cli generate
bunx prisma migrate dev
```

## Installation Order

1. `bun add better-auth`
2. Create `modules/auth/src/services/auth.ts` (server)
3. Create `modules/auth/src/hooks/auth-client.ts` (client)
4. Create `app/api/auth/[...all]/route.ts`
5. Generate DB schema
6. Configure `proxy.ts` (same level as app/)

## Recommended Dependencies

```bash
bun add @prisma/client prisma
```
