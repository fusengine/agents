---
name: better-auth
description: Complete Better Auth - 40+ OAuth providers, 20+ plugins, all adapters, all frameworks. Use when implementing authentication, login, OAuth, 2FA, magic links, SSO, Stripe, SCIM, or session management.
user-invocable: true
references: [references/installation.md, references/basic-usage.md, references/comparison.md, references/server-config.md, references/client.md, references/session.md, references/middleware.md, references/server-actions.md, references/hooks.md, references/email.md, references/rate-limiting.md, references/cli.md, references/security.md, references/api.md, references/migrations.md, references/typescript.md, references/user-accounts.md, references/errors.md, references/telemetry.md, references/faq.md, references/concepts/sessions.md, references/concepts/database.md, references/concepts/plugins.md, references/concepts/users.md, references/concepts/oauth.md, references/concepts/security.md, references/concepts/cookies.md, references/adapters/prisma.md, references/adapters/drizzle.md, references/adapters/mongodb.md, references/adapters/sql-databases.md, references/adapters/community-adapters.md, references/providers/overview.md, references/providers/google.md, references/providers/github.md, references/providers/discord.md, references/providers/apple.md, references/providers/microsoft.md, references/providers/social-providers.md, references/providers/generic-oauth.md, references/providers/oauth-providers-all.md, references/plugins/overview.md, references/plugins/2fa.md, references/plugins/admin.md, references/plugins/organization.md, references/plugins/passkey.md, references/plugins/magic-link.md, references/plugins/email-otp.md, references/plugins/phone.md, references/plugins/anonymous.md, references/plugins/username.md, references/plugins/sso.md, references/plugins/jwt.md, references/plugins/bearer.md, references/plugins/multi-session.md, references/plugins/oidc-provider.md, references/plugins/api-key.md, references/plugins/captcha.md, references/plugins/stripe.md, references/plugins/polar.md, references/plugins/scim.md, references/plugins/siwe.md, references/plugins/device-auth.md, references/integrations/nextjs.md, references/integrations/other-frameworks.md, references/integrations/frameworks-all.md, references/examples/nextjs-app-router.md, references/examples/oauth-complete.md, references/examples/2fa-complete.md, references/examples/organization-complete.md, references/examples/passkey-complete.md, references/guides/performance.md, references/guides/plugin-development.md, references/guides/saml-okta.md, references/guides/database-adapter.md, references/guides/auth0-migration.md, references/guides/clerk-migration.md, references/guides/authjs-migration.md, references/guides/supabase-migration.md, references/guides/workos-migration.md, references/guides/browser-extension.md]
related-skills: [nextjs-16, prisma-7]
---

# Better Auth - Complete Documentation

## Quick Start
```bash
bun add better-auth
```

## Coverage
- **40+ OAuth Providers**: Google, GitHub, Discord, Apple, Microsoft, Slack, Spotify, etc.
- **20+ Plugins**: 2FA, Magic Link, SSO, Organization, Stripe, SCIM, Passkey, SIWE, etc.
- **All Adapters**: Prisma, Drizzle, MongoDB, PostgreSQL, MySQL, SQLite
- **18 Frameworks**: Next.js, SvelteKit, Nuxt, Remix, Astro, Expo, NestJS, etc.

## SOLID Structure (Next.js 16)
```
proxy.ts
app/api/auth/[...all]/route.ts
modules/auth/src/
├── services/auth.ts        # betterAuth config
└── hooks/auth-client.ts    # createAuthClient
```

## When to Use References
- **Setup**: installation, server-config, client, session
- **OAuth**: providers/*.md (40+ providers documented)
- **Plugins**: plugins/*.md (2FA, SSO, Stripe, SCIM, Passkey...)
- **Database**: adapters/*.md (Prisma, Drizzle, MongoDB, SQL)
- **Enterprise**: sso, scim, organization, saml-okta
- **Payments**: stripe
- **Web3**: siwe (Sign-In with Ethereum)
- **Guides**: performance, plugin-development, migrations
