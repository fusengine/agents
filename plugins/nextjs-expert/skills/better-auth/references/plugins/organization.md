# Organization Plugin

## Server Configuration

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { organization } from "better-auth/plugins/organization"

export const auth = betterAuth({
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      membershipLimit: 100
    })
  ]
})
```

## Client Configuration

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [organizationClient()]
})
```

## Create Organization

```typescript
const { data } = await authClient.organization.create({
  name: "My Company",
  slug: "my-company"
})
```

## List Organizations

```typescript
const { data } = await authClient.organization.list()
// Returns array of organizations user belongs to
```

## Set Active Organization

```typescript
await authClient.organization.setActive({
  organizationId: "org_xxx"
})
```

## Invite Member

```typescript
await authClient.organization.inviteMember({
  email: "user@example.com",
  role: "member", // or "admin", "owner"
  organizationId: "org_xxx"
})
```

## Accept Invitation

```typescript
await authClient.organization.acceptInvitation({
  invitationId: "inv_xxx"
})
```

## Remove Member

```typescript
await authClient.organization.removeMember({
  memberId: "member_xxx",
  organizationId: "org_xxx"
})
```

## Get Organization (Server)

```typescript
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

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
| `owner` | Full control, delete org |
| `admin` | Manage members, settings |
| `member` | Basic access |
