# Better Auth FAQ

## General

**Q: Is Better Auth free?**
A: Yes, MIT licensed, free for commercial use.

**Q: What databases are supported?**
A: PostgreSQL, MySQL, SQLite, MongoDB, MS SQL via Prisma, Drizzle, or direct adapters.

**Q: Can I use it without a framework?**
A: Yes, works with plain Node.js, Express, Fastify, etc.

## Authentication

**Q: How do I add custom user fields?**
```typescript
user: { additionalFields: { role: { type: "string", defaultValue: "user" } } }
```

**Q: How do I protect routes?**
A: Use `proxy.ts` (Next.js 16) or middleware to check session.

**Q: Can users have multiple OAuth accounts?**
A: Yes, use `authClient.linkSocial({ provider: "github" })`.

## Sessions

**Q: How long do sessions last?**
A: Default 7 days, configurable via `session.expiresIn`.

**Q: How do I invalidate all sessions?**
```typescript
await auth.api.revokeAllSessions({ userId: "..." })
```

## Security

**Q: Is it production-ready?**
A: Yes, used by thousands of applications.

**Q: How are passwords stored?**
A: Bcrypt hashed by default, Argon2 configurable.

**Q: Is CSRF protection included?**
A: Yes, automatic for mutations.

## Plugins

**Q: Can I create custom plugins?**
A: Yes, see `guides/plugin-development.md`.

**Q: Do plugins affect performance?**
A: Minimal impact, lazy-load if needed.

## Migration

**Q: Can I migrate from Auth.js?**
A: Yes, see `guides/authjs-migration.md`.

**Q: Can I migrate from Clerk?**
A: Yes, see `guides/clerk-migration.md`.
