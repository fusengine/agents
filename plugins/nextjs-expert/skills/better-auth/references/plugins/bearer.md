---
name: bearer
description: Bearer token authentication for API access
when-to-use: api authentication, bearer tokens, token-based access
keywords: bearer token, api auth, token authentication
priority: low
requires: server-config.md
related: plugins/jwt.md, plugins/api-key.md
---

# Better Auth Bearer Plugin

## When to Use

- API integrations and webhooks
- CLI tools and scripts
- Server-to-server authentication
- Mobile apps without cookie support

## Why Bearer Tokens

| Cookies | Bearer tokens |
|---------|---------------|
| Browser-only | Any HTTP client |
| Domain-bound | Portable |
| Automatic handling | Explicit control |
| Session-based | Stateless |

## Overview
API key / Bearer token authentication as alternative to cookies.

## Installation

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"
import { bearer } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [bearer()]
})
```

## Client Setup

```typescript
import { createAuthClient } from "better-auth/react"
import { bearerClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [bearerClient()]
})
```

## Create API Key

```typescript
const { bearer } = authClient

const apiKey = await bearer.createToken({
  name: "My API Key",
  expiresIn: 60 * 60 * 24 * 30  // 30 days
})
// { token: "ba_xxx...", id: "key_123" }
```

## Use API Key

```typescript
// In API requests
fetch("/api/data", {
  headers: {
    Authorization: `Bearer ${apiKey.token}`
  }
})
```

## List API Keys

```typescript
const keys = await bearer.listTokens()
// [{ id, name, createdAt, lastUsedAt, expiresAt }]
```

## Revoke API Key

```typescript
await bearer.revokeToken({ id: "key_123" })
```

## Server-Side Verification

```typescript
// In API route
import { auth } from "@/modules/auth/src/services/auth"

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers
  })

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  return Response.json({ data: "..." })
}
```

## Configuration

```typescript
bearer({
  tokenPrefix: "ba_",        // Token prefix
  defaultExpiresIn: 30 * 24 * 60 * 60,  // 30 days
  maxTokensPerUser: 10       // Limit tokens per user
})
```

## Use Cases
- API integrations
- CLI tools
- Server-to-server auth
- Mobile apps without cookie support
