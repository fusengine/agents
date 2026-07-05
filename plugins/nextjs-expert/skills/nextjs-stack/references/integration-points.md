# Integration Points

### Authentication + Database

Better Auth integrates with Prisma adapter for user storage. Schema in `prisma/schema.prisma` includes User, Session, Account, Verification tables.

### Forms + UI + Validation

TanStack Form with Zod validation using shadcn/ui Field components. Server Actions for form submission.

### State + Server Components

Zustand stores for client state only. Server Components fetch data directly. No global state for server data.

### i18n + Routing

next-intl with `[locale]` segment. proxy.ts handles locale detection and redirects.
