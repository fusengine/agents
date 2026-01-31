---
name: apple
description: Apple OAuth provider setup and configuration
when-to-use: apple oauth, ios apps, sign in with apple
keywords: Apple, OAuth, iOS, sign-in with apple, authentication
priority: medium
requires: server-config.md, providers/overview.md
related: providers/overview.md, concepts/oauth.md
---

# Better Auth Apple Provider

## When to Use

- iOS/macOS native apps
- App Store requirement compliance
- Privacy-focused users
- Apple ecosystem products

## Why Apple

| Consideration | Value |
|---------------|-------|
| iOS requirement | Mandatory if other social |
| Privacy | Hide My Email option |
| Device auth | Face/Touch ID |
| User trust | Apple security reputation |

## Setup

### 1. Apple Developer Account
1. Go to [Apple Developer](https://developer.apple.com)
2. Certificates, Identifiers & Profiles > Identifiers
3. Create App ID with "Sign in with Apple" capability
4. Create Services ID for web authentication

### 2. Generate Private Key
1. Keys > Create Key
2. Enable "Sign in with Apple"
3. Download `.p8` file

### 3. Configuration

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  socialProviders: {
    apple: {
      clientId: process.env.APPLE_CLIENT_ID!,       // Services ID
      clientSecret: process.env.APPLE_CLIENT_SECRET!, // Generated JWT
      // Or use key file directly:
      // privateKey: process.env.APPLE_PRIVATE_KEY!,
      // keyId: process.env.APPLE_KEY_ID!,
      // teamId: process.env.APPLE_TEAM_ID!
    }
  }
})
```

### 4. Generate Client Secret (JWT)

```typescript
import jwt from "jsonwebtoken"

const clientSecret = jwt.sign({}, privateKey, {
  algorithm: "ES256",
  expiresIn: "180d",
  audience: "https://appleid.apple.com",
  issuer: TEAM_ID,
  subject: CLIENT_ID,
  keyid: KEY_ID
})
```

## Client Usage

```typescript
const { signIn } = authClient
await signIn.social({ provider: "apple" })
```

## Important Notes

- Apple only returns email on first sign-in
- User can hide email (relay address)
- Name only provided on first authorization

## Environment Variables

```bash
APPLE_CLIENT_ID=com.yourapp.web        # Services ID
APPLE_CLIENT_SECRET=eyJhbGciOiJFUzI1NiI...  # Generated JWT
APPLE_TEAM_ID=XXXXXXXXXX
APPLE_KEY_ID=XXXXXXXXXX
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```
