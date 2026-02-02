---
name: account-types
description: Standard, Express, and Custom account comparison
when-to-use: Choosing the right account type for sellers
keywords: standard, express, custom, accounts, onboarding
---

# Connected Account Types

## Comparison Matrix

| Feature | Standard | Express | Custom |
|---------|----------|---------|--------|
| **Onboarding** | Stripe-hosted | Stripe-hosted | You build |
| **Dashboard** | Full Stripe | Limited | None |
| **Branding** | Stripe | Platform + Stripe | Platform only |
| **Support** | Stripe direct | Platform | Platform |
| **Effort** | Lowest | Medium | Highest |
| **Control** | Lowest | Medium | Full |

## Decision Guide

```
Does seller need full Stripe dashboard?
├── YES → Standard
│   └── Sellers are businesses with Stripe experience
│
└── NO → Express or Custom
    │
    ├── Want Stripe to handle onboarding UI?
    │   └── YES → Express (recommended for most)
    │
    └── Need 100% custom onboarding?
        └── YES → Custom (significant effort)
```

## When to Use Each

### Standard Accounts
- Sellers already have Stripe accounts
- Sellers want full Stripe features
- Platform wants minimal liability
- **Example:** Shopify app connecting existing merchants

### Express Accounts (Recommended)
- New sellers without Stripe accounts
- Platform wants branded experience
- Need quick onboarding
- **Example:** Most marketplaces, gig platforms

### Custom Accounts
- Regulated industries (finance, insurance)
- Need complete UI control
- White-label requirement
- **Example:** Banking apps, complex B2B platforms

## Liability by Account Type

| Scenario | Standard | Express | Custom |
|----------|----------|---------|--------|
| **Disputes** | Seller | Platform* | Platform |
| **Negative balance** | Seller | Platform* | Platform |
| **Compliance** | Shared | Platform | Platform |
| **Refunds** | Seller | Configurable | Platform |

*Express can shift some liability with proper setup.

## Capabilities

Each account type requires specific capabilities:

| Capability | Purpose |
|------------|---------|
| `card_payments` | Accept card payments |
| `transfers` | Receive transfers from platform |
| `tax_reporting_us_1099_k` | US tax compliance |

→ **Implementation:** See [templates/Seller.php.md](templates/Seller.php.md)
