# Better Auth Organization Complete Example

## Server Setup

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"
import { organization } from "better-auth/plugins"

export const auth = betterAuth({
  database: prismaAdapter(prisma),
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      membershipLimit: 100,
      roles: {
        owner: { permissions: ["*"] },
        admin: { permissions: ["member:read", "member:write", "invite:*"] },
        member: { permissions: ["member:read"] }
      }
    })
  ]
})
```

## Client Setup

```typescript
import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [organizationClient()]
})
```

## Organization Management

```typescript
"use client"
export function OrganizationManager() {
  const { data: org } = authClient.useActiveOrganization()

  async function createOrg() {
    await authClient.organization.create({ name: "My Org", slug: "my-org" })
  }

  async function inviteMember(email: string) {
    await authClient.organization.inviteMember({ email, role: "member" })
  }

  async function removeMember(userId: string) {
    await authClient.organization.removeMember({ userId })
  }

  async function updateRole(userId: string, role: string) {
    await authClient.organization.updateMemberRole({ userId, role })
  }

  return (
    <div>
      <h1>{org?.name}</h1>
      <button onClick={createOrg}>Create Org</button>
      <input placeholder="Email" onSubmit={e => inviteMember(e.target.value)} />
    </div>
  )
}
```

## Organization Switcher

```typescript
"use client"
export function OrgSwitcher() {
  const { data: orgs } = authClient.useListOrganizations()
  const { data: active } = authClient.useActiveOrganization()

  return (
    <select
      value={active?.id}
      onChange={e => authClient.organization.setActive({ organizationId: e.target.value })}
    >
      {orgs?.map(org => (
        <option key={org.id} value={org.id}>{org.name}</option>
      ))}
    </select>
  )
}
```

## Accept Invitation

```typescript
// From email link with token
await authClient.organization.acceptInvitation({ invitationId: "..." })
```
