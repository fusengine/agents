---
name: plugins
description: Understand plugin architecture, how plugins work, isolation, and plugin system design
when-to-use: understanding plugin system, building custom plugins, evaluating plugins, plugin architecture
keywords: plugins, architecture, plugin system, isolation, endpoints, middleware, schema, design
priority: medium
requires: server-config.md
related: plugins/overview.md, guides/plugin-development.md
---

# Better Auth Plugins Concept

## When to Use

- Understanding plugin system
- Evaluating plugin options
- Building custom plugins
- Troubleshooting plugin issues

## Why Plugins

| Monolithic | Plugin-based |
|------------|--------------|
| All-or-nothing | Pick what you need |
| Large bundle | Tree-shakable |
| Fixed features | Extensible |
| Core-coupled | Isolated logic |

## Plugin Architecture

```typescript
interface BetterAuthPlugin {
  id: string
  init?: (ctx) => void | Promise<void>
  endpoints?: Record<string, Endpoint>
  middlewares?: Middleware[]
  schema?: Record<string, ModelDefinition>
  hooks?: { before?: Hook[], after?: Hook[] }
  rateLimit?: RateLimitConfig[]
}
```

## How Plugins Work

```
1. Plugin registered → Schema merged → Endpoints added
2. Request arrives → Middlewares run → Endpoint executed
3. Hooks fire → Before/After each operation
4. Response returned → Client receives data
```

## Using Plugins

```typescript
import { betterAuth } from "better-auth"
import { twoFactor, organization } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [
    twoFactor({ issuer: "MyApp" }),
    organization({ allowUserToCreateOrganization: true })
  ]
})
```

## Client Plugins

```typescript
import { createAuthClient } from "better-auth/react"
import { twoFactorClient, organizationClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [twoFactorClient(), organizationClient()]
})

// Now available
await authClient.twoFactor.enable()
await authClient.organization.create({ name: "My Org" })
```

## Plugin Isolation

- Each plugin has isolated schema
- Endpoints namespaced by plugin ID
- Hooks scoped to plugin operations
- Rate limits per-plugin configurable
