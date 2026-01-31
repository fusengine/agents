---
name: polar
description: Polar integration for subscriptions and monetization
when-to-use: polar subscriptions, monetization, recurring payments
keywords: Polar, subscriptions, monetization, payments
priority: low
requires: server-config.md
related: plugins/stripe.md
---

# Better Auth Polar Plugin

## When to Use

- Open source monetization
- Developer-focused subscriptions
- GitHub sponsor alternative
- Community-supported products

## Why Polar

| Stripe | Polar |
|--------|-------|
| General payments | Open source focus |
| Complex setup | OSS-optimized |
| Generic billing | Developer experience |
| Manual integration | Built-in user sync |

## Installation

```bash
bun add @better-auth/polar
```

## Server Setup

```typescript
import { betterAuth } from "better-auth"
import { polar } from "@better-auth/polar"

export const auth = betterAuth({
  plugins: [
    polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN!,
      organizationId: process.env.POLAR_ORG_ID!,
      webhookSecret: process.env.POLAR_WEBHOOK_SECRET!
    })
  ]
})
```

## Client Setup

```typescript
import { createAuthClient } from "better-auth/react"
import { polarClient } from "@better-auth/polar/client"

export const authClient = createAuthClient({
  plugins: [polarClient()]
})
```

## Create Checkout

```typescript
const { url } = await authClient.polar.createCheckout({
  productId: "prod_123",
  successUrl: "https://myapp.com/success",
  cancelUrl: "https://myapp.com/cancel"
})
window.location.href = url
```

## Webhook Handler

```typescript
// app/api/polar/webhook/route.ts
import { auth } from "@/modules/auth/src/services/auth"

export async function POST(request: Request) {
  return auth.handler(request)  // Handles /api/auth/polar/webhook
}
```

## Get Subscription

```typescript
const { data } = await authClient.polar.getSubscription()
// { status: "active", plan: "pro", currentPeriodEnd: Date }
```

## Cancel Subscription

```typescript
await authClient.polar.cancelSubscription()
```
