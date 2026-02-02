---
name: team-billing
description: Team/organization billing concepts and seat management
when-to-use: Consult when billing teams instead of individual users
keywords: team, organization, seats, b2b, per-seat, enterprise
priority: high
requires: stripe.md
related: metered-billing.md, subscriptions.md
---

# Team/Organization Billing

## What is it?

Bill a team/organization rather than individual users. The **Team model** owns the subscription, not User.

**Per-user billing**: Each person pays $10/month
**Team billing**: Company pays $50/month for 5 seats

---

## When to Use Team Billing

| Scenario | Model | Why |
|----------|-------|-----|
| B2C SaaS | Per-user | Individual purchase decisions |
| B2B SaaS | Team | Company pays, employees use |
| Freemium → Team | Hybrid | Free individuals, paid teams |
| Enterprise | Team | Centralized billing, procurement |

**Rule of thumb**: If someone other than the user pays, use team billing.

---

## Key Concepts

### Billable Model
- **Per-user**: `User` has `Billable` trait
- **Team**: `Team` has `Billable` trait, User does not

### Seats
- Number of users allowed on the team
- Can be fixed (5 seats) or flexible (add/remove anytime)

### Owner
- Team member who manages billing
- Usually the person who created the team

---

## Pricing Models

### Fixed Seats
- Pay for X seats upfront
- Unused seats = wasted money
- Simple to understand

### Per-Seat (Recommended)
- Pay only for active users
- Add/remove seats anytime
- Proration on changes

### Tiered
- 1-5 users: $10/seat
- 6-20 users: $8/seat
- 21+: $6/seat

---

## Key Decisions

### 1. What Counts as a Seat?

| Definition | Pros | Cons |
|------------|------|------|
| **Invited users** | Predictable | Pay for inactive |
| **Active users** (logged in 30d) | Fair | Fluctuating bills |
| **Concurrent users** | Cost-effective | Complex tracking |

**Recommendation**: Active users with 30-day window.

### 2. Minimum Seats?

Always charge for at least 1 seat, even if team is empty.
Prevents $0 invoices and abuse.

### 3. Seat Changes Mid-Cycle?

| Approach | Add Seat | Remove Seat |
|----------|----------|-------------|
| **Immediate proration** | Charge now | Credit now |
| **Next cycle** | Free until renewal | Active until renewal |
| **Hybrid** | Charge now | Active until renewal |

**Recommendation**: Charge immediately for adds, keep active until renewal for removes.

---

## Access Control

Team billing affects authorization:

1. **Check team subscription**, not user subscription
2. **Features unlock for all team members**
3. **Owner manages billing**, members just use

```
User wants feature X
  → Get user's team
  → Check team.subscribed('plan')
  → Check team.canUseFeature('X')
```

---

## Common Mistakes

❌ **Billable on User** → Can't share subscription
❌ **No seat limits** → Unlimited sharing
❌ **Owner can leave** → Orphaned billing
❌ **No proration preview** → Surprise charges

---

## Implementation

→ See [templates/TeamBillable.php.md](templates/TeamBillable.php.md) for:
- Team model with Billable trait
- Seat management (add/remove members)
- Access control helpers
- Owner transfer logic
