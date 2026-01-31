---
name: jwt
description: JWT token generation and validation
when-to-use: jwt tokens, token-based auth, api protection
keywords: JWT, JSON Web Token, tokens, api auth, verification
priority: low
requires: server-config.md
related: plugins/bearer.md
---

# Better Auth JWT Plugin

## When to Use

- Microservices token verification
- External service authorization
- Stateless token validation
- Cross-domain authentication

## Why JWT

| Session lookup | JWT |
|----------------|-----|
| DB query each request | No DB needed |
| Centralized validation | Distributed |
| Single point of failure | Decentralized |
| Stateful | Stateless |

## Installation

```typescript
import { betterAuth } from "better-auth"
import { jwt } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [jwt({ jwks: { keyPairConfig: { alg: "RS256" } } })]
})
```

## Client Setup

```typescript
import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({ plugins: [jwtClient()] })
```

## Get JWT Token

```typescript
const { jwt } = authClient
const token = await jwt.getToken()
// eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

## JWKS Endpoint

```
GET /api/auth/jwks
```

Returns public keys for token verification.

## Verify Token (External)

```typescript
import jwt from "jsonwebtoken"
import jwksClient from "jwks-rsa"

const client = jwksClient({ jwksUri: "https://yourapp.com/api/auth/jwks" })

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => callback(null, key.getPublicKey()))
}

jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
  console.log(decoded)
})
```

## Configuration

```typescript
jwt({
  jwks: { keyPairConfig: { alg: "RS256" } },  // or ES256, EdDSA
  jwt: { expiresIn: "15m", issuer: "yourapp.com", audience: "yourapp" }
})
```

## Custom Claims

```typescript
jwt({
  jwt: {
    customClaims: async (user, session) => ({
      role: user.role,
      permissions: user.permissions
    })
  }
})
```
