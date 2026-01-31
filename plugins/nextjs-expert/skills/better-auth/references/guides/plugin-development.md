---
name: plugin-development
description: Guide to building custom Better Auth plugins
when-to-use: custom plugins, plugin development, extending better-auth
keywords: plugin development, custom plugins, extending, plugin api
priority: low
requires: server-config.md, concepts/plugins.md
related: concepts/plugins.md
---

# Better Auth Plugin Development

## When to Use

- Building custom authentication features
- Packaging reusable auth logic
- Contributing to Better Auth ecosystem
- Integrating proprietary systems

## Why Build Plugins

| Inline code | Plugin |
|-------------|--------|
| App-coupled | Reusable |
| No structure | Standard API |
| Hard to maintain | Isolated |
| Not shareable | Publishable |

## Plugin Structure

```typescript
import { BetterAuthPlugin } from "better-auth"

export const myPlugin = (): BetterAuthPlugin => ({
  id: "my-plugin",
  endpoints: {
    myEndpoint: {
      path: "/my-plugin/action",
      method: "POST",
      handler: async (ctx) => {
        const { user } = ctx.context
        // Your logic
        return ctx.json({ success: true })
      }
    }
  },
  schema: {
    myTable: {
      fields: {
        id: { type: "string", required: true },
        userId: { type: "string", required: true },
        data: { type: "string" }
      }
    }
  },
  hooks: {
    after: [{
      matcher: (ctx) => ctx.path === "/sign-in/email",
      handler: async (ctx) => {
        // Post sign-in logic
        return { response: ctx.response }
      }
    }]
  }
})
```

## Client Plugin

```typescript
import { BetterAuthClientPlugin } from "better-auth/client"

export const myPluginClient = (): BetterAuthClientPlugin => ({
  id: "my-plugin",
  getActions: ($fetch) => ({
    myAction: async (data: { input: string }) => {
      return $fetch("/my-plugin/action", { method: "POST", body: data })
    }
  })
})
```

## Usage

```typescript
// Server
import { myPlugin } from "./my-plugin"
export const auth = betterAuth({ plugins: [myPlugin()] })

// Client
import { myPluginClient } from "./my-plugin-client"
export const authClient = createAuthClient({ plugins: [myPluginClient()] })

// Use
await authClient.myPlugin.myAction({ input: "data" })
```

## Best Practices

1. **Prefix endpoints** with plugin name
2. **Use hooks** for cross-cutting concerns
3. **Define schema** for database tables
4. **Provide types** for TypeScript support
5. **Handle errors** gracefully

## Publishing

```json
{
  "name": "better-auth-my-plugin",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "peerDependencies": { "better-auth": "^1.0.0" }
}
```
