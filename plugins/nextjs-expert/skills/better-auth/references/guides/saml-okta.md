# Better Auth SAML/Okta SSO Guide

## Prerequisites

```typescript
import { betterAuth } from "better-auth"
import { organization, sso } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [organization(), sso()]
})
```

## Okta Setup

### 1. Create SAML Application in Okta

1. Applications > Create App Integration
2. Select SAML 2.0
3. Configure:
   - Single sign-on URL: `https://yourapp.com/api/auth/saml/callback`
   - Audience URI: `https://yourapp.com`
   - Name ID format: `EmailAddress`

### 2. Get Okta Metadata

Download from: `https://yourcompany.okta.com/app/xxx/sso/saml/metadata`

### 3. Create SSO Connection

```typescript
await auth.api.createSSOConnection({
  organizationId: "org_123",
  type: "saml",
  config: {
    entryPoint: "https://yourcompany.okta.com/app/xxx/sso/saml",
    certificate: "-----BEGIN CERTIFICATE-----...",
    issuer: "http://www.okta.com/xxx"
  }
})
```

## Azure AD Setup

1. Enterprise Applications > New Application > SAML
2. Basic SAML Configuration:
   - Identifier: `https://yourapp.com`
   - Reply URL: `https://yourapp.com/api/auth/saml/callback`

## Sign In Flow

```typescript
// User initiates SSO
await authClient.signIn.sso({
  organizationId: "org_123"
  // or email: "user@company.com" for domain-based lookup
})
```

## SP Metadata

Expose for IdP configuration:
```
GET /api/auth/saml/metadata
```

## Domain Mapping

```typescript
await auth.api.updateOrganization({
  id: "org_123",
  data: { domain: "company.com" }
})

// Auto-detect org by email domain
await authClient.signIn.sso({ email: "user@company.com" })
```
