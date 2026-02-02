---
name: feature-flags
description: Feature access control based on subscription plan
when-to-use: Consult when limiting features by plan tier
keywords: features, flags, plans, tiers, limits, pennant, gates
priority: high
requires: subscriptions.md
related: team-billing.md
---

# Feature Flags per Plan

## What is it?

Control which features each plan can access. Free users get basic features, premium users get advanced.

**Without flags**: Everyone sees everything (or complex if/else)
**With flags**: Clean feature gating tied to subscription

---

## Feature Types

| Type | Example | Implementation |
|------|---------|----------------|
| **Boolean** | "Can export PDF?" | Yes/No check |
| **Numeric limit** | "Max 5 projects" | Count check |
| **Tiered** | "Basic/Advanced analytics" | Level check |

---

## Laravel Pennant (Official)

Laravel's official feature flag package (Laravel 10+).

### Why Pennant?

- Official Laravel package
- Database-backed (persistent)
- Per-user/team resolution
- Blade directives included

### Alternatives

| Package | Use Case |
|---------|----------|
| **Pennant** | Plan-based features |
| **Spatie Permission** | Role-based (admin, editor) |
| **Custom trait** | Simple needs |

---

## Feature Definition Strategies

### 1. Plan-Based (Recommended)

```
User on price_premium? → Advanced Analytics: YES
User on price_basic? → Advanced Analytics: NO
```

### 2. Additive

```
Basic: Feature A
Premium: Feature A + B + C
Enterprise: Feature A + B + C + D
```

### 3. Limit-Based

```
Basic: 5 projects
Premium: 50 projects
Enterprise: Unlimited
```

---

## Key Decisions

### 1. Where to Define Features?

| Location | Pros | Cons |
|----------|------|------|
| **Code** (ServiceProvider) | Version controlled | Redeploy to change |
| **Database** | Dynamic changes | Harder to track |
| **Config file** | Simple | No runtime changes |

**Recommendation**: Code for features, config for limits.

### 2. Cache Features?

- **Yes**: Better performance, stale on plan change
- **No**: Always accurate, more DB queries

**Recommendation**: Cache with purge on subscription change.

### 3. What Happens When Downgrade?

| Approach | Example |
|----------|---------|
| **Graceful degradation** | Can view but not create |
| **Hard block** | Feature completely hidden |
| **Grandfather** | Keep access, no new usage |

---

## UX Patterns

### Upgrade Prompts

When feature is blocked, show upgrade CTA:

```
┌─────────────────────────────────┐
│ 📊 Advanced Analytics           │
│                                 │
│ This feature is available on    │
│ the Premium plan.               │
│                                 │
│ [Upgrade to Premium]            │
└─────────────────────────────────┘
```

### Feature Teasing

Show premium features grayed out (not hidden):
- Creates desire
- Shows value of upgrade
- Reduces confusion

### Limit Warnings

At 80% of limit: "You've used 4 of 5 projects"
At 100%: "Upgrade to create more projects"

---

## Plan Configuration

Define features per plan centrally:

```
plans:
  basic:
    features: [export-csv, basic-support]
    limits:
      projects: 5
      team_members: 1

  premium:
    features: [export-csv, export-pdf, analytics, api-access]
    limits:
      projects: 50
      team_members: 10

  enterprise:
    features: [all]
    limits:
      projects: unlimited
      team_members: unlimited
```

---

## Common Mistakes

❌ **Hiding features** → Users don't know what they're missing
❌ **No upgrade path** → Blocked users leave
❌ **Complex logic in views** → Hard to maintain
❌ **Forgetting cache purge** → Stale access after plan change

---

## Implementation

→ See [templates/FeatureFlags.php.md](templates/FeatureFlags.php.md) for:
- Laravel Pennant setup
- Plan-based feature definitions
- Limit checking trait
- Blade directives
- Cache management
