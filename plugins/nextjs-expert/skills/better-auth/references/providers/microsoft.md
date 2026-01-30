# Better Auth Microsoft Provider

## Setup

### 1. Azure AD App Registration
1. Go to [Azure Portal](https://portal.azure.com)
2. Azure Active Directory > App registrations > New registration
3. Add redirect URI: `http://localhost:3000/api/auth/callback/microsoft`
4. Create client secret in Certificates & secrets

### 2. Configuration

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  socialProviders: {
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      tenantId: process.env.MICROSOFT_TENANT_ID  // Optional
    }
  }
})
```

### Tenant Options
- `common` - Any Microsoft account (default)
- `organizations` - Work/school accounts only
- `consumers` - Personal accounts only
- `{tenant-id}` - Specific organization

## Client Usage

```typescript
const { signIn } = authClient
await signIn.social({ provider: "microsoft" })
```

## Scopes

Default: `openid`, `profile`, `email`, `User.Read`

```typescript
microsoft: {
  clientId: "...",
  clientSecret: "...",
  scope: ["openid", "profile", "email", "Calendars.Read"]
}
```

## Graph API Access

```typescript
const account = await getAccount(userId, "microsoft")
const profile = await fetch("https://graph.microsoft.com/v1.0/me", {
  headers: { Authorization: `Bearer ${account.accessToken}` }
})
```

## Environment Variables

```bash
MICROSOFT_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MICROSOFT_CLIENT_SECRET=your_client_secret
MICROSOFT_TENANT_ID=common  # or specific tenant ID
```

## Redirect URIs

- Dev: `http://localhost:3000/api/auth/callback/microsoft`
- Prod: `https://yourapp.com/api/auth/callback/microsoft`
