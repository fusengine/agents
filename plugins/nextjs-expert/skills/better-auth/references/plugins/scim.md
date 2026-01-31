# Better Auth SCIM Plugin

## Overview
SCIM 2.0 provisioning for enterprise identity providers (Okta, Azure AD, etc.).

## Installation

```typescript
import { betterAuth } from "better-auth"
import { scim } from "better-auth/plugins"
import { organization } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [
    organization(),  // Required
    scim()
  ]
})
```

## SCIM Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/scim/v2/Users` | GET | List users |
| `/scim/v2/Users` | POST | Create user |
| `/scim/v2/Users/:id` | GET | Get user |
| `/scim/v2/Users/:id` | PATCH | Update user |
| `/scim/v2/Users/:id` | DELETE | Delete user |
| `/scim/v2/Groups` | GET | List groups |
| `/scim/v2/Groups` | POST | Create group |

## Generate SCIM Token

```typescript
// Admin generates token for IdP
const token = await auth.api.createScimToken({
  organizationId: "org_123"
})
// Configure this token in Okta/Azure AD
```

## IdP Configuration

### Okta
1. Applications > Create SCIM Integration
2. Base URL: `https://yourapp.com/api/auth/scim/v2`
3. Authentication: Bearer Token

### Azure AD
1. Enterprise Applications > Provisioning
2. Tenant URL: `https://yourapp.com/api/auth/scim/v2`
3. Secret Token: SCIM token from above

## Configuration

```typescript
scim({
  requireOrganization: true,  // Scope to organization
  userSchema: {
    // Map SCIM attributes to your user model
    userName: "email",
    displayName: "name"
  }
})
```

## Events

```typescript
scim({
  onUserProvisioned: async (user, org) => {
    await sendWelcomeEmail(user.email)
  },
  onUserDeprovisioned: async (user, org) => {
    await revokeAccess(user.id)
  }
})
```
