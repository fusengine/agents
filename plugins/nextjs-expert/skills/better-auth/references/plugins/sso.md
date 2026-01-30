# Better Auth SSO Plugin (Enterprise)

## Overview
SAML 2.0 and OIDC single sign-on for enterprise customers.

## Installation

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"
import { sso } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [
    sso({
      organizationPlugin: true  // Requires organization plugin
    })
  ]
})
```

## SAML Configuration

```typescript
sso({
  saml: {
    // Your SP (Service Provider) metadata
    issuer: "https://yourapp.com",
    callbackUrl: "https://yourapp.com/api/auth/saml/callback",
    // Certificate for signing
    certificate: process.env.SAML_CERTIFICATE,
    privateKey: process.env.SAML_PRIVATE_KEY
  }
})
```

## Per-Organization IdP Setup

```typescript
// Admin creates SSO connection for organization
await auth.api.createSSOConnection({
  organizationId: "org_123",
  type: "saml",
  config: {
    entryPoint: "https://idp.customer.com/saml/sso",
    certificate: "-----BEGIN CERTIFICATE-----..."
  }
})
```

## OIDC Configuration

```typescript
await auth.api.createSSOConnection({
  organizationId: "org_123",
  type: "oidc",
  config: {
    issuer: "https://idp.customer.com",
    clientId: "client_id",
    clientSecret: "client_secret"
  }
})
```

## Client Usage

```typescript
// Initiate SSO sign-in
await authClient.signIn.sso({
  organizationId: "org_123"
  // or
  // email: "user@customer.com"  // Auto-detect org by domain
})
```

## SP Metadata Endpoint

Expose metadata for IdP configuration:
```
GET /api/auth/saml/metadata
```

## Environment Variables

```bash
SAML_CERTIFICATE="-----BEGIN CERTIFICATE-----..."
SAML_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
```
