# Better Auth Stripe Plugin

## Overview
Integrate Stripe for payments, subscriptions, and customer management.

## Installation

```typescript
import { betterAuth } from "better-auth"
import { stripe } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [
    stripe({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!
    })
  ]
})
```

## Client Setup

```typescript
import { createAuthClient } from "better-auth/react"
import { stripeClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [stripeClient()]
})
```

## Create Checkout Session

```typescript
const { stripe } = authClient

const session = await stripe.createCheckoutSession({
  priceId: "price_xxx",
  successUrl: "/success",
  cancelUrl: "/cancel"
})
// Redirect to session.url
```

## Manage Subscription

```typescript
// Get subscription
const sub = await stripe.getSubscription()

// Cancel subscription
await stripe.cancelSubscription()

// Create portal session
const portal = await stripe.createPortalSession({
  returnUrl: "/settings"
})
```

## Webhook Handler

```typescript
// app/api/stripe/webhook/route.ts
import { auth } from "@/modules/auth/src/services/auth"

export async function POST(request: Request) {
  return auth.api.stripeWebhook({ request })
}
```

## Configuration

```typescript
stripe({
  stripeSecretKey: "sk_...",
  stripeWebhookSecret: "whsec_...",
  createCustomerOnSignUp: true,  // Auto-create Stripe customer
  syncUserData: true              // Sync email/name to Stripe
})
```

## Environment Variables

```bash
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```
