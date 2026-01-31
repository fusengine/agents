---
name: installation
description: Setup Better Auth in your project with database, environment variables, and dependencies
when-to-use: installing better-auth, initial setup, new project, adding authentication library
keywords: setup, npm install, environment variables, database url, prisma, initial config
priority: high
requires: none
related: basic-usage.md, server-config.md, cli.md
---

# Better Auth Installation

## When to Use

- New authentication setup
- Migrating from another auth library
- Adding auth to existing Next.js project

## Why Better Auth

| Feature | Better Auth |
|---------|-------------|
| TypeScript | First-class |
| Bundle size | ~50KB |
| Plugins | 20+ |
| OAuth providers | 40+ |
| Framework lock-in | None |

## Installation

```bash
bun add better-auth
```

## SOLID Project Structure (Next.js 16)

```
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
