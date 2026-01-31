---
name: scim
description: SCIM 2.0 protocol for user provisioning and management
when-to-use: enterprise sso, user provisioning, identity management
keywords: SCIM, provisioning, enterprise, identity management, sso
priority: low
requires: server-config.md
related: plugins/sso.md
---

# Better Auth SCIM Plugin

## When to Use

- Enterprise IT admin requirements
- Automatic user provisioning/deprovisioning
- Okta, Azure AD, OneLogin integration
- SOC2/compliance directory sync

## Why SCIM

| Manual provisioning | SCIM |
|---------------------|------|
| Admin creates users | Auto-sync from IdP |
| Manual deprovisioning | Instant offboarding |
| Out-of-sync data | Real-time sync |
| No audit trail | Full provisioning logs |

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
