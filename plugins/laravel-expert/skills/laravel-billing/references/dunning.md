---
name: dunning
description: Failed payment recovery strategies and grace periods
when-to-use: Consult when handling payment failures and churn prevention
keywords: dunning, failed, payment, recovery, retry, grace, churn
priority: critical
requires: webhooks.md
related: subscriptions.md
---

# Dunning Management

## What is it?

Dunning = recovering failed payments through automated retries and customer communication.

**Without dunning**: 5-10% of subscriptions fail → immediate churn
**With dunning**: Recover 50-70% of failed payments

---

## Why Payments Fail

| Reason | % of Failures | Recovery Rate |
|--------|---------------|---------------|
| **Insufficient funds** | 40% | 70% (retry later) |
| **Expired card** | 25% | 50% (needs update) |
| **Card declined** | 20% | 30% (hard decline) |
| **Fraud suspected** | 10% | 10% (manual review) |
| **Bank error** | 5% | 80% (auto-resolves) |

---

## Recovery Strategy

### 1. Stripe Smart Retries (Automatic)

Stripe retries failed payments automatically using ML to find optimal timing.

**Enable in**: Stripe Dashboard > Billing > Settings > Smart Retries

**Retry schedule**: ~4 attempts over 3-4 weeks

### 2. Grace Period

Allow continued access while payment is being recovered.

| Duration | Pros | Cons |
|----------|------|------|
| **3 days** | Limits exposure | May lose recoverable revenue |
| **7 days** (recommended) | Good recovery rate | Balanced risk |
| **14 days** | Maximum recovery | Risk of abuse |

### 3. Email Sequence

| Day | Email | Content |
|-----|-------|---------|
| 0 | Payment failed | "We couldn't charge your card" |
| 3 | Reminder | "Please update your payment method" |
| 7 | Urgency | "Access will be suspended tomorrow" |
| 8 | Suspended | "Your access has been paused" |

**Key**: Include one-click link to update payment method (Stripe Portal).

---

## Customer Experience

### During Grace Period

- Show banner: "Payment failed, please update"
- Allow full access (don't punish yet)
- Make update process frictionless

### After Grace Period

- Suspend access (don't delete data)
- Continue retry attempts
- Easy reactivation when resolved

---

## Communication Channels

| Channel | Open Rate | Recovery Impact |
|---------|-----------|-----------------|
| Email | 20-30% | Baseline |
| Email + SMS | 40-50% | +30% recovery |
| Email + SMS + In-app | 60-70% | +50% recovery |

**Recommendation**: Multi-channel for high-value customers.

---

## Metrics to Track

| Metric | Target |
|--------|--------|
| **Involuntary churn rate** | < 2%/month |
| **Recovery rate** | > 60% |
| **Time to recovery** | < 7 days average |
| **Update rate** (card updated after failure) | > 40% |

---

## Prevention

Better than recovery:

1. **Card Updater**: Stripe auto-updates expired cards (Account Updater)
2. **Expiration warnings**: Email 30 days before card expires
3. **Backup payment method**: Request secondary card
4. **Annual billing**: Fewer failure opportunities

---

## Common Mistakes

❌ **No grace period** → Immediate churn
❌ **Generic emails** → Low engagement
❌ **No update link** → Friction to resolve
❌ **Deleting data** → No recovery possible
❌ **Single channel** → Missed contacts

---

## Implementation

→ See [templates/DunningService.php.md](templates/DunningService.php.md) for:
- Webhook listeners for payment failures
- Grace period middleware
- Email notification sequence
- Recovery tracking
