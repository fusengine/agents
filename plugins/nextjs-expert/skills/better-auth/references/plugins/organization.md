---
name: organization
description: Multi-tenant organizations and teams with role-based access
when-to-use: saas applications, multi-tenant features, team management, workspace separation
keywords: organization, teams, multi-tenant, roles, permissions, workspace, members
priority: medium
requires: server-config.md
related: plugins/overview.md, concepts/plugins.md
---

# Organization Plugin

## When to Use

- B2B SaaS with team workspaces
- Multi-tenant applications
- Role-based access within teams
- Invitation-based onboarding

## Why Organizations

| Without | With |
|---------|------|
| Single user scope | Team collaboration |
| Manual role logic | Built-in RBAC |
| Custom invitations | Managed invites |
| No data isolation | Tenant separation |

## Server Configuration

```typescript
import { betterAuth } from "better-auth"
import { organization } from "better-auth/plugins/organization"

export const auth = betterAuth({
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 5
    })
  ]
})
```

## Client Configuration

```typescript
import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [organizationClient()]
})
```

## Create & List

```typescript
await authClient.organization.create({ name: "My Company", slug: "my-company" })
const { data } = await authClient.organization.list()
```

## Set Active & Members

```typescript
await authClient.organization.setActive({ organizationId: "org_xxx" })
await authClient.organization.inviteMember({
  email: "user@example.com",
  role: "member", // or "admin", "owner"
  organizationId: "org_xxx"
})
await authClient.organization.acceptInvitation({ invitationId: "inv_xxx" })
await authClient.organization.removeMember({ memberId: "m_xxx", organizationId: "org_xxx" })
```

## Get Organization (Server)

```typescript
const session = await auth.api.getSession({ headers: await headers() })
const orgId = session?.session.activeOrganizationId
const org = await auth.api.getFullOrganization({
  headers: await headers(),
  query: { organizationId: orgId }
})
```

## Roles

| Role | Permissions |
|------|-------------|
| `owner` | Full control |
| `admin` | Manage members |
| `member` | Basic access |
