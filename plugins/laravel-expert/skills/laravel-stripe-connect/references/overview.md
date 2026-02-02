---
name: overview
description: Stripe Connect fundamentals for marketplaces
when-to-use: Understanding Connect architecture and use cases
keywords: connect, marketplace, platform, multi-vendor, payments
---

# Stripe Connect Overview

## What is Stripe Connect?

Stripe Connect enables platforms to facilitate payments between buyers and sellers while taking a commission.

## Platform Types

| Type | Description | Examples |
|------|-------------|----------|
| **Marketplace** | Connects buyers and sellers | Etsy, eBay, Amazon Marketplace |
| **On-demand** | Service providers paid per job | Uber, DoorDash, Instacart |
| **Crowdfunding** | Collect funds for projects | Kickstarter, GoFundMe |
| **SaaS + Payouts** | Creators receive earnings | Substack, Patreon, Teachable |

## Money Flow

```
Customer Payment (€100)
         │
         ▼
┌─────────────────┐
│    Platform     │ ← Application Fee (€15)
│  Stripe Account │
└────────┬────────┘
         │ Transfer (€85)
         ▼
┌─────────────────┐
│     Seller      │
│ Connected Acct  │
└────────┬────────┘
         │ Payout
         ▼
   Seller's Bank
```

## Core Components

| Component | Purpose |
|-----------|---------|
| **Platform Account** | Your main Stripe account |
| **Connected Accounts** | Seller Stripe accounts |
| **Charges** | Customer payments |
| **Transfers** | Moving money to sellers |
| **Application Fees** | Your commission |
| **Payouts** | Seller bank transfers |

## When to Use Connect

| Scenario | Solution |
|----------|----------|
| Customers pay you directly | Use Laravel Cashier (billing) |
| Customers pay sellers via you | Use Stripe Connect |
| Mix of both | Combine billing + Connect |

## Integration Approaches

| Approach | Effort | Control |
|----------|--------|---------|
| **Stripe Checkout** | Low | Low |
| **Payment Links** | Low | Low |
| **Payment Intents** | Medium | High |
| **Custom Flow** | High | Full |

→ **Implementation:** See [templates/](templates/) for complete code.
