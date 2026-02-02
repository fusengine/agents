---
name: metered-billing
description: Usage-based billing concepts and decision guide
when-to-use: Consult when choosing between fixed vs usage-based pricing
keywords: metered, usage, consumption, api, storage, pay-per-use
priority: high
requires: stripe.md
related: team-billing.md, subscriptions.md
---

# Metered/Usage-Based Billing

## What is it?

Charge customers based on actual consumption instead of fixed monthly fees.

**Fixed pricing**: $29/month for unlimited access
**Metered pricing**: $0.001 per API call, pay only what you use

---

## When to Use Metered Billing

| Use Case | Metered? | Why |
|----------|----------|-----|
| API calls | ✅ Yes | Usage varies wildly between customers |
| Storage (GB) | ✅ Yes | Scales with customer data |
| Active seats | ⚠️ Hybrid | Base + per-seat works better |
| SaaS features | ❌ No | Fixed tiers are simpler |

**Rule of thumb**: If usage varies >10x between customers, consider metered.

---

## Pricing Models

### Pure Metered
- No base fee, pay only for usage
- Best for: APIs, infrastructure
- Risk: $0 months = no revenue

### Hybrid (Recommended for SaaS)
- Base fee + overage charges
- Example: $29/month includes 10,000 calls, then $0.001/call
- Best for: Predictable revenue + scalability

### Tiered Usage
- Different rates at different volumes
- Example: 0-1000 calls = $0.01, 1001-10000 = $0.005
- Best for: Enterprise volume discounts

---

## Key Decisions

### 1. When to Report Usage?

| Strategy | Pros | Cons |
|----------|------|------|
| **Real-time** (per request) | Accurate | High volume, rate limits |
| **Batch** (hourly/daily) | Efficient | Slight delay |
| **End of period** | Simple | Customer surprise |

**Recommendation**: Batch reporting every hour for high-volume, real-time for low-volume.

### 2. How to Handle Limits?

| Approach | UX | Revenue |
|----------|-----|---------|
| **Hard limit** | Blocks access | Protects margins |
| **Soft limit** | Warning only | More revenue, risk of disputes |
| **Auto-upgrade** | Seamless | Best revenue, complex |

### 3. Billing Thresholds?

Stripe can auto-invoice when usage hits a dollar amount (e.g., $100).
- Useful for: High-usage customers, preventing large invoices
- Configure in: Stripe Dashboard > Billing > Settings

---

## Customer Communication

Critical for metered billing success:

1. **Dashboard**: Show real-time usage vs limits
2. **Alerts**: Email at 50%, 80%, 100% of limit
3. **Predictions**: "At current rate, you'll use X by month end"
4. **Transparency**: Detailed usage breakdown on invoice

---

## Common Mistakes

❌ **No usage visibility** → Surprise bills, churn
❌ **Reporting every request** → Stripe rate limits
❌ **No limits** → Abuse potential
❌ **Complex pricing** → Customer confusion

---

## Implementation

→ See [templates/MeteredBillingController.php.md](templates/MeteredBillingController.php.md) for:
- Subscription creation with metered prices
- Usage reporting (real-time and batch)
- Usage tracking middleware
- Dashboard API endpoints
