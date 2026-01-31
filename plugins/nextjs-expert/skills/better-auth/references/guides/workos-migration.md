---
name: workos-migration
description: Migrate from WorkOS to Better Auth
when-to-use: workos migration, switching from workos, migration guide
keywords: WorkOS, migration, switching, from WorkOS, migration guide
priority: low
requires: migrations.md
related: migrations.md
---

# Better Auth WorkOS Migration Guide

## When to Use

- Migrating from WorkOS SSO/SCIM
- Eliminating per-connection pricing
- Self-hosting enterprise auth
- Full control over SSO

## Why Migrate

| WorkOS | Better Auth |
|--------|-------------|
| Per-connection $ | Free |
| Hosted service | Self-hosted |
| WorkOS dashboard | Your database |
| Limited customization | Full control |

## Key Differences

| WorkOS | Better Auth |
|--------|-------------|
| `@workos-inc/node` | `better-auth` |
| Hosted SSO | Self-hosted SSO |
| Per-connection pricing | Free |
| WorkOS dashboard | Your database |

## 1. Install Better Auth

```bash
bun remove @workos-inc/node
bun add better-auth
```

## 2. Replace SSO Configuration

```typescript
// Before (WorkOS)
const workos = new WorkOS(process.env.WORKOS_API_KEY)
const { url } = workos.sso.getAuthorizationURL({
  organization: "org_123",
  redirectURI: "https://app.com/callback"
})

// After (Better Auth)
import { sso } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [
    sso({
      providers: [{
        id: "okta",
        issuer: "https://company.okta.com",
        clientId: process.env.OKTA_CLIENT_ID!,
        clientSecret: process.env.OKTA_CLIENT_SECRET!
      }]
    })
  ]
})
```

## 3. Replace Directory Sync (SCIM)

```typescript
// Before: WorkOS Directory Sync
// After: Better Auth SCIM
import { scim } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [
    scim({
      organizations: true,
      endpoints: { users: "/scim/v2/Users", groups: "/scim/v2/Groups" }
    })
  ]
})
```

## 4. Migrate Organizations

```sql
INSERT INTO organizations (id, name, slug)
SELECT id, name, slug FROM workos_organizations;

INSERT INTO members (user_id, organization_id, role)
SELECT user_id, organization_id, 'member' FROM workos_memberships;
```

## 5. Update SSO Callbacks

Change IdP callback URLs:
- From: `https://api.workos.com/sso/callback`
- To: `https://your-domain.com/api/auth/sso/callback`

## 6. Remove WorkOS Environment Variables

```env
# Remove
WORKOS_API_KEY=...
WORKOS_CLIENT_ID=...

# Add Better Auth
BETTER_AUTH_SECRET=...
```
