---
name: nextjs-stack
description: Next.js 16+ avec App Router, Prisma 7, Better Auth. Documentation locale complète.
user-invocable: false
---

# Next.js Stack Skill

Documentation complète pour le développement Next.js moderne.

## Documentation Locale

```
nextjs-16/           # Next.js 16 App Router
prisma-7/            # Prisma 7 ORM
better-auth/         # Better Auth (PAS NextAuth.js)
```

## Quick Reference

### Next.js 16

| Feature | Path |
|---------|------|
| App Router | `nextjs-16/01-app/03-building/01-routing/` |
| Server Components | `nextjs-16/01-app/03-building/02-rendering/` |
| Server Actions | `nextjs-16/01-app/03-building/03-data-fetching/` |
| Caching | `nextjs-16/01-app/02-guides/caching.md` |
| Middleware | `nextjs-16/01-app/03-building/01-routing/13-middleware.md` |

### Prisma 7

| Feature | Path |
|---------|------|
| Quickstart | `prisma-7/200-orm/025-getting-started/10-quickstart.md` |
| Schema | `prisma-7/200-orm/050-prisma-schema/` |
| Client | `prisma-7/200-orm/100-prisma-client/` |
| Migrations | `prisma-7/200-orm/200-prisma-migrate/` |

### Better Auth

| Feature | Path |
|---------|------|
| Installation | `better-auth/installation.md` |
| Next.js Example | `better-auth/examples/next-js.md` |
| Prisma Adapter | `better-auth/adapters/prisma.md` |
| OAuth | `better-auth/authentication/` |

## Forbidden

- ❌ Utiliser NextAuth.js (utiliser Better Auth)
- ❌ Pages Router pour nouveaux projets
- ❌ Client Components par défaut
