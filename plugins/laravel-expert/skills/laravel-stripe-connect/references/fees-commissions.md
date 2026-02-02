---
name: fees-commissions
description: Platform revenue models and fee collection
when-to-use: Implementing commission and fee structures
keywords: fees, commissions, application-fee, revenue, pricing
---

# Fees & Commissions

## Revenue Models

| Model | Description | Example |
|-------|-------------|---------|
| **Percentage** | % of transaction | 10% of each sale |
| **Fixed** | Flat fee per transaction | €0.50 per order |
| **Hybrid** | Percentage + fixed | 5% + €0.30 |
| **Tiered** | Rate based on volume | 10% → 8% → 5% |
| **Subscription** | Monthly fee + lower % | €29/mo + 3% |

## Fee Collection Methods

| Method | When to Use |
|--------|-------------|
| **Application Fee** | Destination/Direct charges |
| **Transfer Amount** | Separate charges + transfers |
| **Subscription** | Recurring platform fee (use billing skill) |

## Application Fee vs Transfer

| Aspect | Application Fee | Manual Transfer |
|--------|-----------------|-----------------|
| **Timing** | Automatic at charge | You control |
| **Flexibility** | Per-transaction | Full control |
| **Complexity** | Simple | Complex |
| **Multi-party** | No | Yes |

## Fee Calculation Examples

### Simple Percentage (10%)

```
Sale: €100
Application Fee: €10
Seller receives: €90 (minus Stripe fees)
```

### Hybrid (5% + €0.30)

```
Sale: €100
Application Fee: €5.30
Seller receives: €94.70 (minus Stripe fees)
```

### Who Pays Stripe Fees?

| Configuration | Platform Pays | Seller Pays |
|---------------|--------------|-------------|
| Default | ❌ | ✅ (from transfer) |
| Fee on platform | ✅ (from app fee) | ❌ |

## Stripe Fee Structure (EU)

| Payment Type | Fee |
|--------------|-----|
| European cards | 1.5% + €0.25 |
| UK cards | 2.5% + €0.25 |
| International cards | 3.25% + €0.25 |

## Decision: Fee Responsibility

```
Who absorbs Stripe processing fees?
│
├── Seller (default) → Deducted from transfer
│   └── Simpler, seller sees net amount
│
└── Platform → Include in application fee calculation
    └── More complex, better seller experience
```

## Negative Balance Protection

| Scenario | Risk |
|----------|------|
| Refund after payout | Seller balance goes negative |
| Dispute lost | Platform may cover |
| Seller disappears | Platform liable |

**Mitigation:** Hold reserves, delay payouts, insurance.

→ **Implementation:** See [templates/MarketplacePaymentController.php.md](templates/MarketplacePaymentController.php.md)
