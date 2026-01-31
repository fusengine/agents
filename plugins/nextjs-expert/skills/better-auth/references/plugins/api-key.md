---
name: api-key
description: API key generation and management for service-to-service auth
when-to-use: api keys, service authentication, third-party access
keywords: API key, service auth, third-party, key management
priority: low
requires: server-config.md
related: plugins/bearer.md, plugins/jwt.md
---

# Better Auth API Key Plugin

## When to Use

- Developer API access
- Long-lived automation credentials
- Service account authentication
- Integration key management

## Why API Keys

| Session | API Key |
|---------|---------|
| Browser-bound | Any client |
| Short-lived | Long-lived |
| User interaction | Automated |
| Cookie-based | Header-based |

## Overview
Generate and manage API keys for programmatic access.

## Installation

```typescript
import { betterAuth } from "better-auth"
import { apiKey } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [apiKey()]
})
```

## Client Setup

```typescript
import { createAuthClient } from "better-auth/react"
import { apiKeyClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [apiKeyClient()]
})
```

## Create API Key

```typescript
const { apiKey } = authClient

const key = await apiKey.create({
  name: "Production API",
  expiresIn: 60 * 60 * 24 * 365,  // 1 year
  permissions: ["read", "write"]
})
// { key: "ba_xxx...", id: "key_123" }
```

## Use API Key

```typescript
fetch("/api/data", {
  headers: { "X-API-Key": key.key }
})
```

## List & Revoke Keys

```typescript
const keys = await apiKey.list()
await apiKey.revoke({ id: "key_123" })
```

## Configuration

```typescript
apiKey({
  prefix: "ba_",              // Key prefix
  length: 32,                 // Key length
  maxKeysPerUser: 10,         // Limit per user
  defaultPermissions: ["read"]
})
```

## Server Verification

```typescript
export async function GET(request: Request) {
  const key = request.headers.get("X-API-Key")
  const session = await auth.api.verifyApiKey({ key })
  if (!session) return Response.json({ error: "Invalid" }, { status: 401 })
  return Response.json({ data: "..." })
}
```
